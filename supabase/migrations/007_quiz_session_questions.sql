CREATE TABLE quiz_session_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  block_number INTEGER NOT NULL CHECK (block_number BETWEEN 1 AND 3),
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 10),
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (session_id, question_id),
  UNIQUE (session_id, block_number, position)
);

CREATE INDEX idx_quiz_session_questions_session_block
  ON quiz_session_questions(session_id, block_number);

ALTER TABLE quiz_session_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own issued quiz questions" ON quiz_session_questions
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM quiz_sessions WHERE user_id = auth.uid()
    )
  );

DROP POLICY "Questions are readable by authenticated users" ON questions;
