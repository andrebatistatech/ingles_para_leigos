// Estrutura do feedback de redação armazenado em quiz_answers.ai_feedback (JSON).
// Mantém compatibilidade com feedback antigo (texto puro).

export interface StructuredEssayFeedback {
  correction: string
  explanation_en: string
  explanation_pt: string
}

export type ParsedEssayFeedback =
  | { structured: true; data: StructuredEssayFeedback }
  | { structured: false; text: string }

export function parseEssayFeedback(raw: string): ParsedEssayFeedback {
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object' && ('explanation_en' in obj || 'correction' in obj)) {
      return {
        structured: true,
        data: {
          correction: String(obj.correction ?? ''),
          explanation_en: String(obj.explanation_en ?? ''),
          explanation_pt: String(obj.explanation_pt ?? ''),
        },
      }
    }
  } catch {
    // não é JSON → feedback legado em texto puro
  }
  return { structured: false, text: raw }
}
