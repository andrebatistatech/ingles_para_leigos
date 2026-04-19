# PRD — Inglês para Leigos: Plataforma de Quiz

## 1. Visão Geral

### 1.1 Objetivo
Construir uma plataforma web de quiz interativo para aprendizado de inglês, onde o usuário seleciona seu nível CEFR (A1-C2) e realiza quizzes de 30 questões organizadas em 3 blocos de dificuldade, com avaliação automática por IA para questões dissertativas e feedback educativo completo.

### 1.2 Problema
Pessoas que querem aprender inglês não têm acesso fácil a uma ferramenta prática que teste seus conhecimentos no nível correto, forneça feedback educativo imediato e acompanhe seu progresso ao longo do tempo.

### 1.3 Público-Alvo
- Estudantes autodidatas que querem praticar por conta própria
- Alunos de escolas/cursos que querem reforço fora da aula
- Profissionais que precisam validar/melhorar o inglês para o mercado

### 1.4 Métricas de Sucesso
- Usuário completa o cadastro e primeiro quiz em menos de 30 minutos
- Taxa de conclusão de quiz acima de 70%
- Usuário retorna para fazer pelo menos 2 quizzes

---

## 2. Requisitos Funcionais

### 2.1 Autenticação
- Cadastro e login com email/senha
- Login social com Google OAuth
- Sessão persistente (usuário não precisa logar toda vez)
- Perfil do usuário com nome e avatar

### 2.2 Seleção de Nível
- Página inicial exibe os 6 níveis CEFR: A1, A2, B1, B2, C1, C2
- Cada nível mostra uma breve descrição do que é esperado
- Usuário pode trocar de nível a qualquer momento
- Exibir histórico de quizzes já feitos por nível

### 2.3 Quiz — Estrutura
- 30 questões por quiz, divididas em 3 blocos:
  - **Bloco Fácil**: 10 questões (8 múltipla escolha + 2 dissertativas)
  - **Bloco Médio**: 10 questões (8 múltipla escolha + 2 dissertativas)
  - **Bloco Difícil**: 10 questões (8 múltipla escolha + 2 dissertativas)
- Navegação linear dentro de cada bloco (sem voltar)
- Resultado parcial exibido ao final de cada bloco antes de avançar
- Questões sorteadas do banco, evitando repetição de questões já respondidas pelo aluno

### 2.4 Quiz — Questões
- Questões de múltipla escolha com 4 alternativas
- Questões dissertativas com campo de texto livre
- Timer por questão:
  - Múltipla escolha: 60 segundos
  - Dissertativa: 120 segundos
- Ao esgotar o tempo, a questão é marcada como não respondida e avança automaticamente

### 2.5 Quiz — Feedback
- Ao responder cada questão (ou esgotar o tempo), o aluno vê:
  - Se acertou ou errou
  - A resposta correta
  - Explicação do porquê (ex: "Usamos Present Perfect porque...")
  - Dica de estudo relacionada (ex: "Revise: regras do Present Perfect")
- Para dissertativas: feedback gerado por IA (Claude API) avaliando a resposta

### 2.6 Quiz — Pontuação
- Múltipla escolha: 0 (errou) ou 100 (acertou) pontos
- Dissertativa: 0 a 100 pontos (avaliação gradual pela IA)
- Pontuação do bloco: média das 10 questões
- Pontuação total: média dos 3 blocos
- Exibir tempo total gasto

### 2.7 Dashboard do Aluno
- Histórico de todos os quizzes realizados (data, nível, nota)
- Pontuação média por nível
- Evolução ao longo do tempo (gráfico simples)
- Número de quizzes completados

### 2.8 Avaliação Dissertativa por IA
- Integração com Claude API para avaliar respostas dissertativas
- O prompt deve incluir:
  - A questão original
  - O nível CEFR do aluno
  - A resposta do aluno
- A IA retorna:
  - Score (0-100)
  - Feedback educativo explicando o que está certo/errado
  - Sugestão de melhoria
- Timeout de 15 segundos — se a IA não responder, marcar como "avaliação pendente"

---

## 3. Banco de Questões

### 3.1 Volume
- 900 questões no total
- 50 questões por combinação nível + dificuldade (6 níveis x 3 dificuldades = 18 combinações)
- De cada 50: 40 múltipla escolha + 10 dissertativas

### 3.2 Distribuição de Temas por Nível CEFR

**A1 — Iniciante:**
- Temas: cumprimentos, família, comida, números, cores, dias da semana, objetos cotidianos
- Gramática: Present Simple, verb to be, articles, imperatives, basic prepositions

**A2 — Elementar:**
- Temas: rotina diária, compras, clima, direções, hobbies, descrição de pessoas
- Gramática: Present Continuous, Past Simple, going to (futuro), comparatives, countable/uncountable

**B1 — Intermediário:**
- Temas: viagens, trabalho, saúde, opiniões, planos futuros, experiências
- Gramática: Present Perfect, Past Continuous, First Conditional, modals (can/should/must), relative clauses

**B2 — Intermediário Superior:**
- Temas: notícias, debates, meio ambiente, cultura, tecnologia, educação
- Gramática: Past Perfect, Second/Third Conditional, Passive Voice, Reported Speech, phrasal verbs

**C1 — Avançado:**
- Temas: acadêmico, negócios, ciência, política, ética, literatura
- Gramática: Mixed Conditionals, Advanced Passive, Subjunctive, Inversion, advanced phrasal verbs, cleft sentences

**C2 — Proficiência:**
- Temas: textos complexos, ironia, nuances culturais, debates filosóficos, linguagem literária
- Gramática: todos os tempos com nuances sutis, registro formal/informal, ambiguidade gramatical, collocations avançados

### 3.3 Formato das Questões no Banco

**Múltipla Escolha:**
```json
{
  "level": "A1",
  "difficulty": 1,
  "type": "multiple_choice",
  "topic": "present_simple",
  "question_text": "She ___ to school every day.",
  "options": ["go", "goes", "going", "gone"],
  "correct_answer": "goes",
  "explanation": "We use 'goes' because the subject is 'she' (third person singular). In Present Simple, we add -s or -es to the verb for he/she/it.",
  "study_tip": "Rule: For he/she/it in Present Simple, add -s to the verb. Example: I go → She goes, I play → He plays.",
  "time_limit_seconds": 60
}
```

**Dissertativa:**
```json
{
  "level": "B1",
  "difficulty": 2,
  "type": "essay",
  "topic": "present_perfect_experience",
  "question_text": "Write 2-3 sentences about a place you have visited. Use the Present Perfect tense.",
  "correct_answer": "Sample: I have visited Paris twice. I have seen the Eiffel Tower and I have eaten French food.",
  "explanation": "Present Perfect is used to talk about life experiences without specifying when they happened.",
  "study_tip": "Structure: Subject + have/has + past participle. Use 'ever' for questions and 'never' for negatives about experiences.",
  "time_limit_seconds": 120
}
```

### 3.4 Lógica de Seleção
- Ao iniciar um bloco, o sistema seleciona 10 questões aleatórias (8 MC + 2 essay)
- Filtra questões que o aluno já respondeu naquele nível/dificuldade
- Se o banco de questões não respondidas for menor que 10, permite repetição das mais antigas
- A distribuição de temas deve ser a mais variada possível dentro da seleção

---

## 4. Requisitos Não-Funcionais

### 4.1 Performance
- Página inicial carrega em menos de 2 segundos
- Transição entre questões em menos de 500ms
- Avaliação por IA em menos de 15 segundos

### 4.2 Segurança
- Row Level Security (RLS) no Supabase — cada usuário só acessa seus dados
- Timer validado server-side para evitar manipulação
- Respostas corretas nunca enviadas ao client antes da resposta do aluno
- Sanitização de input nas respostas dissertativas

### 4.3 Responsividade
- Design responsivo (mobile + desktop) desde o início
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Touch-friendly para seleção de alternativas no mobile

### 4.4 Acessibilidade
- Navegação por teclado no quiz
- Contraste adequado (WCAG AA)
- Labels e ARIA attributes nos formulários

---

## 5. Arquitetura Técnica

### 5.1 Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) | SSR, rotas automáticas, SDK Supabase oficial |
| Styling | Tailwind CSS + shadcn/ui | Responsivo, acessível, customizável |
| Auth | Supabase Auth | Email/senha + Google OAuth, sessão persistente |
| Banco de Dados | Supabase PostgreSQL | Managed, RLS, realtime |
| LLM | Claude API (Anthropic) | Avaliação dissertativa + feedback educativo |
| Deploy Frontend | Vercel | Free tier, integração nativa com Next.js |
| Deploy Backend | Supabase Cloud | Free tier, managed PostgreSQL |

### 5.2 Modelo de Dados

```sql
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
  options JSONB, -- null for essay, array of strings for MC
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
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_questions_level_diff ON questions(level, difficulty);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON quiz_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own answers" ON quiz_answers FOR SELECT
  USING (session_id IN (SELECT id FROM quiz_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own answers" ON quiz_answers FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM quiz_sessions WHERE user_id = auth.uid()));

-- Questions são públicas (leitura)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are readable by authenticated users" ON questions FOR SELECT TO authenticated USING (true);
```

### 5.3 Estrutura do Projeto Next.js

```
ingles_para_leigos/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz com providers
│   │   ├── page.tsx                # Landing/home
│   │   ├── login/
│   │   │   └── page.tsx            # Login + cadastro
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard do aluno
│   │   ├── quiz/
│   │   │   ├── select/
│   │   │   │   └── page.tsx        # Seleção de nível
│   │   │   ├── [sessionId]/
│   │   │   │   ├── page.tsx        # Quiz em andamento
│   │   │   │   └── result/
│   │   │   │       └── page.tsx    # Resultado final
│   │   └── api/
│   │       ├── quiz/
│   │       │   ├── start/route.ts      # Inicia quiz + seleciona questões
│   │       │   ├── answer/route.ts     # Registra resposta
│   │       │   └── evaluate/route.ts   # Avalia dissertativa via Claude
│   │       └── auth/
│   │           └── callback/route.ts   # OAuth callback
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── quiz/
│   │   │   ├── QuestionCard.tsx    # Card da questão (MC + essay)
│   │   │   ├── Timer.tsx           # Countdown timer
│   │   │   ├── BlockResult.tsx     # Resultado do bloco
│   │   │   ├── ProgressBar.tsx     # Progresso no bloco
│   │   │   └── FeedbackPanel.tsx   # Feedback após resposta
│   │   ├── dashboard/
│   │   │   ├── QuizHistory.tsx     # Lista de quizzes feitos
│   │   │   └── ScoreChart.tsx      # Gráfico de evolução
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase browser client
│   │   │   ├── server.ts           # Supabase server client
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── claude/
│   │   │   └── evaluate.ts         # Claude API integration
│   │   ├── quiz/
│   │   │   ├── selector.ts         # Lógica de seleção de questões
│   │   │   └── scorer.ts           # Lógica de pontuação
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   └── middleware.ts               # Next.js middleware (auth guard)
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                    # Seed com questões iniciais
├── public/
├── .env.local                      # SUPABASE_URL, SUPABASE_ANON_KEY, CLAUDE_API_KEY
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── prd.md
```

### 5.4 API Routes

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/callback` | GET | Callback do OAuth (Google) |
| `/api/quiz/start` | POST | Cria sessão + seleciona questões do bloco |
| `/api/quiz/answer` | POST | Registra resposta + retorna feedback (MC) ou avalia (essay) |
| `/api/quiz/evaluate` | POST | Avalia resposta dissertativa via Claude API |

### 5.5 Integração Claude API — Prompt para Avaliação Dissertativa

```
You are an English teacher evaluating a student's answer.

Level: {level} (CEFR)
Question: {question_text}
Expected answer example: {correct_answer}
Student's answer: {user_answer}

Evaluate the student's answer and return a JSON object:
{
  "score": <0-100>,
  "feedback": "<educational feedback explaining what's correct and what needs improvement>",
  "suggestion": "<specific suggestion for improvement>"
}

Scoring criteria:
- Grammar accuracy (40%)
- Vocabulary appropriateness for the level (30%)
- Task completion — did they answer what was asked? (30%)

Be encouraging but honest. Explain errors in simple terms appropriate for a {level} student.
Always respond in English.
```

---

## 6. Fluxo do Usuário

### 6.1 Primeiro Acesso
```
Landing Page → Cadastro (email ou Google) → Seleção de Nível → Quiz → Resultado → Dashboard
```

### 6.2 Retorno
```
Login → Dashboard (vê histórico) → Seleciona Nível → Quiz → Resultado → Dashboard atualizado
```

### 6.3 Fluxo do Quiz
```
Seleciona Nível (ex: B1)
    │
    ▼
Bloco 1 — Fácil (10 questões lineares)
    │  ├── Q1: MC → responde → feedback imediato → próxima
    │  ├── Q2: MC → responde → feedback → próxima
    │  ├── ...
    │  ├── Q9: Essay → responde → IA avalia → feedback → próxima
    │  └── Q10: MC → responde → feedback
    │
    ▼
Resultado Bloco 1 (nota, acertos, tempo)
    │  └── Botão: "Continuar para Bloco Médio"
    │
    ▼
Bloco 2 — Médio (mesma estrutura)
    │
    ▼
Resultado Bloco 2
    │  └── Botão: "Continuar para Bloco Difícil"
    │
    ▼
Bloco 3 — Difícil (mesma estrutura)
    │
    ▼
Resultado Final (nota total, breakdown por bloco, tempo total)
    │  └── Botões: "Ver Detalhes" | "Novo Quiz" | "Dashboard"
```

---

## 7. Design e UX

### 7.1 Paleta de Cores (sugestão)
- Primary: Azul (#2563EB) — confiança, aprendizado
- Success: Verde (#16A34A) — acerto
- Error: Vermelho (#DC2626) — erro
- Warning: Amarelo (#F59E0B) — timer baixo
- Background: Cinza claro (#F8FAFC)
- Text: Cinza escuro (#1E293B)

### 7.2 Páginas Principais

**Login/Cadastro:**
- Formulário limpo centralizado
- Opção Google OAuth proeminente
- Link para alternar login/cadastro

**Seleção de Nível:**
- 6 cards (A1-C2) em grid responsivo (2 colunas mobile, 3 desktop)
- Cada card mostra: nível, descrição curta, número de quizzes já feitos
- Cor indicativa de progressão (mais escuro = mais avançado)

**Quiz:**
- Questão centralizada com fonte grande
- Timer visível no topo (muda para vermelho nos últimos 10s)
- Barra de progresso (questão X de 10)
- Alternativas como botões grandes (touch-friendly)
- Campo de texto amplo para dissertativas
- Painel de feedback desliza de baixo após responder

**Resultado do Bloco:**
- Nota em destaque (grande, colorida)
- Lista resumida: acertos/erros por questão
- Tempo total do bloco
- Botão de continuar

**Dashboard:**
- Cards de resumo no topo (total quizzes, nota média, último quiz)
- Gráfico de linha simples (evolução da nota)
- Tabela de histórico (data, nível, nota, duração)

---

## 8. Fases de Implementação

### Fase 1 — Setup e Auth (Sprint 1)
- [ ] Inicializar projeto Next.js + Tailwind + shadcn/ui
- [ ] Configurar Supabase (projeto, tabelas, RLS)
- [ ] Implementar autenticação (email + Google)
- [ ] Criar layout base (header, footer, navegação)
- [ ] Página de login/cadastro funcional

### Fase 2 — Quiz Core (Sprint 2)
- [ ] Página de seleção de nível
- [ ] Lógica de seleção de questões (sem repetição)
- [ ] Componente de questão (múltipla escolha)
- [ ] Componente de questão (dissertativa)
- [ ] Timer por questão
- [ ] Navegação linear entre questões
- [ ] Feedback após cada questão (MC)
- [ ] Resultado do bloco

### Fase 3 — IA e Avaliação (Sprint 3)
- [ ] Integração Claude API
- [ ] Avaliação de dissertativas em tempo real
- [ ] Feedback educativo da IA
- [ ] Tratamento de timeout/erros da IA
- [ ] Resultado final do quiz

### Fase 4 — Dashboard e Polish (Sprint 4)
- [ ] Dashboard com histórico
- [ ] Gráfico de evolução
- [ ] Responsividade completa (mobile/tablet/desktop)
- [ ] Seed do banco com questões iniciais (mínimo 180 para testar — 10 por nível/dificuldade)
- [ ] Testes e ajustes finais

### Fase 5 — Conteúdo (Sprint 5)
- [ ] Criar/validar as 900 questões completas
- [ ] Revisar distribuição de temas por nível
- [ ] Testes com usuários reais

---

## 9. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Custo da Claude API por quiz | Alto se muitos usuários | Cache de respostas similares, rate limiting |
| Qualidade das 900 questões | Questões ruins afetam credibilidade | Revisão manual, referências CEFR oficiais |
| Timer manipulável via client | Trapaça | Validação server-side do tempo |
| Latência da IA em dissertativas | UX ruim se lento | Loading state amigável, timeout de 15s |
| Supabase free tier limits | 500MB DB, 50K auth users | Suficiente para MVP, upgrade quando necessário |

---

## 10. Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Fora do Escopo (MVP)

- Ranking entre usuários
- Painel do professor
- Certificados de conclusão
- Geração dinâmica de questões por IA
- Notificações push
- Sistema de badges/streak
- Chat com IA para tirar dúvidas
- Modo offline / PWA
- Internacionalização (interface só em português no MVP)
- App nativo (mobile)
