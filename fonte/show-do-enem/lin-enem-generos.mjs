// Gêneros textuais no formato do ENEM (Linguagens, padrão 3): 12 perguntas com texto-base (6 médias / 6 difíceis).
// Textos de domínio público conferidos no Wikisource (cortes marcados com [...]); os demais foram elaborados para o jogo.
const TM = "Toda Matéria, Gêneros textuais: https://www.todamateria.com.br/generos-textuais/";
const PE = (nome, slug) => `PreparaEnem, ${nome}: https://www.preparaenem.com/portugues/${slug}.htm`;
const ORIG = (g) => `Texto elaborado para o jogo, no formato de ${g}`;

// mk: a certa entra na posição `pos` (0-3); as erradas entram na ordem dada nas outras posições.
function mk({ id, lvl, text, base, ok, bad, pos, hint, destaque, why, src = "no estilo do ENEM", ref }) {
  const alts = [], analise = [];
  let b = 0;
  for (let i = 0; i < 4; i++) {
    const [t, a] = i === pos ? ok : bad[b++];
    alts.push({ t });
    analise.push(`${"ABCD"[i]}) ${i === pos ? "Certa" : "Errada"}: ${a}`);
  }
  return { id: "lin-enem-gen-" + id, subj: "linguagens", pat: 3, lvl, enem: true, text, fig: [], base, alts, correct: [pos], analise, hint, destaque, why, src, ref };
}

export const QUESTIONS = [
  mk({
    id: "carta-caminha", lvl: 2, pos: 0,
    text: "Os elementos que identificam o trecho como carta são…",
    base: { titulo: "Carta a El Rei D. Manuel (fecho)", fonte: "Pero Vaz de Caminha, Carta a El Rei D. Manuel (1500), grafia atualizada; trechos omitidos marcados com [...]",
      texto: "E desta maneira dou aqui a Vossa Alteza conta do que nesta Vossa terra vi. E se a um pouco alonguei, Ela me perdoe.\n[...]\nBeijo as mãos de Vossa Alteza.\nDeste Porto Seguro, da Vossa Ilha da Vera Cruz, hoje, sexta-feira, primeiro dia de Maio de 1500." },
    ok: ["Despedida formal, local e data, com 1ª pessoa dirigindo-se a um destinatário certo", "despedida formal, local e data são marcas de carta; \"dou conta do que vi\" é relato a uma autoridade."],
    bad: [["Impessoalidade e objetividade para informar um fato recente ao público em geral", "isso é notícia; aqui há um \"eu\" que se dirige a \"Vossa Alteza\"."],
      ["Voz coletiva de um jornal que expõe sua opinião sobre um tema de interesse público", "isso é editorial; não há jornal nem tese a defender no trecho."],
      ["Pedido formal de um grupo a uma autoridade, validado por uma lista de assinaturas", "isso é abaixo-assinado; aqui escreve uma só pessoa e não há lista de nomes."]],
    hint: { t: "Olhe como o texto termina: fórmula de despedida, local e data.", trecho: "Beijo as mãos de Vossa Alteza." },
    destaque: "dou aqui a Vossa Alteza conta do que nesta Vossa terra vi",
    why: "Despedida, local, data e \"dar conta\" ao rei marcam a carta de relato a uma autoridade, com 1ª pessoa e destinatário definido.",
    ref: `${TM} | PreparaEnem, Carta aberta (gênero carta): https://www.preparaenem.com/portugues/carta-aberta.htm | Texto-base conferido: https://pt.wikisource.org/wiki/Carta_a_El_Rei_D._Manuel_(ortografia_atualizada)` }),

  mk({
    id: "cronica-bons-dias", lvl: 2, pos: 2,
    text: "Um traço que identifica o texto como crônica é…",
    base: { titulo: "Bons dias!", fonte: "Machado de Assis, \"Bons dias!\", Gazeta de Notícias (19/5/1888)",
      texto: "Eu pertenço a uma família de profetas après coup, post factum, depois do gato morto, ou como melhor nome tenha em holandês. Por isso digo juro se necessário for, que toda a história desta lei de 13 de maio estava por mim prevista, tanto que na segunda-feira, antes mesmo dos debates, tratei de alforriar um molecote que tinha, pessoa de seus dezoito anos, mais ou menos." },
    ok: ["Narrador em 1ª pessoa comenta com ironia a lei de 13 de maio, em tom leve", "a crônica parte de um fato do dia e o comenta com leveza e ironia, em voz pessoal."],
    bad: [["Linguagem impessoal e objetiva que informa o fato com lide, sem opinião do autor", "isso é notícia; o texto é pessoal, irônico e cheio de opinião."],
      ["Tese defendida com argumentos em nome de uma instituição que fala em coletivo", "isso é editorial; aqui fala um narrador individual, não o jornal."],
      ["Personagens e clímax de ficção, sem ligação alguma com fatos reais da época", "o conto não comenta o noticiário; o texto parte de um fato real, a lei de 13 de maio."]],
    hint: { t: "Quem fala? E de que assunto do dia ele parte?", trecho: "toda a história desta lei de 13 de maio" },
    destaque: "Eu pertenço a uma família de profetas",
    why: "Crônica: texto curto que parte de um fato do cotidiano ou do noticiário e o comenta em 1ª pessoa, com ironia ou humor e tom leve.",
    ref: `${PE("Crônica", "cronica")} | Texto-base conferido: https://pt.wikisource.org/wiki/Cr%C3%B4nica_da_Aboli%C3%A7%C3%A3o` }),

  mk({
    id: "cronica-ontem-hoje", lvl: 3, pos: 1,
    text: "A finalidade do texto, típica da crônica, é…",
    base: { titulo: "Ontem e hoje", fonte: "Lima Barreto, \"Ontem e hoje\", Careta (26/6/1915); trechos omitidos marcados com [...]",
      texto: "Certa vez a aglomeração de povo foi tal que o guarda civil de ronda compareceu, mas logo afastou-se dizendo:\n— É o nosso homem.\n[...]\nNinguém lhe fala, ninguém lhe pede nada, ninguém o abraça - porque?\n[...]\nPorque? Não sabemos, mas talvez o guarda civil pudesse dizer:\n— Ele não é mais o nosso homem." },
    ok: ["Criticar com ironia quem só cerca o homem de poder enquanto ele tem algo a oferecer", "a cena do cotidiano serve de pretexto para a crítica irônica, em tom de crônica."],
    bad: [["Informar de modo objetivo o público sobre a rotina e a agenda de uma figura pública", "isso seria notícia; o texto não traz lide, e sim cena e ironia."],
      ["Convencer o leitor, com tese e dados, a retirar o apoio a uma figura pública", "isso seria artigo de opinião; não há tese explícita nem dados."],
      ["Aprofundar, com entrevistas e números, as causas da perda de prestígio de alguém", "isso seria reportagem; o texto só observa e sugere."]],
    hint: { t: "Compare as duas falas do guarda civil: o que mudou entre elas?", trecho: "É o nosso homem." },
    destaque: "Ele não é mais o nosso homem.",
    why: "A crônica usa uma cena observada e o desfecho irônico (a fala repetida do guarda) para criticar o comportamento social, sem tese formal.",
    ref: `${PE("Crônica", "cronica")} | Texto-base conferido: https://pt.wikisource.org/wiki/Ontem_e_hoje_(Lima_Barreto)` }),

  mk({
    id: "autoral-candidatura", lvl: 3, pos: 3,
    text: "O que mostra que o texto não é um editorial, e sim de autoria pessoal?",
    base: { titulo: "A minha candidatura", fonte: "Lima Barreto, \"A minha candidatura\", Careta (18/8/1921); trechos omitidos marcados com [...]",
      texto: "Vou escrever um artigo perfeitamente pessoal; e é preciso. Sou candidato à Academia de Letras, na vaga do Sr. Paulo Barreto. Não há nada mais justo e justificável. [...] Eu sou escritor e, seja grande ou pequeno, tenho direito a pleitear as recompensas que o Brasil dá aos que se distinguem na sua literatura.\n[...]\nEu não temo abaixo-assinados em matéria de Letras." },
    ok: ["Fala uma pessoa identificada, em 1ª pessoa, que defende um interesse próprio", "\"Sou candidato\", \"eu sou escritor\": a opinião é de um autor, não do veículo."],
    bad: [["O autor só relata fatos de modo neutro, sem tomar posição diante do assunto", "há opinião forte e defesa de uma causa própria; não é texto neutro."],
      ["Há um lide que responde a quem, o quê, quando e onde sobre um fato novo", "o lide é marca de notícia; o texto abre anunciando que será pessoal."],
      ["A voz é a do próprio jornal, em \"nós\" coletivo, e o texto sai sem assinatura", "o texto usa \"eu\" e é do autor identificado na fonte; o editorial usa voz coletiva e não é assinado."]],
    hint: { t: "Observe o sujeito dos verbos: quem fala, um grupo ou uma pessoa?", trecho: "Sou candidato à Academia de Letras" },
    destaque: "Eu sou escritor e, seja grande ou pequeno, tenho direito",
    why: "Autor identificado, em 1ª pessoa e com interesse próprio: autoria individual; o editorial é impessoal, coletivo e sem assinatura.",
    ref: `${PE("Editorial", "editorial")} | ${PE("Artigo de opinião", "artigo-opiniao")} | Texto-base conferido: https://pt.wikisource.org/wiki/A_minha_candidatura` }),

  mk({
    id: "noticia-biblioteca", lvl: 2, pos: 0,
    text: "O gênero do texto se reconhece porque ele…",
    base: { titulo: "Biblioteca municipal reabre nesta segunda após reforma", fonte: ORIG("notícia (nomes e dados fictícios)"),
      texto: "A Biblioteca Municipal de Vila Nova reabriu as portas nesta segunda-feira (3), depois de oito meses fechada para reforma. A obra, que custou R$ 1,2 milhão, ampliou o acervo e criou uma sala de estudos. O espaço funciona de segunda a sábado, das 8h às 18h, segundo a prefeitura." },
    ok: ["Relata um fato recente e responde, logo no início, a quem, o quê, quando e onde", "o primeiro parágrafo traz o lide e o texto segue impessoal e objetivo: é notícia."],
    bad: [["Aprofunda as causas do fechamento, com entrevistas e análise de especialistas", "isso seria reportagem; aqui não há entrevistas nem análise de causas."],
      ["Defende a tese de que a prefeitura deve investir mais em bibliotecas públicas", "isso seria editorial ou artigo; o texto não opina."],
      ["Comenta com lirismo a lembrança pessoal do autor com a antiga biblioteca", "isso seria crônica; não há 1ª pessoa nem memória."]],
    hint: { t: "Leia a primeira frase: ela já traz as informações essenciais?", trecho: "reabriu as portas nesta segunda-feira (3)" },
    destaque: "A Biblioteca Municipal de Vila Nova reabriu as portas nesta segunda-feira (3)",
    why: "Notícia informa fato atual de modo impessoal; o lide (quem, o quê, quando, onde) abre o texto, sem opinião nem grande aprofundamento.",
    ref: `${PE("Reportagem (compara com notícia)", "reportagem")} | ${TM}` }),

  mk({
    id: "reportagem-medicos", lvl: 3, pos: 2,
    text: "O que distingue o texto de uma simples notícia é que ele…",
    base: { titulo: "Por que faltam médicos no interior?", fonte: ORIG("reportagem (dados e nomes fictícios)"),
      texto: "Em 4 de cada 10 cidades pequenas, há menos de um médico para mil moradores, segundo levantamento do conselho da categoria. \"Plantão cansa e a estrada é longa\", diz a clínica geral Marta Reis, que atende em três municípios. Especialistas apontam salário baixo, falta de estrutura e de moradia como causas do problema." },
    ok: ["Investiga as causas de um problema, com dados, depoimento e voz de especialistas", "a reportagem aprofunda o tema: levantamento, depoimento e explicação das causas."],
    bad: [["Registra um fato isolado e recente, sem interpretar as causas nem ouvir ninguém", "isso descreve a notícia; aqui o assunto é um problema contínuo e suas causas."],
      ["Expressa a opinião oficial do jornal, sem citar fontes nem identificar autoria", "isso é editorial; o texto cita fontes e não toma posição."],
      ["Faz apelo direto ao leitor para agir, usando verbos no imperativo e slogan", "isso é campanha; não há imperativos nem pedido de ação."]],
    hint: { t: "Conte quantas fontes diferentes aparecem e o que cada uma acrescenta.", trecho: "Especialistas apontam salário baixo" },
    destaque: "Especialistas apontam salário baixo, falta de estrutura e de moradia como causas do problema",
    why: "Reportagem aprofunda um assunto: dados, falas de pessoas e especialistas e explicação de causas; a notícia só relata o fato recente.",
    ref: `${PE("Reportagem", "reportagem")}` }),

  mk({
    id: "editorial-calcada", lvl: 3, pos: 1,
    text: "O texto se caracteriza como editorial porque…",
    base: { titulo: "Calçada é lugar de gente", fonte: ORIG("editorial"),
      texto: "Este jornal considera inaceitável que as calçadas do Centro continuem tomadas por buracos e carros estacionados. Defendemos que a prefeitura fiscalize, conserve e puna quem as ocupa. Cadeirantes, idosos e crianças merecem andar com segurança. Cidade que não cuida da calçada não cuida das pessoas." },
    ok: ["O próprio jornal assume posição (\"Este jornal\", \"Defendemos\"), sem autor individual", "voz coletiva e impessoal sobre tema público é a marca do editorial."],
    bad: [["Um colunista assina e expõe sua opinião pessoal e subjetiva sobre o assunto", "seria artigo de opinião; aqui não há assinatura nem \"eu\"."],
      ["Informa um fato novo de modo neutro, com lide e sem qualquer opinião sobre ele", "seria notícia; o texto é todo opinativo."],
      ["Relata um episódio cotidiano em tom leve e com humor, a partir de uma cena", "seria crônica; o tom é argumentativo e sério."]],
    hint: { t: "Repare em quem é o sujeito de \"considera\" e \"defendemos\".", trecho: "Este jornal considera inaceitável" },
    destaque: "Este jornal considera inaceitável",
    why: "Editorial expressa a opinião do veículo: voz coletiva (\"nós\", \"este jornal\"), sem assinatura, argumentando sobre tema de interesse público.",
    ref: `${PE("Editorial", "editorial")} | ${PE("Artigo de opinião", "artigo-opiniao")}` }),

  mk({
    id: "carta-aberta-posto", lvl: 3, pos: 3,
    text: "O uso de \"Senhor prefeito\" e de \"carta pública\" revela que o texto se dirige a…",
    base: { titulo: "Posto de saúde fechado: moradores cobram", fonte: ORIG("carta aberta (nomes fictícios)"),
      texto: "Senhor prefeito,\nNós, moradores do bairro Boa Esperança, escrevemos para cobrar a reabertura do posto de saúde, fechado há seis meses. Sem atendimento, os idosos viajam duas horas até a cidade vizinha. Pedimos resposta em 30 dias e tornamos esta carta pública para que todos acompanhem.\nAssociação de Moradores" },
    ok: ["Uma autoridade, mas quer alcançar também a opinião pública da comunidade", "o vocativo mira o prefeito; \"carta pública\" amplia o alcance a toda a comunidade (carta aberta)."],
    bad: [["Apenas um amigo próximo, em tom íntimo, para trocar notícias pessoais", "seria carta pessoal; o assunto é coletivo e público."],
      ["Consumidores que devem contratar um serviço oferecido pela prefeitura", "seria anúncio; ninguém vende nada no texto."],
      ["Leitores de um jornal que comentam uma matéria publicada anteriormente", "seria carta do leitor; não há matéria citada e quem escreve é um grupo."]],
    hint: { t: "Há dois destinatários: um é nomeado; o outro, indicado no fim.", trecho: "tornamos esta carta pública" },
    destaque: "tornamos esta carta pública para que todos acompanhem",
    why: "Carta aberta cobra publicamente uma autoridade, em nome de um grupo, e quer ser lida por muitos; a carta do leitor comenta matéria do veículo.",
    ref: `${PE("Carta aberta", "carta-aberta")} | ${PE("Carta do leitor", "carta-leitor")}` }),

  mk({
    id: "campanha-sangue", lvl: 2, pos: 3,
    text: "A finalidade do texto é…",
    base: { titulo: "Doe sangue. Doe vida.", fonte: ORIG("campanha"),
      texto: "DOE SANGUE. DOE VIDA.\nUma doação leva só 30 minutos e pode ajudar até quatro pessoas. Procure o hemocentro mais próximo, leve um documento com foto e doe. Seu gesto faz falta.\nCampanha Doe Vida (peça fictícia)" },
    ok: ["Mobilizar o público para uma causa social, com slogan e verbos no imperativo", "slogan, imperativos (\"procure\", \"leve\", \"doe\") e apelo ao \"você\" pedem ação."],
    bad: [["Vender um produto, destacando preço, promoção e vantagens ao consumidor", "seria anúncio comercial; não há produto nem preço."],
      ["Informar um fato recente, de modo impessoal, sobre o estoque dos hemocentros", "seria notícia; o texto fala ao leitor e pede ação."],
      ["Avaliar criticamente o trabalho dos hemocentros do país, apontando falhas", "seria resenha ou crítica; não há avaliação."]],
    hint: { t: "Veja os verbos: o texto descreve algo ou manda o leitor fazer algo?", trecho: "Procure o hemocentro mais próximo" },
    destaque: "Procure o hemocentro mais próximo, leve um documento com foto e doe.",
    why: "Campanha de interesse social mobiliza o público: slogan, verbos no imperativo e apelo direto ao leitor, sem finalidade comercial.",
    src: "como no ENEM 2019 (campanha publicitária)",
    ref: `${TM} | Projeto Agatha, Elementos textuais e função social: https://projetoagathaedu.com.br/questoes-enem/resolucao-linguagens/elementos-textuais-e-funcao-social.php` }),

  mk({
    id: "resenha-farol", lvl: 2, pos: 1,
    text: "O texto vai além de um simples resumo porque ele…",
    base: { titulo: "\"O Farol Vazio\" tem fotografia bela e ritmo irregular", fonte: ORIG("resenha de filme (filme fictício)"),
      texto: "Em \"O Farol Vazio\", a diretora conta a história de uma faroleira que descobre um segredo familiar. O roteiro é enxuto e a fotografia valoriza o mar, mas o terceiro ato se arrasta e o final soa previsível. Vale pela atuação da protagonista, que sustenta o filme." },
    ok: ["Apresenta o enredo e também avalia a obra, apontando pontos fortes e fracos", "resenha = descrição da obra + julgamento fundamentado."],
    bad: [["Apenas reproduz a trama em ordem, sem fazer qualquer julgamento sobre o filme", "isso seria resumo; o texto avalia (\"se arrasta\", \"previsível\")."],
      ["Convence o leitor a comprar o ingresso, com imperativos, slogan e promoção", "seria anúncio; o texto também critica o filme."],
      ["Noticia a estreia do filme, com lide e números de bilheteria da semana", "seria notícia; não há dados de estreia nem lide."]],
    hint: { t: "Procure palavras que dão nota, bem ou mal, à obra.", trecho: "mas o terceiro ato se arrasta" },
    destaque: "o terceiro ato se arrasta e o final soa previsível",
    why: "A resenha crítica descreve a obra e a avalia, com pontos positivos e negativos; o resumo só condensa o conteúdo.",
    ref: `${PE("Resenha", "resenha")} | ${TM}` }),

  mk({
    id: "abaixo-assinado-escola", lvl: 3, pos: 2,
    text: "Um traço que identifica o gênero do texto é…",
    base: { titulo: "Pedido dos estudantes", fonte: ORIG("abaixo-assinado (escola fictícia)"),
      texto: "Nós, abaixo assinados, estudantes da Escola Estadual Barão do Sul, solicitamos à Secretaria de Educação a instalação de ventiladores nas salas, que passam de 35 graus no verão. Pedimos providências até o início do próximo semestre.\nAssinam:\n1. ____________\n2. ____________" },
    ok: ["Pedido formal de um grupo a uma autoridade, validado por nomes e assinaturas", "o destinatário, o pedido e a lista de assinaturas definem o gênero."],
    bad: [["Voz do jornal em \"nós\", sem assinatura, que opina sobre o problema público", "seria editorial; aqui um grupo identificado assina e pede algo."],
      ["Cobrança publicada para muitos leitores, em carta aberta sem lista de assinaturas", "seria carta aberta; aqui o pedido vai direto à secretaria, com nomes que o validam."],
      ["Comentário individual de um leitor sobre matéria já publicada no jornal", "seria carta do leitor; não há matéria, e quem pede é um grupo."]],
    hint: { t: "Olhe o fim do texto: o que acompanha o pedido?", trecho: "Assinam:" },
    destaque: "Nós, abaixo assinados, estudantes da Escola Estadual Barão do Sul, solicitamos",
    why: "Abaixo-assinado reivindica algo de uma autoridade em nome de um grupo, com pedido formal e lista de nomes e assinaturas que lhe dá força.",
    ref: `${TM} | Projeto Agatha, Elementos textuais e função social: https://projetoagathaedu.com.br/questoes-enem/resolucao-linguagens/elementos-textuais-e-funcao-social.php` }),

  mk({
    id: "carta-leitor-ciclovia", lvl: 2, pos: 1,
    text: "O gênero do texto se reconhece porque ele…",
    base: { titulo: "Cartas", fonte: ORIG("carta do leitor (nomes fictícios)"),
      texto: "Sobre a reportagem \"Ciclovias param no meio do caminho\" (edição de domingo), concordo que a obra está incompleta. Moro no bairro há dez anos e vejo ciclistas disputando espaço com ônibus. Espero que a prefeitura conclua o trecho.\nLuísa Prado, leitora" },
    ok: ["Traz a opinião de uma leitora, em texto curto, sobre matéria já publicada", "cita a reportagem do veículo e a assina: é a marca da carta do leitor."],
    bad: [["Reúne um grupo que cobra uma autoridade, em texto público e com prazo de resposta", "seria carta aberta; não há prazo, nem vocativo, e quem escreve é uma pessoa."],
      ["Expõe a posição oficial do jornal sobre o assunto, sem identificar quem escreve", "seria editorial; o texto é assinado e em 1ª pessoa."],
      ["Apura o tema com entrevistas, números e especialistas, como fazem os repórteres", "seria reportagem; o texto só dá a opinião de uma leitora."]],
    hint: { t: "Veja como o texto começa: a que ele está respondendo?", trecho: "Sobre a reportagem" },
    destaque: "Sobre a reportagem \"Ciclovias param no meio do caminho\" (edição de domingo), concordo",
    why: "A carta do leitor é um texto curto e assinado em que o leitor opina sobre matéria já publicada pelo próprio veículo.",
    ref: `${PE("Carta do leitor", "carta-leitor")} | ${PE("Carta aberta", "carta-aberta")}` }),
];

export const FIGS = {};
export const PATTERNS_USED = [3];
