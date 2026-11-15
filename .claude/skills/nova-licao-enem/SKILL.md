---
name: nova-licao-enem
description: Acrescenta matéria, unidade, lição ou exercícios à Trilha ENEM (app de lições estilo Duolingo para o ENEM, repo JadsonBruno/trilha-enem) seguindo o schema do conteúdo, as regras de qualidade (resposta calculada, fonte aberta, formato ENEM, sem textão) e os checks, e publica no GitHub Pages. Use sempre que o pedido for criar ou ampliar conteúdo da Trilha ENEM, mesmo que a pessoa só diga "faz uma lição de X", "acrescenta Física", "mais exercícios de genética" ou mande um áudio com o tema.
---

# Nova lição da Trilha ENEM

Projeto: `C:\Users\jadso\OneDrive\Documents\trilha-enem\` (node do Windows). Publicação: clone WSL `~/dev/trilha-enem` (o `gh` só existe no WSL, conta JadsonBruno) → https://jadsonbruno.github.io/trilha-enem/ .
Nunca mexa em `anatomy-quimica\`, no repo `show-quimica` nem em `fonte/` (cópia só leitura do Show do ENEM).

## Antes de escrever
1. Leia `CONTRIBUINDO.md` (schema e exemplo de lição completa), `PLANO.md` e `conteudo/indice.mjs`.
2. Veja o que já existe sobre o tema para não repetir exercício nem texto-base: `grep -rn "<tema>" conteudo/` e `node checks/check-tudo.mjs` (mostra os totais).
3. **Pesquisa:** como o ENEM cobra o tema (2009–hoje), com fonte e o que mais cai. Grave em `pesquisa/<materia>.md`. Nunca invente ano ou número de questão; sem fonte, use "no estilo do ENEM".
4. Decida o que é **calculável** (modelo ou tabela de fatos gera a resposta, em `conteudo/<materia>/_*.mjs` ou reaproveitado de `fonte/`) e o que é **conceitual** (`origem: "manual"`, com `ref` de fonte realmente aberta que você leu).

## Onde cada coisa mora
- Lição nova numa unidade existente: `conteudo/<materia>/NN-<unidade>/NN-<slug>.mjs` (`export default { id, titulo, temas, cartoes, exercicios }`). O número do arquivo define a ordem. Nada mais precisa mudar.
- Unidade nova: pasta `conteudo/<materia>/NN-<slug>/` com `unidade.mjs` (`id, titulo, descricao, temas, desafio` de 10) + lições.
- Matéria nova: `conteudo/<id>/materia.mjs` (`id, nome, cor, area, prefixo, descricao, temas`) + uma linha em `conteudo/indice.mjs` + `checks/check-<id>.mjs`.
- Figura nova: renderizador (`(fig, { mode, size, hint }) → "<svg viewBox>"`, sem width/height, traço `#1c2541`, fundo transparente) + uma linha em `app/figuras/index.js`.
- Tipo de exercício novo: `app/exercicios/<tipo>.js` + uma linha em `app/exercicios/index.js` + regra em `checks/schema.mjs` (ver `app/LEIAME.md`).
- Reaproveitar pergunta do Show: `doShow("<id>")` de `conteudo/_comum/show.mjs`.

## Forma de uma lição
- Cartões de ensino (1 a 4), frases curtas (≤ 240 caracteres): **conceito**, **analogia** do dia a dia, **exemplo** com figura, **enem** ("como cai no ENEM") ou **pegadinha**.
- 5–8 exercícios variados (`mc`, `mc-figura`, `tf`, `match`, `order`, `fill`, `enem`). A partir da 2ª lição da unidade, no máximo ~30% no formato `enem` (texto-base + alternativas de efeito de sentido).
- `mc`, `tf` e `enem` com figura ou texto-base. Explicação de 1 linha (≤ 150).
- Fim de unidade: `desafio` com exatamente 10 questões `mc`/`mc-figura`/`enem` no estilo do ENEM, que não aparecem em lição nenhuma.
- Ids estáveis (nunca índice ou `Math.random`), com o prefixo da matéria (`qui-`, `bio-`, `lin-`…): o progresso e a revisão espaçada dos alunos dependem deles. Não renomeie ids publicados.

## Regras de qualidade (não negociáveis)
- **Resposta certa calculada** (modelo da matéria ou tabela `FATOS`), nunca digitada. Erradas = pegadinhas plausíveis; nenhuma serve também como certa. O `checks/check-<materia>.mjs` recalcula.
- **Formato ENEM:** a certa não pode ser a alternativa mais longa em mais de 40% das questões `enem` da matéria; evite alternativa com menos de 60% do tamanho da maior.
- **Texto-base:** de domínio público (autor morto há mais de 70 anos), transcrição conferida na fonte, cortes marcados com `[...]`; ou "Texto elaborado para o jogo, no formato de …", com dados fictícios. **Nunca** letra de música, tradução moderna ou texto protegido.
- **Figuras:** texto real ≥ 11,5 px numa tela de 390 px (figura principal ~310 px, alternativa ~150 px); o registro sobe a letra mínima, mas confira se nada se sobrepõe. A dica aponta onde olhar, nunca marca a resposta.
- **Sem textão:** enunciado ≤ 120; alternativa ≤ 70 (≤ 100 no `enem`); match ≤ 40 por lado; order ≤ 50; fill ≤ 30; explicação ≤ 150.

## Fluxo com sub-agentes (você orquestra)
1. Pesquisa (1 agente) → você fecha a distribuição por unidade, nível e formato.
2. Um agente por unidade/matéria, cada um só nos próprios arquivos (`conteudo/<materia>/…` + `checks/check-<materia>.mjs`), rodando `node checks/check-tudo.mjs --so <materia>`.
3. Revisor independente (professor da matéria) só lê e escreve `revisao/revisao-<materia>.md` com ALTA/MÉDIA/BAIXA.
4. O autor corrige. Você roda os checks, testa no navegador e publica.

## Checks e testes
- `node checks/check-tudo.mjs` (ou `--so <materia>`): schema, 1 certa, alternativas distintas, ids únicos, limites de texto, tamanho real da letra, `ref`, regra da certa mais longa, % de `enem`, desafio, checks de cada matéria e os checks originais do Show em `fonte/`.
- `node build.mjs` → `dist/trilha-enem.html` (legível, gancho `window.__trilha`) e `dist/index.html` (minificado, sem gancho; o build falha se o gancho vazar).
- Navegador a 390 px (`dist/trilha-enem.html`):
  - varredura de todas as lições e desafios (sem rolagem lateral: `document.documentElement.scrollWidth <= 390`, nada cortado, figura legível);
  - uma lição inteira por cliques; perder as 5 vidas; resultado;
  - revisão espaçada e ofensiva simulando a data (`__trilha.hoje("AAAA-MM-DD")`);
  - exportar/importar progresso; tema escuro;
  - `dist/index.html` abre e não tem `__trilha`.

## Publicar
```bash
node checks/check-tudo.mjs && node build.mjs
```
Depois, no WSL: copiar o repositório (sem `dist/` legível, `node_modules`) para `~/dev/trilha-enem` e o `dist/index.html` para a raiz como `index.html`; commit (com a linha de coautoria pedida pelo ambiente), push, esperar o GitHub Pages (`gh api repos/JadsonBruno/trilha-enem/pages/builds/latest`) e conferir a URL no ar (abrir e ver a nova lição). O script `ferramentas/publicar.sh` faz a cópia, o commit e o push.
