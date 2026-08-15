# Decisões

> Registre decisões que alguém poderia questionar no futuro. O objetivo é preservar o contexto, não escrever atas longas.

## 2026-08-14 — Skill de documentação disponível também no Claude Code

**Decisão:** copiar a skill `organizar-documentacao-projeto` (criada originalmente no Codex, em `~/.codex/skills/`) para `.claude/skills/organizar-documentacao-projeto/SKILL.md`, versionada no repositório.

**Motivo:** a skill só ficava visível para o Codex; o Claude Code não lê `~/.codex/skills/`. Copiar para dentro do projeto torna o fluxo de atualização de documentação (backlog, decisões, diário) utilizável pelas duas ferramentas, e compartilhável com quem clonar o repositório.

**Consequência:** a skill só aparece na lista de skills do Claude Code a partir da próxima sessão (o registro é carregado no início da sessão). Mudanças futuras na skill devem ser replicadas nos dois lugares manualmente, a menos que se decida symlink ou fonte única.

---

## 2026-08-14 — Documentação no próprio repositório

**Decisão:** manter as notas do Obsidian na pasta `docs/` do repositório.

**Motivo:** documentação e código evoluem juntos; os arquivos são Markdown portáveis e podem ser versionados com Git.

**Consequência:** o layout pessoal do aplicativo é ignorado no Git, mas as notas ficam compartilháveis.

---

## 2026-08-14 — Quizzes com questões emitidas por sessão

**Decisão:** registrar as questões entregues em `quiz_session_questions` e validar cada resposta contra esse registro.

**Motivo:** impedir que o cliente envie uma questão que não pertence ao bloco ou à sessão atual; também preserva o conjunto de questões mesmo se o banco mudar depois do início.

**Consequência:** o fluxo aceita sessões antigas sem esse registro como compatibilidade, enquanto as novas sessões passam pela validação de emissão.

---

## 2026-08-14 — Recursos de IA e estudo como benefício VIP

**Decisão:** restringir avaliação de respostas discursivas, explicações de erros e módulo de estudo a perfis `is_vip`.

**Motivo:** diferenciar o plano VIP e controlar o uso das chamadas de IA.

**Consequência:** usuários gratuitos fazem quizzes apenas de múltipla escolha; o servidor aplica a regra, não apenas a interface.

---

## 2026-08-14 — IA com resposta estruturada e degradação segura

**Decisão:** usar `gpt-4.1-nano` para avaliações e lições, exigir JSON e aplicar limites de tempo.

**Motivo:** a interface precisa de pontuação e textos separados para apresentar feedback consistente a estudantes brasileiros.

**Consequência:** falhas ou timeout não interrompem o quiz: a resposta pode ficar pendente de avaliação. A avaliação inclui correção e explicações em inglês e português.

---

Use [[Templates/Registro de decisao|este template]] para novas entradas.
