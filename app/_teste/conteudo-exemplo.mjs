// Conteúdo de TESTE do motor (node build.mjs --exemplo). Fica fora de conteudo/ de propósito: não é o conteúdo do app.
// Usa perguntas reais do Show do ENEM via doShow e escreve à mão só os tipos que o Show não tem (tf/match/order/fill).
import { doShow, bancoShow } from "../../conteudo/_comum/show.mjs";

const mol = (k, extra = {}) => ({ kind: "mol", k, ...extra });
const cartaoQ = [
  { tipo: "conceito", titulo: "Função orgânica", texto: "Função orgânica é um grupo de átomos que dá à molécula um comportamento típico. O OH, por exemplo, marca os álcoois.", fig: mol("etanol", { mark: [2, 1] }) },
  { tipo: "analogia", titulo: "Como um sobrenome", texto: "O grupo funcional é como o sobrenome de uma família: todas as moléculas com ele se comportam parecido." },
  { tipo: "exemplo", titulo: "Etanol", texto: "No etanol, o OH está preso a um carbono comum. Por isso ele é um álcool." },
  { tipo: "enem", titulo: "Como cai", texto: "O ENEM mostra a fórmula de uma substância do dia a dia e pede o nome da função presente nela." },
  { tipo: "pegadinha", titulo: "OH no anel", texto: "OH ligado direto ao anel aromático é fenol, não álcool. Confira em que carbono ele está." },
];

const licoesQuimica1 = [
  {
    id: "qui-u1-l1", titulo: "Ler o bastão", temas: ["funcoes"], cartoes: cartaoQ.slice(0, 3),
    exercicios: [
      doShow("marca-etanol-2"), doShow("marca-acetona-3"), doShow("qual-fenol-timol"),
      { id: "qui-ex-tf-1", tipo: "tf", nivel: 1, enunciado: "O OH do etanol está ligado a um anel aromático.", fig: [mol("etanol", { mark: [2, 1] })], certa: false, explicacao: "O OH está num carbono comum (sem anel): é um álcool, não um fenol.", origem: "manual", ref: "Química Orgânica, funções oxigenadas (exemplo de teste)" },
      { id: "qui-ex-match-1", tipo: "match", nivel: 1, enunciado: "Ligue o grupo à função orgânica.", pares: [["OH em carbono comum", "Álcool"], ["C=O na ponta da cadeia", "Aldeído"], ["C=O no meio da cadeia", "Cetona"], ["COOH", "Ácido carboxílico"]], explicacao: "Cada grupo funcional dá nome à função.", origem: "manual", ref: "Química Orgânica, funções oxigenadas (exemplo de teste)" },
      { id: "qui-ex-order-1", tipo: "order", nivel: 2, enunciado: "Ponha em ordem os passos para achar a função.", itens: ["Achar o grupo diferente de C e H", "Ver a que carbono ele está ligado", "Comparar com a tabela de funções", "Dar o nome da função"], explicacao: "Primeiro o grupo, depois onde ele está, então a função.", origem: "manual", ref: "Método de leitura de fórmulas (exemplo de teste)" },
      { id: "qui-ex-fill-1", tipo: "fill", nivel: 1, enunciado: "Complete a frase.", frase: "Um álcool tem o grupo ___ ligado a um carbono saturado.", opcoes: ["OH", "COOH", "C=O"], certa: 0, explicacao: "Álcool = OH em carbono saturado.", origem: "manual", ref: "Química Orgânica, álcoois (exemplo de teste)" },
    ],
  },
  {
    id: "qui-u1-l2", titulo: "Álcool, fenol, cetona", temas: ["funcoes", "isomeria"], cartoes: cartaoQ.slice(2, 5),
    exercicios: [
      doShow("marca-vinagre-3"), doShow("qual-fenol-hidroquinona"), doShow("qual-alcool-mentol"), doShow("marca-carvona-6"),
      { id: "qui-ex-tf-2", tipo: "tf", nivel: 2, enunciado: "A acetona é uma cetona: o C=O fica no meio da cadeia.", fig: [mol("acetona", { mark: [1, 3] })], certa: true, explicacao: "C=O entre dois carbonos = cetona.", origem: "manual", ref: "Química Orgânica, cetonas (exemplo de teste)" },
      { id: "qui-ex-order-2", tipo: "order", nivel: 2, enunciado: "Ordene do menor para o maior número de carbonos.", itens: ["Metano", "Etano", "Propano", "Butano"], explicacao: "1, 2, 3 e 4 carbonos.", origem: "manual", ref: "Nomenclatura IUPAC (exemplo de teste)" },
    ],
  },
  {
    id: "qui-u1-l3", titulo: "Revisão da unidade", temas: ["funcoes"], cartoes: cartaoQ.slice(3, 5),
    exercicios: [doShow("marca-ibuprofeno-9"), doShow("marca-aspirina-9"), doShow("marca-vanilina-9"), doShow("marca-salicilato-10"), doShow("marca-eugenol-7")],
  },
];
const desafioQ1 = ["marca-eter-2", "marca-banana-3", "marca-propanal-3", "marca-metanal-1", "marca-mentol-6", "marca-timol-6", "marca-canela-9", "marca-glicose-6", "marca-latico-5", "marca-cicloexanol-6"].map((id) => doShow(id));
const desafioQ2 = ["marca-hidroquinona-6", "marca-anetol-9", "marca-acetato_benzila-9", "marca-citral-0", "marca-geraniol-0", "marca-benzaldeido-7", "marca-vanilina-8", "marca-eugenol-7", "marca-salicilato-8", "marca-aspirina-8"].map((id) => doShow(id, id === "marca-eugenol-7" ? { id: "qui-marca-eugenol-7-d" } : {}));

const bio = bancoShow("biologia");
const bioEx = (i) => doShow(bio[i]);
const lin = bancoShow("linguagens");
const linFig = lin.filter((q) => !q.enem).slice(0, 12);
const linEnem = lin.filter((q) => q.enem);

export const CONTEUDO = [
  {
    id: "quimica", nome: "Química", cor: "#2a7f8f", area: "Ciências da Natureza", prefixo: "qui", descricao: "Funções orgânicas e leitura de fórmulas (conteúdo de teste do motor).",
    temas: [
      { id: "funcoes", nome: "Funções orgânicas", freq: "alta", ref: "teste" },
      { id: "isomeria", nome: "Isomeria", freq: "media", ref: "teste" },
      { id: "cadeias", nome: "Cadeias carbônicas", freq: "baixa", ref: "teste" },
    ],
    unidades: [
      { id: "qui-u1", titulo: "Ler o bastão", descricao: "Como ler uma fórmula e achar a função.", temas: ["funcoes", "isomeria"], licoes: licoesQuimica1, desafio: desafioQ1 },
      {
        id: "qui-u2", titulo: "Funções do dia a dia", descricao: "Aromas, remédios e alimentos em fórmulas.", temas: ["funcoes", "cadeias"],
        licoes: [
          { id: "qui-u2-l1", titulo: "Aromas e sabores", temas: ["funcoes"], cartoes: cartaoQ.slice(0, 2), exercicios: ["marca-hda-0", "marca-propofol-6", "marca-resveratrol-14", "marca-acido_salicilico-9", "marca-benzoato_etila-8"].map((id) => doShow(id)) },
          { id: "qui-u2-l2", titulo: "Cadeias", temas: ["cadeias"], cartoes: cartaoQ.slice(1, 3), exercicios: ["marca-alcool_benzilico-7", "marca-vanilina-9", "marca-salicilato-10", "marca-aspirina-9", "marca-ibuprofeno-9"].map((id, i) => doShow(id, { id: "qui-u2-" + id + i })) },
        ],
        desafio: desafioQ2,
      },
    ],
  },
  {
    id: "biologia", nome: "Biologia", cor: "#3f8a3a", area: "Ciências da Natureza", prefixo: "bio", descricao: "Teias e pirâmides ecológicas (conteúdo de teste do motor).",
    temas: [{ id: "eco", nome: "Ecologia", freq: "alta", ref: "teste" }, { id: "cel", nome: "Citologia", freq: "media", ref: "teste" }],
    unidades: [
      {
        id: "bio-u1", titulo: "Teias alimentares", descricao: "Quem come quem e para onde vai a energia.", temas: ["eco"],
        licoes: [
          { id: "bio-u1-l1", titulo: "Ler uma teia", temas: ["eco"], cartoes: [{ tipo: "conceito", titulo: "Teia", texto: "A seta aponta para quem recebe a energia: de quem é comido para quem come." }], exercicios: [0, 1, 2, 3, 4].map(bioEx) },
          { id: "bio-u1-l2", titulo: "Pirâmides", temas: ["eco", "cel"], cartoes: [{ tipo: "pegadinha", titulo: "10%", texto: "Só cerca de 10% da energia passa de um nível para o seguinte." }], exercicios: [5, 6, 7, 8, 9].map(bioEx) },
        ],
        desafio: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(bioEx),
      },
    ],
  },
  {
    id: "linguagens", nome: "Linguagens", cor: "#b3472f", area: "Linguagens", prefixo: "lin", descricao: "Figuras de linguagem e textos (conteúdo de teste do motor).",
    temas: [{ id: "figuras", nome: "Figuras de linguagem", freq: "alta", ref: "teste" }],
    unidades: [
      {
        id: "lin-u1", titulo: "Figuras de linguagem", descricao: "Metáfora, ironia e companhia.", temas: ["figuras"],
        licoes: [
          { id: "lin-u1-l1", titulo: "Figuras no cartaz", temas: ["figuras"], cartoes: [{ tipo: "conceito", titulo: "Figura", texto: "Figura de linguagem é um jeito de dizer que foge do sentido literal para dar força ao texto." }], exercicios: linFig.slice(0, 6).map((q) => doShow(q)) },
          { id: "lin-u1-l2", titulo: "Como cai no ENEM", temas: ["figuras"], cartoes: [{ tipo: "enem", titulo: "Texto-base", texto: "No ENEM a figura vem dentro de um trecho. Leia o texto todo e só depois olhe as alternativas." }], exercicios: [...linEnem.slice(0, 2).map((q) => doShow(q)), ...linFig.slice(6, 9).map((q) => doShow(q))] },
        ],
        desafio: linEnem.slice(2, 12).map((q) => doShow(q)),
      },
    ],
  },
];
