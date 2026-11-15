// Figuras de linguagem (padrão 1): 22 fatos + 30 perguntas geradas da tabela (a certa sai da tabela).
// Fontes abertas de verdade (WebFetch): Toda Matéria e PreparaEnem (ver `ref`).
import { perguntaDeTabela } from "./lin-base.mjs";

const TM = "Toda Matéria, Figuras de linguagem: https://www.todamateria.com.br/figuras-de-linguagem/";
const PE = "PreparaEnem, Figuras de linguagem no Enem: https://www.preparaenem.com/enem/figuras-de-linguagem-no-enem.htm";

export const FATOS = [
  { id: "metafora", nome: "Metáfora", def: "Dá a algo o nome de outra coisa, por analogia", marca: "A é B, sem 'como'", exemplo: "O tempo é um rio que não volta.", destaque: ["rio"], icone: "pena", ref: PE, confunde: ["comparacao", "metonimia", "catacrese", "personificacao"] },
  { id: "comparacao", nome: "Comparação", def: "Aproxima dois termos com conectivo", marca: "Traz 'como', 'tal qual', 'igual a'", exemplo: "Ela corria como o vento.", destaque: ["como"], ref: PE, confunde: ["metafora", "metonimia", "personificacao"] },
  { id: "metonimia", nome: "Metonímia", def: "Troca um termo por outro ligado a ele", marca: "Autor pela obra, parte pelo todo", exemplo: "Li Machado de Assis até de madrugada.", destaque: ["Machado de Assis"], ref: PE, confunde: ["metafora", "catacrese", "comparacao"] },
  { id: "catacrese", nome: "Catacrese", def: "Palavra emprestada que virou o nome da coisa", marca: "Já virou nome comum: 'pé da mesa'", exemplo: "O pé da mesa quebrou.", destaque: ["pé"], ref: TM, confunde: ["metafora", "metonimia", "personificacao"] },
  { id: "antitese", nome: "Antítese", def: "Contrapõe duas palavras ou ideias opostas", marca: "Termos contrários: riso × choro", exemplo: "Entre o riso e o choro, ela aprendeu a viver.", destaque: ["riso", "choro,"], ref: PE, confunde: ["paradoxo", "ironia", "gradacao"] },
  { id: "paradoxo", nome: "Paradoxo", def: "Contradição aparente que faz sentido", marca: "Uma ideia que nega a outra: cego, mas vejo", exemplo: "Estou cego de amor e vejo tudo com clareza.", destaque: ["cego", "vejo"], ref: PE, confunde: ["antitese", "ironia", "hiperbole"] },
  { id: "hiperbole", nome: "Hipérbole", def: "Exagera a ideia de propósito", marca: "Exagero: 'mil vezes', 'uma eternidade'", exemplo: "Esperei uma eternidade pelo ônibus.", destaque: ["eternidade"], ref: TM, confunde: ["eufemismo", "ironia", "gradacao", "pleonasmo"] },
  { id: "eufemismo", nome: "Eufemismo", def: "Suaviza algo duro ou desagradável", marca: "'Partiu', 'faltou', 'nos deixou'", exemplo: "O vovô nos deixou na semana passada.", destaque: ["deixou"], ref: TM, confunde: ["hiperbole", "ironia", "antitese"] },
  { id: "ironia", nome: "Ironia", def: "Diz o contrário do que se pensa", marca: "O contexto desmente a frase", exemplo: "Que ótima ideia: derrubou o bolo inteiro!", destaque: ["ótima", "ideia"], ref: PE, confunde: ["antitese", "paradoxo", "hiperbole", "eufemismo"] },
  { id: "personificacao", nome: "Personificação (prosopopeia)", def: "Dá ação ou sentimento humano a coisa ou bicho", marca: "Verbo humano em coisa ou bicho", exemplo: "O vento sussurrava segredos nas janelas.", destaque: ["sussurrava"], ref: TM, confunde: ["metafora", "apostrofe", "sinestesia", "comparacao"] },
  { id: "sinestesia", nome: "Sinestesia", def: "Mistura sensações de sentidos diferentes", marca: "Som + tato, cor + cheiro", exemplo: "Ela tem uma voz quente e aveludada.", destaque: ["voz", "quente"], ref: TM, confunde: ["metafora", "personificacao", "antitese"] },
  { id: "elipse", nome: "Elipse", def: "Omite termo não dito, deduzido pelo contexto", marca: "Sujeito ou verbo oculto, nunca dito antes", exemplo: "Fui à feira. Comprei pão e frutas.", destaque: ["Comprei"], ref: PE, confunde: ["hiperbato", "polissindeto", "pleonasmo"] },
  { id: "zeugma", nome: "Zeugma", def: "Omite termo já dito na mesma frase", marca: "Verbo não repetido: 'Ana, o pão; Bia, o leite'", exemplo: "Ana comprou o pão; Bia, o leite.", destaque: ["Bia,"], ref: TM, confunde: ["polissindeto", "hiperbato", "pleonasmo"] },
  { id: "gradacao", nome: "Gradação", def: "Ideias em escala crescente ou decrescente", marca: "Sequência que sobe ou desce de intensidade", exemplo: "Veio um chuvisco, depois a chuva, por fim a tempestade.", destaque: ["chuvisco,", "chuva,", "tempestade."], ref: TM, confunde: ["anafora", "polissindeto", "hiperbole", "antitese"] },
  { id: "pleonasmo", nome: "Pleonasmo", def: "Repete a ideia para reforçá-la", marca: "'Vi com os olhos', 'chorou lágrimas'", exemplo: "Vi com meus próprios olhos.", destaque: ["com meus próprios olhos."], ref: TM, confunde: ["anafora", "hiperbole", "polissindeto"] },
  { id: "anafora", nome: "Anáfora", def: "Repete palavra no começo de frases ou versos", marca: "Mesmo início em cada trecho", exemplo: "Não quero ouvir, não quero ver, não quero esquecer.", destaque: ["Não quero", "não quero"], ref: TM, confunde: ["polissindeto", "pleonasmo", "gradacao", "aliteracao"] },
  { id: "aliteracao", nome: "Aliteração", def: "Repete sons de consoantes", marca: "A mesma consoante soa várias vezes", exemplo: "Vozes veladas, veludosas vozes", fonte: "Cruz e Sousa, Violões que choram", destaque: ["Vozes", "veladas,", "veludosas", "vozes"], ref: TM, confunde: ["assonancia", "onomatopeia", "anafora"] },
  { id: "assonancia", nome: "Assonância", def: "Repete sons de vogais", marca: "A mesma vogal soa várias vezes", exemplo: "O bobo do povo comeu todo o bolo.", destaque: ["bobo", "povo", "todo", "bolo."], ref: TM, confunde: ["aliteracao", "onomatopeia", "anafora"] },
  { id: "onomatopeia", nome: "Onomatopeia", def: "Palavra que imita um som", marca: "'tic-tac', 'pluft', 'miau'", exemplo: "O sino fez dlim-dlom no fim da tarde.", destaque: ["dlim-dlom"], ref: TM, confunde: ["aliteracao", "assonancia", "sinestesia"] },
  { id: "hiperbato", nome: "Hipérbato", def: "Inverte a ordem direta da frase", marca: "Ordem trocada: 'Azuis eram os olhos'", exemplo: "Azuis eram os olhos da menina.", destaque: ["Azuis", "eram"], ref: TM, confunde: ["elipse", "zeugma", "pleonasmo"] },
  { id: "polissindeto", nome: "Polissíndeto", def: "Repete conectivos entre os termos", marca: "Muitos 'e' seguidos", exemplo: "Chovia, e ventava, e trovejava, e ninguém saía.", destaque: ["e"], ref: TM, confunde: ["anafora", "gradacao", "pleonasmo", "zeugma"] },
  { id: "apostrofe", nome: "Apóstrofe", def: "Chama diretamente alguém ou algo", marca: "Vocativo: 'Ó mar…', 'Senhor!'", exemplo: "Senhor, ouvi a minha prece!", destaque: ["Senhor,"], ref: TM, confunde: ["personificacao", "ironia", "anafora", "polissindeto"] },
];

// Dicas: apontam onde olhar (palavra-chave ou marca), sem copiar a definição nem dizer o nome da figura.
const DICA = {
  hiperbole: "Repare em 'eternidade': dá para esperar isso mesmo?",
  eufemismo: "Repare no verbo: diz 'deixou' em vez de falar direto.",
  metonimia: "O que você leu: a pessoa ou os livros dela?",
  sinestesia: "Voz se ouve, mas 'quente' é do tato: quantos sentidos?",
  pleonasmo: "Ver já é com os olhos: a ideia se repete para reforçar.",
  aliteracao: "Escute a mesma consoante voltando.",
  elipse: "Quem comprou? O sujeito não aparece, mas se deduz.",
};
const DICA_N = {
  metafora: "Veja se há conectivo entre as duas coisas.", comparacao: "Procure a palavrinha que liga as duas coisas.",
  metonimia: "Pense na relação: o que está perto de quê?", catacrese: "Pense no 'pé' da mesa: ele tem outro nome?",
  antitese: "Olhe se há duas palavras contrárias.", paradoxo: "Procure uma contradição que, pensando, faz sentido.",
  hiperbole: "Procure o exagero.", eufemismo: "Pense em como falar de algo triste sem dureza.",
  ironia: "Preste atenção no contexto, não só nas palavras.", personificacao: "Quem pratica a ação: gente ou coisa?",
  sinestesia: "Conte quantos sentidos aparecem.", elipse: "Veja o que falta e não foi dito antes.",
  zeugma: "Veja o que não se repete, mas já apareceu.", gradacao: "Veja se a intensidade sobe ou desce em degraus.",
  pleonasmo: "Alguma palavra repete o que a outra já diz?", anafora: "Olhe o começo de cada trecho.",
  aliteracao: "Escute as consoantes.", assonancia: "Escute as vogais.", onomatopeia: "Pense em barulho escrito.",
  hiperbato: "Compare com a ordem normal: sujeito, verbo, complemento.", polissindeto: "Conte quantas vezes a mesma palavrinha de ligação aparece.",
  apostrofe: "Veja se alguém é chamado diretamente.",
};
// [id, formato, nível, confunde (só em e2n: tira do páreo as figuras que também serviriam ao exemplo)]
export const PLANO = [
  // fáceis (9)
  ["metafora", "n2d", 1], ["comparacao", "d2n", 1], ["hiperbole", "e2n", 1, ["eufemismo", "ironia", "gradacao"]], ["ironia", "n2d", 1],
  ["onomatopeia", "d2n", 1], ["eufemismo", "e2n", 1, ["hiperbole", "ironia", "antitese"]], ["personificacao", "n2d", 1], ["antitese", "d2n", 1], ["comparacao", "n2d", 1],
  // médias (12)
  ["metonimia", "e2n", 2, ["metafora", "comparacao", "catacrese"]], ["paradoxo", "n2d", 2], ["sinestesia", "e2n", 2, ["personificacao", "antitese", "onomatopeia"]],
  ["catacrese", "d2n", 2], ["elipse", "n2d", 2], ["gradacao", "d2n", 2], ["pleonasmo", "e2n", 2, ["anafora", "hiperbole", "polissindeto"]],
  ["anafora", "d2n", 2], ["aliteracao", "e2n", 2, ["onomatopeia", "anafora", "polissindeto"]], ["eufemismo", "n2d", 2], ["polissindeto", "d2n", 2], ["apostrofe", "n2d", 2],
  // difíceis (9)
  ["paradoxo", "d2n", 3], ["catacrese", "n2d", 3], ["zeugma", "d2n", 3], ["assonancia", "n2d", 3], ["hiperbato", "d2n", 3],
  ["aliteracao", "d2n", 3], ["elipse", "e2n", 3, ["hiperbato", "polissindeto", "pleonasmo"]], ["zeugma", "n2d", 3], ["hiperbato", "n2d", 3],
];
export const FORMATO = { n2d: "nome>def", d2n: "def>nome", e2n: "exemplo>nome" };
// Pares em que as duas figuras podem conviver no mesmo exemplo: nunca juntos num "exemplo → qual é".
export const PARES_SOBREPOSTOS = [["elipse", "zeugma"], ["catacrese", "metafora"], ["aliteracao", "assonancia"], ["sinestesia", "metafora"], ["apostrofe", "personificacao"]];

const por = Object.fromEntries(FATOS.map((f) => [f.id, f]));
export const QUESTIONS = PLANO.map(([alvo, fmt, lvl, conf]) => {
  const f = por[alvo];
  return perguntaDeTabela({
    fatos: FATOS, alvo, formato: FORMATO[fmt], id: `lin-fig-${alvo}-${fmt}`, pat: 1, lvl, rotulo: "figura",
    confunde: conf, sub: fmt === "n2d" ? "figura de linguagem" : undefined,
    hint: fmt === "e2n" ? { t: DICA[alvo] } : { t: DICA_N[alvo] },
    why: `${f.nome}: ${f.def.charAt(0).toLowerCase() + f.def.slice(1)}. Marca: ${f.marca}.`,
  });
});
export const FIGS = {};
export const PATTERNS_USED = [1];
