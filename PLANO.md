# Trilha ENEM: plano e contrato entre agentes

App de lições curtas estilo Duolingo para o ENEM. Projeto **separado** do Show do ENEM (`anatomy-quimica`, repo `show-quimica`), que **não é alterado**. A sessão principal orquestra, revisa, testa a 390 px e publica. Cada agente só mexe nos próprios arquivos.

Repo: `JadsonBruno/trilha-enem` → https://jadsonbruno.github.io/trilha-enem/ . Fonte de trabalho: `C:\Users\jadso\OneDrive\Documents\trilha-enem\` (node do Windows). Publicação: `node build.mjs` → `dist/index.html` → copiado para o clone WSL `~/dev/trilha-enem` (gh só no WSL).

## Pastas
| Pasta | Dono | O que é |
|---|---|---|
| `fonte/show-do-enem/` | ninguém altera | cópia literal dos módulos do Show do ENEM (bancos, modelos, desenhos, checks). Importe daqui; não edite. |
| `app/` | agente do motor | motor do jogo. **Não sabe de matéria nenhuma.** |
| `app/exercicios/<tipo>.js` | agente do motor | um arquivo por tipo de exercício (registro). |
| `app/figuras/` | sessão principal / motor | registro de figuras `FIGURAS[kind](fig, opts)` (mol, bio-*, lin-*). |
| `conteudo/indice.mjs` | sessão principal | lista e ordem das matérias. |
| `conteudo/_comum/` | sessão principal | ajudantes comuns (ex.: `doShow`, que converte uma pergunta do Show num exercício). |
| `conteudo/<materia>/` | agente da matéria | `materia.mjs`, `NN-<unidade>/unidade.mjs`, `NN-<unidade>/NN-<licao>.mjs`, `_*.mjs` (ajudantes/geradores da matéria). |
| `checks/` | sessão principal (schema) + agente da matéria (`check-<materia>.mjs`) | `node checks/check-tudo.mjs` roda tudo. |
| `ferramentas/manifesto.mjs` | sessão principal | gera `conteudo/_manifesto.gen.mjs` (imports estáticos) varrendo as pastas. |
| `revisao/` | revisores | `revisao-<materia>.md` com ALTA/MÉDIA/BAIXA. |
| `pesquisa/` | — | pesquisas de frequência no ENEM (cópia). |

**Ordem**: a das matérias vem de `conteudo/indice.mjs`; a das unidades e lições vem do prefixo numérico do nome da pasta/arquivo (`01-`, `02-`…). Arquivos que começam com `_` não são lições. Matéria/unidade/lição nova = só arquivos novos.

## Schema do conteúdo (validado por `checks/schema.mjs`)

### Matéria — `conteudo/<materia>/materia.mjs`
```js
export default {
  id: "quimica", nome: "Química", cor: "#2a7f8f", area: "Ciências da Natureza",
  prefixo: "qui",                         // todo id da matéria começa com "qui-"
  descricao: "≤ 120 caracteres",
  temas: [ { id: "funcoes", nome: "Funções orgânicas", freq: "alta" | "media" | "baixa", ref: "fonte da frequência" } ], // linhas do mapa
};
```
### Unidade — `conteudo/<materia>/NN-<slug>/unidade.mjs`
```js
export default {
  id: "qui-u1", titulo: "≤ 40", descricao: "≤ 110", temas: ["funcoes"],
  desafio: [ /* exatamente 10 exercícios mc | mc-figura | enem, ids que não aparecem em lição nenhuma */ ],
};
```
### Lição — `conteudo/<materia>/NN-<slug>/NN-<slug>.mjs`
```js
export default {
  id: "qui-u1-l1", titulo: "≤ 40", temas: ["funcoes"],
  cartoes: [ { tipo: "conceito"|"analogia"|"exemplo"|"enem"|"pegadinha", titulo: "≤ 40", texto: "≤ 240, frases curtas", fig?: { kind, … } } ], // 1 a 4
  exercicios: [ /* 5 a 8 */ ],
};
```
### Exercício (campos comuns)
`{ id, tipo, nivel: 1|2|3, enunciado (1–120), explicacao (1–150), fig?: [ {kind,…} ] (0–2), base?: { texto ≤ 450, fonte, titulo? }, dica?: { t, fig?, mark? }, ref?, src?, origem }`
- `id`: único no app inteiro, estável entre builds (nada de índice nem `Math.random`), começa com o prefixo da matéria (reaproveitados do Show mantêm o id original; Química do Show não tem prefixo, então `doShow` acrescenta `qui-`).
- `origem`: `"show:<id original>"` (reaproveitado) ou `"gerado:<gerador>"` (criado por código a partir de modelo/tabela) ou `"manual"` (só conceituais, e então `ref` é obrigatório).
- `src`: "no estilo do ENEM" ou referência real; **nunca** inventar ano/número de prova.

| tipo | campos próprios | regras |
|---|---|---|
| `mc` | `alts: string[]` (3–4), `certa: i` | alternativa ≤ 70; precisa de `fig` ou `base` |
| `mc-figura` | `alts: [{ fig, cap? }]` (4), `certa: i` | figuras distintas |
| `enem` | `base` obrigatório, `alts: string[]` (4–5, ≤ 100), `certa`, `analise: string[]` (1 por alternativa) | a certa não pode ser a mais longa em > 40% dos `enem` da matéria |
| `tf` | `certa: true|false` (o `enunciado` é a afirmação) | precisa de `fig` ou `base` |
| `match` | `pares: [[esq, dir], …]` (3–4) | ≤ 40 por lado; esquerdas distintas, direitas distintas |
| `order` | `itens: string[]` (3–5) **na ordem certa** | ≤ 50; distintos |
| `fill` | `frase` com exatamente um `___`, `opcoes: string[]` (3–4), `certa: i` | opção ≤ 30; distintas |

Regras de unidade: a 1ª lição não tem `enem`; no conjunto das lições da unidade, `enem` ≤ 30% (arredondado). Toda resposta certa sai de modelo/tabela (`fonte/`) ou de `doShow`; à mão só conceituais, com `ref` aberta.

## Figuras — `app/figuras/index.js`
`FIGURAS[kind](fig, { mode: "ask"|"reveal", size: "main"|"alt", hint })` devolve `<svg viewBox=…>`. Mesmos renderizadores do Show (`mol`, `eco-*`, `gen-*`, `corpo-*`, `cel-*`, `lin-cartao`, `lin-frase`, `lin-gen-recorte`). Tamanho mostrado a 390 px: **main ~310 px, alt ~150 px**; letra real = `font-size × largura mostrada ÷ largura do viewBox` ≥ **11,5 px** (o registro sobe o font-size mínimo de cada figura; o check confere). Kind novo = renderizador novo + uma linha no registro.

## Jogo (motor)
5 vidas por lição; errar tira 1 e a questão volta no fim da fila; XP por acerto + combo; ofensiva de dias; meta diária; revisão espaçada (hoje → 1 → 3 → 7 → 16 dias); lições destravadas em sequência (opção "liberar tudo"); Desafio de fim de unidade (10 questões estilo ENEM, nota ilustrativa, **não é TRI**); mapa Matérias × temas; progresso em `localStorage` (try/catch) + exportar/importar código. Abas: Trilha / Revisão / Mapa / Perfil.

## Build e testes
- `node ferramentas/manifesto.mjs` (o build e os checks já chamam).
- `node checks/check-tudo.mjs`: schema, ids, 1 certa, alternativas distintas, limites de texto, figura/texto-base, letra real, regra da certa mais longa, % de `enem`, desafio, + `checks/check-<materia>.mjs` + checks originais em `fonte/`.
- `node build.mjs` → `dist/trilha-enem.html` (legível, gancho `window.__trilha`) e `dist/index.html` (minificado, sem gancho).
