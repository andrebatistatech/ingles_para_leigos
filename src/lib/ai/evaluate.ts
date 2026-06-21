import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { CEFRLevel } from '@/types'

export interface EvaluationResult {
  score: number
  correction: string
  explanation_en: string
  explanation_pt: string
}

const SYSTEM_PROMPT = `You are an English teacher grading a student's written answer for a CEFR-leveled quiz.

Grade against three weighted criteria and combine them into a single 0-100 score:
- Grammar accuracy (40%): correctness of tense, agreement, syntax, spelling.
- Vocabulary appropriateness for the CEFR level (30%): range and accuracy expected AT that level
  (do not penalize an A1 student for simple vocabulary, nor reward a C1 student for it).
- Task completion (30%): did they actually answer what was asked, on topic and complete?

Score anchors (apply per criterion, then weight):
- 90-100: fully meets the criterion for the level, negligible issues.
- 70-89: meets it with minor issues that don't impede understanding.
- 50-69: partially meets it; noticeable issues.
- 20-49: largely fails it; frequent errors or off-task.
- 0-19: empty, off-topic, or unintelligible.

Calibrate expectations to the student's CEFR level (A1 lowest, C2 highest): the same text earns a
higher score at A1 than at C1.

Return ONLY a valid JSON object, no markdown, no text before or after, with this exact shape:
{
  "score": <integer 0-100>,
  "correction": "<the student's answer rewritten correctly in natural English, keeping their original meaning. If it was already correct, repeat it.>",
  "explanation_en": "<simple, encouraging explanation IN ENGLISH of what was wrong and why, in plain words a learner understands. 2-3 short sentences. Point to the specific mistakes.>",
  "explanation_pt": "<the SAME explanation translated to Brazilian Portuguese, simple and clear.>"
}

Be encouraging but honest. Keep the language simple and appropriate for the student's level.`

export async function evaluateEssay(
  level: CEFRLevel,
  questionText: string,
  correctAnswerExample: string,
  studentAnswer: string
): Promise<EvaluationResult | null> {
  try {
    const result = await Promise.race([
      callModel(level, questionText, correctAnswerExample, studentAnswer),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      ),
    ])
    return result
  } catch (err) {
    console.error('[evaluateEssay] failed:', err)
    return null
  }
}

async function callModel(
  level: CEFRLevel,
  questionText: string,
  correctAnswerExample: string,
  studentAnswer: string
): Promise<EvaluationResult> {
  const { text } = await generateText({
    model: openai('gpt-4.1-nano'),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Level: ${level} (CEFR)
<question>${questionText}</question>
<expected_answer>${correctAnswerExample}</expected_answer>
<student_answer>${studentAnswer}</student_answer>`,
      },
    ],
  })

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Invalid JSON from model')

  const parsed = JSON.parse(match[0])
  return {
    score: Math.max(0, Math.min(100, Number(parsed.score))),
    correction: String(parsed.correction ?? ''),
    explanation_en: String(parsed.explanation_en ?? ''),
    explanation_pt: String(parsed.explanation_pt ?? ''),
  }
}
