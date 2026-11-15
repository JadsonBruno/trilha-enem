// Figuras de linguagem no formato do ENEM (padrão 1): 13 perguntas com texto-base de domínio público (7 médias, 6 difíceis).
// Cada texto foi aberto na Wikisource (pt) e conferido; grafia atualizada. Conceito: Toda Matéria e PreparaEnem (abertos).
const TM = "Toda Matéria, Figuras de linguagem: https://www.todamateria.com.br/figuras-de-linguagem/";
const PE = "PreparaEnem, Figuras de linguagem no Enem: https://www.preparaenem.com/enem/figuras-de-linguagem-no-enem.htm";
const WS = "https://pt.wikisource.org/wiki/";

// mk: `alts` na ordem da tela; `ok` = índice da certa; `an` na mesma ordem das alts.
function mk(o) {
  const { ok, alts, an, ...r } = o;
  return { subj: "linguagens", pat: 1, enem: true, ...r, alts: alts.map((t) => ({ t })), correct: [ok], analise: an.map((x, i) => `${"ABCD"[i]}) ${x}`) };
}

export const QUESTIONS = [
  mk({
    id: "lin-enem-fig-ironia-joalheiros", lvl: 2, ok: 2,
    text: "No trecho, dizer que os joalheiros são 'muito vistos na gramática' produz o efeito de…",
    base: {
      texto: "Cuido haver dito, no capítulo XIV, que Marcela morria de amores pelo Xavier. Não morria, vivia. Viver não é a mesma coisa que morrer; assim o afirmam todos os joalheiros deste mundo, gente muito vista na gramática. Bons joalheiros, que seria do amor se não fossem os vossos dixes e fiados? Um terço ou um quinto do universal comércio dos corações.",
      fonte: "Machado de Assis, Memórias Póstumas de Brás Cubas (1881), cap. XVI",
    },
    alts: [
      "Crítica à ignorância dos joalheiros, que errariam a gramática",
      "Elogio sincero à cultura dos comerciantes da época do narrador",
      "Finge elogiar os joalheiros para sugerir que o amor se compra com joias",
      "Lamento pela morte de Marcela, que não resistiu ao amor",
    ],
    an: [
      "Errada. O texto não fala de erros de gramática; a 'gramática' é pretexto para o gracejo sobre 'viver' e 'morrer'.",
      "Errada. O elogio não é sincero; 'dixes e fiados' e 'comércio dos corações' mostram que há zombaria.",
      "Certa. O narrador diz o contrário do que pensa: os joalheiros só 'sabem' do amor que se compra. É ironia.",
      "Errada. O narrador corrige 'morria de amores' para 'vivia'; ninguém morre nem é lamentado no trecho.",
    ],
    hint: { t: "Pergunte-se se o narrador diz isso a sério. Veja de que o texto fala logo depois: dixes, fiados, comércio.", trecho: "gente muito vista na gramática" },
    destaque: "gente muito vista na gramática",
    why: "Ironia: o narrador diz o contrário do que pensa para criticar. O 'saber' dos joalheiros é só o do comércio do amor.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Memórias_Póstumas_de_Brás_Cubas/XVI (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-metafora-pantera", lvl: 2, ok: 0,
    text: "Chamar a Ingratidão de 'pantera' produz, no poema, o efeito de…",
    base: {
      texto: "Somente a Ingratidão — esta pantera —\nFoi tua companheira inseparável!\nAcostuma-te à lama que te espera!\nO Homem, que, nesta terra miserável,\nMora entre feras, sente inevitável\nNecessidade de também ser fera.",
      fonte: "Augusto dos Anjos, Versos íntimos, in Eu (1912)",
    },
    alts: [
      "Apresentar a ingratidão como fera cruel que acompanha o sujeito sem trégua",
      "Mostrar que o sujeito se sente protegido pela ingratidão, como por um guardião",
      "Sugerir que a ingratidão é veloz e elegante, qualidades que o sujeito admira",
      "Indicar que a ingratidão ataca só os fracos, poupando quem aceita a lama",
    ],
    an: [
      "Certa. A ingratidão É uma pantera (sem 'como'): fera que persegue, o que combina com 'lama', 'feras' e 'ser fera'.",
      "Errada. 'Companheira inseparável' é amarga: a presença da fera é castigo, não proteção.",
      "Errada. O poema não elogia o animal; a imagem é de ameaça, não de elegância.",
      "Errada. Extrapola: o texto não diz que a ingratidão poupa alguém; 'acostuma-te à lama' é conselho de endurecer-se.",
    ],
    hint: { t: "Olhe o que é igualado a quê, e que outras palavras do trecho pertencem ao mundo dos bichos.", trecho: "a Ingratidão — esta pantera —" },
    destaque: "a Ingratidão — esta pantera —",
    why: "Metáfora: iguala um sentimento a uma fera sem 'como'. A ingratidão aparece como ameaça cruel que persegue o sujeito.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Eu_(Augusto_dos_Anjos,_1912)/Versos_intimos (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-comparacao-floresta", lvl: 2, ok: 3,
    text: "A comparação com a floresta sugere que o coração da mulher amada era…",
    base: {
      texto: "Como a floresta secular, sombria,\nVirgem do passo humano e do machado,\nOnde apenas, horrendo, ecoa o brado\nDo tigre, e cuja agreste ramaria\nNão atravessa nunca a luz do dia,\nAssim também, da luz do amor privado,\nTinhas o coração ermo e fechado,\nComo a floresta secular, sombria...",
      fonte: "Olavo Bilac, Via Láctea, IV, in Poesias (1888)",
    },
    alts: [
      "Coração exuberante e acolhedor, cheio de vida como uma mata em festa",
      "Coração antigo e respeitável, valorizado pela idade como árvore secular",
      "Coração perigoso, que guarda feras e ameaça quem dele se aproximar",
      "Coração fechado e sem luz, isolado como mata que ninguém atravessa",
    ],
    an: [
      "Errada. A mata descrita é sombria e sem passos humanos; nada nela é festa ou acolhimento.",
      "Errada. 'Secular' descreve a mata, mas a comparação trata de solidão e escuridão, não de respeito pela idade.",
      "Errada. O 'tigre' compõe o cenário da mata; o texto não diz que o coração ameaça quem se aproxima (extrapolação).",
      "Certa. 'Assim também' liga a mata sem luz e sem passo humano ao coração 'ermo e fechado', privado da luz do amor.",
    ],
    hint: { t: "Procure o conectivo que liga os dois termos. Depois liste o que a floresta é (luz, passos, sons) e transfira ao coração.", trecho: "Assim também" },
    destaque: "Assim também",
    why: "Comparação ('como… assim também'): o coração é tão fechado e sem luz quanto a mata virgem e sombria.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Via_Láctea (Domínio Público). No 7º verso a Wikisource traz 'ermo o fechado', erro de transcrição; corrigido para 'ermo e fechado'. ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-hiperbole-quaresma", lvl: 2, ok: 1,
    text: "Ao comparar a chegada do major a um eclipse, o narrador produz o efeito de…",
    base: {
      texto: "Não gastava nesses passos nem mesmo uma hora, de forma que, às três e quarenta, por aí assim, tomava o bonde, sem erro de um minuto, ia pisar a soleira da porta de sua casa, numa rua afastada de São Januário, bem exatamente às quatro e quinze, como se fosse a aparição de um astro, um eclipse, enfim um fenômeno matematicamente determinado, previsto e predito.",
      fonte: "Lima Barreto, Triste Fim de Policarpo Quaresma (1915), cap. I",
    },
    alts: [
      "Valorizar o conhecimento de astronomia do major, comparável ao de um cientista",
      "Sugerir, em tom de gozação, uma rotina tão rígida que parece fenômeno natural",
      "Indicar que o major dominava os astros e determinava o horário do bonde",
      "Criticar o bonde, tão pontual que desorganizava a rotina da vizinhança",
    ],
    an: [
      "Errada. O tom é de gozação; o texto não valoriza ciência nenhuma, brinca com a mania de horário do major.",
      "Certa. Chegar em casa é tratado como evento astronômico 'previsto e predito': exagero proposital que faz rir da rotina.",
      "Errada. O eclipse é só termo de exagero; ninguém atribui poderes ao major (extrapolação).",
      "Errada. O bonde é pontual, 'sem erro de um minuto', mas não há crítica a ele nem desorganização da vizinhança.",
    ],
    hint: { t: "Compare a dimensão do fato (chegar em casa) com a dimensão da imagem escolhida para descrevê-lo. O tom é sério ou de gozação?", trecho: "a aparição de um astro, um eclipse" },
    destaque: "a aparição de um astro, um eclipse",
    why: "Hipérbole: tratar a chegada em casa como fenômeno astronômico exagera de propósito e ridiculariza a rotina rígida do major.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Triste_Fim_de_Policarpo_Quaresma/I/I (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-personificacao-cortico", lvl: 2, ok: 2,
    text: "No trecho, o verbo 'acordava', aplicado ao cortiço, produz o efeito de…",
    base: {
      texto: "Eram cinco horas da manhã e o cortiço acordava, abrindo, não os olhos, mas a sua infinidade de portas e janelas alinhadas.\nUm acordar alegre e farto de quem dormiu de uma assentada sete horas de chumbo.",
      fonte: "Aluísio Azevedo, O Cortiço (1890), cap. III",
    },
    alts: [
      "Mostrar o cortiço vazio e silencioso de manhã, como se ainda dormisse",
      "Destacar a quantidade enorme de moradias para impressionar o leitor",
      "Fazer do conjunto de casas um ser vivo e coletivo que desperta",
      "Suavizar a miséria do lugar, que passa a parecer acolhedor e calmo",
    ],
    an: [
      "Errada. O despertar é 'alegre e farto'; o texto descreve movimento, não vazio nem silêncio.",
      "Errada. 'Infinidade' é descrição, mas o recurso do trecho está no verbo e nos 'olhos', que dão vida ao conjunto de casas.",
      "Certa. 'Acordava', 'olhos' e 'dormiu' são traços humanos: o cortiço age como um só organismo vivo.",
      "Errada. O narrador não suaviza a miséria nesse trecho; o recurso é atribuir ações humanas a um lugar.",
    ],
    hint: { t: "Veja quem pratica a ação 'acordar' e se normalmente um conjunto de casas faria isso. Note também a menção aos 'olhos'.", trecho: "o cortiço acordava" },
    destaque: "o cortiço acordava",
    why: "Personificação: acordar e ter olhos são traços humanos; o cortiço vira um ser vivo e coletivo, tema do Naturalismo.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}O_Cortiço/III (Domínio Público; grafia atualizada). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-anafora-nosso", lvl: 2, ok: 3,
    text: "No trecho, a repetição de 'Nosso/Nossas/Nossos/Nossa' no início dos versos contribui para…",
    base: {
      texto: "Minha terra tem palmeiras,\nOnde canta o Sabiá;\nAs aves, que aqui gorjeiam,\nNão gorjeiam como lá.\nNosso céu tem mais estrelas,\nNossas várzeas têm mais flores,\nNossos bosques têm mais vida,\nNossa vida mais amores.",
      fonte: "Gonçalves Dias, Canção do Exílio, in Primeiros Cantos (1846)",
    },
    alts: [
      "Mostrar a ligação do eu lírico com a terra onde está agora",
      "Marcar a rima entre os versos e dar musicalidade, sem relação com o tema",
      "Contrapor o grupo do eu lírico a outro grupo de moradores",
      "Reforçar, em ritmo marcado, o orgulho e a posse afetiva da terra natal",
    ],
    an: [
      "Errada. O eu lírico está longe ('aqui' × 'lá'); a ligação é com a terra que deixou, não com a de agora.",
      "Errada. A repetição está no começo dos versos, não na rima, e reforça o sentido: enumera o que a pátria tem de melhor.",
      "Errada. 'Nosso' fala da terra natal; não há outro grupo de moradores sendo contraposto no trecho.",
      "Certa. A anáfora de 'nosso' abre cada verso da enumeração das vantagens da pátria e marca a identificação com ela.",
    ],
    hint: { t: "Observe a posição da palavra repetida em cada verso e o que vem depois dela. O que o conjunto desses versos enumera?", trecho: "Nosso céu tem mais estrelas,\nNossas várzeas têm mais flores,\nNossos bosques têm mais vida,\nNossa vida mais amores." },
    destaque: "Nosso céu tem mais estrelas,\nNossas várzeas têm mais flores,\nNossos bosques têm mais vida,\nNossa vida mais amores.",
    why: "Anáfora: repetir 'nosso' no início dos versos enumera as qualidades da pátria e reforça orgulho e saudade do eu lírico.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Canção_do_Exílio_(Gonçalves_Dias) (Domínio Público; grafia atualizada). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-refrao-morresse", lvl: 2, ok: 2,
    text: "A repetição de 'Se eu morresse amanhã' ao final das estrofes contribui para…",
    base: {
      texto: "Se eu morresse amanhã, viria ao menos\nFechar meus olhos minha triste irmã;\nMinha mãe de saudades morreria,\nSe eu morresse amanhã!\nQuanta glória presinto em meu futuro!\nQue aurora de porvir e que manhã\nEu perdera chorando essas coroas,\nSe eu morresse amanhã!",
      fonte: "Álvares de Azevedo, Se eu morresse amanhã (Obras, 1862)",
    },
    alts: [
      "Mostrar tranquilidade diante da morte, que o eu lírico aceita sem medo nem pesar",
      "Dar leveza ao poema, tratando a morte como brincadeira do eu lírico",
      "Fixar a ideia obsessiva da morte precoce, que interromperia afetos e sonhos",
      "Indicar que o eu lírico despreza a glória e a família que deixaria",
    ],
    an: [
      "Errada. É uma hipótese carregada de angústia ('mãe de saudades morreria'); não há serenidade nem aceitação.",
      "Errada. Nada no trecho é cômico; a morte aparece como perda de mãe, irmã e futuro.",
      "Certa. O verso-refrão volta ao fim de cada estrofe como pensamento fixo e fecha cada perda possível com a mesma ideia.",
      "Errada. O eu lírico lamenta perder a glória ('perdera chorando essas coroas'); não a despreza.",
    ],
    hint: { t: "Veja onde o mesmo verso reaparece e o que vem imediatamente antes dele em cada estrofe.", trecho: "Se eu morresse amanhã!" },
    destaque: "Se eu morresse amanhã!",
    why: "Repetição em refrão no fim das estrofes: toda perda imaginada termina na mesma hipótese e dá ao poema um tom obsessivo.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Se_eu_morresse_amanhã (Domínio Público; grafia atualizada). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-metonimia-armas", lvl: 3, ok: 0,
    text: "No primeiro verso, a palavra 'armas' é usada de modo a…",
    base: {
      texto: "As armas e os barões assinalados,\nQue da ocidental praia Lusitana,\nPor mares nunca de antes navegados,\nPassaram ainda além da Taprobana,\nEm perigos e guerras esforçados,\nMais do que prometia a força humana,\nE entre gente remota edificaram\nNovo Reino, que tanto sublimaram;",
      fonte: "Luís Vaz de Camões, Os Lusíadas (1572), Canto I, estrofe 1",
    },
    alts: [
      "Pôr o objeto no lugar da atividade, resumindo os feitos de guerra em imagem concreta",
      "Informar, ao pé da letra, que as naus partiram carregadas apenas de armamentos para a viagem",
      "Comparar os portugueses a armas, destacando a dureza e a frieza dos navegantes",
      "Exagerar o poderio militar de Portugal para ironizar a conquista dos mares",
    ],
    an: [
      "Certa. 'Armas' (o objeto) está no lugar da vida militar e dos feitos de guerra; o par 'armas e barões' resume os heróis do poema.",
      "Errada. Leitura literal: o verso anuncia façanhas, e não a carga das naus.",
      "Errada. Não há comparação: 'armas' não é aproximada dos navegantes, apenas representa as guerras que enfrentaram.",
      "Errada. O tom da abertura é épico e elogioso; não há ironia nem exagero zombeteiro.",
    ],
    hint: { t: "O que o poema anuncia que vai cantar? Que palavra aparece no lugar disso?", trecho: "As armas e os barões assinalados" },
    destaque: "As armas e os barões assinalados",
    why: "Metonímia: o objeto (armas) está no lugar da atividade (guerra, feitos militares); alguns manuais falam em sinédoque.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Os_Lusíadas_(grafia_atualizada)/I (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-antitese-bahia", lvl: 3, ok: 3,
    text: "Nesses versos, a oposição entre 'pobre' e 'rica' produz o efeito de…",
    base: {
      texto: "Triste Bahia! Oh quão dessemelhante\nEstás, e estou do nosso antigo estado!\nPobre te vejo a ti, tu a mi empenhado,\nRica te vejo eu já, tu a mi abundante.\nA ti tocou-te a máquina mercante,\nQue em tua larga barra tem entrado,\nA mim foi-me trocando, e tem trocado\nTanto negócio, e tanto negociante.",
      fonte: "Gregório de Matos, Triste Bahia! Oh quão dessemelhante (séc. XVII)",
    },
    alts: [
      "Mostrar que a Bahia é, ao mesmo tempo, rica e pobre, numa contradição sem solução",
      "Exagerar a miséria da cidade para provocar riso no leitor e criticar o povo",
      "Atenuar a decadência da Bahia, apresentada como passageira e sem importância",
      "Contrapor riqueza e pobreza de antes e de agora para lamentar a decadência",
    ],
    an: [
      "Errada. Pobre e rica não valem para o mesmo momento: o poeta compara dois tempos (o 'antigo estado' e o agora).",
      "Errada. O tom é de queixa e tristeza ('Triste Bahia!'), sem riso nem exagero cômico.",
      "Errada. Não há atenuação: o poeta lamenta a mudança e culpa a 'máquina mercante' e os negociantes.",
      "Certa. Palavras de sentido oposto (pobre × rica, empenhado × abundante) contrastam o antes e o agora e sustentam o lamento.",
    ],
    hint: { t: "Observe os adjetivos postos lado a lado e o tempo a que cada um se refere ('antigo estado', 'já').", trecho: "Pobre te vejo a ti, tu a mi empenhado,\nRica te vejo eu já, tu a mi abundante." },
    destaque: "Pobre te vejo a ti, tu a mi empenhado,\nRica te vejo eu já, tu a mi abundante.",
    why: "Antítese: termos opostos (pobre × rica) contrastam o passado e o presente e sustentam o lamento pela decadência.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Triste_Bahia!_Oh_quão_dessemelhante (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-paradoxo-amor", lvl: 3, ok: 2,
    text: "Na definição do amor, a expressão 'contentamento descontente' produz o efeito de…",
    base: {
      texto: "Amor é fogo que arde sem se ver;\nÉ ferida que dói e não se sente;\nÉ um contentamento descontente;\nÉ dor que desatina sem doer;",
      fonte: "Luís Vaz de Camões, Amor é fogo que arde sem se ver (séc. XVI)",
    },
    alts: [
      "Mostrar que o amor é motivo de pura alegria, sem sofrimento algum",
      "Ironizar quem diz estar contente, pois o amor só traz tédio",
      "Mostrar que o amor reúne sensações opostas e só se explica pela contradição",
      "Listar sentimentos diferentes em ordem crescente, do mais fraco ao mais forte",
    ],
    an: [
      "Errada. Os versos falam de fogo, ferida e dor; o amor ali é sofrimento e prazer juntos, não alegria pura.",
      "Errada. Não há zombaria de ninguém; o poeta define o amor, e não o tédio.",
      "Certa. 'Contentamento descontente' une ideias que se negam, como 'dor sem doer': paradoxo que traduz o amor contraditório.",
      "Errada. Os versos não formam escala de intensidade; cada um é uma definição à parte, de sentido contraditório.",
    ],
    hint: { t: "Releia a expressão e pergunte-se se as duas palavras combinam ou se chocam. Depois compare com 'dor que desatina sem doer'.", trecho: "contentamento descontente" },
    destaque: "contentamento descontente",
    why: "Paradoxo: ideias que se contradizem ('contentamento descontente', 'dor sem doer') expressam um amor feito de opostos.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Amor_he_hum_fogo_que_arde_sem_se_ver (Domínio Público; grafia atualizada). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-sinestesia-harmonia", lvl: 3, ok: 1,
    text: "No trecho, a expressão 'doce harmonia' contribui para…",
    base: {
      texto: "Oh! que doce harmonia traz-me a brisa!\nQue música suave ao longe soa!\nMeu Deus! como é sublime um canto ardente\nPelas vagas sem fim boiando à toa!",
      fonte: "Castro Alves, O Navio Negreiro (1869), parte I",
    },
    alts: [
      "Marcar o contraste entre a doçura da música e a dureza do mar revolto",
      "Fazer a música da brisa parecer tão agradável que quase se saboreia",
      "Mostrar que a brisa canta como uma pessoa para o poeta, que a escuta",
      "Comparar a música ao sabor de um doce, por meio de um conectivo",
    ],
    an: [
      "Errada. 'Doce' e 'música suave' combinam; o trecho fala de encanto, e não de choque com um mar revolto.",
      "Certa. 'Doce' (paladar) qualifica 'harmonia' (audição): sinestesia que torna a música trazida pela brisa deliciosa.",
      "Errada. A brisa 'traz' o som, mas ela não canta nem age como pessoa; o recurso está na mistura de sentidos.",
      "Errada. Não há comparação: o único 'como' do trecho, no 3º verso, introduz uma exclamação ('como é sublime').",
    ],
    hint: { t: "Procure adjetivos que normalmente pertencem a um sentido (gosto, tato) mas qualificam algo de outro (o som).", trecho: "doce harmonia" },
    destaque: "doce harmonia",
    why: "Sinestesia: 'doce' (paladar) com 'harmonia' (audição) dá à música trazida pela brisa um encanto sensorial intenso.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}O_Navio_Negreiro (Domínio Público). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-aliteracao-sussurro", lvl: 3, ok: 0,
    text: "No trecho, a repetição de certos sons consonantais contribui para…",
    base: {
      texto: "E sons soturnos, suspiradas mágoas,\nMágoas amargas e melancolias,\nNo sussurro monótono das águas,\nNoturnamente, entre ramagens frias.",
      fonte: "Cruz e Sousa, Violões que choram, in Faróis (1900)",
    },
    alts: [
      "Sugerir, pelo som, o sussurro das águas e o clima de lamento da noite",
      "Marcar a violência da noite, com sons ásperos e secos que lembram golpes de faca",
      "Dar ritmo de festa aos versos, com sons vivos que lembram dança",
      "Mostrar o silêncio total da noite, sem qualquer som vindo das águas",
    ],
    an: [
      "Certa. A aliteração do /s/ (sons, soturnos, suspiradas, sussurro) imita o sussurro e reforça o clima de mágoa e melancolia.",
      "Errada. Os sons repetidos são suaves, e as palavras falam de suspiro e melancolia, não de violência.",
      "Errada. O tom é de lamento ('mágoas amargas'), sem qualquer ideia de festa ou dança.",
      "Errada. Há som: o 'sussurro monótono das águas'; o texto não descreve silêncio total.",
    ],
    hint: { t: "Leia os versos em voz alta e note o som que mais se repete. Depois ligue esse som à palavra 'sussurro'.", trecho: "No sussurro monótono das águas" },
    destaque: "No sussurro monótono das águas",
    why: "Aliteração: o /s/ repetido imita o sussurro das águas e acompanha o lamento do poema; o som reforça o sentido.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Violões_Que_Choram... (Domínio Público; grafia atualizada). ${PE}.`,
  }),
  mk({
    id: "lin-enem-fig-gradacao-vulto", lvl: 3, ok: 3,
    text: "A sequência de verbos 'Tropeça, cai, soluça, arqueja, grita' produz o efeito de…",
    base: {
      texto: "Hoje, quero, em teus braços acolhido,\nRever a estrada pavorosa e escura\nOnde, ladeando o abismo da loucura,\nAndei de pesadelos perseguido.\nOlha-a: torce-se toda na infinita\nVolta dos sete círculos do inferno...\nE nota aquele vulto: as mãos eleva,\nTropeça, cai, soluça, arqueja, grita,\nBuscando um coração que foge, e eterno\nOuvindo-o perto palpitar na treva.",
      fonte: "Olavo Bilac, Via Láctea, II, in Poesias (1888)",
    },
    alts: [
      "Mostrar a calma do vulto, que caminha sem pressa e sem dor pela estrada escura",
      "Repetir a mesma ideia de queda para fixá-la na memória do leitor",
      "Opor movimentos de queda a gestos de descanso do vulto na estrada",
      "Acumular ações que vão intensificando o sofrimento do vulto até o grito",
    ],
    an: [
      "Errada. Os verbos (tropeça, cai, soluça, arqueja) mostram aflição, e não calma.",
      "Errada. Cada verbo traz uma ação diferente; a sequência avança, e não repete a ideia de queda.",
      "Errada. Nenhum verbo expressa descanso; todos descrevem dor e esforço.",
      "Certa. Os verbos vão do tropeço ao grito, em escala crescente de sofrimento: gradação.",
    ],
    hint: { t: "Compare a força de cada verbo da sequência, na ordem em que aparecem. Em que ponto a dor se torna som?", trecho: "Tropeça, cai, soluça, arqueja, grita," },
    destaque: "Tropeça, cai, soluça, arqueja, grita,",
    why: "Gradação: dos verbos mais leves (tropeça) ao grito, a sequência intensifica o sofrimento do vulto passo a passo.",
    src: "no estilo do ENEM",
    ref: `${TM}. Texto-base conferido em ${WS}Via_Láctea (Domínio Público). ${PE}.`,
  }),
];

export const FIGS = {};
export const PATTERNS_USED = [1];
