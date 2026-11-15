// Funções da linguagem no formato ENEM (padrão 2): texto-base + função predominante e justificativa.
const TM = "Toda Matéria, Funções da linguagem: https://www.todamateria.com.br/funcoes-da-linguagem/";
const wiki = (t, u) => `${t}: ${u}`;
const ORIG = (g) => `Texto elaborado para o jogo, no formato de ${g}`;

// c = índice da certa; alts na ordem final; analise na mesma ordem das alts
const Q = (o) => ({
  id: "lin-enem-fun-" + o.id, subj: "linguagens", pat: 2, lvl: o.lvl, enem: true,
  text: o.text, base: o.base, fig: [],
  alts: o.alts.map((t) => ({ t })), correct: [o.c], analise: o.analise,
  hint: { t: o.hint, trecho: o.trecho }, destaque: o.destaque, why: o.why, src: o.src || "no estilo do ENEM", ref: o.ref,
});

export const QUESTIONS = [
  Q({
    id: "noticia-ciclovia", lvl: 2, text: "A função predominante se evidencia pelo(a)…",
    base: { titulo: "Prefeitura inaugura ciclovia", fonte: ORIG("notícia"), texto: "A nova ciclovia, de 12 km, liga o terminal de ônibus ao parque central e custou R$ 8 milhões, segundo a Secretaria de Obras. De acordo com a prefeitura, a pista deve receber cerca de 3 mil ciclistas por dia. A abertura ao público ocorre neste sábado, às 8h." },
    alts: ["convite direto ao leitor para que use a ciclovia na data da abertura","apresentação de medidas, custo e horário, em 3ª pessoa e com fontes citadas","tom de entusiasmo do jornalista, que valoriza a obra com adjetivos elogiosos","linguagem figurada que embeleza a notícia e chama atenção para a forma"],
    c: 1,
    analise: ["Errada: o texto só informa a data; não há imperativo nem vocativo que convoque o leitor (conativa).", "Certa: medidas, valores e horário em 3ª pessoa, citando fontes, informam sobre o assunto (referencial).", "Errada: não há 1ª pessoa, exclamação nem adjetivo avaliativo; a emotiva está ausente.", "Errada: a linguagem é denotativa e direta; não há figuras que valorizem a forma (poética)."],
    hint: "Veja de quem o texto fala: do emissor, do leitor ou do assunto?", trecho: "segundo a Secretaria de Obras", destaque: "custou R$ 8 milhões",
    why: "Referencial: foco no assunto, com dados, fontes e 3ª pessoa. Não há apelo, emoção ou jogo com a forma.",
    src: "como no ENEM 2018 (texto sobre aplicativo: função referencial em linguagem denotativa)",
    ref: TM + " | Notícia original, sem texto de terceiros.",
  }),
  Q({
    id: "meus-oito-anos", lvl: 2, text: "Como o foco é o sentimento de quem fala, a função predominante se evidencia pelo(a)…",
    base: { titulo: "Meus oito anos", fonte: "Casimiro de Abreu, As primaveras (1859), ortografia atualizada", texto: "Oh! que saudades que tenho\nDa aurora da minha vida,\nDa minha infância querida\nQue os anos não trazem mais!" },
    alts: ["relato neutro de fatos da infância, sem marcas de opinião ou de emoção","uso das rimas e da imagem “aurora da vida”, sem relação com o que o eu sente","exclamação e verbos em 1ª pessoa que revelam a saudade do eu lírico","uso do imperativo para pedir que o leitor também lembre a sua infância"],
    c: 2,
    analise: ["Errada: o tom é afetivo e pessoal; nada é descrito de forma neutra e impessoal (referencial).","Errada: rimas e metáfora existem e são traço secundário (poética), mas o enunciado pede o que revela o sentimento de quem fala.","Certa: “Oh!”, “tenho” e “minha” centram o texto no emissor, que expõe a saudade (emotiva). A poética é secundária.","Errada: não há imperativo nem vocativo; o leitor não é chamado a agir (conativa)."],
    hint: "Procure quem aparece no texto: o eu, o leitor ou um assunto externo?", trecho: "Oh! que saudades que tenho", destaque: "Oh! que saudades que tenho",
    why: "Emotiva: o foco é o sentimento do eu lírico (1ª pessoa, exclamação). A forma poética existe, mas é secundária.",
    ref: wiki("Conceito", "https://www.todamateria.com.br/funcoes-da-linguagem/") + " | Texto conferido em https://pt.wikisource.org/wiki/Meus_oito_anos",
  }),
  Q({
    id: "anuncio-colchao", lvl: 2, text: "A função predominante do anúncio se evidencia pelo(a)…",
    base: { titulo: "Seu sono merece mais", fonte: ORIG("anúncio publicitário"), texto: "Troque o colchão antes que a dor nas costas escolha por você. Visite a Colchões Luar do Sul, aproveite 30% de desconto até domingo e acorde outra pessoa." },
    alts: ["preço e desconto expostos de modo imparcial, sem tentar convencer ninguém","desabafo do emissor sobre as próprias noites mal dormidas, em 1ª pessoa","verbos no imperativo e “seu”, dirigidos ao consumidor para levá-lo a comprar","jogo de sons e imagens que faz do título um verso e valoriza a forma"],
    c: 2,
    analise: ["Errada: o desconto é argumento de venda, não dado neutro (referencial é traço secundário).","Errada: não há 1ª pessoa nem confissão de sentimentos de quem anuncia (emotiva).","Certa: “troque”, “visite”, “aproveite” e “acorde” miram o receptor para convencê-lo (conativa).","Errada: o título tem ritmo, mas serve à venda; a forma não é o foco (poética secundária)."],
    hint: "Observe a forma dos verbos e a quem eles se dirigem.", trecho: "Troque o colchão", destaque: "Visite a Colchões Luar do Sul",
    why: "Conativa: foco no receptor, com imperativos que o levam a agir (trocar, visitar, aproveitar).",
    ref: TM + " | Anúncio original, sem texto de terceiros.",
  }),
  Q({
    id: "app-audio", lvl: 2, text: "A função predominante se evidencia pelo(a)…",
    base: { titulo: "Conversa por chamada de voz", fonte: ORIG("conversa de aplicativo de mensagens"), texto: "— Oi, tá aí?\n— Tô! Tá me ouvindo? Seu áudio tá picotando.\n— E agora?\n— Agora foi. Pode falar, tô te ouvindo." },
    alts: ["descrição precisa do defeito do áudio, com dados sobre a falha técnica","troca de falas que verificam e confirmam se o canal está funcionando","explicação de palavras e expressões usadas pelos falantes na conversa","ordens que tentam convencer o outro a mudar de atitude durante a chamada"],
    c: 1,
    analise: ["Errada: o problema do áudio é só pretexto; as falas não descrevem a falha com dados (referencial).", "Certa: “tá aí?”, “tá me ouvindo?” e “tô te ouvindo” verificam se o contato funciona (fática).", "Errada: ninguém comenta palavras nem regras da língua (metalinguística).", "Errada: “pode falar” autoriza a fala, mas não visa convencer (conativa)."],
    hint: "Pergunte-se: há algum assunto sendo discutido ou só o contato?", trecho: "Tá me ouvindo?", destaque: "tô te ouvindo",
    why: "Fática: o foco é o canal. As falas abrem, testam e confirmam o contato; quase nada se informa.",
    ref: TM + " | Diálogo original, sem texto de terceiros.",
  }),
  Q({
    id: "ourives-bilac", lvl: 2, text: "A função predominante do trecho se evidencia pelo(a)…",
    base: { titulo: "Profissão de fé (trecho)", fonte: "Olavo Bilac, Profissão de fé (Poesias, 1888)", texto: "Invejo o ourives quando escrevo:\nImito o amor\nCom que ele, em ouro, o alto relevo\nFaz de uma flor." },
    alts: ["descrição objetiva do trabalho do ourives, sem relação com a escrita","comparação entre escrever e o ofício do ourives, com o poema falando do poema","convite ao leitor para que aprenda o ofício do ourives e escreva também","confissão da inveja que o poeta sente, em tom de desabafo pessoal"],
    c: 1,
    analise: ["Errada: o ourives é termo de comparação; o assunto é a escrita, não a ourivesaria (referencial).","Certa: o poeta trata do próprio fazer poético, explicado pela imagem do ourives (metalinguística).","Errada: não há imperativo nem vocativo dirigidos ao leitor (conativa).","Errada: a inveja é traço de 1ª pessoa, mas serve para tratar da arte de escrever (emotiva secundária)."],
    hint: "Qual é o verdadeiro assunto: o ourives ou o ato de escrever?", trecho: "Imito o amor", destaque: "quando escrevo",
    why: "Metalinguística: o poema fala do próprio fazer poético, comparado ao trabalho do ourives.",
    ref: TM + " | Texto conferido em https://pt.wikisource.org/wiki/Profissão_de_Fé",
  }),
  Q({
    id: "autopsicografia", lvl: 3, text: "A função predominante se evidencia pelo(a)…",
    base: { titulo: "Autopsicografia (trecho)", fonte: "Fernando Pessoa, Autopsicografia (1932)", texto: "O poeta é um fingidor.\nFinge tão completamente\nQue chega a fingir que é dor\nA dor que deveras sente." },
    alts: ["confissão de uma dor pessoal, em que o eu lírico fala de si mesmo","destaque dado a rimas e ritmo como marcas da poeticidade do texto","definição do poeta e do ato de criar, em poesia sobre a própria poesia","constatação, em tom neutro, de um fato sobre os escritores em geral"],
    c: 2,
    analise: ["Errada: a dor é tema da reflexão sobre o fingimento; o poeta não se confessa, ele explica a criação (emotiva).","Errada: rima e ritmo existem, mas servem à ideia; o foco do texto é o fazer poético (poética secundária).","Certa: o assunto é o poeta e a criação; a linguagem poética explica a poesia (metalinguística).","Errada: não há tom neutro nem dado verificável; a afirmação é uma tese lírica (referencial)."],
    hint: "Troque a pergunta “o que o poeta sente?” por “sobre o que o poema fala?”.", trecho: "O poeta é um fingidor", destaque: "O poeta é um fingidor",
    why: "Metalinguística: o poema tem a criação poética como assunto. Rima e dor aparecem, mas em segundo plano.",
    src: "como no ENEM 2021 PPL (poema que fala de si como linguagem)",
    ref: TM + " | Texto conferido em https://pt.wikisource.org/wiki/Autopsicografia",
  }),
  Q({
    id: "violoes-cruz", lvl: 3, text: "A função que privilegia a construção da mensagem se evidencia pelo(a)…",
    base: { titulo: "Violões que choram… (abertura)", fonte: "Cruz e Sousa, Faróis (1900)", texto: "Ah! plangentes violões dormentes, mornos,\nSoluços ao luar, choros ao vento..." },
    alts: ["interjeição “Ah!”, isolada no início, que expõe a emoção de quem fala","referência a um fato musical datado, tratado como informação objetiva","reflexão sobre o fazer poético e sobre a linguagem própria da música","repetição de sons e imagens como “soluços ao luar”, que valoriza a forma"],
    c: 3,
    analise: ["Errada: “Ah!” e a tristeza dos violões dão traço emotivo, mas secundário; o enunciado pede a construção da mensagem.","Errada: não há fato datado nem dado informativo; os adjetivos são figurados (referencial).","Errada: os violões são tema e imagem; o poema não fala da linguagem em si (metalinguística).","Certa: sons repetidos, ritmo e imagens (“choros ao vento”) põem a mensagem em evidência (poética)."],
    hint: "Compare a força de uma interjeição com a de todos os sons e imagens.", trecho: "Soluços ao luar, choros ao vento", destaque: "Soluços ao luar, choros ao vento",
    why: "Poética: ritmo, sonoridade e imagens valorizam a forma. O “Ah!” e o tom triste são traço emotivo secundário.",
    ref: TM + " | Verso conferido em https://pt.wikisource.org/wiki/Violões_que_choram...",
  }),
  Q({
    id: "campanha-vacina", lvl: 3, text: "A função predominante se evidencia pelo(a)…",
    base: { titulo: "Campanha de vacinação", fonte: ORIG("campanha publicitária (dados fictícios)"), texto: "Segundo especialistas, a cobertura vacinal infantil caiu e doenças já controladas podem voltar. Não espere: leve seu filho ao posto de saúde, atualize a caderneta e proteja quem você ama." },
    alts: ["informação sobre a queda da cobertura vacinal, que abre o texto","imperativos e “você” dirigidos ao leitor, com a informação como motivo","referência afetiva a “quem você ama”, que expõe os sentimentos do emissor","citação de “especialistas”, que dá voz a uma fonte e afasta o emissor"],
    c: 1,
    analise: ["Errada: o dado inicial é traço secundário; serve de argumento para o apelo final (referencial).","Certa: “leve”, “atualize”, “proteja” e “você” miram o receptor, e o dado é motivo para agir (conativa).","Errada: “quem você ama” é recurso de persuasão ao leitor, não confissão do emissor (emotiva).","Errada: citar especialistas apoia a informação, mas o texto termina em ordens ao leitor (referencial)."],
    hint: "Descubra qual parte do texto manda o leitor fazer algo.", trecho: "leve seu filho ao posto de saúde", destaque: "atualize a caderneta",
    why: "Conativa: o dado inicial só justifica o apelo. Imperativos e “você” mostram o foco no receptor.",
    ref: TM + " | Campanha original, sem texto de terceiros.",
  }),
  Q({
    id: "tabacaria", lvl: 3, text: "A função predominante se evidencia pelo(a)…",
    base: { titulo: "Tabacaria (abertura)", fonte: "Álvaro de Campos (Fernando Pessoa), Tabacaria (escrito em 1928)", texto: "Não sou nada.\nNunca serei nada.\nNão posso querer ser nada.\nÀ parte isso, tenho em mim todos os sonhos do mundo." },
    alts: ["constatação de fatos sobre si, como dados objetivos de um relatório","exposição, em 1ª pessoa, da visão que o sujeito tem de si e dos sonhos","repetição de “nada”, que vale mais pelo som e pela forma que pelo sentido","frases curtas em tom de ordem, que tentam convencer um interlocutor"],
    c: 1,
    analise: ["Errada: o tom é de constatação, mas os verbos em 1ª pessoa expressam uma vivência pessoal, não um fato verificável (referencial).", "Certa: “sou”, “serei”, “posso” e “tenho” mostram o emissor revelando a si mesmo e o que sente (emotiva).", "Errada: a repetição é recurso expressivo, secundário diante do foco no eu que fala (poética tomada como predominante).", "Errada: as frases curtas são afirmações, não imperativos; não há interlocutor a convencer (conativa)."],
    hint: "Observe quem é o sujeito e o assunto dos verbos.", trecho: "tenho em mim todos os sonhos do mundo", destaque: "Não sou nada.",
    why: "Emotiva: o eu fala de si, em 1ª pessoa. O tom de constatação e a repetição são traços secundários.",
    ref: TM + " | Texto conferido em https://pt.wikisource.org/wiki/Tabacaria",
  }),
  Q({
    id: "verbete-saudade", lvl: 3, text: "A função predominante do texto se evidencia pelo(a)…",
    base: { titulo: "Verbete", fonte: ORIG("verbete de dicionário"), texto: "saudade s.f. 1. Sentimento de falta de alguém ou de algo distante. 2. Lembrança nostálgica de um tempo vivido. Ex.: A saudade é um pedaço de casa que a gente leva no peito." },
    alts: ["explicação do sentido de uma palavra, com exemplo de uso","saudade pessoal de quem escreve o verbete, dita em 1ª pessoa","metáfora do exemplo, que torna o texto poético e valoriza a forma","informação sobre a história do sentimento, em tom científico"],
    c: 0,
    analise: ["Certa: acepções numeradas e exemplo de uso explicam a palavra “saudade” (metalinguística).","Errada: não há 1ª pessoa nem confissão; o verbete não revela sentimentos de quem o escreve (emotiva).","Errada: a metáfora do exemplo é traço secundário; o texto continua sendo definição (poética).","Errada: não se informa a história do sentimento; o texto explica o termo, não o fenômeno (referencial)."],
    hint: "Veja o que o texto explica: um fato do mundo ou uma palavra?", trecho: "Sentimento de falta de alguém ou de algo distante", destaque: "saudade s.f.",
    why: "Metalinguística: o verbete usa a língua para explicar uma palavra. A metáfora do exemplo é só um adorno.",
    ref: TM + " | Verbete original, sem texto de terceiros.",
  }),
];
export const FIGS = {};
export const PATTERNS_USED = [2];
