# Contribuindo com conteúdo da Trilha ENEM

Matéria, unidade ou lição nova = **só arquivos novos em `conteudo/`**. O motor (`app/`) não muda. Para criar com um agente, use a skill `.claude/skills/nova-licao-enem/` (regras de qualidade, fluxo com revisor e publicação).

```bash
node checks/check-tudo.mjs --so quimica   # uma matéria
node checks/check-tudo.mjs                # tudo (obrigatório antes de publicar)
node build.mjs                            # dist/trilha-enem.html (teste) e dist/index.html (público)
```

## Onde fica cada coisa
```
conteudo/
  indice.mjs                      lista e ordem das matérias
  _comum/show.mjs                 doShow(id): reaproveita uma pergunta do Show do ENEM (resposta já calculada)
  <materia>/
    materia.mjs                   id, nome, cor, área, prefixo, temas (linhas do mapa)
    _*.mjs                        geradores e modelos da matéria (não viram lição)
    NN-<unidade>/
      unidade.mjs                 id, título, descrição, temas, desafio (10 questões)
      NN-<licao>.mjs              uma lição (export default)
checks/check-<materia>.mjs        recalcula as respostas da matéria
fonte/show-do-enem/               cópia só leitura do Show do ENEM (bancos, modelos, desenhos)
```
A ordem de unidades e lições é a do prefixo `NN-` do nome. Ids nunca mudam depois de publicados (o progresso e a revisão espaçada dos alunos dependem deles).

## Schema

### Matéria (`materia.mjs`)
| campo | regra |
|---|---|
| `id`, `nome` (≤ 20), `cor` (`#rrggbb`), `area` (≤ 40), `prefixo` (2–5 letras), `descricao` (≤ 120) | obrigatórios |
| `temas` | `[{ id, nome (≤ 40), freq: "alta"\|"media"\|"baixa", ref }]` — linhas do mapa Matérias × temas |

### Unidade (`unidade.mjs`)
`{ id: "<prefixo>-uN", titulo (≤ 40), descricao (≤ 110), temas: [ids de temas], desafio: [10 exercícios] }`
O desafio tem exatamente 10 questões `mc`, `mc-figura` ou `enem`, no estilo do ENEM, com ids que não aparecem em lição nenhuma. A nota é ilustrativa (não é TRI).

### Lição (`NN-slug.mjs`)
`{ id, titulo (≤ 40), temas, cartoes: [1–4], exercicios: [5–8] }`
- Cartão: `{ tipo: "conceito"|"analogia"|"exemplo"|"enem"|"pegadinha", titulo (≤ 40), texto (≤ 240, frases curtas), fig? }`
- A 1ª lição da unidade não tem `enem`; nas lições da unidade, `enem` ≤ 30%.
- Ordene os exercícios do fácil ao difícil (`nivel`).

### Exercício
Campos comuns: `id` (único, estável, com o prefixo da matéria), `tipo`, `nivel` (1–3), `enunciado` (≤ 120), `explicacao` (≤ 150), `origem` (`"show:<id>"` | `"gerado:<gerador>"` | `"manual"` + `ref` obrigatória), e opcionais `fig` (0–2 figuras `{ kind, … }`), `base` (`{ texto ≤ 450, fonte, titulo? }`), `dica` (`{ t, fig?, mark? }`), `ref`, `src` ("no estilo do ENEM" ou referência real — nunca ano inventado).

| tipo | campos | regras |
|---|---|---|
| `mc` | `alts: string[3–4]`, `certa` | alternativa ≤ 70; precisa de `fig` ou `base` |
| `mc-figura` | `alts: [{ fig, cap? }] ×4`, `certa`, `altCap?` | a legenda só aparece antes de responder com `altCap: true` |
| `enem` | `base`, `alts: string[4–5]`, `certa`, `analise: string[]` (1 por alternativa) | alternativa ≤ 100; a certa não pode ser a mais longa em > 40% das `enem` da matéria |
| `tf` | `certa: true\|false` (o enunciado é a afirmação) | precisa de `fig` ou `base` |
| `match` | `pares: [[esq, dir]] ×3–4` | ≤ 40 por lado, sem repetição |
| `order` | `itens: string[3–5]` na ordem certa | ≤ 50 |
| `fill` | `frase` com um `___`, `opcoes: string[3–4]`, `certa` | opção ≤ 30 |

Figuras: `kind` do registro `app/figuras/index.js` (`mol`, `eco-*`, `gen-*`, `corpo-*`, `cel-*`, `lin-cartao`, `lin-frase`, `lin-gen-recorte`). Letra real ≥ 11,5 px a 390 px (o check mede).

## Exemplo de lição completa
`conteudo/quimica/02-alcool-fenol-aldeido-cetona/01-alcool-ou-fenol.mjs` (real, publicada):
```js
import { show as doShow } from "../_geradores.mjs"; // doShow com ids normalizados
import * as G from "../_geradores.mjs";              // geradores: a certa sai do modelo (analyze)

const L = "qui-u2-l1";
export default {
  id: L, titulo: "Álcool ou fenol?", temas: ["alcool-fenol"],
  cartoes: [
    { tipo: "conceito", titulo: "OH no anel é fenol", texto: "Álcool: OH num carbono de cadeia ou de anel sem duplas alternadas. Fenol: OH preso direto no anel aromático. A diferença é onde o OH está.", fig: G.molFig("timol", "fenol") },
    { tipo: "pegadinha", titulo: "Hexágono nem sempre é benzeno", texto: "O mentol tem hexágono, mas sem duplas alternadas. Não é aromático, então o OH é de ÁLCOOL. Procure as duplas no anel.", fig: G.molFig("mentol", "alcool") },
    { tipo: "exemplo", titulo: "No dia a dia", texto: "Etanol (álcool) é combustível e está nas bebidas. O timol (fenol) está no tomilho e em antissépticos bucais. O fenol é um ácido fraco.", fig: G.molFig("etanol", "alcool") },
  ],
  exercicios: [
    doShow("marca-etanol-2"),                    // mc do Show, resposta calculada lá
    doShow("marca-hidroquinona-6"),
    doShow("qual-fenol-hidroquinona"),           // mc-figura
    G.tfFuncao(L, "fenol", "fenol"),             // V/F gerado: "Esta molécula tem a função fenol" (certa = analyze)
    G.tfFuncao(L, "mentol", "fenol", 2),
    G.tfFuncao(L, "cicloexanol", "alcool", 2),
    G.fillGrupoFunc(L, "fenol", ["alcool", "aldeido", "cetona"]), // completar, opções vindas de FUNCS
  ].sort((a, b) => a.nivel - b.nivel),           // do fácil ao difícil (estável)
};
```
Um exercício escrito à mão (só conceitual, com fonte aberta) fica assim:
```js
{ id: "bio-u3-l4:match-imunidade", tipo: "match", nivel: 1, origem: "manual",
  enunciado: "Ligue cada termo ao que ele é",
  pares: [["Antígeno", "Molécula que o corpo reconhece"], ["Anticorpo", "Proteína que se liga ao antígeno"], ["Vacina", "Ensina sem causar a doença"]],
  explicacao: "A vacina apresenta antígenos; o corpo produz anticorpos e células de memória.",
  ref: "OpenStax Biology 2e, cap. 42 (aberto): https://openstax.org/books/biology-2e/pages/42-introduction" }
```

## Matéria nova (ex.: Física)
1. `pesquisa/fisica.md` com o que mais cai e fontes.
2. `conteudo/fisica/materia.mjs` (`prefixo: "fis"`) e `"fisica"` em `conteudo/indice.mjs`.
3. Modelos/geradores em `conteudo/fisica/_*.mjs` (a certa sai do cálculo); figuras novas: renderizador + uma linha em `app/figuras/index.js`.
4. Unidades e lições; `checks/check-fisica.mjs` que recalcula as respostas.
5. Revisor independente → `revisao/revisao-fisica.md`; o autor corrige; checks; build; teste a 390 px; publicar (`ferramentas/publicar.sh` no WSL).
