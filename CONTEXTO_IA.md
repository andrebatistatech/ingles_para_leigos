# Contexto do Projeto — Base para Engenharia de Prompts

> Documento de referência para uso com ChatGPT (ou outra IA) na criação e otimização
> de prompts de alta performance para o produto **Inglês para Leigos**.

---

## 1. O que é o produto

**Inglês para Leigos** é uma plataforma de quizzes de inglês para brasileiros. O usuário
escolhe um nível CEFR (A1, A2, B1, B2, C1, C2) e faz um quiz de **30 questões**, dividido em
**3 blocos de 10 questões** com dificuldade progressiva (bloco 1 = fácil, bloco 2 = médio,
bloco 3 = difícil). Recebe feedback educativo imediato e, no caso de usuários VIP, correção
de redação e explicação de erros por IA.

### Tipos de questão
- **Múltipla escolha (MC):** nota 0 ou 100 (acertou/errou). Corrigida sem IA.
- **Redação (essay):** nota 0–100 atribuída por IA. **Exclusiva para VIP.**

### Regras de pontuação
- Nota do bloco = média das 10 questões.
- Nota total = média dos 3 blocos.
- Plano grátis: só MC. VIP: 2 redações por bloco (6 por quiz) + correção por IA.

---

## 2. Stack técnica

- **Frontend/Backend:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui.
- **Auth + Banco:** Supabase (PostgreSQL com RLS; login email/senha + Google OAuth).
- **IA:** **OpenAI via Vercel AI SDK** (`ai` + `@ai-sdk/openai`). Modelo atual: **`gpt-4.1-nano`**.
  > Observação: a documentação interna (`CLAUDE.md`) menciona Claude/Anthropic, mas o código
  > real usa OpenAI. Considerar isso ao planejar prompts (formato de mensagens, JSON, etc).
- **Deploy:** Vercel (frontend) + Supabase Cloud.

---

## 3. Onde a IA é usada hoje (2 pontos)

A IA aparece em **dois lugares**, ambos server-side, ambos com `gpt-4.1-nano`.

### 3.1 Correção de redação (`src/lib/ai/evaluate.ts`)

**Função:** dada uma resposta de redação do aluno, retorna `{ score, feedback, suggestion }`.

**Entradas disponíveis:**
- `level` — nível CEFR do quiz (A1–C2)
- `questionText` — enunciado da questão
- `correctAnswerExample` — exemplo de resposta esperada/correta
- `studentAnswer` — resposta do aluno

**Critérios de nota:** gramática 40%, vocabulário (adequado ao nível) 30%, cumprimento da
tarefa 30%.

**Restrições técnicas atuais:**
- **Timeout de 15s** (via `Promise.race`); se estourar, retorna `null` e a redação fica
  pendente (`ai_feedback = null`) — nunca trava o usuário.
- A saída precisa ser **JSON válido**. O parsing hoje é frágil: extrai o primeiro `{...}`
  com regex (`/\{[\s\S]*\}/`) e dá `JSON.parse`. Se vier texto fora do JSON ou markdown,
  pode quebrar.
- `score` é forçado para o intervalo 0–100.
- Resposta sempre em inglês.

**Prompt de sistema atual (verbatim):**
```
You are an English teacher evaluating a student's answer.

Scoring criteria:
- Grammar accuracy (40%)
- Vocabulary appropriateness for the level (30%)
- Task completion — did they answer what was asked? (30%)

Return ONLY a valid JSON object with this exact shape:
{"score": <0-100>, "feedback": "<educational feedback>", "suggestion": "<specific improvement tip>"}

Be encouraging but honest. Explain errors in simple terms appropriate for the student's level.
Always respond in English.
```

**Mensagem do usuário atual (verbatim):**
```
Level: {level} (CEFR)
<question>{questionText}</question>
<expected_answer>{correctAnswerExample}</expected_answer>
<student_answer>{studentAnswer}</student_answer>
```

### 3.2 Explicação de erro em MC para VIP (`src/app/api/quiz/explain/route.ts`)

**Função:** quando o aluno VIP erra uma questão de múltipla escolha, gera uma explicação
educativa bilíngue (português + inglês).

**Entradas disponíveis:**
- `questionText` — enunciado
- `userAnswer` — o que o aluno respondeu (pode ser nulo / "tempo esgotado")
- `correctAnswer` — resposta correta
- `level` — nível CEFR

**Restrições técnicas atuais:**
- Apenas VIP (`is_vip = true`), senão 403.
- **Limite de 5 explicações por sessão de quiz** (`explain_count`), senão 429.
- Saída é texto livre (não JSON), em formato fixo de 2 linhas.

**Prompt de sistema atual (verbatim):**
```
You are a bilingual English teacher (English + Brazilian Portuguese).
A student answered an English question incorrectly.

Provide a short, educational explanation with:
1. Why their answer is wrong (in Portuguese)
2. Why the correct answer is right (in Portuguese)
3. A grammar/vocabulary tip in English with Portuguese translation

Format as a single paragraph, max 3-4 sentences. Be encouraging.
Respond in this exact format:
🇧🇷 <explanation in Portuguese>
🇺🇸 <tip in English> (<Portuguese translation>)
```

**Mensagem do usuário atual (verbatim):**
```
Level: {level}
Question: {questionText}
Student answered: {userAnswer ?? '(no answer / time expired)'}
Correct answer: {correctAnswer}
```

---

## 4. Modelo de dados relevante para prompts

- **`questions`** — banco de ~900 questões. Campos úteis para contexto de prompt:
  `level` (A1–C2), `difficulty` (1–3), `type` (`multiple_choice` | `essay`), `topic`,
  `question_text`, `options` (JSONB, nulo em redação), `correct_answer`, `explanation`
  (explicação pré-escrita), `study_tip` (dica pré-escrita), `time_limit_seconds`.
- **`quiz_answers`** — uma linha por questão respondida. `ai_feedback` é nulo até a IA
  responder (redações).
- **`quiz_sessions`** — guarda `explain_count` (limite de explicações VIP) e notas por bloco.

> Importante: cada questão já tem `explanation` e `study_tip` escritos por humano no banco.
> A IA pode (ou não) usar isso como insumo adicional — hoje **não** usa.

---

## 5. Objetivos ao otimizar prompts (o que pedir ao ChatGPT)

Ao pedir ajuda na criação de prompts de alta performance, considerar estas metas:

1. **Confiabilidade de JSON** (caso 3.1): garantir saída JSON 100% parseável, sem markdown,
   sem texto extra. Avaliar uso de structured output / response_format.
2. **Adequação ao nível CEFR:** o vocabulário e a complexidade do feedback devem variar de
   A1 (simples) a C2 (avançado). Hoje o prompt só diz "appropriate for the level" — pode ser
   muito mais explícito por faixa.
3. **Consistência de nota:** mesma redação deve receber notas estáveis. Definir rubrica
   detalhada por critério (gramática/vocabulário/tarefa) com âncoras de pontuação.
4. **Custo e latência:** modelo é o `gpt-4.1-nano` (barato/rápido) com timeout de 15s. Prompts
   devem ser eficientes; evitar cadeias longas que estourem o tempo.
5. **Idioma:** correção de redação em inglês; explicação de erro bilíngue PT+EN no formato fixo.
6. **Tom:** encorajador porém honesto, didático.
7. **Robustez de entrada:** lidar com respostas vazias, "tempo esgotado", respostas muito
   curtas ou fora do tópico.

---

## 6. Pergunta-modelo para o ChatGPT

> "Sou dono de uma plataforma de quizzes de inglês (contexto acima). Uso OpenAI `gpt-4.1-nano`
> via Vercel AI SDK em dois pontos: correção de redação (saída JSON `{score, feedback,
> suggestion}`) e explicação bilíngue de erro. Ajude-me a reescrever esses prompts para máxima
> confiabilidade de JSON, consistência de notas, adequação ao nível CEFR e baixa latência.
> Proponha rubricas de pontuação, exemplos few-shot e formato de saída robusto."
