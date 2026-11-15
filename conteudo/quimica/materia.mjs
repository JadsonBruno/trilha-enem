// Química: matéria da Trilha ENEM. Os temas são as linhas do mapa "Matérias × temas".
// Frequência: a pasta pesquisa/ do projeto não tem levantamento de Química. Usei levantamentos abertos de cursinhos
// (Estuda.com: química orgânica ≈ 24% das questões; Estratégia Vestibulares: > 15%, de 1998 a 2020), que NÃO publicam
// % por tema. A classificação alta/média abaixo é qualitativa: temas citados como recorrentes nessas fontes e em
// Preparaenem/Infoescola (funções orgânicas, reações orgânicas, nomenclatura, isomeria, forças intermoleculares).
// Fora do escopo desta versão: isomeria geométrica (cis-trans) e óptica (carbono quiral), porque os modelos do Show só
// calculam isomeria plana (função, cadeia, posição); e exercícios `enem` com texto-base (não há texto de domínio público de Química).
const FONTES = "estuda.com/o-que-mais-cai-em-quimica-no-enem; preparaenem.com/enem/temas-de-quimica-que-mais-caem-no-enem.htm";

export default {
  id: "quimica", nome: "Química", cor: "#2a7f8f", area: "Ciências da Natureza", prefixo: "qui",
  descricao: "Química orgânica do ENEM: ler o bastão, funções com oxigênio, propriedades, reações e isomeria.",
  temas: [
    { id: "ler-bastao", nome: "Ler o bastão e a fórmula", freq: "alta", ref: `Qualitativa (sem % por tema). Fórmula e leitura de estruturas aparecem em todo item de orgânica. ${FONTES}` },
    { id: "cadeias", nome: "Cadeias e hidrocarbonetos", freq: "alta", ref: `Qualitativa: alcanos, alcenos, alcinos e classificação da cadeia citados entre os mais cobrados. ${FONTES}` },
    { id: "alcool-fenol", nome: "Álcool e fenol", freq: "alta", ref: `Qualitativa: álcoois entre os mais cobrados (Estuda.com); funções oxigenadas em preparaenem.com/enem/principais-funcoes-organicas-abordadas-no-enem.htm` },
    { id: "aldeido-cetona", nome: "Aldeído e cetona", freq: "media", ref: `Qualitativa: cetonas citadas entre os mais cobrados (Estuda.com); funções oxigenadas em preparaenem.com/enem/principais-funcoes-organicas-abordadas-no-enem.htm` },
    { id: "acido-ester-eter", nome: "Ácido, éster e éter", freq: "alta", ref: `Qualitativa: ésteres citados entre os mais cobrados (Estuda.com); funções oxigenadas em preparaenem.com/enem/principais-funcoes-organicas-abordadas-no-enem.htm` },
    { id: "propriedades", nome: "Ponto de ebulição e solubilidade", freq: "alta", ref: `Qualitativa: forças intermoleculares e polaridade entre os temas recorrentes. ${FONTES}` },
    { id: "reacoes", nome: "Reações orgânicas", freq: "alta", ref: `Qualitativa: reações orgânicas entre os temas mais frequentes (Infoescola, citando análise do SAS). infoescola.com/educacao/assuntos-que-mais-caem-no-enem-em-cada-area` },
    { id: "isomeria", nome: "Isomeria", freq: "media", ref: `Qualitativa: nomenclatura e isomeria citadas como recorrentes (Preparaenem, Estuda.com). ${FONTES}` },
  ],
};
