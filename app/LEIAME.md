# Motor da Trilha ENEM (`app/`)

Um HTML só (esbuild, iife). O motor **não sabe de matéria**: recebe `CONTEUDO` (matérias → unidades → lições, contrato em `PLANO.md`) e desenha tudo a partir dele. Progresso só em `localStorage` (`trilha-enem.v1`, sempre em try/catch).

## Arquitetura
| Arquivo | Papel |
|---|---|
| `main.js` | entrada do bundle: `import { CONTEUDO } from "@conteudo"` (alias do esbuild, definido por `build.mjs`) e `iniciar(CONTEUDO)` |
| `app.js` | cabeçalho (ofensiva, XP, anel da meta), abas por `#hash`, gancho de teste |
| `estado.js` | estado `S`, `hoje()` (trocável), ofensiva, XP, revisão espaçada (caixas 0→1→3→7→16 dias), exportar/importar `TE1:` |
| `conteudo.js` | índice do `CONTEUDO` (ids → exercício/lição/unidade), travas de sequência, cor de cada unidade |
| `cores.js` | cor da unidade derivada da cor da matéria, escurecida até o texto branco ter contraste ≥ 4,6 |
| `ui/trilha.js` `revisao.js` `mapa.js` `perfil.js` | as quatro abas |
| `ui/sessao.js` | tela cheia: cartões → exercícios → resultado (lição, Desafio e revisão); vidas, XP, combo, dica |
| `ui/comum.js` | modal, confirmação, toast, som (WebAudio), chips de matéria, anel |
| `exercicios/` | registro de tipos (abaixo) |
| `estilo.css`, `shell.html` | visual e casca HTML (o build junta tudo) |
| `figuras/index.js` | registro `FIGURAS[kind](fig, { mode, size, hint })` (não é do motor) |
| `_teste/conteudo-exemplo.mjs` | conteúdo de teste (fora de `conteudo/`), usado por `node build.mjs --exemplo` |

Regras de jogo: 5 vidas por lição; errar tira 1 e a questão volta no fim da fila (uma vez) e entra na revisão. XP: 10 por acerto de primeira, 5 depois de errar, metade se usou a dica; combo a partir de 3 acertos seguidos soma +2 por acerto extra (máx. +10); +10 por lição sem erros. Desafio: 10 XP por acerto, sem vidas, sem explicação durante, nota ilustrativa x/10 (melhor guardada; não é TRI). Revisão: 5 XP por acerto, sem vidas, até 10 questões vencidas por sessão. Lições destravam em sequência dentro da matéria; o Desafio abre quando todas as lições da unidade estão feitas.

## Registro de exercícios (`app/exercicios/`)
Um arquivo por tipo (`mc`, `mc-figura`, `enem`, `tf`, `match`, `order`, `fill`) e o `index.js` que os junta. Cada tipo exporta um objeto:

```js
{
  rotulo,                        // texto curto
  render(ex, ctx) → html,        // ctx = { est, pronto(bool), modo }; `est` é o estado deste exercício (guarde nele o que quiser: ordem embaralhada, escolha…)
  ligar(el, ex, ctx),            // liga eventos em `el` (um <div> novo por exercício); chame ctx.pronto(true|false) para habilitar/desabilitar CONFERIR
  conferir(ex, est) → boolean,
  revelar(el, ex, est, ok),      // pinta certa/errada e redesenha as figuras com mode "reveal"
  travar?(el, est),              // só bloqueia (Desafio, que não revela)
  certaTexto(ex) → string,       // aparece no rodapé de erro e na revisão do Desafio
  escolhaTexto?(ex, est),        // texto do que o aluno marcou
  auto?(el, ex, est, certo),     // responde por cliques de verdade; só o gancho de teste usa
}
```
Ajudantes em `_comum.js`: `topo` (rótulo, texto-base, enunciado, figuras), `figuras`/`redesenhar`/`svgFig` (sempre via `FIGURAS`), `altsHtml`/`ligarAlts`/`revelarAlts` (alternativas de texto).

**Tipo novo** = `app/exercicios/<tipo>.js` + uma linha em `exercicios/index.js` (+ o tipo em `checks/schema.mjs`, que é da sessão principal). O motor não tem `switch` por tipo.

## Build
- `node build.mjs` → manifesto + `dist/trilha-enem.html` (legível, com gancho) e `dist/index.html` (minificado, **sem** gancho; o build falha se `__trilha` aparecer nele).
- `node build.mjs --exemplo` → usa `app/_teste/conteudo-exemplo.mjs`; o público de teste sai como `dist/exemplo-index.html` (nunca vira `dist/index.html`).

## Gancho de teste (só em `dist/trilha-enem.html`)
`window.__trilha`:
- `estado` (o objeto de progresso, ao vivo), `conteudo`, `hoje(AAAA-MM-DD)` (força a data e redesenha; sem argumento volta à data real), `dia()` (data atual do app)
- `abrirLicao(id)`, `abrirDesafio(unidadeId)`, `abrirRevisao()`, `ir("trilha"|"revisao"|"mapa"|"perfil")`, `atualizar()`
- `fase()` (`"cartoes" | "ex" | "fim" | null`), `vidas()`, `exercicioAtual()`, `pularCartoes()`
- `responderCerto()` / `responderErrado()` (clicam de verdade nos elementos e conferem) e `continuar()` (equivale a CONTINUAR / fim)

Exemplo: fazer uma lição inteira
```js
const t = __trilha; t.abrirLicao("qui-u1-l1"); t.pularCartoes();
while (t.fase() === "ex") { t.responderCerto(); t.continuar(); }
```
