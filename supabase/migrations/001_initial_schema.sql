-- Perfil do usuário (extensão do auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Banco de questões
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  type TEXT NOT NULL CHECK (type IN ('multiple_choice','essay')),
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  study_tip TEXT NOT NULL,
  time_limit_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessão de quiz
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  current_block INTEGER DEFAULT 1 CHECK (current_block BETWEEN 1 AND 3),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','abandoned')),
  block_1_score NUMERIC(5,2),
  block_2_score NUMERIC(5,2),
  block_3_score NUMERIC(5,2),
  total_score NUMERIC(5,2),
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- Respostas do quiz
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  block_number INTEGER NOT NULL CHECK (block_number BETWEEN 1 AND 3),
  user_answer TEXT,
  is_correct BOOLEAN,
  score NUMERIC(5,2) DEFAULT 0,
  ai_feedback TEXT,
  time_spent_seconds INTEGER,
  question_started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_questions_level_diff ON questions(level, difficulty);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: quiz_sessions
CREATE POLICY "Users can view own sessions" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON quiz_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Policies: quiz_answers
CREATE POLICY "Users can view own answers" ON quiz_answers FOR SELECT
  USING (session_id IN (SELECT id FROM quiz_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own answers" ON quiz_answers FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM quiz_sessions WHERE user_id = auth.uid()));

-- Policies: questions (leitura pública para autenticados)
CREATE POLICY "Questions are readable by authenticated users" ON questions
  FOR SELECT TO authenticated USING (true);

-- Trigger: criar profile automaticamente no signup (inclusive Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para marcar sessões abandonadas (usada por cron/edge function)
CREATE OR REPLACE FUNCTION abandon_stale_sessions()
RETURNS void AS $$
BEGIN
  UPDATE quiz_sessions
  SET status = 'abandoned'
  WHERE status = 'in_progress'
    AND started_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
