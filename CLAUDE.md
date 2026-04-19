# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inglês para Leigos** — an English quiz platform for Brazilian learners. Users select a CEFR level (A1–C2), take 30-question quizzes in 3 difficulty blocks, and receive AI-graded feedback on essay questions.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Auth + DB**: Supabase (PostgreSQL with RLS, email/password + Google OAuth)
- **AI**: Claude API (Anthropic) — essay grading only
- **Deploy**: Vercel (frontend) + Supabase Cloud

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

Supabase migrations:
```bash
supabase db push     # Apply migrations to remote
supabase db reset    # Reset local DB and re-run migrations
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-side only
ANTHROPIC_API_KEY=             # server-side only
NEXT_PUBLIC_APP_URL=
```

## Architecture

### Route Structure
- `/` — Landing/home
- `/login` — Email + Google OAuth
- `/dashboard` — Quiz history, score evolution chart
- `/quiz/select` — CEFR level picker (A1–C2)
- `/quiz/[sessionId]` — Active quiz (linear, no back-navigation)
- `/quiz/[sessionId]/result` — Final results

### API Routes (all server-side)
- `POST /api/quiz/start` — Creates session, selects questions for a block (avoids repeats)
- `POST /api/quiz/answer` — Records answer, returns MC feedback or triggers essay eval
- `POST /api/quiz/evaluate` — Calls Claude API for essay scoring (15s timeout)
- `GET /api/auth/callback` — Google OAuth redirect handler

### Key Business Rules

**Quiz structure**: 30 questions = 3 blocks × 10 questions (8 MC + 2 essay per block). Blocks map to difficulty 1/2/3.

**Question selection** (`lib/quiz/selector.ts`): Query `questions` filtered by level+difficulty, exclude IDs already answered by this user in this level. If <10 unresponded, allow oldest repeats.

**Scoring**: MC is 0 or 100. Essay is 0–100 via AI. Block score = average of 10 questions. Total = average of 3 blocks.

**Essay evaluation** (`lib/claude/evaluate.ts`): Claude returns `{score, feedback, suggestion}` JSON. On timeout/error, store `ai_feedback = null` and mark as pending — never block the user.

**Security**: Correct answers are never sent to the client before the user answers. Timer is validated server-side. All user data is protected by Supabase RLS.

### Data Model (key tables)
- `profiles` — extends `auth.users`, stores name + avatar
- `questions` — 900 questions; `options` is JSONB (null for essays)
- `quiz_sessions` — tracks level, current block, per-block scores, status
- `quiz_answers` — one row per question answered; `ai_feedback` nullable for essays

### Supabase Clients
- `lib/supabase/client.ts` — browser client (uses anon key)
- `lib/supabase/server.ts` — server client (uses service role key for API routes)
- `lib/supabase/middleware.ts` — auth session refresh
- `src/middleware.ts` — Next.js middleware guards authenticated routes

## Claude API Integration

Essay evaluation prompt expects: CEFR level, question text, correct answer example, student answer. Scoring weights: grammar 40%, vocabulary 30%, task completion 30%. Always responds in English. See `prd.md §5.5` for the full prompt template.

Use `claude-sonnet-4-6` or newer for cost/quality balance. Implement prompt caching on the system prompt portion to reduce API costs across multiple evaluations in a session.

## Question Bank

900 questions: 6 levels × 3 difficulties × 50 questions (40 MC + 10 essay each). Minimum seed for development: 180 questions (10 per level/difficulty combination). See `prd.md §3` for topic distribution by CEFR level and exact JSON schema for each question type.
