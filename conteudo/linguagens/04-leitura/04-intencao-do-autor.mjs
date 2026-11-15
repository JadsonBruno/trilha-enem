import { tfDef, matchPares, fill, mcTab, porNivel } from "../_gerar.mjs";

const L = "lin-u4-l4";
export default {
  id: L, titulo: "Intenção do autor", temas: ["intencao", "leitura"],
  cartoes: [
    { tipo: "conceito", titulo: "Quatro intenções", texto: "Todo texto quer algo: informar, convencer, criticar ou emocionar. Descobrir isso é o primeiro passo para achar o efeito.", fig: { kind: "lin-cartao", titulo: "Intenção do autor", icone: "megafone" } },
    { tipo: "exemplo", titulo: "As marcas de cada uma", texto: "Informar: dados e tom neutro. Convencer: imperativo e “você”. Criticar: ironia ou humor que denuncia. Emocionar: imagens e ritmo.", fig: { kind: "lin-frase", texto: "Doe sangue hoje: você pode salvar vidas.", destaque: ["Doe", "você"] } },
    { tipo: "pegadinha", titulo: "Criticar × convencer", texto: "A crítica também pode convencer. Fique com a intenção predominante: apontar falhas (criticar) ou pedir uma ação (convencer)." },
  ],
  exercicios: porNivel([
    mcTab(L, "int", "convencer", "exemplo>nome", 1, { text: "Qual é a intenção predominante neste trecho?" }),
    mcTab(L, "int", "criticar", "exemplo>nome", 2, { text: "Qual é a intenção predominante neste trecho?" }),
    matchPares(L, "int", ["informar", "convencer", "criticar", "emocionar"], "def", { nivel: 1, enun: "Ligue cada intenção ao que ela faz." }),
    tfDef(L, "int", "informar", "emocionar", 1, "def"),
    fill(L, "int", "emocionar", "marca", 2),
    {
      id: "lin-u4-l4:enem-feira-intencao", tipo: "enem", nivel: 2,
      enunciado: "A intenção predominante do autor do texto é…",
      base: { titulo: "Carta do leitor", fonte: "Texto elaborado para o jogo, no formato de carta do leitor (feira fictícia)", texto: "Todo sábado a feira do bairro enche de gente. Neste ano, porém, as barracas do fundo continuam sem cobertura, e a chuva leva embora o pão, a fruta e a paciência de quem trabalha ali. Prometeram o telhado em março; já é setembro. Sigo acreditando em promessa, mas só naquela que vem com data e com obra." },
      alts: [
        "criticar a demora de uma obra prometida, mostrando o prazo vencido e o prejuízo dos feirantes",
        "informar, com neutralidade, os dias, os horários e a localização das barracas da feira do bairro",
        "convencer o leitor a comprar na feira, com apelo direto e verbos no imperativo",
        "emocionar o leitor com lembranças da infância e saudade do bairro de antigamente",
      ],
      certa: 0,
      explicacao: "Criticar: o texto aponta a promessa não cumprida (março × setembro) e o prejuízo, sem pedir compra nem só informar.",
      analise: [
        "A) Certa. O contraste entre a promessa de março e setembro, mais a chuva que estraga as mercadorias, denuncia a demora: é crítica.",
        "B) Errada. O texto não traz horários nem localização; o tom é de queixa, não de informação neutra.",
        "C) Errada. Não há imperativo nem convite à compra; o leitor não é chamado a agir na feira.",
        "D) Errada. Não há lembrança de infância nem saudade; o assunto é um problema atual.",
      ],
      origem: "manual", src: "no estilo do ENEM",
      ref: "Estuda.com, Dicas de interpretação de texto: https://estuda.com/dicas-de-interpretacao-de-texto/ (intenção do autor: informar, convencer, criticar ou emocionar). Texto-base elaborado para o jogo.",
    },
  ]),
};
