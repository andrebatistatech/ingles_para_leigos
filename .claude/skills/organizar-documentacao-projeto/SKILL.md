---
name: organizar-documentacao-projeto
description: Crie e mantenha uma documentação leve de projeto em Markdown, compatível com Obsidian. Use ao preparar um repositório para notas de projeto, criar ou atualizar backlog, diário, decisões, referências e notas de tarefa, ou registrar contexto de desenvolvimento para retomar o trabalho depois.
---

# Organizar documentação de projeto

Organize a memória do projeto em arquivos Markdown versionáveis, sem duplicar documentação ou código já existentes.

## Fluxo

1. Inspecione o repositório, a documentação existente e as instruções locais antes de editar.
2. Determine se `docs/` já é um cofre do Obsidian pela presença de `docs/.obsidian/`. Caso não exista documentação, use `docs/` como local padrão; não crie um segundo cofre sem necessidade.
3. Preserve notas e configurações existentes. Crie somente arquivos ausentes e peça orientação se a mudança estrutural for ambígua.
4. Extraia uma descrição curta do objetivo e da stack a partir de arquivos existentes, como `README.md`, PRD e manifestos. Não invente fatos.
5. Crie ou mantenha as notas abaixo. Use títulos e conteúdo no idioma predominante do projeto:

   - `00-Visao-geral.md`: objetivo, links de navegação e fontes do repositório.
   - `01-Backlog.md`: itens em Agora, Em breve, Ideias e Concluído, usando checkboxes Markdown.
   - `02-Decisoes.md`: decisões com data, contexto, escolha, motivo e consequências.
   - `03-Diario.md`: entradas curtas por data, com feito, observações e próximo passo.
   - `04-Referencias.md`: links e uma frase sobre a relevância de cada fonte.
   - `Templates/Nota de tarefa.md` e `Templates/Registro de decisao.md`: modelos concisos reutilizáveis.

6. Conecte notas com links Obsidian no formato `[[Nome da nota]]`. Prefira links relativos Markdown para arquivos do repositório fora do cofre quando forem úteis.
7. Se o cofre estiver dentro do repositório, ignore somente os layouts pessoais do Obsidian no `.gitignore`:

   ```gitignore
   .obsidian/workspace.json
   .obsidian/workspace-mobile.json
   docs/.obsidian/workspace.json
   docs/.obsidian/workspace-mobile.json
   ```

   Não ignore todas as configurações sem motivo: configurações compartilháveis podem ser úteis para a equipe.
8. Verifique que não há erros de whitespace e informe quais notas foram criadas ou atualizadas.

## Atualizações pontuais

- Para uma nova tarefa, registre-a no backlog e crie uma nota detalhada somente se ela exigir contexto, critérios de conclusão ou acompanhamento.
- Para uma decisão, acrescente uma entrada datada; não reescreva decisões históricas.
- Para encerrar uma sessão, adicione uma entrada curta ao diário e atualize o próximo item do backlog quando necessário.
- Para retomar o projeto, leia a visão geral, as últimas entradas do diário, o backlog e as decisões mais recentes antes de sugerir trabalho.

## Limites

- Não altere código, dependências, banco de dados ou configurações de produção ao organizar documentação, salvo pedido explícito.
- Não sobrescreva notas do usuário nem remova arquivos.
- Mantenha as notas práticas: registre contexto e decisões; o PRD, README e o código continuam sendo as fontes detalhadas.
