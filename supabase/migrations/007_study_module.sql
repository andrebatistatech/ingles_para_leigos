-- Módulo de Estudo VIP: currículo curado (gramática + expressões) + progresso

-- Currículo curado. Mapeia para questions.topic via question_topics (para exercícios).
-- Conteúdo da lição (explanation/examples) é gerado por IA sob demanda e cacheado aqui.
CREATE TABLE study_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('grammar','expressions')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  question_topics TEXT[] NOT NULL DEFAULT '{}',
  explanation TEXT,
  examples JSONB,
  content_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_study_topics_level ON study_topics(level, sort_order);

-- Progresso do usuário por tópico
CREATE TABLE study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES study_topics(id) ON DELETE CASCADE NOT NULL,
  lesson_studied_at TIMESTAMPTZ,
  exercises_done INTEGER NOT NULL DEFAULT 0,
  exercises_correct INTEGER NOT NULL DEFAULT 0,
  best_score NUMERIC(5,2),
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

CREATE INDEX idx_study_progress_user ON study_progress(user_id);

-- RLS
ALTER TABLE study_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Study topics readable by authenticated" ON study_topics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users view own study progress" ON study_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own study progress" ON study_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own study progress" ON study_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Seed do currículo (6 tópicos por nível). question_topics referencia slugs reais do banco.
INSERT INTO study_topics (level, slug, title, category, sort_order, question_topics) VALUES
-- A1
('A1','a1-present-simple','Present Simple','grammar',1, ARRAY['present_simple']),
('A1','a1-verb-to-be','Verb To Be','grammar',2, ARRAY['verb_to_be']),
('A1','a1-articles','Articles (a / an / the)','grammar',3, ARRAY['articles']),
('A1','a1-there-is-are','There is / There are','grammar',4, ARRAY['there_is_are','there_is']),
('A1','a1-greetings','Greetings & Introductions','expressions',5, ARRAY['greetings']),
('A1','a1-numbers','Numbers','expressions',6, ARRAY['numbers','ordinal_numbers']),
-- A2
('A2','a2-past-simple','Past Simple','grammar',1, ARRAY['past_simple']),
('A2','a2-present-continuous','Present Continuous','grammar',2, ARRAY['present_continuous']),
('A2','a2-going-to','Future with "going to"','grammar',3, ARRAY['going_to']),
('A2','a2-comparatives','Comparatives & Superlatives','grammar',4, ARRAY['comparatives','superlatives']),
('A2','a2-can','Can (ability / permission)','grammar',5, ARRAY['can','can_ability','can_could']),
('A2','a2-countable','Countable & Uncountable','grammar',6, ARRAY['countable_uncountable','countable']),
-- B1
('B1','b1-present-perfect','Present Perfect','grammar',1, ARRAY['present_perfect','present_perfect_intro','present_perfect_continuous']),
('B1','b1-first-conditional','First Conditional','grammar',2, ARRAY['first_conditional']),
('B1','b1-second-conditional','Second Conditional','grammar',3, ARRAY['second_conditional']),
('B1','b1-modal-verbs','Modal Verbs','grammar',4, ARRAY['modal_verbs','modals','must_should','must']),
('B1','b1-phrasal-verbs','Phrasal Verbs','expressions',5, ARRAY['phrasal_verbs']),
('B1','b1-adverbs','Adverbs','grammar',6, ARRAY['adverbs']),
-- B2
('B2','b2-passive-voice','Passive Voice','grammar',1, ARRAY['passive_voice','advanced_passive','complex_passives','passive_complex']),
('B2','b2-reported-speech','Reported Speech','grammar',2, ARRAY['reported_speech','reported_speech_complex','reported_speech_advanced','reported_speech_intro']),
('B2','b2-relative-clauses','Relative Clauses','grammar',3, ARRAY['relative_clauses']),
('B2','b2-mixed-conditionals','Mixed & Third Conditionals','grammar',4, ARRAY['mixed_conditionals','mixed_conditional','third_conditional']),
('B2','b2-connectors','Connectors & Linking Words','expressions',5, ARRAY['connectors','linking_words','discourse_markers']),
('B2','b2-collocations','Collocations','expressions',6, ARRAY['collocations','collocation','advanced_collocations']),
-- C1
('C1','c1-inversion','Inversion','grammar',1, ARRAY['inversion','advanced_inversion','inversion_advanced','inversion_style']),
('C1','c1-cleft','Cleft Sentences','grammar',2, ARRAY['cleft','cleft_emphasis','cleft_sentences','cleft_advanced']),
('C1','c1-nominalization','Nominalization','grammar',3, ARRAY['nominalization','nominal_phrases']),
('C1','c1-hedging','Hedging','expressions',4, ARRAY['hedging','hedging_advanced','hedged_claim']),
('C1','c1-idioms','Idioms','expressions',5, ARRAY['idioms','idioms_advanced','idiom_nuance']),
('C1','c1-register','Register & Formality','expressions',6, ARRAY['register','formal','formal_register','register_precision','high_register']),
-- C2
('C2','c2-subjunctive','Subjunctive','grammar',1, ARRAY['subjunctive','subjunctive_advanced','subjunctive_formal','subjunctive_usage']),
('C2','c2-complex-syntax','Complex Syntax','grammar',2, ARRAY['complex_syntax','complex_sentences','formal_syntax','syntax']),
('C2','c2-rhetoric','Rhetorical Devices','expressions',3, ARRAY['rhetoric','rhetorical','rhetorical_speech']),
('C2','c2-philosophical','Philosophical & Abstract Language','expressions',4, ARRAY['philosophical','philosophical_argument','philosophical_vocabulary']),
('C2','c2-ambiguity','Ambiguity & Nuance','grammar',5, ARRAY['ambiguity','nuance','nuanced']),
('C2','c2-stylistic','Stylistic & Literary Language','expressions',6, ARRAY['stylistic','literary','literary_language','stylistic_virtuosity']);
