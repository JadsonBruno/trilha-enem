# Show da Química → Show de Ciências: plano e contrato entre agentes

Dono: sessão principal (orquestra, revisa, testa e publica). Agentes escrevem código e conteúdo em arquivos separados.

## Decisões do usuário (fechadas)
- Matérias: Química (já existe, 251 perguntas) + Biologia (nova, **80 perguntas**). Outras no futuro, pelo mesmo contrato.
- Biologia: só o que der para fazer com qualidade, priorizando os temas que **mais caem no ENEM** (pesquisa em `pesquisa-biologia-enem.md`).
- Conceituais (sem modelo para calcular): escritos à mão, **cada um com fonte citada** (campo `ref`).
- Menu: **Só Química / Só Biologia / Mesclado estilo ENEM**. Mesclado = opção A: 16 perguntas, metade de cada matéria ativa (8 + 8), sempre da fácil para a difícil.
- **Uma escada só** (350 → 900, degraus seguros 5 e 10), nota ilustrativa (não é TRI). Melhor nota guardada **por modo**.
- Revisão de erros: **lista única com filtro** (Todas / Química / Biologia).
- Cores: Química azul-petróleo `#2a7f8f`, Biologia verde-folha `#4c9a3c` (capa, etiqueta da pergunta, botão do modo).
- Continua **um arquivo só**, sem internet, publicado minificado no GitHub Pages.
- O banco de Química, os ids das perguntas, a melhor nota e os erros já salvos **não mudam** (migrar `best` numérico → `best.quimica`).

## Arquivos
| Arquivo | Dono | O que é |
|---|---|---|
| `show.js`, `show-style.mjs`, `build-show.mjs` | agente do motor | motor do jogo, sem saber de matéria |
| `quimica.mjs` (novo) | agente do motor | `SUBJECT` de Química: embrulha `questions.mjs` sem alterá-lo |
| `subjects.mjs` (novo) | agente do motor | lista das matérias: `export const SUBJECTS = [QUIMICA, BIOLOGIA]` |
| `biologia.mjs` | agente do motor cria um esboço; depois a sessão principal junta os lotes | `SUBJECT` de Biologia |
| `bio-base.mjs` | sessão principal | cores e ajudantes de SVG comuns a todos os desenhos de biologia (só ler) |
| `bio-genetica.mjs` + `check-bio-genetica.mjs` | agente de genética | 18 perguntas + seus renderizadores |
| `bio-ecologia.mjs` + `check-bio-ecologia.mjs` | agente de ecologia | 20 perguntas + seus renderizadores |
| `bio-corpo.mjs` + `check-bio-corpo.mjs` | agente de corpo humano | 17 perguntas (fisiologia 9, doenças/imunologia 8) |
| `bio-celula.mjs` + `check-bio-celula.mjs` | agente de célula/evolução | 25 perguntas (citologia 9, evolução 6, biotecnologia 5, botânica 3, zoologia 2) |
| `check-show.mjs` | não mexer | conferência da química (tem de continuar passando) |
| `check-bio.mjs` | sessão principal | regras gerais para todas as perguntas de biologia |

Cada `bio-<tema>.mjs` exporta `export const QUESTIONS = [...]`, `export const FIGS = { kind: render }` (kinds com prefixo do tema, ex.: `gen-punnett`, `eco-teia`, para não colidir) e `export const PATTERNS_USED = [...]` com os números de padrão que usa. Padrões de Biologia (fixos): 1 Ecologia, 2 Genética, 3 Corpo humano, 4 Célula e metabolismo, 5 Doenças e vacinas, 6 Evolução, 7 Biotecnologia, 8 Plantas e animais.
| `questions.mjs`, `chem.mjs`, `model.mjs`, `molecules.mjs`, `trilha*.{js,mjs}` | **ninguém altera** | |

## Linguagens (2ª expansão, pedido em PROMPT-LINGUAGENS.md)
- Temas: figuras de linguagem (~30), gêneros textuais (~30), funções da linguagem (~20); 80 perguntas, níveis 25/32/23. Pesquisa em `pesquisa-linguagens-enem.md`.
- Pedido dela: **direto, sem textão**, para memorizar o que é cada coisa. Maioria "conceito → definição" (alternativas erradas = definições dos irmãos que mais confundem), depois "definição → conceito", "gênero → função/estrutura" e poucas "exemplo de 1 linha → qual é".
- **Sem modelo para calcular**: cada tema tem uma TABELA DE FATOS (`FATOS`: id, nome, def, marca, exemplo, ref, confunde[]) e as perguntas são GERADAS dela por código; a certa sai da tabela. O check garante que nenhuma definição/marca serve para dois itens. Toda pergunta com `ref` aberta de verdade.
- Matéria: `linguagens.mjs` (SUBJECT id "linguagens", nome "Linguagens", cor roxo `#7d4fb3`, `area: "linguagens"`). Química e Biologia ganham `area: "natureza"`. **Mesclado = só as matérias da área natureza** (8 + 8, como hoje). Linguagens tem só o botão "Só Linguagens". Título do app vira **"Show do ENEM"**.
- Padrões de Linguagens: 1 Figuras de linguagem, 2 Funções da linguagem, 3 Gêneros textuais.
- Arquivos: `lin-base.mjs` (agente da base: renderizadores comuns `lin-cartao` e `lin-frase` + ajudantes de geração), `lin-figuras.mjs`, `lin-funcoes.mjs`, `lin-generos.mjs` (um agente cada; gêneros tem seus próprios renderizadores `lin-gen-*` para o recorte de cada gênero), cada um com `check-lin-<tema>.mjs`; `check-lin.mjs` geral.
- Formas das figuras comuns (contrato fixo, para os agentes trabalharem em paralelo):
  - `{ kind: "lin-cartao", titulo: "Metalinguagem", sub?: "função da linguagem", icone?: "balao"|"lupa"|"livro"|"megafone"|"coracao"|"telefone"|"pena"|"jornal" }` — cartão do conceito (título grande).
  - `{ kind: "lin-frase", texto: "frase de até ~100 caracteres", fonte?: "autor/obra curta", destaque?: ["palavra", …] }` — frase em destaque; `opts.hint`/`hint.mark = ["palavra"]` circula a palavra-chave; no reveal pinta `destaque`.
  - Nas alternativas, `lin-cartao` pequeno (só o título) é permitido; texto da alternativa ≤ 46 caracteres (definições curtas!).

## Linguagens no formato do ENEM (3ª expansão)
- Pedido: ~30% do banco de Linguagens no formato em que o ENEM cobra. As 80 de memorização ficam como base (degraus fáceis). Novas: **35 perguntas "estilo ENEM"** → total 115, 35/115 ≈ 30%. Todas de nível 2 ou 3 (figuras 13: 7 médias/6 difíceis; funções 10: 5/5; gêneros 12: 6/6).
- Formato ENEM: **texto-base curto e autêntico** + pergunta sobre **efeito de sentido / intenção / recurso que produz tal efeito / função predominante e por quê / característica do gênero no texto**; alternativas são **frases interpretativas** (≤ 100 caracteres), não rótulos de uma palavra; erradas = leituras plausíveis mas erradas (efeito trocado, recurso que não está no texto, extrapolação, generalização).
- Texto-base: de **domínio público** (autor brasileiro/português morto antes de 1956: Machado de Assis, Olavo Bilac, Gonçalves Dias, Castro Alves, Álvares de Azevedo, Cruz e Sousa, Augusto dos Anjos, Lima Barreto, João do Rio, Raul Pompeia, Aluísio Azevedo, Euclides da Cunha, Monteiro Lobato, Mário de Andrade, Fernando Pessoa, Gregório de Matos, Camões, Pero Vaz de Caminha, jornais e anúncios do séc. XIX), com trecho fiel e fonte (obra, ano). Gêneros modernos sem texto livre (anúncio, campanha, notícia atual) podem usar texto **elaborado para o jogo**, dito claramente em `base.fonte` ("Texto elaborado para o jogo, no formato de anúncio"). **Nunca letra de música**, nem tradução moderna, nem texto protegido.
- Campos novos da pergunta: `enem: true`; `base: { texto: "≤ 450 caracteres, quebras de verso com \n", fonte: "Autor, Obra (ano)" | "Texto elaborado…", titulo?: "…" }`. O motor mostra `base` como um cartão de texto (HTML, legível e selecionável, papel de prova) acima da figura; `fig` é opcional quando há `base` (o cartão conta como visual). Etiqueta "estilo ENEM" ao lado do padrão.
- Sem modelo: cada pergunta traz `analise: ["por que A está certa/errada", …]` (uma linha por alternativa), que o revisor confere. `why` ≤ 150; `ref` = fonte do conceito (aberta) e, quando houver, link do texto-base (Domínio Público/MEC, Wikisource, Biblioteca Brasiliana).
- Arquivos (um agente cada, sem tocar nos outros): `lin-enem-figuras.mjs`, `lin-enem-funcoes.mjs`, `lin-enem-generos.mjs` + `check-lin-enem-<tema>.mjs`. Ids `lin-enem-fig-…`, `lin-enem-fun-…`, `lin-enem-gen-…`; `pat` igual ao do tema (1, 2, 3). O agregador `linguagens.mjs` passa a importar os três.

## Contrato: matéria
```js
export const SUBJECT = {
  id: "biologia",              // "quimica" | "biologia" | ...
  nome: "Biologia",
  cor: "#4c9a3c",
  PATTERNS: { 1: "Ecologia", 2: "Genética", ... },   // rótulo curto mostrado acima do enunciado
  BANK: [ /* perguntas */ ],
  FIGS: { punnett: (fig, opts) => svg, ... },        // renderizadores por kind (Química: "mol")
  uni: (q, ctx) => html | null,                      // opcional; sem ele o motor usa a "votação dos universitários"
};
```

## Contrato: pergunta
```js
{
  id: "bio-gen-cruz-aa-aa",        // único no app inteiro; Biologia começa com "bio-"
  subj: "biologia",
  pat: 2, lvl: 1,                   // lvl 1 fácil, 2 média, 3 difícil
  text: "…",                        // ≤ 120 caracteres, 1–2 linhas no celular
  fig: [ { kind: "punnett", …dados, cap: "legenda curta" } ],   // 0 a 2 figuras
  alts: [ { t: "texto" } | { fig: { kind, …dados }, cap? } ],   // exatamente 4, todas diferentes
  correct: [i],                     // exatamente 1 índice; CALCULADO pelo modelo sempre que houver modelo
  hint: { t: "aponta onde olhar, sem dar a resposta", fig: 0, mark: … },  // mark é livre, entendido pelo renderizador
  why: "1 linha de explicação (≤ 150)",
  src: "como no ENEM 2019 (…)" | "no estilo do ENEM",   // nunca inventar ano/número
  ref: "fonte do fato (livro/site)",  // obrigatório nas conceituais
}
```
Regras:
- **Toda pergunta tem figura**: na pergunta (`fig`) ou nas alternativas (`alts[].fig`). O objetivo é treinar leitura visual.
- Alternativas erradas plausíveis (as pegadinhas clássicas do tema), nunca absurdas.
- Enunciados originais, no estilo do ENEM; não copiar provas.
- Química continua usando `{ k, mark, cap }` (molécula): o motor trata como `kind: "mol"`.

## Contrato: renderizador de figura
`FIGS[kind](fig, opts)` devolve uma string `<svg viewBox="0 0 W H" …>` sem width/height fixos.
- `opts.mode`: `"ask"` (pergunta), `"uni"` (ajuda dos universitários), `"reveal"` (depois de responder: pode pintar a resposta).
- `opts.size`: `"main"` (figura da pergunta, até ~360×210 px) ou `"alt"` (alternativa em grade 2×2, ~165×120 px).
- `opts.hint`: o `hint.mark` da pergunta quando a dica do professor está ativa (anel tracejado laranja `#e08a2f`, classe `hintring`).
- Estilo da trilha: traço azul-marinho `#1c2541`, 2–2.4 px, cantos arredondados, fundo transparente (o cartão já é creme), texto `Trebuchet MS` ≥ 12 px na escala final, cores suaves com contorno.
- Legível a 390 px: nada de texto menor que 11 px renderizado, nada cortado na borda.
- **Regra de tamanho (corrigida):** o que importa é o tamanho REAL na tela. A figura "main" ocupa ~340 px de largura e a "alt" ~150 px. Fonte real = `font-size × (340 ou 150) ÷ largura do viewBox` e tem de dar **≥ 11,5 px**. Ex.: viewBox main de 360 → fonte ≥ 12,5; de 520 → fonte ≥ 18. Alternativa de 300 → fonte ≥ 23 (prefira viewBox alt estreito, ~160–200, e pouco texto).
- A dica do professor aponta ONDE olhar, nunca marca a própria resposta.

## Testes que a sessão principal roda no fim
- `node check-show.mjs` (química) e `node check-bio.mjs` (biologia: 1 certa, 4 diferentes, figura, ids únicos, tamanhos de texto, modelos conferidos).
- `node build-show.mjs` gera `show-do-milhao-quimica.html` (legível, com gancho de teste) e `show-do-milhao-quimica-min.html` (público, sem gancho).
- Cliques no navegador a 390 px: os 3 modos, ganhar, cair no seguro, parar, ajudas, revisão com filtro, migração dos dados antigos; varredura de todas as perguntas (sem rolagem lateral, texto estourando, rótulo cortado ou figura miúda).
