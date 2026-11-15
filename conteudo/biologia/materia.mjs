// Matéria Biologia da Trilha ENEM. Frequência: pesquisa/pesquisa-biologia-enem.md (seção 1; SAS/CNN 2009–2023, Estuda, Aprova Total).
const P = "pesquisa-biologia-enem.md §1";
export default {
  id: "biologia", nome: "Biologia", cor: "#4c9a3c", area: "Ciências da Natureza", prefixo: "bio",
  descricao: "Ecologia, genética, corpo humano, células e evolução: figuras, contas e pegadinhas do ENEM.",
  temas: [
    { id: "ecologia", nome: "Ecologia", freq: "alta", ref: `${P}: ~22–26% das questões (SAS 23,7%; Estuda 22%; Aprova Total ~26%).` },
    { id: "fisiologia", nome: "Fisiologia e corpo humano", freq: "alta", ref: `${P}: histologia e fisiologia 12,3% (SAS); animal e humana 14% (Estuda).` },
    { id: "citologia", nome: "Citologia e metabolismo", freq: "media", ref: `${P}: citologia 10,8% (SAS); 10% (Estuda).` },
    { id: "genetica", nome: "Genética", freq: "media", ref: `${P}: genética pura 5–11%; com biologia molecular chega a ~20% (Estuda, SAS); figura todo ano.` },
    { id: "biotecnologia", nome: "Biotecnologia", freq: "media", ref: `${P}: biotecnologia 7,5% (SAS).` },
    { id: "doencas-vacinas", nome: "Doenças, vetores e vacinas", freq: "media", ref: `${P}: microbiologia e doenças 7,3% (SAS); parasitologia 5% (Estuda).` },
    { id: "evolucao", nome: "Evolução e filogenia", freq: "baixa", ref: `${P}: evolução ~5% (Estuda); 11% nas provas antigas (Tribuna PR, 1998–2012).` },
    { id: "plantas-animais", nome: "Plantas e animais", freq: "baixa", ref: `${P}: botânica e zoologia ~7% (Aprova Total, botânica 7,1%).` },
  ],
};
