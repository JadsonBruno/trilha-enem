// Funções da linguagem (Jakobson) — padrão 2 de Linguagens. A certa sai da tabela FATOS; erradas = funções que mais confundem.
// 12 linhas: 6 "base" (def = o que faz, marca = sinal no texto, exemplo 1) e 6 "foco" (def = elemento da comunicação,
// marca = gêneros típicos, exemplo 2). Linhas "foco" só se misturam com "foco" (cada confunde aponta para o mesmo tipo).
import { perguntaDeTabela } from "./lin-base.mjs";

const REF = "Toda Matéria, Funções da linguagem: https://www.todamateria.com.br/funcoes-da-linguagem/";
const base = (id, nome, icone, def, marca, exemplo, destaque, confunde) => ({ id, nome, icone, def, marca, exemplo, destaque, ref: REF, confunde });
const foco = (id, nome, icone, def, marca, exemplo, destaque, confunde) => ({ id: id + "-foco", nome, icone, def, marca, exemplo, destaque, ref: REF, confunde: confunde.map((c) => c + "-foco") });

export const FATOS = [
  base("referencial", "Referencial", "jornal", "Informa fatos de modo objetivo", "3ª pessoa, dados, tom neutro", "O IBGE divulgou hoje os dados do novo censo.", ["divulgou", "dados"], ["conativa", "emotiva", "poetica"]),
  base("emotiva", "Emotiva", "coracao", "Mostra os sentimentos de quem fala", "1ª pessoa, exclamação, reticências", "Ai, como eu me sinto sozinho hoje!", ["eu", "sinto"], ["fatica", "poetica", "conativa"]),
  base("conativa", "Conativa", "megafone", "Quer convencer o outro ou levá-lo a agir", "Imperativo e vocativo", "Venha à nossa loja e garanta o seu desconto!", ["Venha", "garanta"], ["referencial", "emotiva", "poetica"]),
  base("fatica", "Fática", "telefone", "Testa ou mantém o contato", "Alô?, tá me ouvindo?, né?", "Alô? Tá me ouvindo bem? A linha tá ruim.", ["Alô", "ouvindo"], ["emotiva", "conativa", "referencial"]),
  base("metalinguistica", "Metalinguística", "livro", "Usa o código para falar do próprio código", "Fala da própria língua ou de outra linguagem", "Adjetivo é a palavra que caracteriza o substantivo.", ["Adjetivo", "palavra"], ["poetica", "referencial", "emotiva"]),
  base("poetica", "Poética", "pena", "Cuida do jeito de dizer: sons e imagens", "Figuras, rima, ritmo, sentido figurado", "A lua é uma lâmpada pendurada no teto da noite.", ["lâmpada"], ["metalinguistica", "emotiva", "referencial"]),
  foco("referencial", "Referencial", "jornal", "Centrada no assunto, no referente", "Notícia, relatório, texto científico", "A chuva deixou 30 mm de água na cidade ontem.", ["chuva", "30"], ["conativa", "emotiva", "poetica"]),
  foco("emotiva", "Emotiva", "coracao", "Centrada no emissor, quem fala", "Diário, carta pessoal, desabafo", "Estou tão feliz hoje!", ["Estou", "feliz"], ["fatica", "poetica", "conativa"]),
  foco("conativa", "Conativa", "megafone", "Centrada no receptor, quem ouve ou lê", "Anúncio, cartaz, discurso político", "Ei, você aí: cuide da sua saúde e vacine-se!", ["você", "cuide", "vacine-se"], ["referencial", "emotiva", "poetica"]),
  foco("fatica", "Fática", "telefone", "Centrada no canal de comunicação", "Telefonema, saudação, conversa rápida", "Oi, tudo bem? Pode falar, tô te ouvindo.", ["Oi", "ouvindo"], ["emotiva", "conativa", "referencial"]),
  foco("metalinguistica", "Metalinguística", "livro", "Centrada no código, na própria língua", "Verbete, gramática, dicionário", "Na frase, a palavra “que” é uma conjunção.", ["palavra", "conjunção"], ["poetica", "referencial", "emotiva"]),
  foco("poetica", "Poética", "pena", "Centrada na mensagem, em como é dita", "Poema, ditado, letra de música", "Pé ante pé, passo a passo, pássaro no espaço.", ["Pé", "passo", "pássaro"], ["metalinguistica", "emotiva", "referencial"]),
];

const S = (alvo, formato, lvl, text, hint, why, src) => ({ alvo, formato, lvl, text, hint, why, src });
const ESPEC = [
  // conceito -> definição (9)
  S("metalinguistica", "nome>def", 1, "Metalinguagem é o quê?", "Pense em linguagem falando de si mesma.", "Metalinguística: o código explica o código (dicionário, gramática).", "como no ENEM 2013 (função predominante num texto sobre a própria linguagem)"),
  S("referencial", "nome>def", 1, "Função referencial é o quê?", "Pense em jornal: o foco é o assunto.", "Referencial: foco no assunto; informa sem emoção nem apelo."),
  S("emotiva", "nome>def", 1, "Função emotiva (ou expressiva) é o quê?", "O foco está em quem fala.", "Emotiva: o emissor expõe sentimentos, em 1ª pessoa."),
  S("conativa", "nome>def", 2, "Função conativa (ou apelativa) é o quê?", "O verbo-chave é “fazer o outro agir”.", "Conativa: foco no receptor; convence e manda (imperativo, vocativo)."),
  S("poetica", "nome>def", 2, "Função poética é o quê?", "Olhe para a forma, não só para o conteúdo.", "Poética: a atenção está em como se diz (som, imagem, ritmo)."),
  S("fatica", "nome>def", 3, "Função fática é o quê?", "Pense em telefone e em conversa de elevador.", "Fática: foco no canal; abre, testa ou mantém a conversa."),
  S("conativa", "nome>marca", 2, "Qual marca denuncia a função conativa?", "Quem manda costuma usar um modo verbal específico.", "Conativa: verbo no imperativo e vocativo chamam o receptor."),
  S("poetica", "nome>marca", 3, "Qual sinal indica função poética?", "Pense no que um poema trabalha além da informação.", "Poética: figuras, rima, ritmo e sentido figurado chamam atenção à forma."),
  S("metalinguistica-foco", "nome>def", 3, "A função metalinguística está centrada em quê?", "Elemento da comunicação: o conjunto de signos.", "Metalinguística: foco no código, a língua falando da língua."),
  // definição -> conceito (6)
  S("emotiva-foco", "def>nome", 1, "Que função é “centrada no emissor, quem fala”?", "Quem fala é o assunto do texto.", "Emotiva: foco no emissor, que revela sentimentos e opiniões."),
  S("referencial", "def>nome", 2, "Que função da linguagem informa fatos de modo objetivo?", "Dados e tom neutro, sem apelo.", "Referencial: informa sobre o assunto; típico de notícias e textos científicos."),
  S("fatica", "marca>nome", 3, "Que função aparece em “Alô?, tá me ouvindo?, né?”", "Há conteúdo ou só teste de canal?", "Fática: testa o canal. Não há assunto, só contato."),
  S("conativa-foco", "marca>nome", 2, "Qual função costuma predominar em anúncio, cartaz e discurso político?", "Esses gêneros querem algo do público.", "Conativa: anúncios e discursos visam convencer o receptor."),
  S("metalinguistica-foco", "marca>nome", 1, "Qual função costuma predominar em verbete, gramática e dicionário?", "Esses textos explicam palavras e regras.", "Metalinguística: o dicionário usa a língua para explicar a língua."),
  S("poetica-foco", "def>nome", 2, "Que função é “centrada na mensagem, em como é dita”?", "A forma da mensagem é a protagonista.", "Poética: o foco é a mensagem em si, o modo de dizer."),
  // exemplo -> qual é (5)
  S("referencial", "exemplo>nome", 1, "Qual função predomina neste trecho?", "Veja se há opinião, apelo ou só informação.", "Referencial: dados do censo, 3ª pessoa, tom neutro.", "como no ENEM 2018 (texto sobre aplicativo: dados em linguagem denotativa)"),
  S("conativa-foco", "exemplo>nome", 2, "Qual função predomina neste trecho?", "Verbos mandam o leitor fazer algo.", "Conativa: vocativo “você” e verbos no imperativo."),
  S("poetica", "exemplo>nome", 2, "Qual função predomina neste trecho?", "A lua virou outra coisa: olhe a imagem.", "Poética: metáfora (lua = lâmpada) cuida da forma, não só do fato."),
  S("metalinguistica-foco", "exemplo>nome", 3, "Qual função predomina neste trecho?", "O trecho analisa uma palavra da própria língua.", "Metalinguística: a língua descreve uma palavra da língua.", "como no ENEM 2017 (gramática normativa: função predominante)"),
  S("emotiva-foco", "exemplo>nome", 3, "Qual função predomina neste trecho?", "O sujeito diz como ele mesmo se sente.", "Emotiva: 1ª pessoa, exclamação, sentimento de quem fala."),
];

export const QUESTIONS = ESPEC.map((e, i) => perguntaDeTabela({
  fatos: FATOS, alvo: e.alvo, formato: e.formato,
  id: `lin-fun-${e.alvo.replace("-foco", "F")}-${e.formato.replace(">", "2")}-${i + 1}`, pat: 2, lvl: e.lvl, rotulo: "função",
  text: e.text, hint: { t: e.hint }, why: e.why, src: e.src,
}));
export const FIGS = {};
export const PATTERNS_USED = [2];
