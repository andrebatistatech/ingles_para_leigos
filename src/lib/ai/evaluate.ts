import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { CEFRLevel } from '@/types'

export interface EvaluationResult {
  score: number
  feedback: string
  suggestion: string
}

const SYSTEM_PROMPT = `You are an English teacher evaluating a student's answer.

Scoring criteria:
- Grammar accuracy (40%)
- Vocabulary appropriateness for the level (30%)
- Task completion — did they answer what was asked? (30%)

Return ONLY a valid JSON object with this exact shape:
{"score": <0-100>, "feedback": "<educational feedback>", "suggestion": "<specific improvement tip>"}

Be encouraging but honest. Explain errors in simple terms appropriate for the student's level.
Always respond in English.`

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
    model: anthropic('claude-sonnet-4-6'),
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
    feedback: String(parsed.feedback),
    suggestion: String(parsed.suggestion),
  }
}
