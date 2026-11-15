// Tabelas de fatos próprias da unidade "Leitura no estilo ENEM": armadilhas de alternativa, efeitos, intenções e passos de leitura.
// Mesmo formato das tabelas do Show (id, nome, def, marca, exemplo, ref, confunde), para poder usar perguntaDeTabela/checkTabela.
// Fontes abertas CONSULTADAS nesta sessão (WebFetch):
//  - Estuda.com, Dicas de interpretação de texto: https://estuda.com/dicas-de-interpretacao-de-texto/  (intenção do autor: informar, convencer, criticar, emocionar;
//    isolar o comando antes das alternativas; extrapolação = inferência sem base no texto; não entender o comando)
//  - Guia da Carreira, Como eliminar alternativas no Enem: https://www.guiadacarreira.com.br/blog/como-eliminar-alternativas-no-enem  (ler o comando primeiro;
//    palavras absolutas indicam generalização, mas nem sempre são erro; fuga do texto; informação não demonstrada; um erro basta para cortar)
//  - PreparaEnem, Figuras de linguagem no Enem: https://www.preparaenem.com/enem/figuras-de-linguagem-no-enem.htm  (o ENEM avalia o efeito gerado: crítica, contraste, intensificação; e por que o autor usou o recurso)
//  - Toda Matéria, Figuras de linguagem: https://www.todamateria.com.br/figuras-de-linguagem/
// Os nomes das 5 armadilhas seguem o uso comum dessas fontes; a separação em 5 tipos é a deste app (convenção didática, não termo oficial do Inep).
export const REF_LEITURA = "Estuda.com, Dicas de interpretação de texto: https://estuda.com/dicas-de-interpretacao-de-texto/ | Guia da Carreira, Como eliminar alternativas no Enem: https://www.guiadacarreira.com.br/blog/como-eliminar-alternativas-no-enem";
const REF_EFEITO = "PreparaEnem, Figuras de linguagem no Enem: https://www.preparaenem.com/enem/figuras-de-linguagem-no-enem.htm | Toda Matéria, Figuras de linguagem: https://www.todamateria.com.br/figuras-de-linguagem/";
const REF_INTENCAO = "Estuda.com, Dicas de interpretação de texto: https://estuda.com/dicas-de-interpretacao-de-texto/ | Toda Matéria, Gêneros textuais: https://www.todamateria.com.br/generos-textuais/";
const FONTE_JOGO = "Texto elaborado para o jogo, no formato de crônica";

// ---------- armadilhas de alternativa (5) ----------
// `confunde` aqui = só as armadilhas que SEGURAMENTE não se aplicam à alternativa-exemplo do alvo (serve de distratora e de "falsa" no V/F).
// extrapolação × generalização podem coexistir numa mesma alternativa: por isso nunca aparecem como distratoras uma da outra.
export const ARMADILHAS = [
  { id: "extrapolacao", nome: "Extrapolação", def: "Conclui fato ou causa que o texto não dá", marca: "Aponta culpado ou causa sem base no texto", ref: REF_LEITURA, confunde: ["recurso-ausente", "fuga-comando", "efeito-trocado"] },
  { id: "generalizacao", nome: "Generalização", def: "Faz de um caso uma regra para todos", marca: "Vira regra geral, com “todo”, “sempre”", ref: REF_LEITURA, confunde: ["recurso-ausente", "fuga-comando", "efeito-trocado"] },
  { id: "efeito-trocado", nome: "Efeito trocado", def: "Dá ao recurso o efeito contrário", marca: "O efeito citado destoa do tom do trecho", ref: REF_LEITURA + " | " + REF_EFEITO, confunde: ["recurso-ausente", "fuga-comando", "generalizacao"] },
  { id: "recurso-ausente", nome: "Recurso ausente", def: "Cita uma figura que o trecho não tem", marca: "Você não consegue apontar a figura no texto", ref: REF_LEITURA, confunde: ["extrapolacao", "generalizacao", "fuga-comando"] },
  { id: "fuga-comando", nome: "Fuga do comando", def: "Diz algo certo, mas fora do que se pede", marca: "Repete o texto sem tratar do que se pede", ref: REF_LEITURA, confunde: ["generalizacao", "efeito-trocado", "recurso-ausente"] },
];
export const SOBREPOSTAS_ARM = [["extrapolacao", "generalizacao"]];

// ---------- casos: texto-base elaborado + a pergunta + a alternativa certa + 1 alternativa por armadilha ----------
export const CASOS = {
  a: {
    pergunta: "Qual alternativa explica o efeito de “as calçadas viraram rios”?",
    base: { titulo: "Trecho de crônica", fonte: FONTE_JOGO, texto: "Choveu o dia inteiro e a cidade parou. Os ônibus sumiram, as calçadas viraram rios e o relógio da praça marcava a mesma hora de ontem. Mesmo assim, a padeira abriu a porta às cinco da manhã, porque pão quente, dizia ela, é o único jeito de avisar que o dia começou." },
    correta: "Intensifica a imagem do alagamento nas calçadas.",
    alts: {
      "extrapolacao": "Prova que a prefeitura abandonou a cidade.",
      "generalizacao": "Mostra que toda chuva forte destrói qualquer cidade.",
      "efeito-trocado": "Suaviza o problema, como se a chuva fosse inofensiva.",
      "recurso-ausente": "Compara, com “como”, as calçadas a rios.",
      "fuga-comando": "Informa que a padeira abriu a porta às cinco.",
    },
  },
  b: {
    pergunta: "Qual alternativa explica o efeito de “Que serviço excelente, hein?”",
    base: { titulo: "Trecho de crônica", fonte: FONTE_JOGO, texto: "Pela terceira vez no mês, o elevador parou. Subi seis andares com as compras e, ofegante, agradeci ao síndico em voz alta: “Que serviço excelente, hein?” O vizinho do quinto, que também subia, riu e concordou." },
    correta: "Critica o conserto que não vem, dizendo o contrário.",
    alts: {
      "extrapolacao": "Prova que o síndico desviou o dinheiro do prédio.",
      "generalizacao": "Mostra que todo síndico é descuidado.",
      "efeito-trocado": "Elogia sinceramente o trabalho do síndico.",
      "recurso-ausente": "Exagera, com hipérbole, o cansaço de subir.",
      "fuga-comando": "Informa que o elevador parou três vezes no mês.",
    },
  },
  c: {
    pergunta: "Qual alternativa explica o efeito de “a calma era a pior notícia”?",
    base: { titulo: "Trecho de crônica", fonte: FONTE_JOGO, texto: "A casa estava em silêncio quando o telefone tocou. Do outro lado, a voz do pai, calma demais, disse apenas: “Venha logo.” Ela largou o café pela metade, pegou as chaves e entendeu, antes de ouvir qualquer explicação, que a calma era a pior notícia." },
    correta: "Faz a calma soar como sinal de algo grave.",
    alts: {
      "extrapolacao": "Prova que o pai escondia uma doença antiga.",
      "generalizacao": "Mostra que toda calma esconde uma tragédia.",
      "efeito-trocado": "Tranquiliza a filha, como se tudo estivesse bem.",
      "recurso-ausente": "Usa onomatopeia para imitar o toque do telefone.",
      "fuga-comando": "Informa que ela largou o café pela metade.",
    },
  },
};
// Tabela de armadilhas com o exemplo (alternativa) de um caso: serve a perguntaDeTabela e a checkTabela.
export const fatosCaso = (caso) => ARMADILHAS.map((a) => ({ ...a, exemplo: CASOS[caso].alts[a.id] }));

// ---------- efeitos de sentido (recurso → efeito) ----------
export const EFEITOS = [
  { id: "hiperbole", nome: "Hipérbole", def: "Dá ênfase: intensifica a ideia", marca: "Exagero que reforça o que se diz", exemplo: "Esperei uma eternidade pelo ônibus.", destaque: ["eternidade"], ref: REF_EFEITO, confunde: ["eufemismo", "antitese", "personificacao"] },
  { id: "eufemismo", nome: "Eufemismo", def: "Suaviza o assunto desagradável", marca: "Palavra branda no lugar da dura", exemplo: "O vovô nos deixou na semana passada.", destaque: ["deixou"], ref: REF_EFEITO, confunde: ["hiperbole", "antitese", "sinestesia"] },
  { id: "ironia", nome: "Ironia", def: "Critica ao dizer o oposto do que se pensa", marca: "Elogio que, no contexto, é crítica", exemplo: "Que ótima ideia: derrubou o bolo inteiro!", destaque: ["ótima", "ideia"], ref: REF_EFEITO, confunde: ["hiperbole", "eufemismo", "sinestesia", "personificacao"] },
  { id: "antitese", nome: "Antítese", def: "Cria contraste entre ideias opostas", marca: "Dois polos postos frente a frente", exemplo: "Entre o riso e o choro, ela aprendeu a viver.", destaque: ["riso", "choro,"], ref: REF_EFEITO, confunde: ["hiperbole", "eufemismo", "personificacao", "sinestesia"] },
  { id: "personificacao", nome: "Personificação (prosopopeia)", def: "Humaniza o que não é humano", marca: "Coisa que age ou sente como gente", exemplo: "O vento sussurrava segredos nas janelas.", destaque: ["sussurrava"], ref: REF_EFEITO, confunde: ["hiperbole", "eufemismo", "antitese", "sinestesia"] },
  { id: "sinestesia", nome: "Sinestesia", def: "Mistura sentidos e enriquece a sensação", marca: "Um sentido descrito com palavra de outro", exemplo: "Ela tem uma voz quente e aveludada.", destaque: ["voz", "quente"], ref: REF_EFEITO, confunde: ["hiperbole", "eufemismo", "antitese", "personificacao"] },
];
export const SOBREPOSTAS_EFE = [["ironia", "antitese"]];

// ---------- intenção do autor ----------
export const INTENCOES = [
  { id: "informar", nome: "Informar", def: "Passa dados sem tomar partido", marca: "Fatos, números e tom neutro", exemplo: "A biblioteca abre das 8h às 18h, de segunda a sexta.", ref: REF_INTENCAO, confunde: ["convencer", "criticar", "emocionar"] },
  { id: "convencer", nome: "Convencer", def: "Quer levar o leitor a agir ou concordar", marca: "Imperativo, “você” e apelo direto", exemplo: "Doe sangue hoje: você pode salvar vidas.", ref: REF_INTENCAO, confunde: ["informar", "criticar", "emocionar"] },
  { id: "criticar", nome: "Criticar", def: "Aponta falhas, muitas vezes com ironia", marca: "Ironia ou humor que denuncia", exemplo: "Que beleza: três meses de obra e a rua continua um buraco.", ref: REF_INTENCAO, confunde: ["informar", "convencer", "emocionar"] },
  { id: "emocionar", nome: "Emocionar", def: "Toca o leitor com imagens e sentimentos", marca: "Metáforas, ritmo e olhar sensível", exemplo: "Quando ela partiu, a casa aprendeu o silêncio.", ref: REF_INTENCAO, confunde: ["informar", "convencer", "criticar"] },
];

// ---------- passos de leitura (ordem certa = a do array) ----------
export const PASSOS = [
  { id: "comando", nome: "Ler o comando", def: "Descobrir o que a questão pede", marca: "Vem primeiro, antes das alternativas", exemplo: "O comando pede o efeito, não o nome da figura.", ref: REF_LEITURA, confunde: ["textobase", "recurso", "efeito", "eliminar"] },
  { id: "textobase", nome: "Ler o texto-base", def: "Entender assunto, tom e gênero", marca: "Sublinhe conectivos e palavras-chave", exemplo: "O tom do trecho é de queixa bem-humorada.", ref: REF_LEITURA, confunde: ["comando", "recurso", "efeito", "eliminar"] },
  { id: "recurso", nome: "Achar o recurso", def: "Apontar no trecho a marca da figura", marca: "Aponte a palavra ou o verso que mostra", exemplo: "Marquei “viraram rios”: troca direta, sem “como”.", ref: REF_LEITURA, confunde: ["comando", "textobase", "efeito", "eliminar"] },
  { id: "efeito", nome: "Ligar ao efeito", def: "Dizer o que o recurso provoca no leitor", marca: "Ênfase, crítica, contraste, suavização…", exemplo: "A troca por “rios” intensifica o alagamento.", ref: REF_LEITURA + " | " + REF_EFEITO, confunde: ["comando", "textobase", "recurso", "eliminar"] },
  { id: "eliminar", nome: "Comparar e eliminar", def: "Comparar as alternativas ao texto e cortar", marca: "Um único erro já basta para cortar", exemplo: "Cortei a que dizia “toda chuva destrói qualquer cidade”.", ref: REF_LEITURA, confunde: ["comando", "textobase", "recurso", "efeito"] },
];
export const ORDEM_PASSOS = PASSOS.map((p) => p.id);
