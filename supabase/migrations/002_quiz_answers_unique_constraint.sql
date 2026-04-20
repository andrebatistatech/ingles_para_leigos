-- Prevent duplicate answers for the same question in a session (race condition fix)
ALTER TABLE quiz_answers
  ADD CONSTRAINT uq_quiz_answers_session_question
  UNIQUE (session_id, question_id);
