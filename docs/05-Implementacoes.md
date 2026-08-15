# Implementações atuais

> Inventário do que está presente no código e nas migrações na revisão atual do repositório. Para requisitos planejados, consulte o [[../prd|PRD]].

## Plataforma e acesso

- Aplicação em Next.js 14 (App Router), React, TypeScript, Tailwind CSS e componentes shadcn/ui.
- Autenticação com Supabase: cadastro e login por e-mail/senha, confirmação de e-mail, recuperação e alteração de senha, além de Google OAuth.
- Rotas autenticadas para dashboard, quiz, conta e estudo; middleware também restringe `/admin` a perfis administradores.
- Tema claro/escuro, cabeçalho com avatar/nome e indicação de plano VIP.

## Quiz por nível

- Seleção de nível CEFR de A1 a C2 e quiz dividido em três blocos de dificuldade.
- Questões de múltipla escolha são embaralhadas; as alternativas também são embaralhadas antes de chegar ao aluno.
- O seletor evita questões já respondidas pelo mesmo usuário no mesmo nível e dificuldade. Quando necessário, permite repetição das mais antigas.
- O conjunto de questões é emitido e registrado por sessão em `quiz_session_questions`; o servidor aceita respostas apenas de questões emitidas para o bloco atual.
- A sessão pode ser finalizada em qualquer bloco; o resultado mostra detalhes por questão e mantém o histórico no dashboard.
- Pontuação e estado da sessão são persistidos em Supabase. Respostas corretas não são enviadas ao cliente antes da tentativa.

## Dashboard e acompanhamento

- Histórico de quizzes, cartões de estatísticas, gráfico de evolução e filtro por nível.
- Melhor pontuação e estatísticas agregadas por nível.
- Relatório de tópicos fracos para usuários VIP, usando o desempenho registrado nas respostas.

## Recursos VIP

- Comparação de plano gratuito e VIP na página inicial, com página de solicitação de upgrade.
- Solicitações pendentes são registradas em `vip_requests`; a área administrativa lista usuários e permite conceder ou remover o status VIP.
- O plano VIP libera questões discursivas, avaliação por IA, explicação de erros de múltipla escolha e módulo de estudo.
- Há limites de uso para explicações de erro por sessão.

## IA aplicada ao aprendizado

- Avaliação de respostas discursivas por `gpt-4.1-nano`, com nota de 0 a 100 baseada em gramática, vocabulário e conclusão da tarefa.
- Feedback discursivo inclui frase corrigida e explicações curtas em inglês e português. A chamada tem timeout; em falha, a resposta permanece sem bloquear o quiz.
- Explicação de erros em múltipla escolha para VIP.
- Geração sob demanda de lições bilíngues, em Markdown, para tópicos de gramática e expressões.

## Módulo de estudo VIP

- Hub de estudos com 36 tópicos de gramática e expressões distribuídos pelos níveis CEFR.
- Página de lição, marcação de conteúdo estudado e exercícios práticos vinculados aos tópicos.
- Progresso por usuário: data de estudo, quantidade de exercícios, acertos, melhor resultado e última prática.

## Dados e segurança

- Banco com perfis, perguntas, sessões, respostas, solicitações VIP, tópicos de estudo, progresso e questões emitidas por sessão.
- O seed completo contém 720 questões; há scripts auxiliares para geração do banco de questões.
- RLS protege perfis, sessões, respostas, solicitações VIP e progresso de estudo. A conta de serviço é usada somente nas rotas de servidor que exigem administração.
- As migrações `001` a `008` definem a base do produto, incluindo suporte a VIP, administração, estudos, limite de explicações e emissão de questões.

## Rotas relevantes

| Área | Rotas |
| --- | --- |
| Público | `/`, `/login`, `/recuperar-senha`, `/upgrade` |
| Usuário autenticado | `/dashboard`, `/conta`, `/quiz/select`, `/quiz/[sessionId]`, `/quiz/[sessionId]/result` |
| Estudo VIP | `/estudar`, `/estudar/[slug]`, `/estudar/[slug]/exercicios` |
| Administração | `/admin` |

## Pontos para retomar

- Consulte [[01-Backlog|Backlog]] para transformar os próximos objetivos em tarefas.
- Consulte [[02-Decisoes|Decisões]] antes de alterar regras de acesso, IA ou segurança do quiz.
