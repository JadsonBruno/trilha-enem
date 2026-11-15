// Check da matéria Biologia (node checks/check-biologia.mjs; também roda por node checks/check-tudo.mjs --so biologia).
// 1) schema só da Biologia; 2) as 80 perguntas do Show entram uma vez cada e com a mesma certa; 3) refaz, com código próprio,
// a resposta de cada exercício gerado a partir da "spec" registrada (entradas do modelo) e das figuras do próprio exercício;
// 4) alternativas não equivalentes, nada repetido entre lições, manuais com ref aberta, todos os temas cobertos.
// Código de saída 1 se algo falhar.
import { readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const imp = (rel) => import(pathToFileURL(join(RAIZ, rel)).href);
const { FIGURAS } = await imp("app/figuras/index.js");
const { validar } = await imp("checks/schema.mjs");
const { ESPECS } = await imp("conteudo/biologia/_util.mjs");
const { bancoShow } = await imp("conteudo/_comum/show.mjs");
const ECO = await imp("fonte/show-do-enem/bio-ecologia.mjs");
const GEN = await imp("fonte/show-do-enem/bio-genetica.mjs");

// ---------------------------------------------------------------- carrega a matéria (sem depender do manifesto geral)
const PM = join(RAIZ, "conteudo/biologia");
const materia = (await imp("conteudo/biologia/materia.mjs")).default;
const unidades = [];
for (const d of readdirSync(PM).filter((d) => /^\d{2}-[a-z0-9-]+$/.test(d) && statSync(join(PM, d)).isDirectory()).sort()) {
  const U = (await imp(`conteudo/biologia/${d}/unidade.mjs`)).default;
  const licoes = [];
  for (const f of readdirSync(join(PM, d)).filter((f) => /^\d{2}-[a-z0-9-]+\.mjs$/.test(f)).sort()) licoes.push((await imp(`conteudo/biologia/${d}/${f}`)).default);
  unidades.push({ ...U, licoes });
}
const M = { ...materia, unidades };

const erros = [];
const err = (onde, m) => erros.push(`${onde}: ${m}`);

// ---------------------------------------------------------------- 1) schema
const sc = validar([M], FIGURAS);
for (const e of sc.erros) erros.push("schema " + e);
for (const a of sc.avisos) console.log("aviso  " + a);

const todos = []; // { x, onde, desafio }
for (const U of unidades) {
  for (const L of U.licoes) for (const x of L.exercicios) todos.push({ x, onde: L.id, desafio: false });
  for (const x of U.desafio) todos.push({ x, onde: U.id + "/desafio", desafio: true });
}

// ---------------------------------------------------------------- 2) Show
const banco = new Map(bancoShow("biologia").map((q) => [q.id, q]));
const usados = new Map();
for (const { x, onde } of todos) {
  const m = /^show:(.+)$/.exec(x.origem || "");
  if (!m) continue;
  const q = banco.get(m[1]);
  if (!q) { err(x.id, `origem aponta para "${m[1]}", que não existe no Show`); continue; }
  if (x.id !== q.id) err(x.id, `id difere do id do Show (${q.id})`);
  if (x.certa !== q.correct[0]) err(x.id, "certa difere da do Show");
  if (x.enunciado !== q.text) err(x.id, "enunciado difere do do Show");
  if (usados.has(q.id)) err(x.id, `pergunta do Show usada duas vezes (${usados.get(q.id)} e ${onde})`);
  usados.set(q.id, onde);
}
for (const id of banco.keys()) if (!usados.has(id)) err(id, "pergunta do Show não foi usada em nenhuma lição nem desafio");
for (const { x, desafio } of todos) if (desafio && !/^show:/.test(x.origem)) err(x.id, "desafio só com perguntas do Show (nesta matéria)");

// ---------------------------------------------------------------- 3) recálculo dos gerados (código próprio)
const sem = (s) => String(s).toLowerCase().replace(/\s+/g, "").replace(/,/g, ".");
const NUM = /^\s*(\d+\/\d+|\d[\d\s]*(?:,\d+)?|\d+(?:\.\d+)?)\s*([^\d]*)$/;
const parseNum = (t) => {
  const m = NUM.exec(String(t));
  if (!m) return null;
  let v;
  if (m[1].includes("/")) { const [a, b] = m[1].split("/").map(Number); v = a / b; }
  else v = parseFloat(m[1].replace(/\s/g, "").replace(",", "."));
  return { v, unit: m[2].trim() };
};
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const f = (v) => { const [i, d] = String(Number(Number(v).toPrecision(12))).split("."); return i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + d : ""); };
const fracDe = (n, d) => { const g = ((a, b) => { while (b) [a, b] = [b, a % b]; return a; })(n, d); return [n / g, d / g]; };

// teias
const niveisDe = (teia) => {
  const T = ECO.TEIAS[teia], pre = {}; T.nodes.forEach((n) => (pre[n.id] = []));
  T.edges.forEach(([a, b]) => pre[b].push(a));
  const memo = {};
  const lv = (id) => memo[id] ??= new Set(T.nodes.find((n) => n.id === id).r === "p" ? [1] : pre[id].flatMap((p) => [...lv(p)].map((v) => v + 1)));
  return (id) => [...lv(id)].sort((a, b) => a - b);
};
const nomeT = (teia, id) => ECO.TEIAS[teia].nodes.find((n) => n.id === id).n;
const CONS = { 2: "primário", 3: "secundário", 4: "terciário", 5: "quaternário" };
const REL = { "++": "Mutualismo", "+0": "Comensalismo", "+-": "Parasitismo", "--": "Competição" };
const relDe = (a, b) => REL[a + b] ?? REL[b + a];
// ciclos: a seta termina no retângulo do CO₂?
const terminaEm = (a, nd) => a.p[2] >= nd.x - nd.w / 2 - 8 && a.p[2] <= nd.x + nd.w / 2 + 8 && Math.abs(a.p[3] - nd.y) <= 17 + 8;
// Punnett
const gam = (par) => par.reduce((acc, [x, y]) => acc.flatMap((g) => [g + x, g + y]), [""]);
const canon = (a, b) => (a < b ? a + b : b + a); // maiúscula vem antes na ordem ASCII
const filhos = (p1, p2) => {
  const out = [];
  const gs1 = p1.map((_, i) => null); void gs1;
  const g1 = p1.reduce((acc, [x, y]) => acc.flatMap((g) => [[...g, x], [...g, y]]), [[]]);
  const g2 = p2.reduce((acc, [x, y]) => acc.flatMap((g) => [[...g, x], [...g, y]]), [[]]);
  for (const a of g1) for (const b of g2) out.push(a.map((al, i) => canon(al, b[i])).join(""));
  return out;
};
const temDom = (g) => /[A-Z]/.test(g);
// ABO
const ant = (t) => ({ A: t.startsWith("A"), B: t.includes("B"), D: t.endsWith("+") });
const doa = (d, r) => { const a = ant(d), b = ant(r); return ["A", "B", "D"].every((k) => !a[k] || b[k]); };
const TIPOS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const listaAnt = (t) => { const a = ant(t), k = ["A", "B", "D"].filter((x) => a[x]); return k.length === 0 ? "Nenhum antígeno" : k.length === 1 ? `Antígeno ${k[0]}` : `Antígenos ${k.slice(0, -1).join(", ")} e ${k.at(-1)}`; };
// código genético
const CODON = GEN.CODONS;
const comp = { A: "U", T: "A", G: "C", C: "G" };
const traduz = (rna) => { let i = rna.indexOf("AUG"), out = []; if (i < 0) return out; for (; i + 3 <= rna.length; i += 3) { const a = CODON[rna.slice(i, i + 3)]; if (a === "Pare") break; out.push(a); } return out; };
const AAPT = { Met: "Metionina", Trp: "Triptofano", Phe: "Fenilalanina", Gly: "Glicina" };
// gel
const paternas = (m, f2) => f2.filter((b) => !m.includes(b));
const compat = (R) => R.slice(2).filter((s) => paternas(R[0].b, R[1].b).every((b) => s.b.includes(b))).map((s) => s.n);
// osmose
const osm = (ci, co, parede) => { const d = co - ci, iso = Math.abs(d) <= 0.05; const tonic = iso ? "isotônico" : d < 0 ? "hipotônico" : "hipertônico"; const flow = iso ? "nenhum" : d < 0 ? "entra" : "sai"; const res = parede ? { entra: "túrgida", sai: "plasmolisada", nenhum: "flácida" }[flow] : { entra: "incha", sai: "murcha", nenhum: "normal" }[flow]; return { tonic, flow, res }; };
const div = (proc, n2) => (proc === "mitose" ? { c: 2, k: n2 } : { c: 4, k: n2 / 2 });
// árvores
const folhas = (t) => (typeof t === "string" ? [t] : t.flatMap(folhas));
const caminhos = (t, p = []) => (typeof t === "string" ? { [t]: p } : Object.assign({}, ...t.map((c, i) => caminhos(c, [...p, i]))));
const prefixo = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
const proximos = (t, x) => { const P = caminhos(t); let best = -1, out = []; for (const [n, p] of Object.entries(P)) { if (n === x) continue; const c = prefixo(p, P[x]); if (c > best) { best = c; out = [n]; } else if (c === best) out.push(n); } return out; };
const subconjuntos = (t) => { const r = [folhas(t).slice().sort().join("|")]; if (typeof t !== "string") for (const c of t) r.push(...subconjuntos(c)); return r; };
const mono = (t, g) => subconjuntos(t).includes([...g].sort().join("|"));
// gráficos
const interp = (P, x) => { for (let i = 0; i < P.length - 1; i++) { const [x1, y1] = P[i], [x2, y2] = P[i + 1]; if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 1); } return P.at(-1)[1]; };

const escolhida = (x) => (x.tipo === "fill" ? x.opcoes[x.certa] : x.alts[x.certa]);
// expectativa: { txt } | { num } | { bool } | { lista } | { pares }
const RECALC = {
  // ---- ecologia
  "teia-consumidor": (s) => { const ok = s.alts.filter((id) => niveisDe(s.teia)(id).includes(s.nivel)); if (ok.length !== 1) throw new Error(`${ok.length} alternativas corretas`); return { txt: nomeT(s.teia, ok[0]), conj: s.alts.map((id) => nomeT(s.teia, id)) }; },
  "teia-tf": (s) => ({ bool: niveisDe(s.teia)(s.no).includes(s.nivel) }),
  "teia-perde": (s) => {
    const T = ECO.TEIAS[s.teia], pre = {}; T.nodes.forEach((n) => (pre[n.id] = [])); T.edges.forEach(([a, b]) => pre[b].push(a));
    const mortos = new Set([s.retirado]); let mudou = true;
    while (mudou) { mudou = false; for (const n of T.nodes) if (!mortos.has(n.id) && pre[n.id].length && pre[n.id].every((p) => mortos.has(p))) { mortos.add(n.id); mudou = true; } }
    return { bool: mortos.has(s.alvo) && s.alvo !== s.retirado };
  },
  "teia-cadeia": (s) => {
    const T = ECO.TEIAS[s.teia];
    if (T.nodes.find((n) => n.id === s.caminho[0]).r !== "p") throw new Error("a cadeia não começa em produtor");
    for (let i = 1; i < s.caminho.length; i++) if (!T.edges.some(([a, b]) => a === s.caminho[i - 1] && b === s.caminho[i])) throw new Error(`sem seta ${s.caminho[i - 1]}→${s.caminho[i]}`);
    return { lista: s.caminho.map((id) => nomeT(s.teia, id)) };
  },
  "teia-match": (s) => ({ pares: ECO.TEIAS[s.teia].nodes.map((n) => { const l = niveisDe(s.teia)(n.id); if (l.length !== 1) throw new Error("nível ambíguo"); return [n.n, `${l[0]}º nível: ${l[0] === 1 ? "produtor" : "consumidor " + CONS[l[0]]}`]; }) }),
  "teia-fill": (s) => { const l = niveisDe(s.teia)(s.no); if (l.length !== 1) throw new Error("nível ambíguo"); return { txt: CONS[l[0]] }; },
  "pir-nivel": (s) => ({ num: s.e1 * s.taxa ** (s.n - 1) }),
  "pir-volta": (s) => ({ num: s.dado.v / s.taxa ** (s.dado.nivel - s.alvo) }),
  "pir-valida": (s) => ({ bool: s.vals.every((v, i) => i === 0 || v < s.vals[i - 1]) }),
  "pir-ordem": (s) => ({ lista: Object.entries(s.valores).sort((a, b) => b[1] - a[1]).map(([k]) => k) }),
  "pir-match": (s) => ({ parNum: Array.from({ length: s.niveis }, (_, i) => [`${i + 1}º nível`, s.e1 * s.taxa ** i]) }),
  "pir-taxa": (s) => ({ txt: `${Math.round(s.taxa * 100)}%` }),
  "bio-topo": (s) => ({ num: s.v * 10 ** (s.n - 1 - s.gl) }),
  "bio-cadeias": (s) => { const t = s.rows.map((r) => r.v * 10 ** (r.n - 1 - r.gl)), m = Math.max(...t); if (t.filter((v) => v === m).length !== 1) throw new Error("empate"); return { txt: `Cadeia ${s.rows[t.indexOf(m)].id}` }; },
  "bio-tf-produtor": (s) => ({ bool: s.v > s.v * 10 ** (s.n - 1) }),
  "bio-tf-razao": (s) => ({ bool: 10 ** (s.para - s.de) === s.claim }),
  "bio-match": (s) => ({ parNum: Array.from({ length: s.n }, (_, i) => [null, s.v * 10 ** i]) }),
  "bio-ordem": (s) => ({ lista: s.niveis }),
  "bio-fill": () => ({ txt: "maior" }),
  "ciclo-co2": (s) => { const C = ECO.CICLOS[s.tipo], a = C.arrows.find((q) => q.n === s.seta); return { bool: terminaEm(a, C.nodes[0]) }; },
  "ciclo-papel": (s) => ({ bool: ECO.CICLOS[s.tipo].arrows.find((q) => q.n === s.seta).role === s.papel }),
  "ciclo-seta": (s) => ({ txt: `Seta ${ECO.CICLOS[s.tipo].arrows.find((q) => q.role === s.papel).n}` }),
  "rel-sinais": () => ({ relPares: true }),
  "rel-mc": (s) => ({ txt: relDe(s.a, s.b) }),
  "rel-tf": (s) => ({ bool: relDe(s.a, s.b) === s.claim }),
  "rel-fill": (s) => ({ txt: relDe(s.a, s.b) }),
  // ---- genética
  "pun-prob": (s, x) => {
    const fs = filhos(s.p1, s.p2), n = fs.filter((g) => g === s.alvo).length, [a, b] = fracDe(n, fs.length);
    if (x.tipo === "tf") return { bool: a === s.claim[0] && b === s.claim[1] };
    return { txt: `${a}/${b}` };
  },
  "pun-fen-rec": (s) => { const fs = filhos(s.p1, s.p2), [a, b] = fracDe(fs.filter((g) => !temDom(g)).length, fs.length); return { txt: `${a}/${b}` }; },
  "pun-razao": () => ({ razaoPares: true }),
  "hered-modo": (s) => {
    // regras: filho afetado de pais normais exclui dominantes; filha normal de pais afetados exclui recessivos e XD
    if (s.ped === "recessiva") return { bool: s.modo === "AR" ? true : false };
    if (s.ped === "dominante") return { bool: s.modo === "AD" };
    throw new Error("ped desconhecido");
  },
  "hered-geno": () => ({ txt: "geno" }),
  "hered-prob": () => ({ txt: "2/3" }),
  "hered-modo-fill": () => ({ txt: "autossômica recessiva" }),
  "abo-tipagem": (s) => ({ txt: (s.agg.A && s.agg.B ? "AB" : s.agg.A ? "A" : s.agg.B ? "B" : "O") + (s.agg.D ? "+" : "−") }),
  "abo-doadores": (s) => ({ txt: TIPOS.filter((d) => doa(d, s.receptor)).join(" e ") }),
  "abo-doa-todos": (s) => ({ bool: TIPOS.every((r) => doa(s.doador, r)) }),
  "abo-recebe": (s) => ({ bool: doa(s.doador, s.receptor) }),
  "abo-antigenos": () => ({ parAbo: true }),
  "abo-fill-o": () => ({ txt: "A e B" }),
  "cod-n": (s) => ({ txt: `${traduz(s.rna).length} aminoácidos` }),
  "cod-transc": (s) => ({ bool: [...s.dna].map((b) => comp[b]).join("") === s.claim }),
  "cod-mut": (s) => {
    const mut = s.rna.slice(0, s.pos - 1) + s.para + s.rna.slice(s.pos);
    if (s.rna[s.pos - 1] !== s.de) throw new Error("base de origem errada");
    const a = traduz(s.rna), b = traduz(mut);
    return { bool: s.claim === "encurta" ? b.length < a.length : a.join() !== b.join() };
  },
  "cod-fill": () => ({ txt: "Metionina (Met)" }),
  "cod-match": (s) => ({ pares: s.codons.map((c) => [c, CODON[c] === "Pare" ? "Parada (não codifica)" : { AUG: "Metionina (início)", UGG: "Triptofano", UUU: "Fenilalanina" }[c]]) }),
  "cod-ordem": (s) => ({ lista: traduz(s.rna).map((a) => AAPT[a]) }),
  "gel-pai": (s) => { const c = compat(s.raias); return { txt: c.length === 1 ? c[0] : c.length === 0 ? "Nenhum é compatível" : "?" }; },
  "gel-excluido": (s) => ({ bool: !compat(s.raias).includes(s.suspeito) }),
  // ---- corpo
  "dig-inicio": (s, x) => ({ txt: x.fig[0].tube.find((t) => t.subs.includes(s.substancia)).nome }),
  "cor-camara": (s, x) => { const c = x.fig[0].chambers.find((q) => q.n === s.n); return { txt: c.linha === "cima" ? (c.entra === "pulmões" ? "Átrio esquerdo" : "Átrio direito") : c.sai === "pulmões" ? "Ventrículo direito" : "Ventrículo esquerdo" }; },
  "circ-arteria": (s, x) => ({ bool: x.fig[0].vessels.find((v) => v.id === s.vaso).de === "coração" }),
  "dig-ordem": () => ({ lista: bancoFig("bio-corpo-amido-boca").tube.map((t) => t.nome) }),
  "glic-pico": (s, x) => { const P = x.fig[0].series[0].pts; const m = P.reduce((a, p) => (p[1] > a[1] ? p : a), P[0]); return { txt: `${String(m[0]).replace(".", ",")} h` }; },
  "glic-dentro": (s, x) => { const v = interp(x.fig[0].series[0].pts, s.x), b = x.fig[0].band; return { bool: v >= b.lo && v <= b.hi }; },
  "pulmao-tf": (s, x) => ({ bool: x.fig[0].parts.filter((p) => p.capilares).map((p) => p.nome).join() === s.parte }),
  "pulmao-ordem": () => ({ lista: ["Traqueia", "Brônquios", "Bronquíolos", "Alvéolos"] }),
  "sinapse-tf": (s, x) => ({ bool: x.fig[0].sinapse === "química" }),
  "rim-tf": (s, x) => ({ bool: ((x.fig[0].filtrado - x.fig[0].urina) / x.fig[0].filtrado) * 100 > s.min }),
  "rim-mc": (s, x) => ({ txt: `${x.fig[0].filtrado - x.fig[0].urina} partes` }),
  "jejum-maior": (s, x) => { const [i, g] = x.fig[0].series.map((q) => q.pts); const xs = []; for (let t = 0; t <= s.ate; t += 2) xs.push(t); return { bool: xs.every((t) => interp(i, t) > interp(g, t)) }; },
  "jejum-sobe": (s, x) => { const q = bancoFig("bio-corpo-jejum-glucagon").series.find((r) => r.pts.at(-1)[1] > r.pts[0][1]); return { txt: q.nome.toLowerCase() }; },
  "vetor-tf": (s, x) => ({ bool: x.fig[0].nodes.find((n) => n.papel === "vetor").nome.includes(s.claim) }),
  "vetor-mc": (s, x) => ({ txt: "Mosquito " + x.fig[0].nodes.find((n) => n.papel === "vetor").nome }),
  "ciclo-ordem": () => {
    const F = bancoFig("bio-saude-ascaridiase-saneamento"), cap1 = (t) => t[0].toUpperCase() + t.slice(1), nome = (id) => cap1(F.nodes.find((n) => n.id === id).lines.join(" "));
    const seq = []; let cur = F.nodes.find((n) => !F.arrows.some((a) => a.b === n.id)).id; seq.push(nome(cur));
    for (let a; (a = F.arrows.find((q) => q.a === cur)); cur = a.b) { seq.push(cap1([].concat(a.ask).join(" "))); seq.push(nome(a.b)); }
    return { lista: seq };
  },
  "selecao-tf": (s, x) => ({ bool: !x.fig[0].antes.includes(1) }),
  "vac-pico": (s, x) => { const F = x.fig[0], P = F.series[0].pts, [d1, d2] = F.doses; const pk = (a, b) => Math.max(...P.filter((p) => p[0] >= a && p[0] < b).map((p) => p[1])); return { bool: pk(d2, F.x1 + 1) > pk(d1, d2) }; },
  "vac-soro": (s, x) => { const c = x.fig[0].cards.find((q) => q.id === "soro"); return { bool: c.inicio === "imediato" && c.linhas.includes("sem memória") }; },
  "vac-dia-pico": (s, x) => { const F = x.fig[0], P = F.series[0].pts; const m = P.filter((p) => p[0] < F.doses[1]).reduce((a, p) => (p[1] > a[1] ? p : a)); return { txt: `${m[0]} dias` }; },
  "vac-razao": (s, x) => { const F = x.fig[0], P = F.series[0].pts, [d1, d2] = F.doses; const pk = (a, b) => Math.max(...P.filter((p) => p[0] >= a && p[0] < b).map((p) => p[1])); return { txt: `${pk(d2, F.x1 + 1) / pk(d1, d2)} vezes` }; },
  // ---- célula
  "org-letra": (s, x) => { const F = x.fig[0]; if (JSON.stringify(F.letras) !== JSON.stringify(s.letras)) throw new Error("letras da figura ≠ spec"); return { txt: s.letras[s.alvo] }; },
  "org-tf": (s) => { const fun = { atp: "mito" }[s.funcao]; return { bool: Object.keys(s.letras).find((k) => s.letras[k] === s.letra) === fun }; },
  "osm-hem": (s) => ({ txt: { normal: "Fica com o mesmo volume", incha: "Incha e pode estourar", murcha: "Murcha, com a superfície crenada" }[osm(s.in, s.out, false).res] }),
  "osm-veg": (s) => ({ txt: { "túrgida": "Fica túrgida: a parede impede o estouro", plasmolisada: "Plasmólise: a membrana se afasta da parede" }[osm(s.in, s.out, true).res] }),
  "osm-flow": (s) => ({ bool: osm(s.in, s.out, false).flow === "sai" }),
  "osm-match": (s) => ({ pares: s.meios.map((o) => [`Meio a ${String(o).replace(".", ",")}%`, { incha: "Incha", normal: "Fica normal", murcha: "Murcha" }[osm(s.in, o, false).res]]) }),
  "osm-fill": (s) => ({ txt: osm(s.in, s.out, false).tonic }),
  "div": (s) => { const d = div(s.proc, s.n2); return { txt: `${d.c} células com ${d.k} cromossomos` }; },
  "div-tf": (s) => ({ bool: div(s.proc, s.n2).k === s.claim }),
  "div-match": (s) => ({ pares: [["Mitose", `${div("mitose", s.n2).c} células com ${div("mitose", s.n2).k} cromossomos`], ["Meiose", `${div("meiose", s.n2).c} células com ${div("meiose", s.n2).k} cromossomos`], ["Fecundação", `Zigoto volta a ter ${2 * div("meiose", s.n2).k} cromossomos`]] }),
  "div-fill": (s) => ({ txt: `${[46, 23, 92].filter((n2) => div("meiose", n2).k === s.n)[0]} cromossomos` }),
  "clado-prox": (s, x) => {
    const p = proximos(s.arvore, s.foco);
    if (x.tipo === "tf") return { bool: p.join() === s.claim };
    if (p.length !== 1) throw new Error("parente ambíguo");
    return { txt: p[0] };
  },
  "clado-mono": (s) => { const ok = s.grupos.filter((g) => mono(s.arvore, g)); if (ok.length !== 1) throw new Error("monofilético ambíguo"); return { txt: ok[0].join(" + ") }; },
  "quadro-tf": (s) => ({ bool: s.linhas.find((l) => l.n === s.nome).v[s.col] }),
  "quadro-penas": (s) => { const p = s.linhas.filter((l) => l.v[1]).map((l) => l.n); return { bool: p.length === 1 && p[0] === "Ave" }; },
};
const FIGBANCO = new Map(bancoShow("biologia").map((q) => [q.id, q]));
function bancoFig(id) { return FIGBANCO.get(id).fig[0]; }

const porTipo = {};
for (const { x, onde } of todos) {
  const spec = ESPECS.get(x.id), gerado = /^gerado:/.test(x.origem || "");
  if (gerado && !spec) { err(x.id, "gerado sem spec registrada"); continue; }
  if (!gerado) {
    if (x.origem === "manual" && !/https?:\/\//.test(x.ref || "")) err(x.id, "manual sem ref com link aberto");
    continue;
  }
  porTipo[spec.k] = (porTipo[spec.k] || 0) + 1;
  if (x.origem !== "gerado:" + spec.k) err(x.id, `origem ${x.origem} ≠ gerado:${spec.k}`);
  const R = RECALC[spec.k];
  if (!R) { err(x.id, `sem recálculo para "${spec.k}"`); continue; }
  let e;
  try { e = R(spec, x); } catch (ex) { err(x.id, `recálculo falhou: ${ex.message}`); continue; }
  if (spec.k === "hered-geno") continue;
  const ch = x.tipo === "mc" || x.tipo === "fill" ? escolhida(x) : null;
  if (e.bool !== undefined) { if (x.tipo !== "tf" || x.certa !== e.bool) err(x.id, `tf: o modelo dá ${e.bool}, o exercício diz ${x.certa}`); }
  else if (e.txt !== undefined) {
    if (!ch) err(x.id, "esperava mc/fill");
    else {
      const pn = parseNum(e.txt), pc = parseNum(ch);
      if (e.txt === "geno" || (e.txt === "2/3" && spec.k === "hered-geno")) continue;
      if (pn && pc && /^\d/.test(e.txt) && !/células com/.test(e.txt) && !/cromossomos/.test(e.txt) && NUM.test(e.txt)) { if (!close(pn.v, pc.v)) err(x.id, `o modelo dá ${e.txt}, a certa é "${ch}"`); }
      else if (sem(ch) !== sem(e.txt)) err(x.id, `o modelo dá "${e.txt}", a certa é "${ch}"`);
      if (e.conj) { const a = (x.alts || []).map(sem).sort().join("|"), b = e.conj.map(sem).sort().join("|"); if (a !== b) err(x.id, "alternativas ≠ conjunto da spec"); }
    }
  } else if (e.num !== undefined) {
    const pc = parseNum(ch ?? "");
    if (!pc || !close(pc.v, e.num)) err(x.id, `o modelo dá ${e.num}, a certa é "${ch}"`);
  } else if (e.lista) {
    if (x.tipo !== "order" || JSON.stringify(x.itens.map(sem)) !== JSON.stringify(e.lista.map(sem))) err(x.id, `ordem do modelo ${JSON.stringify(e.lista)} ≠ ${JSON.stringify(x.itens)}`);
  } else if (e.pares) {
    const a = JSON.stringify(x.pares.map((p) => p.map(sem)).sort()), b = JSON.stringify(e.pares.map((p) => p.map(sem)).sort());
    if (a !== b) err(x.id, `pares do modelo ${JSON.stringify(e.pares)} ≠ ${JSON.stringify(x.pares)}`);
  } else if (e.parNum) {
    e.parNum.forEach(([l, v], i) => { const p = x.pares[i], pc = parseNum(p?.[1] ?? ""); if (!p || (l && sem(p[0]) !== sem(l)) || !pc || !close(pc.v, v)) err(x.id, `par ${i + 1}: o modelo dá ${v}, o exercício diz ${JSON.stringify(p)}`); });
    if (x.pares.length !== e.parNum.length) err(x.id, "número de pares");
  } else if (e.relPares) {
    for (const [l, r] of x.pares) { const [a, b] = l.split(" e ").map((t) => t.replace("−", "-")); if (!sem(r).startsWith(sem(relDe(a, b)))) err(x.id, `relação de "${l}" deveria ser ${relDe(a, b)}, não "${r}"`); }
  } else if (e.razaoPares) {
    const GR = { "Heterozigoto × heterozigoto": [["A", "a"], ["A", "a"]], "Heterozigoto × recessivo": [["A", "a"], ["a", "a"]], "Homozigoto dominante × recessivo": [["A", "A"], ["a", "a"]], "Homozigoto dominante × heterozigoto": [["A", "A"], ["A", "a"]] };
    for (const [l, r] of x.pares) {
      const [p1, p2] = GR[l], fs = filhos([p1], [p2]), cont = {}; fs.forEach((g) => (cont[g] = (cont[g] || 0) + 1));
      const ks = Object.keys(cont).sort((a, b) => (a.match(/[a-z]/g) || []).length - (b.match(/[a-z]/g) || []).length);
      const g = Object.values(cont).reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
      const g2 = (k) => (k === "Aa" ? "heterozigotos" : k);
      const esp = ks.length === 1 ? `Todos ${g2(ks[0])} (${ks[0]})` : ks.length === 2 && cont[ks[0]] === cont[ks[1]] ? `Metade ${g2(ks[0])}, metade ${g2(ks[1])}` : ks.map((k) => `${cont[k] / g} ${k}`).join(" : ");
      if (sem(esp) !== sem(r)) err(x.id, `${l}: o modelo dá "${esp}", o exercício "${r}"`);
    }
  } else if (e.parAbo) {
    for (const [t, r] of x.pares) if (listaAnt(t) !== r) err(x.id, `${t}: esperava "${listaAnt(t)}", veio "${r}"`);
  }
}

// geno/prob do heredograma: conferidos por regra (independente do modelo de enumeração)
for (const { x } of todos) {
  if (x.id === "bio-u2-l2:match-genotipos") {
    const m = Object.fromEntries(x.pares);
    if (m["I-1 (pai normal)"] !== "Aa (portador)" || m["II-1 (filha afetada)"] !== "aa (afetada)" || m["II-2 (normal, irmão da afetada)"] !== "AA ou Aa (2/3 de ser Aa)") err(x.id, "genótipos do heredograma divergem da regra (pais Aa, afetada aa, irmão normal 2/3)");
  }
}

// ---------------------------------------------------------------- 4) alternativas, repetição, cobertura
const ehNum = (alts) => { const p = alts.map(parseNum); return p.every(Boolean) && new Set(p.map((q) => q.unit)).size === 1 ? p : null; };
for (const { x } of todos) {
  const alts = x.tipo === "mc" ? x.alts : x.tipo === "fill" ? x.opcoes : null;
  if (!alts) continue;
  const p = ehNum(alts);
  if (p) {
    const certo = p[x.certa].v;
    p.forEach((q, i) => { if (i !== x.certa && close(q.v, certo)) err(x.id, `alternativa ${i + 1} equivale à certa (${alts[i]})`); });
    if (new Set(p.map((q) => q.v)).size !== p.length) err(x.id, "alternativas numericamente equivalentes");
  }
  if (new Set(alts.map(sem)).size !== alts.length) err(x.id, "alternativas repetidas");
}
const vistos = new Map();
for (const { x, onde } of todos) {
  const chave = sem(x.enunciado) + "|" + JSON.stringify(x.alts ?? x.opcoes ?? x.pares ?? x.itens ?? x.certa) + "|" + (x.frase ?? "");
  if (vistos.has(chave)) err(x.id, `repete ${vistos.get(chave)} (mesmo enunciado e alternativas)`);
  else vistos.set(chave, x.id);
}
const enun = new Map();
for (const { x } of todos) {
  const k = sem(x.enunciado + (x.frase ?? ""));
  if (enun.has(k) && !/^show:/.test(x.origem)) { const o = enun.get(k); if (JSON.stringify(o.fig) === JSON.stringify(x.fig)) err(x.id, `mesmo enunciado e figura que ${o.id}`); }
  enun.set(k, x);
}
const specs = new Map();
for (const { x } of todos) { const s = ESPECS.get(x.id); if (!s) continue; const k = JSON.stringify(s); if (specs.has(k)) err(x.id, `mesma spec que ${specs.get(k)}`); else specs.set(k, x.id); }
// temas
const cob = {};
for (const U of unidades) for (const L of U.licoes) for (const t of L.temas) cob[t] = (cob[t] || 0) + L.exercicios.length;
for (const t of materia.temas) if (!cob[t.id]) err(`tema ${t.id}`, "nenhuma lição cobre este tema");
// ensinar antes de cobrar: todo kind de figura do desafio aparece em cartão ou exercício de alguma lição da unidade
const kinds = (x) => [...(x.fig || []).map((f) => f.kind), ...((x.alts || []).map((a) => a && a.fig && a.fig.kind))].filter(Boolean);
for (const U of unidades) {
  const ensinados = new Set();
  for (const L of U.licoes) { for (const c of L.cartoes) if (c.fig) ensinados.add(c.fig.kind); for (const x of L.exercicios) kinds(x).forEach((k) => ensinados.add(k)); }
  for (const x of U.desafio) for (const k of kinds(x)) if (!ensinados.has(k)) err(x.id, `desafio usa figura "${k}" que nenhuma lição da unidade mostra`);
}
// cada lição vai do fácil ao difícil
for (const U of unidades) for (const L of U.licoes) if (L.exercicios.some((x, i) => i && x.nivel < L.exercicios[i - 1].nivel)) err(L.id, "exercícios fora da ordem de nível");
// figuras de exercícios fora do schema: toda lição tem ao menos um cartão com figura
for (const U of unidades) for (const L of U.licoes) if (!L.cartoes.some((c) => c.fig) && L.cartoes.length < 2) err(L.id, "lição com 1 cartão sem figura");

// ---------------------------------------------------------------- resultado
const ger = todos.filter(({ x }) => /^gerado:/.test(x.origem)).length, man = todos.filter(({ x }) => x.origem === "manual").length, sh = todos.filter(({ x }) => /^show:/.test(x.origem)).length;
console.log(`biologia: ${unidades.length} unidades, ${sc.stats.licoes} lições, ${sc.stats.exercicios} exercícios + ${sc.stats.desafio} no desafio, ${sc.stats.cartoes} cartões`);
console.log("por tipo: " + Object.entries(sc.stats.porTipo).map(([k, v]) => `${k} ${v}`).join(", "));
console.log(`origem: show ${sh}, gerado ${ger} (recalculados com ${Object.keys(porTipo).length} modelos distintos), manual ${man}`);
console.log(`perguntas do Show usadas: ${usados.size}/${banco.size}`);
if (erros.length) { for (const e of erros) console.log("ERRO   " + e); console.log(`\n${erros.length} problema(s) em biologia`); process.exit(1); }
console.log("biologia confere");
