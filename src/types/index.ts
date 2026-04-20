export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type Difficulty = 1 | 2 | 3
export type QuestionType = 'multiple_choice' | 'essay'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'

// Tipo enviado ao client — nunca inclui correct_answer
export interface Question {
  id: string
  level: CEFRLevel
  difficulty: Difficulty
  type: QuestionType
  topic: string
  question_text: string
  options: string[] | null
  explanation: string
  study_tip: string
  time_limit_seconds: number
}

// Tipo server-only — importar APENAS em route handlers e lib/server
export interface QuestionWithAnswer extends Question {
  correct_answer: string
}

export interface QuizSession {
  id: string
  user_id: string
  level: CEFRLevel
  current_block: Difficulty
  status: SessionStatus
  block_1_score: number | null
  block_2_score: number | null
  block_3_score: number | null
  total_score: number | null
  started_at: string
  finished_at: string | null
}

export interface QuizAnswer {
  id: string
  session_id: string
  question_id: string
  block_number: Difficulty
  user_answer: string | null
  is_correct: boolean | null
  score: number
  ai_feedback: string | null
  time_spent_seconds: number | null
  answered_at: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
}

// Retorno do /api/quiz/answer para o client (após o usuário já ter respondido)
export interface AnswerFeedback {
  is_correct: boolean | null
  correct_answer: string
  explanation: string
  study_tip: string
  score: number
  ai_feedback?: string | null
  pending?: boolean  // true = avaliação de essay ainda em processamento
  answerId?: string  // id do quiz_answer, usado para polling do essay
}

// Retorno do /api/quiz/start
export interface StartQuizResponse {
  sessionId: string
  questions: Question[]
  block: Difficulty
}

// Dados agregados para o dashboard
export interface LevelStats {
  level: CEFRLevel
  avg_score: number
  quiz_count: number
}

export interface QuizHistoryItem {
  id: string
  level: CEFRLevel
  total_score: number | null
  started_at: string
  finished_at: string | null
}
