# BRAINSTORM: Inglês para Leigos - Plataforma de Quiz

> Exploratory session to clarify intent and approach before requirements capture

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | ENGLISH_QUIZ |
| **Date** | 2026-04-19 |
| **Author** | brainstorm-agent |
| **Status** | Ready for Define |

---

## Initial Idea

**Raw Input:** Plataforma web de quiz para aprendizado de inglês com autenticação, seleção de nível CEFR (A1-C2), quiz de 30 questões por nível (divididas em 3 blocos de dificuldade), questões de múltipla escolha e dissertativas com avaliação por IA, e tracking de progresso do aluno.

**Context Gathered:**
- Projeto greenfield — diretório vazio
- Supabase como backend (PostgreSQL + Auth)
- Foco em plataforma aberta para qualquer público

**Technical Context Observed (for Define):**

| Aspect | Observation | Implication |
|--------|-------------|-------------|
| Likely Location | Next.js App Router structure | Frontend + API routes no mesmo projeto |
| Relevant KB Domains | CEFR, English teaching, Quiz systems | Banco de questões precisa seguir padrões CEFR |
| IaC Patterns | Vercel + Supabase Cloud | Deploy serverless, sem infra manual |

---

## Discovery Questions & Answers

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | Público-alvo principal? | Todos — plataforma aberta (autodidatas, alunos, profissionais) | Foco 100% no aluno, sem painel de professor |
| 2 | Avaliação das dissertativas? | IA (LLM) com feedback em tempo real | Integração com Claude API, custo operacional |
| 3 | Banco de questões? | Híbrido — fixo validado agora, IA dinâmica no futuro | MVP com banco fixo de 900 questões |
| 4 | Gamificação? | Básico — pontuação + histórico | MVP enxuto sem badges/streak/ranking |
| 5 | Responsividade? | Ambos igualmente — responsivo desde o início | Tailwind CSS com mobile + desktop |
| 6 | Framework frontend? | Recomendação aceita: Next.js | SDK Supabase oficial, App Router, Vercel |
| 7 | Temas por nível? | Mix natural com cobertura garantida | Questões variadas, banco cobre todos os tópicos |
| 8 | Feedback ao errar? | Resposta correta + explicação + dica de estudo | Cada questão precisa de explanation + study_tip |
| 9 | Fluxo do quiz? | Por blocos (fácil→médio→difícil), linear dentro do bloco | 3 blocos de 10, resultado entre blocos |
| 10 | Limite de tempo? | Sim — por questão | Timer client-side com validação server-side |
| 11 | Amostras/referências? | Referências públicas (Cambridge, British Council) | Base CEFR oficial para criar questões |
| 12 | Volume do banco? | 50 questões por nível/dificuldade (900 total) | Aluno pode refazer 5x sem repetição |

---

## Sample Data Inventory

| Type | Location | Count | Notes |
|------|----------|-------|-------|
| Input files | N/A | 0 | Projeto greenfield |
| Output examples | N/A | 0 | - |
| Ground truth | Referências CEFR públicas | - | Cambridge, British Council |
| Related code | N/A | 0 | Nenhum código existente |

**How samples will be used:**
- Referências CEFR para validar distribuição de temas por nível
- Exemplos de questões de Cambridge/British Council como modelo para o banco

---

## Selected Approach: Next.js + Supabase + Claude API

### Arquitetura

```
Frontend (Next.js + Tailwind + shadcn/ui)
    │
    ├── Login/Cadastro → Supabase Auth (email + Google OAuth)
    ├── Seleção de Nível → A1 a C2
    ├── Quiz por Blocos → Fácil(10) → Médio(10) → Difícil(10)
    ├── Resultado → Nota + feedback por questão
    └── Dashboard → Histórico + progresso
    │
    ▼
Supabase (PostgreSQL + Auth + RLS)
    │
    ▼
Claude API (avaliação dissertativa + feedback)
```

**Why Selected:** Stack moderna, SDK oficial integrado, deploy gratuito (Vercel + Supabase free tier), comunidade ampla.

---

## Key Decisions Made

| # | Decision | Rationale | Alternative Rejected |
|---|----------|-----------|----------------------|
| 1 | Next.js como framework | SDK Supabase oficial, App Router, deploy Vercel | React puro (sem SSR), Vue/Nuxt (menos ecossistema) |
| 2 | Banco fixo de questões no MVP | Controle de qualidade, sem custo de IA por quiz | Geração dinâmica (custo alto, qualidade variável) |
| 3 | Claude API para dissertativas | Feedback educativo de alta qualidade | Matching de strings (baixa qualidade), auto-avaliação (sem valor) |
| 4 | 50 questões por nível/dificuldade | Permite 5+ repetições sem duplicação | 20 questões (repetição rápida) |
| 5 | Blocos com resultado intermediário | Progressão natural de dificuldade | Quiz contínuo (sem pausas), todas visíveis (estilo prova) |
| 6 | Timer por questão | Pressão saudável, simula proficiência real | Sem timer (sem pressão), timer por bloco (menos controle) |
| 7 | shadcn/ui para componentes | Acessível, customizável, Tailwind nativo | Material UI (pesado), Chakra (menos flexível) |

---

## Features Removed (YAGNI)

| Feature Suggested | Reason Removed | Can Add Later? |
|-------------------|----------------|----------------|
| Ranking entre usuários | Complexidade de privacidade, não essencial | Yes |
| Painel do professor | Público é autodidata | Yes |
| Certificado de conclusão | Requer validação formal | Yes |
| Geração dinâmica por IA | Custo + controle de qualidade | Yes |
| Notificações push | Engajamento é fase 2 | Yes |
| Badges/Streak | Pontuação básica suficiente para MVP | Yes |
| Chat com IA para dúvidas | Escopo separado, custo alto | Yes |
| Modo offline/PWA | Complexidade desnecessária | Yes |

---

## Incremental Validations

| Section | Presented | User Feedback | Adjusted? |
|---------|-----------|---------------|-----------|
| Arquitetura do sistema | Yes | Aprovada | No |
| Modelo de dados | Yes | Pediu mais questões (50 por nível/dif) | Yes |
| YAGNI features | Yes | Concordou com exclusões | No |

---

## Suggested Requirements for /define

### Problem Statement (Draft)
Pessoas que querem aprender inglês precisam de uma forma prática e interativa de testar e desenvolver seus conhecimentos, com feedback educativo que transforme a avaliação em aprendizado.

### Target Users (Draft)
| User | Pain Point |
|------|------------|
| Estudante autodidata | Não sabe seu nível real e não tem feedback estruturado |
| Aluno de curso | Quer praticar fora da aula com questões do seu nível |
| Profissional | Precisa validar e melhorar seu inglês para o mercado |

### Success Criteria (Draft)
- [ ] Usuário consegue se cadastrar e fazer login
- [ ] Usuário seleciona nível e completa quiz de 30 questões em 3 blocos
- [ ] Questões dissertativas são avaliadas por IA com feedback educativo
- [ ] Progresso é salvo e visível no dashboard
- [ ] Banco de 900 questões cobrindo todos os níveis CEFR
- [ ] Quiz não repete questões já respondidas pelo aluno

### Constraints Identified
- Custo de API do Claude para avaliação dissertativa (6 chamadas por quiz)
- 900 questões precisam ser criadas/validadas para o MVP
- Timer por questão precisa de validação server-side para evitar trapaça

### Out of Scope (Confirmed)
- Ranking entre usuários
- Painel do professor
- Certificados
- Geração dinâmica de questões
- Notificações push
- Badges/Streak
- Chat com IA
- PWA/Offline

---

## Session Summary

| Metric | Value |
|--------|-------|
| Questions Asked | 12 |
| Approaches Explored | 2 (Next.js recomendado vs alternativas) |
| Features Removed (YAGNI) | 8 |
| Validations Completed | 3 |
| Duration | ~15 min |

---

## Next Step

**Ready for:** `/define .claude/sdd/features/BRAINSTORM_ENGLISH_QUIZ.md`
