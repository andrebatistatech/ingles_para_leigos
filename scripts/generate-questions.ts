import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
const DIFFICULTIES = [1, 2, 3] as const

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'absolute beginner: verb to be, articles, basic present simple, numbers, colors, family, greetings, basic vocabulary',
  A2: 'elementary: past simple, present continuous, going to future, comparatives, modals can/could, adverbs, basic conditionals',
  B1: 'intermediate: present perfect, first/second conditionals, passive voice, reported speech, phrasal verbs, relative clauses, modal verbs',
  B2: 'upper-intermediate: mixed conditionals, subjunctive, complex passives, discourse markers, advanced vocabulary, formal language, idioms',
  C1: 'advanced: inversion, cleft sentences, advanced collocations, hedging language, complex syntax, academic register, sophisticated grammar',
  C2: 'mastery/proficiency: literary language, philosophical vocabulary, nuanced connotation, advanced rhetoric, complex syntax, register precision',
}

const DIFFICULTY_DESCRIPTIONS: Record<number, string> = {
  1: 'easier questions for this level — straightforward, clear distractors',
  2: 'medium difficulty — some nuance required, plausible distractors',
  3: 'challenging — subtle distinctions, sophisticated content',
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

function formatOptions(options: string[]): string {
  return `'${JSON.stringify(options).replace(/'/g, "''")}'`
}

async function generateQuestionsForCombination(
  level: string,
  difficulty: number,
  existingCount: number
): Promise<string> {
  const mcNeeded = 32
  const essayNeeded = 8

  const prompt = `Generate ${mcNeeded} multiple choice questions and ${essayNeeded} essay questions for an English learning quiz.

Level: ${level} (${LEVEL_DESCRIPTIONS[level]})
Difficulty: ${difficulty} (${DIFFICULTY_DESCRIPTIONS[difficulty]})

Requirements:
- Multiple choice: 4 options each, exactly 1 correct answer
- Essay: open-ended prompts requiring 2-5 sentence written responses
- All questions must be appropriate for CEFR level ${level}
- Vary the grammar topics and vocabulary topics covered
- Make distractors plausible (common mistakes for this level)
- Include explanation (why correct answer is right) and study_tip (learning tip)
- time_limit_seconds: 60 for MC, 120 for essay

Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {
    "type": "multiple_choice",
    "topic": "topic_name",
    "question_text": "question here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct_answer": "exact correct option text",
    "explanation": "why this is correct",
    "study_tip": "learning tip",
    "time_limit_seconds": 60
  },
  {
    "type": "essay",
    "topic": "topic_name",
    "question_text": "essay prompt here",
    "options": null,
    "correct_answer": "example answer / key elements expected",
    "explanation": "what makes a good answer",
    "study_tip": "writing tip",
    "time_limit_seconds": 120
  }
]

Generate exactly ${mcNeeded} multiple_choice and ${essayNeeded} essay entries.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonText = content.text.trim()
  const questions = JSON.parse(jsonText)

  const sqlRows = questions.map((q: {
    type: string
    topic: string
    question_text: string
    options: string[] | null
    correct_answer: string
    explanation: string
    study_tip: string
    time_limit_seconds: number
  }) => {
    const optionsSql = q.options ? formatOptions(q.options) : 'NULL'
    return `('${level}',${difficulty},'${q.type}','${escapeSql(q.topic)}','${escapeSql(q.question_text)}',${optionsSql},'${escapeSql(q.correct_answer)}','${escapeSql(q.explanation)}','${escapeSql(q.study_tip)}',${q.time_limit_seconds})`
  })

  return sqlRows.join(',\n')
}

async function main() {
  const outputPath = path.join(process.cwd(), 'supabase', 'seed-full.sql')
  const lines: string[] = [
    '-- Full seed: 720 additional questions (32 MC + 8 essay per level/difficulty)',
    '-- Run after seed.sql (which contains the initial 180)',
    '',
    'INSERT INTO questions (level, difficulty, type, topic, question_text, options, correct_answer, explanation, study_tip, time_limit_seconds) VALUES',
  ]

  const allRows: string[] = []

  for (const level of LEVELS) {
    for (const difficulty of DIFFICULTIES) {
      console.log(`Generating ${level} difficulty ${difficulty}...`)
      try {
        const rows = await generateQuestionsForCombination(level, difficulty, 0)
        allRows.push(rows)
        console.log(`  ✓ ${level} D${difficulty} done`)
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 1000))
      } catch (err) {
        console.error(`  ✗ ${level} D${difficulty} failed:`, err)
        throw err
      }
    }
  }

  lines.push(allRows.join(',\n'))
  lines.push(';')

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
  console.log(`\nDone! Written to ${outputPath}`)
}

main().catch(console.error)
