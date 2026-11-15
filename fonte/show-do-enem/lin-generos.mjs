// Gêneros textuais (Linguagens, padrão 3): tabela de fatos, 30 perguntas e o "recorte esquemático" de cada gênero.
// A certa SEMPRE sai da tabela FATOS (ou, nas de "parte", da lista de partes do próprio desenho).
// Formatos (sufixo do id): -c conceito→definição (5), -d definição→gênero (5), -f… gênero→função/estrutura (20).
import { INK, MUTED, HINT, FILL, svg, text, rect, r1, esc } from "./bio-base.mjs";
import { LIN, LIN_SOFT, perguntaDeTabela, sorteio } from "./lin-base.mjs";

// ---------------- fontes abertas de verdade (WebFetch nesta sessão) ----------------
const TM = "Toda Matéria, Gêneros textuais: https://www.todamateria.com.br/generos-textuais/";
const PE = "PreparaEnem, Gêneros textuais no Enem: https://www.preparaenem.com/enem/generos-textuais-no-enem.htm";
const PE_EDIT = "PreparaEnem, Editorial: https://www.preparaenem.com/portugues/editorial.htm";
const PE_REP = "PreparaEnem, Reportagem: https://www.preparaenem.com/portugues/reportagem.htm";
const PE_ART = "PreparaEnem, Artigo de opinião: https://www.preparaenem.com/portugues/artigo-opiniao.htm";
const PE_CRON = "PreparaEnem, Crônica: https://www.preparaenem.com/portugues/cronica.htm";
const PE_CONTO = "PreparaEnem, Conto: https://www.preparaenem.com/portugues/conto.htm";
const PE_RES = "PreparaEnem, Resenha: https://www.preparaenem.com/portugues/resenha.htm";
const PE_CA = "PreparaEnem, Carta aberta: https://www.preparaenem.com/portugues/carta-aberta.htm";
const PE_CL = "PreparaEnem, Carta do leitor: https://www.preparaenem.com/portugues/carta-leitor.htm";
const PE_HQ = "PreparaEnem, História em quadrinhos (tira, charge x cartum): https://www.preparaenem.com/portugues/historia-quadrinhos.htm";
const WIKI_INST = "Wikipédia, Propaganda institucional: https://pt.wikipedia.org/wiki/Propaganda_institucional";
const PE_POEMA = "PreparaEnem, Poema: https://www.preparaenem.com/portugues/poema.htm";

// ---------------- tabela de fatos ----------------
export const FATOS = [
  { id: "noticia", nome: "Notícia", icone: "jornal", def: "Informa um fato recente de modo objetivo", marca: "Lide responde: o quê, quem, quando, onde", exemplo: "Chuva forte alaga ruas do Centro nesta terça.",
    funcao: "Informar sobre evento recente de interesse público", partes: ["título", "lide", "corpo"], tipo: "informativo", ref: PE, confunde: ["reportagem", "editorial", "artigo", "cronica"] },
  { id: "reportagem", nome: "Reportagem", icone: "jornal", def: "Aprofunda um assunto: causas e efeitos", marca: "Mais longa, com dados, falas e análise", exemplo: "Por que a cidade alaga? Especialistas explicam.",
    funcao: "Detalhar fatos, causas e efeitos", partes: ["título", "linha fina", "lide", "corpo"], tipo: "expositivo/informativo", ref: PE_REP, confunde: ["noticia", "editorial", "resenha", "artigo"] },
  { id: "editorial", nome: "Editorial", def: "Expressa a opinião do próprio jornal", marca: "Não assinado: fala em nome da instituição", exemplo: "Cabe ao poder público limpar os rios da cidade.",
    funcao: "Mostrar a posição oficial do veículo", partes: ["título", "tese", "argumentos", "conclusão"], tipo: "argumentativo", ref: PE_EDIT, confunde: ["artigo", "noticia", "cartaleitor", "cartaaberta"] },
  { id: "artigo", nome: "Artigo de opinião", def: "Defende o ponto de vista de um autor", marca: "Assinado, com tese e argumentos pessoais", exemplo: "Penso que o lixo é um problema de todos nós.",
    funcao: "Defender uma opinião pessoal sobre tema social", partes: ["título", "tese", "argumentos", "conclusão", "assinatura"], tipo: "argumentativo", ref: PE_ART, confunde: ["editorial", "cartaaberta", "resenha", "cartaleitor"] },
  { id: "cronica", nome: "Crônica", def: "Comenta o cotidiano com humor ou lirismo", marca: "Cena do dia a dia em tom leve", exemplo: "No ônibus lotado, um sorriso mudou o meu dia.",
    funcao: "Narrar e comentar o dia a dia", partes: ["título", "fato do cotidiano", "reflexão ou humor"], tipo: "narrativo", ref: PE_CRON, confunde: ["conto", "artigo", "reportagem", "charge"] },
  { id: "conto", nome: "Conto", def: "Conta uma história curta e ficcional", marca: "Poucos personagens, conflito e desfecho", exemplo: "A menina abriu a porta e o gato falou.",
    funcao: "Contar uma história inventada e curta", partes: ["apresentação", "conflito", "clímax", "desfecho"], tipo: "narrativo", ref: PE_CONTO, confunde: ["cronica", "tirinha", "poema", "noticia"] },
  { id: "charge", nome: "Charge", def: "Critica com humor um fato da atualidade", marca: "Quadro único ligado à notícia do dia", exemplo: "Político com balde tenta secar o rio.",
    funcao: "Criticar com humor um fato atual", partes: ["desenho", "fala", "fato do dia"], tipo: "humorístico/crítico", ref: PE_HQ, confunde: ["cartum", "tirinha", "anuncio", "editorial"] },
  { id: "cartum", nome: "Cartum", def: "Faz humor crítico atemporal, sem data", marca: "Quadro único que dispensa contexto", exemplo: "Dois peixes conversam dentro de um aquário.",
    funcao: "Criticar com humor temas universais", partes: ["desenho", "fala", "tema geral"], tipo: "humorístico", ref: PE_HQ, confunde: ["charge", "tirinha", "anuncio", "cronica"] },
  { id: "tirinha", nome: "Tirinha", icone: "balao", def: "Conta cena curta em quadros, em geral cômica", marca: "Quadros em sequência com balões", exemplo: "Três quadros, dois balões e uma piada no final.",
    funcao: "Narrar uma situação curta, em geral cômica", partes: ["quadros", "balões", "desfecho"], tipo: "narrativo/humorístico", ref: PE_HQ, confunde: ["charge", "cartum", "cronica", "conto"] },
  { id: "anuncio", nome: "Anúncio publicitário", icone: "megafone", def: "Convence o público a comprar um produto", marca: "Slogan, imagem do produto e imperativo", exemplo: "Experimente o novo suco. Sinta a diferença!",
    funcao: "Levar o público a adquirir produto ou serviço", partes: ["imagem", "slogan", "texto", "marca"], tipo: "persuasivo", ref: PE, confunde: ["institucional", "noticia", "receita", "cartaaberta"] },
  { id: "institucional", nome: "Propaganda institucional", icone: "megafone", def: "Promove a imagem e as ações de uma instituição", marca: "Assinatura da instituição e seus valores", exemplo: "Há 40 anos cuidando do rio que passa pela nossa fábrica.",
    funcao: "Promover a imagem e as ações de uma instituição", partes: ["imagem", "slogan", "texto", "instituição"], tipo: "persuasivo", ref: WIKI_INST + " | " + PE, confunde: ["anuncio", "cartaaberta", "editorial", "noticia"] },
  { id: "cartaaberta", nome: "Carta aberta", icone: "pena", def: "Reivindica ou protesta perante o público", marca: "Vocativo público e assinatura de grupo", exemplo: "Senhores vereadores, pedimos mais vagas na creche.",
    funcao: "Expor reivindicação a um público amplo", partes: ["local e data", "vocativo", "corpo", "assinatura"], tipo: "argumentativo", ref: PE_CA, confunde: ["cartaleitor", "editorial", "artigo", "anuncio"] },
  { id: "cartaleitor", nome: "Carta do leitor", icone: "pena", def: "Opina sobre matéria publicada no veículo", marca: "Curta, cita o texto do jornal ou revista", exemplo: "Sobre a matéria de domingo, discordo do autor.",
    funcao: "Opinar sobre texto lido em jornal ou revista", partes: ["seção", "referência à matéria", "opinião", "nome"], tipo: "argumentativo", ref: PE_CL, confunde: ["cartaaberta", "editorial", "resenha", "artigo"] },
  { id: "resenha", nome: "Resenha", icone: "livro", def: "Resume e avalia uma obra", marca: "Apresentação, descrição e avaliação", exemplo: "O filme emociona, mas o final é previsível.",
    funcao: "Apresentar e avaliar livro, filme ou série", partes: ["apresentação", "descrição", "avaliação"], tipo: "argumentativo", ref: PE_RES, confunde: ["resumo", "artigo", "reportagem", "noticia"] },
  { id: "resumo", nome: "Resumo", def: "Condensa a ideia central, sem avaliar", marca: "Só o essencial, sem opinião de quem resume", exemplo: "A obra trata da vida de uma família do sertão.",
    funcao: "Condensar o essencial de um texto", partes: ["ideia central"], tipo: "expositivo", ref: PE_RES, confunde: ["resenha", "noticia", "verbete", "artigo"] },
  { id: "verbete", nome: "Verbete", icone: "livro", def: "Define uma palavra ou um tema", marca: "Palavra-entrada seguida das definições", exemplo: "casa: s.f. construção destinada à moradia.",
    funcao: "Expor por definição, conceito ou informação", partes: ["entrada", "classe", "definições", "exemplo"], tipo: "expositivo", ref: TM, confunde: ["resenha", "receita", "entrevista", "noticia"] },
  { id: "receita", nome: "Receita", def: "Orienta o passo a passo de um preparo", marca: "Ingredientes e modo de fazer, no imperativo", exemplo: "Misture os ovos e leve ao forno por 30 minutos.",
    funcao: "Orientar o leitor a fazer algo", partes: ["título", "ingredientes", "modo de preparo"], tipo: "injuntivo", ref: TM, confunde: ["verbete", "poema", "anuncio", "entrevista"] },
  { id: "poema", nome: "Poema", icone: "pena", def: "Expressa emoções ou ideias em versos", marca: "Versos reunidos em estrofes, com ritmo", exemplo: "A lua veio devagar, pousou no mar.",
    funcao: "Expressar emoções, reflexões ou ideias", partes: ["título", "versos", "estrofes"], tipo: "lírico", ref: PE_POEMA, confunde: ["conto", "cronica", "verbete", "receita"] },
  { id: "entrevista", nome: "Entrevista", icone: "balao", def: "Dá voz a alguém em perguntas e respostas", marca: "Perguntas e respostas em alternância", exemplo: "— Quando começou a pintar? — Aos dez anos.",
    funcao: "Apresentar a fala de uma pessoa a um público", partes: ["título", "apresentação", "pergunta", "resposta"], tipo: "expositivo", ref: TM, confunde: ["resenha", "noticia", "verbete", "receita"] },
];
const BY = Object.fromEntries(FATOS.map((f) => [f.id, f]));

// ---------------- recortes esquemáticos (viewBox 320×200) ----------------
// parte: [chave, x, y, w, h, rótulo, {f: preenchimento, l: nº de linhas cinza, c: centrado, e: elipse}]
const P = (k, x, y, w, h, label, o = {}) => ({ k, x, y, w, h, label, ...o });
const AM = FILL.amarelo, LA = FILL.laranja, AG = FILL.agua, CZ = FILL.cinza, AR = FILL.areia, RO = FILL.rosa, LI = FILL.lilas;
const edi = (assinFill, rv, o = {}) => [
  P("titulo", 14, 12, 292, 24, "Título", { f: AM }), P("tese", 14, 42, 292, 34, "Tese", { f: LA }),
  P("args", 14, 82, 292, 54, "Argumentos", { l: 3 }), P("concl", 14, 142, 164, 38, "Conclusão", { l: 1 }), P("assin", 184, 142, 122, 38, "Rodapé", { f: assinFill, rv, ...o }),
];
const LAYOUTS = {
  noticia: [P("titulo", 14, 12, 292, 28, "Título", { f: AM }), P("lide", 14, 46, 292, 44, "Lide: o quê, quem, quando, onde", { f: LA, l: 1 }), P("corpo", 14, 96, 184, 88, "Corpo", { l: 4 }), P("foto", 204, 96, 102, 88, "Foto", { f: AG, c: true })],
  reportagem: [P("titulo", 14, 12, 292, 24, "Título", { f: AM }), P("linhafina", 14, 40, 292, 22, "Linha fina", { f: LA }), P("lide", 14, 66, 292, 22, "Abertura (lide)", { f: LA }), P("corpo", 14, 94, 152, 90, "Corpo longo", { l: 5 }), P("falas", 172, 94, 134, 42, "Falas de fontes", { f: RO }), P("dados", 172, 142, 134, 42, "Dados e gráfico", { f: AG })],
  editorial: edi("#fff", "Sem assinatura", { c: true }),
  artigo: edi(AM, "Assinado", { s: true }),
  cronica: [P("titulo", 14, 12, 292, 24, "Título", { f: AM }), P("cena", 14, 42, 292, 54, "Fato do cotidiano", { f: LA, l: 2 }), P("coment", 14, 102, 292, 78, "Reflexão ou humor do cronista", { l: 4 })],
  conto: [P("apres", 14, 12, 292, 38, "Apresentação", { l: 1 }), P("conflito", 14, 56, 292, 38, "Conflito", { f: LA, l: 1 }), P("climax", 14, 100, 292, 38, "Clímax", { f: RO, l: 1 }), P("desfecho", 14, 144, 292, 38, "Desfecho", { f: AR, l: 1 })],
  charge: [P("desenho", 24, 22, 160, 156, "Caricatura", { f: CZ, c: true }), P("fala", 194, 24, 104, 50, "Fala", { e: true, c: true }), P("fato", 194, 90, 104, 84, "Contexto", { f: AM, l: 2, rv: "Fato do dia" })],
  cartum: [P("desenho", 24, 22, 160, 156, "Desenho", { f: CZ, c: true }), P("fala", 194, 24, 104, 50, "Fala", { e: true, c: true }), P("tema", 194, 90, 104, 84, "Contexto", { f: AG, l: 2, rv: "Tema geral" })],
  tirinha: [P("q1", 14, 16, 92, 118, ""), P("q2", 114, 16, 92, 118, ""), P("q3", 214, 16, 92, 118, ""), P("b1", 22, 24, 76, 30, "", { e: true, l: 1 }), P("balao", 122, 24, 76, 30, "Balão", { e: true, c: true }), P("b3", 222, 24, 76, 30, "", { e: true, l: 1 }),
    P("l1", 14, 142, 92, 28, "Quadro 1", { c: true, f: LA }), P("l2", 114, 142, 92, 28, "Quadro 2", { c: true, f: LA }), P("desfecho", 214, 142, 92, 28, "Quadro 3", { c: true, f: AM })],
  anuncio: [P("imagem", 14, 12, 292, 84, "Imagem do produto", { f: AG, c: true }), P("slogan", 14, 102, 292, 32, "Slogan", { f: AM, c: true }), P("texto", 14, 140, 170, 42, "Texto curto", { l: 2 }), P("marca", 192, 140, 114, 42, "Produto", { f: LA, c: true })],
  institucional: [P("imagem", 14, 12, 292, 84, "Imagem da causa", { f: AG, c: true }), P("slogan", 14, 102, 292, 32, "Slogan", { f: AM, c: true }), P("texto", 14, 140, 170, 42, "Texto curto", { l: 2 }), P("inst", 192, 140, 114, 42, "Instituição", { f: LA, c: true })],
  cartaaberta: [P("data", 14, 12, 150, 24, "Local e data", { f: CZ }), P("vocativo", 14, 42, 292, 26, "Destinatário", { f: AM }), P("corpo", 14, 74, 292, 70, "Pedido e argumentos", { l: 3 }), P("assin", 14, 150, 292, 32, "Assinatura do grupo", { f: LA })],
  cartaleitor: [P("secao", 14, 12, 292, 24, "Seção: Cartas", { f: CZ }), P("ref", 14, 42, 292, 36, "Cita a matéria lida", { f: AM }), P("corpo", 14, 84, 292, 62, "Opinião curta", { l: 3 }), P("assin", 14, 152, 160, 30, "Nome do leitor", { f: LA })],
  resenha: [P("apres", 14, 12, 292, 40, "Apresentação da obra", { f: AM, l: 1 }), P("descr", 14, 58, 292, 54, "Descrição", { l: 3 }), P("aval", 14, 118, 292, 54, "Avaliação", { f: LA, l: 2 })],
  verbete: [P("entrada", 14, 12, 140, 30, "Entrada", { f: AM }), P("classe", 160, 12, 146, 30, "Classe gramatical", { f: CZ }), P("def1", 14, 48, 292, 38, "Sentido 1", { l: 1 }), P("def2", 14, 92, 292, 38, "Sentido 2", { l: 1 }), P("exemplo", 14, 136, 292, 40, "Exemplo de uso", { f: AR, l: 1 })],
  receita: [P("titulo", 14, 12, 292, 26, "Título do prato", { f: AM }), P("ingr", 14, 44, 118, 140, "Ingredientes", { f: LA, l: 5 }), P("modo", 138, 44, 168, 140, "Modo de preparo", { l: 6 })],
  poema: [P("titulo", 14, 12, 292, 24, "Título", { f: AM }), P("e1", 14, 42, 150, 68, "Bloco 1", { l: 3 }), P("e2", 14, 116, 150, 68, "Bloco 2", { l: 3 }), P("verso", 172, 42, 134, 68, "Linhas curtas", { f: LA, c: true }), P("ritmo", 172, 116, 134, 68, "Rima, se houver", { f: LI, c: true })],
  entrevista: [P("titulo", 14, 12, 292, 24, "Título", { f: AM }), P("apres", 14, 42, 292, 30, "Apresentação", { f: CZ }), P("p1", 14, 78, 210, 30, "Pergunta", { f: LA }), P("r1", 86, 114, 220, 30, "Resposta", { l: 0 }), P("p2", 14, 150, 210, 30, "Pergunta", { f: LA })],
};
export const PARTES = Object.fromEntries(Object.entries(LAYOUTS).map(([g, ps]) => [g, ps.filter((p) => p.label).map((p) => p.k)]));
const LINHA = "#cfc9b8";
const FS = 12.5;

function desenhaParte(p, { rev, oculto, reveal }) {
  const opts = { reveal };
  const f = rev ? FILL.verde : p.f || "#fff";
  let s = "";
  if (p.e) s += `<ellipse cx="${r1(p.x + p.w / 2)}" cy="${r1(p.y + p.h / 2)}" rx="${r1(p.w / 2)}" ry="${r1(p.h / 2)}" fill="${f}" stroke="${INK}" stroke-width="2"/>`;
  else s += rect(p.x, p.y, p.w, p.h, { fill: f, rx: 7, sw: rev ? 2.8 : 2 });
  const lab = oculto ? "?" : (opts.reveal && p.rv) || p.label;
  if (lab) {
    if (p.c || (!p.l && !p.s)) s += `<text x="${r1(p.c ? p.x + p.w / 2 : p.x + 9)}" y="${r1(p.y + p.h / 2 + (oculto ? 6 : 4.5))}" font-size="${oculto ? 18 : FS}" font-weight="800" fill="${oculto ? LIN : INK}" text-anchor="${p.c ? "middle" : "start"}">${esc(lab)}</text>`;
    else s += `<text x="${r1(p.x + 9)}" y="${r1(p.y + 16)}" font-size="${oculto ? 14 : FS}" font-weight="800" fill="${oculto ? LIN : INK}">${esc(lab)}</text>`;
  }
  if (p.s && !oculto) s += `<path d="M${p.x + 12} ${p.y + 30}q9-14 18 0t18 0t18 0t18 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  if (p.l && !oculto) for (let i = 0; i < p.l; i++) {
    const y = p.y + (lab ? 26 : 12) + i * 11, w = (p.w - 18) * [1, 0.88, 0.94, 0.7, 0.9, 0.8][i % 6];
    if (y + 6 < p.y + p.h) s += `<rect x="${r1(p.x + 9)}" y="${r1(y)}" width="${r1(w)}" height="5" rx="2.5" fill="${LINHA}"/>`;
  }
  return s;
}
function recorte(fig, opts = {}) {
  const lay = LAYOUTS[fig.genero]; if (!lay) throw new Error("lin-gen-recorte: gênero sem layout " + fig.genero);
  const alt = opts.size === "alt", rev = opts.mode === "reveal", hl = new Set(fig.hl || []), oc = new Set(fig.oculta || []);
  let b = rect(4, 4, 312, 192, { fill: "#fffdf6", rx: 14 });
  if (fig.genero === "charge" || fig.genero === "cartum") b += rect(14, 12, 292, 176, { fill: "#fff", rx: 8, sw: 2.4 });
  if (fig.genero === "tirinha") b += lay.filter((p) => /^q\d$/.test(p.k)).map((p, i) => rect(p.x, p.y, p.w, p.h, { fill: "#fff", rx: 6, sw: 2.2 }) + `<circle cx="${p.x + 46}" cy="${p.y + 76}" r="11" fill="${AM}" stroke="${INK}" stroke-width="2"/><path d="M${p.x + 46} ${p.y + 87}v22" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`).join("");
  if (fig.genero === "charge" || fig.genero === "cartum") b += `<circle cx="104" cy="82" r="20" fill="${AM}" stroke="${INK}" stroke-width="2"/><path d="M104 102v44M104 118l-24 14M104 118l24 14" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const partes = lay.filter((p) => !(fig.genero === "tirinha" && /^q\d$/.test(p.k) && false));
  for (const p of partes) {
    if (fig.genero === "charge" || fig.genero === "cartum") { if (p.k === "desenho") { b += `<text x="104" y="170" font-size="${FS}" font-weight="800" fill="${INK}" text-anchor="middle">${esc(p.label)}</text>`; continue; } }
    if (fig.genero === "tirinha" && /^q\d$/.test(p.k)) continue;
    b += desenhaParte(p, { rev: rev && hl.has(p.k), oculto: !rev && oc.has(p.k), reveal: rev });
  }
  const mk = opts.hint ? [opts.hint].flat().filter((k) => lay.some((p) => p.k === k)) : [];
  if (mk.length && opts.mode !== "reveal") {
    const ps = lay.filter((p) => mk.includes(p.k)), x0 = Math.min(...ps.map((p) => p.x)) - 5, y0 = Math.min(...ps.map((p) => p.y)) - 5, x1 = Math.max(...ps.map((p) => p.x + p.w)) + 5, y1 = Math.max(...ps.map((p) => p.y + p.h)) + 5;
    b += `<rect class="hintring" x="${r1(x0)}" y="${r1(y0)}" width="${r1(x1 - x0)}" height="${r1(y1 - y0)}" rx="10" fill="none" stroke="${HINT}" stroke-width="3.2" stroke-dasharray="5 4"/>`;
  }
  const rot = `Recorte esquemático de ${BY[fig.genero]?.nome || fig.genero}`;
  if (alt) return svg(160, 118, `<g transform="translate(0 9) scale(.5)">${b.replace(/<text [^>]*>[^<]*<\/text>/g, "")}</g>`, rot);
  return svg(320, 200, b, rot);
}
export const FIGS = { "lin-gen-recorte": recorte };

// ---------------- geração das perguntas ----------------
const TXT = { def: "Qual é a função deste gênero?", marca: "Qual característica marca este gênero?", nome: "Que gênero textual tem este recorte?" };
function pRecorte({ id, alvo, para, lvl, text, wrongs, hl, mark, oculta, hint, why, src }) {
  const f = BY[alvo], rnd = sorteio(id), certa = f[para];
  const alts = [certa, ...wrongs.map((w) => BY[w][para])].sort(() => 0);
  const ord = [...alts.keys()].map((i) => [rnd(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const final = ord.map((i) => alts[i]);
  return { id, subj: "linguagens", pat: 3, lvl, text: text || TXT[para],
    fig: [{ kind: "lin-gen-recorte", genero: alvo, hl, ...(oculta ? { oculta } : {}) }],
    alts: final.map((t) => ({ t })), correct: [final.indexOf(certa)],
    hint: { t: hint, fig: 0, mark }, why: why.slice(0, 150), src: src || "no estilo do ENEM", ref: f.ref };
}
function pParte({ id, alvo, oculta, certa, errados, lvl, text, mark, hint, why, src }) {
  const rnd = sorteio(id), alts = [certa, ...errados], ord = [...alts.keys()].map((i) => [rnd(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), final = ord.map((i) => alts[i]);
  return { id, subj: "linguagens", pat: 3, lvl, text,
    fig: [{ kind: "lin-gen-recorte", genero: alvo, hl: [oculta], oculta: [oculta] }],
    alts: final.map((t) => ({ t })), correct: [final.indexOf(certa)],
    hint: { t: hint, fig: 0, mark }, why: why.slice(0, 150), src: src || "no estilo do ENEM", ref: BY[alvo].ref };
}
const C = (o) => perguntaDeTabela({ fatos: FATOS, formato: "nome>def", pat: 3, rotulo: "gênero", text: "Qual definição combina com o gênero do cartão?", ...o });
const D = (o) => perguntaDeTabela({ fatos: FATOS, formato: "def>nome", pat: 3, rotulo: "gênero textual", ...o });

export const QUESTIONS = [
  // ---- fáceis (10)
  C({ id: "lin-gen-noticia-c", alvo: "noticia", lvl: 1, confunde: ["reportagem", "editorial", "artigo"], hint: { t: "O que a notícia traz logo no começo?" }, why: "Notícia informa um fato recente de modo objetivo; o lide responde o quê, quem, quando e onde." }),
  C({ id: "lin-gen-receita-c", alvo: "receita", lvl: 1, confunde: ["verbete", "poema", "anuncio"], hint: { t: "Pense em quem lê com a cozinha à frente: o que ele faz?" }, why: "Receita é texto injuntivo: orienta o passo a passo, com ingredientes e modo de fazer." }),
  D({ id: "lin-gen-anuncio-d", alvo: "anuncio", lvl: 1, confunde: ["institucional", "noticia", "receita"], hint: { t: "Veja o verbo que diz o que o público deve fazer com o produto.", mark: ["comprar"] }, why: "Anúncio publicitário quer vender: slogan, imagem do produto e verbos no imperativo." }),
  pRecorte({ id: "lin-gen-tirinha-f1", alvo: "tirinha", para: "def", lvl: 1, wrongs: ["cronica", "noticia", "verbete"], hl: ["q1", "q2", "q3", "balao"], mark: ["balao"], hint: "Olhe quantos quadros há e o que sai da boca das figuras.", why: "Tirinha: poucos quadros em sequência, com balões; a cena fecha no último quadro." }),
  pRecorte({ id: "lin-gen-verbete-f1", alvo: "verbete", para: "def", lvl: 1, wrongs: ["resenha", "receita", "entrevista"], hl: ["def1", "def2"], mark: ["entrada"], hint: "Veja a palavra em destaque no topo e o que vem depois dela.", why: "Verbete traz a palavra-entrada e suas definições: serve para definir." }),
  pRecorte({ id: "lin-gen-poema-f1", alvo: "poema", para: "marca", lvl: 1, wrongs: ["noticia", "receita", "entrevista"], hl: ["e1", "e2"], mark: ["e1"], hint: "Repare em como as linhas estão agrupadas.", why: "Poema organiza versos em estrofes, com ritmo, rima e figuras de linguagem." }),
  pParte({ id: "lin-gen-receita-f2", alvo: "receita", oculta: "ingr", certa: "Ingredientes", errados: ["Tese", "Lide", "Vocativo"], lvl: 1, text: "Que parte da receita aparece no lugar do ‘?’, antes do modo de preparo?", mark: ["ingr"], hint: "Veja o que se separa antes de começar a cozinhar.", why: "A receita lista os ingredientes e depois o modo de preparo." }),
  pRecorte({ id: "lin-gen-noticia-f2", alvo: "noticia", para: "def", lvl: 1, wrongs: ["poema", "receita", "tirinha"], hl: ["titulo", "lide"], mark: ["titulo"], hint: "Olhe o título e o parágrafo logo abaixo dele.", why: "Notícia: título e lide dão o fato recente de modo objetivo.", src: "no estilo do ENEM" }),
  D({ id: "lin-gen-poema-d", alvo: "poema", lvl: 1, confunde: ["conto", "cronica", "verbete"], hint: { t: "Procure como o texto é escrito: em linhas curtas.", mark: ["versos"] }, why: "Poema: texto em versos e estrofes que expressa emoções ou ideias." }),
  pRecorte({ id: "lin-gen-anuncio-f2", alvo: "anuncio", para: "def", lvl: 1, wrongs: ["noticia", "receita", "entrevista"], hl: ["imagem", "slogan", "marca"], mark: ["slogan"], hint: "Olhe a frase de efeito e a imagem do produto.", why: "Anúncio tem slogan, imagem e marca: seu objetivo é levar o público a comprar.", src: "no estilo do ENEM" }),
  // ---- médias (12)
  C({ id: "lin-gen-editorial-c", alvo: "editorial", lvl: 2, confunde: ["artigo", "noticia", "cartaleitor"], hint: { t: "Quem fala aqui não é uma pessoa, é o veículo." }, why: "Editorial é argumentativo e sem assinatura: traz a posição do próprio jornal.", src: "como no ENEM 2014 (editorial sobre lixo: função social)" }),
  D({ id: "lin-gen-charge-d", alvo: "charge", lvl: 2, confunde: ["cartum", "tirinha", "anuncio"], hint: { t: "Veja o tipo de fato criticado: de hoje ou de sempre?", mark: ["atualidade"] }, why: "Charge critica com humor um fato do momento; sem esse contexto não se entende." }),
  pRecorte({ id: "lin-gen-cronica-f3", alvo: "cronica", para: "nome", lvl: 2, wrongs: ["conto", "reportagem", "artigo"], hl: ["cena", "coment"], mark: ["cena"], hint: "Veja de onde sai o assunto e o que o autor faz com ele.", why: "Crônica parte de um fato do cotidiano e o comenta, com humor ou lirismo." }),
  pRecorte({ id: "lin-gen-reportagem-f1", alvo: "reportagem", para: "def", lvl: 2, wrongs: ["noticia", "editorial", "resenha"], hl: ["corpo", "falas", "dados"], mark: ["dados"], hint: "Olhe o que existe além do título e do lide.", why: "Reportagem é mais longa que a notícia: traz falas, dados, causas e efeitos." }),
  pParte({ id: "lin-gen-noticia-f4", alvo: "noticia", oculta: "lide", certa: "Lide", errados: ["Linha fina", "Conclusão", "Vocativo"], lvl: 2, text: "Qual parte da notícia responde: o quê, quem, quando e onde?", mark: ["lide"], hint: "Veja o bloco logo abaixo do título.", why: "O lide abre a notícia e resume o fato: o quê, quem, quando, onde, como e por quê." }),
  pRecorte({ id: "lin-gen-charge-f2", alvo: "charge", para: "marca", lvl: 2, wrongs: ["cartum", "tirinha", "anuncio"], hl: ["fato"], mark: ["fato"], hint: "Os dois têm quadro único; o que muda?", why: "Charge: quadro único ligado a um fato do dia; o cartum dispensa contexto.", src: "no estilo do ENEM" }),
  pRecorte({ id: "lin-gen-cartaaberta-f1", alvo: "cartaaberta", para: "def", lvl: 2, wrongs: ["cartaleitor", "editorial", "artigo"], hl: ["vocativo", "assin"], mark: ["assin"], hint: "Veja a quem a carta se dirige e quem a assina.", why: "Carta aberta expõe uma reivindicação de interesse público a um público amplo.", src: "como no ENEM 2023 (carta aberta: objetivo do texto)" }),
  pParte({ id: "lin-gen-resenha-f4", alvo: "resenha", oculta: "aval", certa: "Avaliação", errados: ["Manchete", "Vocativo", "Ingredientes"], lvl: 2, text: "Na resenha, que parte vem no ‘?’, depois de descrever a obra?", mark: ["aval"], hint: "Pense no que a resenha faz além de resumir.", why: "A resenha apresenta, descreve e avalia a obra: a avaliação traz o julgamento." }),
  D({ id: "lin-gen-cronica-d", alvo: "cronica", lvl: 2, confunde: ["conto", "artigo", "charge"], hint: { t: "Procure o tema de onde o texto parte: a rotina.", mark: ["cotidiano"] }, why: "Crônica comenta o cotidiano, com humor ou lirismo, em linguagem leve." }),
  pRecorte({ id: "lin-gen-conto-f1", alvo: "conto", para: "marca", lvl: 2, wrongs: ["cronica", "tirinha", "poema"], hl: ["conflito", "climax", "desfecho"], mark: ["climax"], hint: "Veja a sequência de etapas da história.", why: "Conto narra uma história curta: apresentação, conflito, clímax e desfecho." }),
  pRecorte({ id: "lin-gen-entrevista-f1", alvo: "entrevista", para: "def", lvl: 2, wrongs: ["resenha", "noticia", "verbete"], hl: ["p1", "r1", "p2"], mark: ["p1"], hint: "Veja como as falas se alternam no texto.", why: "Entrevista dá voz a alguém: perguntas e respostas em alternância." }),
  pRecorte({ id: "lin-gen-tirinha-f3", alvo: "tirinha", para: "nome", lvl: 2, wrongs: ["charge", "cartum", "cronica"], hl: ["q1", "q2", "q3"], mark: ["q2"], hint: "Conte os quadros: um só ou uma sequência?", why: "Vários quadros em sequência com balões e desfecho no fim: tirinha." }),
  // ---- difíceis (8)
  pRecorte({ id: "lin-gen-editorial-f2", alvo: "editorial", para: "marca", lvl: 3, wrongs: ["artigo", "noticia", "cartaaberta"], hl: ["assin"], mark: ["assin"], hint: "Olhe o rodapé: quem responde pelo texto?", why: "Editorial não é assinado: a voz é a da instituição; o artigo traz autor." }),
  pRecorte({ id: "lin-gen-artigo-f3", alvo: "artigo", para: "nome", lvl: 3, wrongs: ["editorial", "cartaaberta", "resenha"], hl: ["assin"], mark: ["assin"], hint: "Olhe o rodapé: há marca de quem escreveu?", why: "Tese, argumentos e conclusão assinados por um autor: artigo de opinião." }),
  D({ id: "lin-gen-cartum-d", alvo: "cartum", lvl: 3, confunde: ["charge", "tirinha", "anuncio"], hint: { t: "Procure a palavra que diz que o assunto não tem data.", mark: ["atemporal"] }, why: "Cartum: humor crítico atemporal, em quadro único, entendido sem contexto." }),
  pParte({ id: "lin-gen-charge-f3", alvo: "charge", oculta: "fato", certa: "Fato do dia", errados: ["Tema geral", "Slogan", "Lide"], lvl: 3, text: "Que parte da charge liga o desenho a um acontecimento do momento?", mark: ["desenho"], hint: "Pense no que o leitor precisa conhecer para entender a piada.", why: "A charge depende de um fato do dia; o cartum tem tema geral, sem data." }),
  pRecorte({ id: "lin-gen-institucional-f1", alvo: "institucional", para: "def", lvl: 3, wrongs: ["anuncio", "cartaaberta", "editorial"], hl: ["inst", "slogan"], mark: ["inst"], hint: "Veja quem assina a peça, no canto inferior.", why: "Propaganda institucional promove a imagem e as ações de quem assina, não um produto." }),
  C({ id: "lin-gen-resenha-c", alvo: "resenha", lvl: 3, confunde: ["resumo", "artigo", "reportagem"], hint: { t: "Compare com o resumo: a resenha faz mais um passo." }, why: "Resenha resume e avalia; o resumo só condensa, sem julgar.", src: "como no ENEM 2016 (resenha: função social)" }),
  pRecorte({ id: "lin-gen-cartaleitor-f1", alvo: "cartaleitor", para: "def", lvl: 3, wrongs: ["cartaaberta", "editorial", "resenha"], hl: ["ref"], mark: ["ref"], hint: "Veja o que o leitor cita logo no começo.", why: "Carta do leitor é curta e responde a uma matéria já publicada no veículo." }),
  C({ id: "lin-gen-reportagem-c", alvo: "reportagem", lvl: 3, confunde: ["noticia", "editorial", "resenha"], hint: { t: "Procure o que ela faz a mais que a notícia." }, why: "Reportagem vai além do fato: detalha causas e efeitos, e é mais longa." }),
];
export const PATTERNS_USED = [3];
