import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { CEFRLevel, LessonExample, StudyCategory } from '@/types'

export interface LessonContent {
  explanation: string
  examples: LessonExample[]
}

const SYSTEM_PROMPT = `You are a bilingual English teacher (English + Brazilian Portuguese) writing a
study lesson for a Brazilian learner at a given CEFR level.

Write the lesson so it matches the level: simpler language and shorter sentences for A1/A2,
more nuance for C1/C2.

Return ONLY a valid JSON object, no markdown fences, no text before or after, with this exact shape:
{
  "explanation": "<the lesson, in Brazilian Portuguese, using simple markdown (## headings, **bold**, - bullets). Explain WHEN and HOW to use the topic, the structure/rules, and 2-3 common mistakes Brazilians make. 150-300 words.>",
  "examples": [
    {"en": "<example sentence in English>", "pt": "<Portuguese translation>"}
  ]
}

Provide 4-6 examples that clearly illustrate the topic. Keep it encouraging and practical.`

export async function generateLesson(
  level: CEFRLevel,
  title: string,
  category: StudyCategory
): Promise<LessonContent | null> {
  try {
    return await Promise.race([
      callModel(level, title, category),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 20000)
      ),
    ])
  } catch (err) {
    console.error('[generateLesson] failed:', err)
    return null
  }
}

async function callModel(
  level: CEFRLevel,
  title: string,
  category: StudyCategory
): Promise<LessonContent> {
  const kind = category === 'expressions' ? 'expressions / vocabulary' : 'grammar'
  const { text } = await generateText({
    model: openai('gpt-4.1-nano'),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `CEFR level: ${level}
Topic type: ${kind}
Topic title: ${title}

Write the lesson for this topic.`,
      },
    ],
  })

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Invalid JSON from model')

  const parsed = JSON.parse(match[0]) as {
    explanation?: unknown
    examples?: unknown
  }

  const explanation = String(parsed.explanation ?? '').trim()
  if (!explanation) throw new Error('Empty explanation')

  const examples: LessonExample[] = Array.isArray(parsed.examples)
    ? parsed.examples
        .filter((e): e is { en: unknown; pt: unknown } => !!e && typeof e === 'object')
        .map(e => ({ en: String((e as { en: unknown }).en ?? ''), pt: String((e as { pt: unknown }).pt ?? '') }))
        .filter(e => e.en)
    : []

  return { explanation, examples }
}
