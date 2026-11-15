// ---- Trilha de química orgânica para o ENEM. Toda resposta vem de analyze() (chem.mjs). ----
const $ = (sel, el = document) => el.querySelector(sel);
const UNIT = 42;
const INK = "#1c2541";
const ELC = { C: "#3d4357", O: "#e4504a", H: "#f7f4ec" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const r1 = (n) => Number(n.toFixed(1));
const fmtT = (t) => (t === null || t === undefined ? "—" : `${String(Math.abs(t) < 1 && t !== 0 ? t.toFixed(1) : Math.round(t)).replace("-", "−").replace(".", ",")} °C`);
const capFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const FORDER = ["alcool", "fenol", "eter", "aldeido", "cetona", "acido", "ester"];
const store = {
  get() { try { return JSON.parse(localStorage.getItem("trilha-quimica") || "{}"); } catch { return {}; } },
  set(v) { try { localStorage.setItem("trilha-quimica", JSON.stringify(v)); } catch {} },
};
const progress = Object.assign({ intro: 0, missions: [], hunted: [], thermo: [], oil: [] }, store.get());
const save = () => { store.set(progress); renderTabs(); };

// ----------------------------------------------------------------------------- desenho de moléculas (bolas, traços, bastão)
const xyOf = (a) => toXY(a.q, a.r);
function labelOf(A, a, view, xy) {
  const h = A.info[a.id].h;
  const nbs = A.nb[a.id];
  const allRight = nbs.length > 0 && nbs.every((x) => xy[x.id][0] > xy[a.id][0] + 0.01);
  if (a.el === "O") return h ? (allRight ? "HO" : "OH") : "O";
  if ((view === "bastao" || (view === "tracos" && A.rings.some((r) => r.includes(a.id)))) && nbs.length) return null;
  const hs = h ? "H" + (h > 1 ? subN(h) : "") : "";
  if (!hs) return "C";
  return allRight ? hs + "C" : "C" + hs;
}
function freeDirs(m, a) {
  const used = m.bonds.filter((b) => b.a === a.id || b.b === a.id).map((b) => {
    const o = m.atoms.find((x) => x.id === (b.a === a.id ? b.b : b.a));
    return DIRS.findIndex(([dq, dr]) => a.q + dq === o.q && a.r + dr === o.r);
  });
  const free = [0, 1, 2, 3, 4, 5].filter((k) => !used.includes(k));
  const gap = (k) => (used.length ? Math.min(...used.map((j) => Math.min((k - j + 6) % 6, (j - k + 6) % 6))) : 3);
  // espalha: primeiro as direções mais longe das ligações, depois as mais longe umas das outras
  const out = [];
  const pool = [...free];
  while (pool.length) {
    pool.sort((p, q) => {
      const sp = gap(p) + (out.length ? Math.min(...out.map((j) => Math.min((p - j + 6) % 6, (j - p + 6) % 6))) : 0);
      const sq = gap(q) + (out.length ? Math.min(...out.map((j) => Math.min((q - j + 6) % 6, (j - q + 6) % 6))) : 0);
      return sq - sp;
    });
    out.push(pool.shift());
  }
  return out;
}
// opt: view, groups (para auréolas), tags (escrever o nome da função), box ([x0,y0,x1,y1] em unidades), grid, sel, unit, pad, bad
function drawMol(m, A, opt = {}) {
  const view = opt.view || "bastao";
  if (opt.groups === "all") opt = { ...opt, groups: A.groups };
  const U = opt.unit || UNIT;
  const xy = Object.fromEntries(m.atoms.map((a) => [a.id, xyOf(a)]));
  let box = opt.box;
  if (!box) {
    const xs = m.atoms.map((a) => xy[a.id][0]), ys = m.atoms.map((a) => xy[a.id][1]);
    const pad = opt.pad ?? (view === "bolas" ? 1.05 : 0.75);
    box = xs.length ? [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad] : [-2, -1, 2, 1];
  }
  const W = (box[2] - box[0]) * U, H = (box[3] - box[1]) * U;
  const P = ([x, y]) => [r1((x - box[0]) * U), r1((y - box[1]) * U)];
  let s = "";
  // grade de pontos (montador)
  if (opt.grid) {
    for (let q = -14; q <= 14; q++) for (let r = -14; r <= 14; r++) {
      const [x, y] = toXY(q, r);
      if (x < box[0] + 0.3 || x > box[2] - 0.3 || y < box[1] + 0.3 || y > box[3] - 0.3) continue;
      const [px, py] = P([x, y]);
      s += `<circle cx="${px}" cy="${py}" r="2.6" fill="#d6ccb6"/>`;
    }
  }
  // auréolas das funções
  for (const g of opt.groups || []) {
    const col = FCOLOR[g.func] || "#999";
    for (const b of m.bonds) if (g.atoms.includes(b.a) && g.atoms.includes(b.b)) { const [x1, y1] = P(xy[b.a]), [x2, y2] = P(xy[b.b]); s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col}" stroke-opacity=".32" stroke-width="${r1(U * 0.78)}" stroke-linecap="round"/>`; }
    for (const id of g.atoms) { const [x, y] = P(xy[id]); s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.42)}" fill="${col}" fill-opacity=".32" stroke="${col}" stroke-width="2"/>`; }
  }
  const labels = Object.fromEntries(m.atoms.map((a) => [a.id, view === "bolas" ? null : labelOf(A, a, view, xy)]));
  const rad = (id) => (labels[id] ? (labels[id].length <= 1 ? 0.26 : 0.38) : 0);
  // ligações
  for (const b of m.bonds) {
    const [ax, ay] = xy[b.a], [bx, by] = xy[b.b];
    const dx = bx - ax, dy = by - ay, L0 = Math.hypot(dx, dy), ux = dx / L0, uy = dy / L0, nx = -uy, ny = ux;
    const s0 = view === "bolas" ? 0 : rad(b.a), s1 = view === "bolas" ? 0 : rad(b.b);
    const p1 = [ax + ux * s0, ay + uy * s0], p2 = [bx - ux * s1, by - uy * s1];
    const offs = b.o === 1 ? [0] : b.o === 2 ? [-1, 1] : [-1.6, 0, 1.6];
    const gap = view === "bolas" ? 0.09 : 0.07;
    for (const o of offs) {
      const [x1, y1] = P([p1[0] + nx * gap * o, p1[1] + ny * gap * o]), [x2, y2] = P([p2[0] + nx * gap * o, p2[1] + ny * gap * o]);
      if (view === "bolas") s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${b.o === 1 ? 7 : 5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${b.o > 1 ? "#f2b63c" : "#c3cad8"}" stroke-width="${b.o === 1 ? 4.2 : 2.6}" stroke-linecap="round"/>`;
      else s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
  }
  // átomos
  for (const a of m.atoms) {
    const [x, y] = P(xy[a.id]);
    if (view === "bolas") {
      const h = A.info[a.id].h;
      const dirs = freeDirs(m, a).slice(0, h);
      for (const k of dirs) {
        const [hx0, hy0] = toXY(a.q + DIRS[k][0] * 0.62, a.r + DIRS[k][1] * 0.62);
        const [hx, hy] = P([hx0, hy0]);
        s += `<path d="M${x} ${y}L${hx} ${hy}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y}L${hx} ${hy}" stroke="#c3cad8" stroke-width="2.6" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="${r1(U * 0.17)}" fill="${ELC.H}" stroke="${INK}" stroke-width="1.6"/><circle cx="${r1(hx - U * 0.05)}" cy="${r1(hy - U * 0.05)}" r="${r1(U * 0.05)}" fill="#fff"/>`;
      }
      const rr = a.el === "C" ? U * 0.27 : U * 0.25;
      s += `<circle cx="${x}" cy="${y}" r="${r1(rr)}" fill="${ELC[a.el]}" stroke="${INK}" stroke-width="1.8"/><circle cx="${r1(x - rr * 0.35)}" cy="${r1(y - rr * 0.38)}" r="${r1(rr * 0.3)}" fill="#fff" fill-opacity=".45"/>`;
      if (opt.letters) s += `<text x="${x}" y="${r1(y + 4.5)}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${a.el}</text>`;
    } else if (labels[a.id]) {
      const t = labels[a.id];
      const col = a.el === "O" ? "#c23a30" : INK;
      s += `<text x="${x}" y="${r1(y + 6)}" text-anchor="middle" font-size="${r1(U * 0.42)}" font-weight="700" fill="${col}" font-family="Trebuchet MS, sans-serif">${esc(t)}</text>`;
    }
    if (opt.sel === a.id) s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.43)}" fill="none" stroke="#e08a2f" stroke-width="3" stroke-dasharray="5 4"/>`;
    if (opt.bad === a.id) s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.45)}" fill="none" stroke="#c23a30" stroke-width="3.2"/>`;
  }
  // nome da função escrito perto do grupo
  if (opt.tags) {
    const cx = m.atoms.reduce((t, a) => t + xy[a.id][0], 0) / m.atoms.length, cy = m.atoms.reduce((t, a) => t + xy[a.id][1], 0) / m.atoms.length;
    for (const g of opt.groups || []) {
      const gx = g.atoms.reduce((t, id) => t + xy[id][0], 0) / g.atoms.length, gy = g.atoms.reduce((t, id) => t + xy[id][1], 0) / g.atoms.length;
      let dx = gx - cx, dy = gy - cy; const L0 = Math.hypot(dx, dy) || 1; dx /= L0; dy /= L0;
      const [tx, ty] = P([gx + dx * 1.0, gy + dy * 1.0 + 0.1]);
      s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${FCOLOR[g.func]}" stroke="#fffdf6" stroke-width="4" paint-order="stroke" font-family="Trebuchet MS, sans-serif">${esc(FNAME[g.func])}</text>`;
    }
  }
  return { svg: `<svg viewBox="0 0 ${r1(W)} ${r1(H)}" width="${r1(W)}" role="img" aria-label="${esc(opt.label || "molécula")}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`, box, W, H };
}
const specMol = (spec) => fromSpec(spec);
const quick = (spec, view = "bastao", extra = {}) => { const m = specMol(spec); const A = analyze(m); return { m, A, ...drawMol(m, A, { view, ...extra }) }; };
const chipF = (f) => `<span class="chip"><i style="background:${FCOLOR[f]}"></i>${esc(FNAME[f])}</span>`;
const forceChips = (A) => `<div class="force"><span class="lo">velcro de ${A.count.C} C (London)</span>${A.forces.dipolo ? `<span class="di">ímã (dipolo)</span>` : ""}${A.forces.hbond ? `<span class="hb">abraço O−H (lig. de H)</span>` : ""}</div>`;

// ----------------------------------------------------------------------------- estações e abas
const STATIONS = [
  { id: "intro", nome: "Começo", ic: "1" },
  { id: "montar", nome: "Montar", ic: "2" },
  { id: "cacar", nome: "Caçar", ic: "3" },
  { id: "ferver", nome: "Ferver/Água", ic: "4" },
];
let station = "intro";
const main = $("#main");
function renderTabs() {
  const counts = { intro: progress.intro >= SLIDES.length - 1 ? "✓" : "", montar: progress.missions.length ? `${progress.missions.length}/${MISSIONS.length}` : "", cacar: progress.hunted.length ? `${progress.hunted.length}/${HUNT.length}` : "", ferver: progress.thermo.length + progress.oil.length ? `${progress.thermo.length + progress.oil.length}/${ROUNDS.length + OIL.length}` : "" };
  $("#tabs").innerHTML = STATIONS.map((s) => `<button type="button" data-st="${s.id}" aria-current="${s.id === station ? "page" : "false"}"><b>${s.ic}</b>${s.nome}<i>${counts[s.id]}</i></button>`).join("");
  const total = (progress.intro >= SLIDES.length - 1 ? 1 : 0) + progress.missions.length + progress.hunted.length + progress.thermo.length + progress.oil.length;
  const max = 1 + MISSIONS.length + HUNT.length + ROUNDS.length + OIL.length;
  $("#stars").textContent = `★ ${total} de ${max}`;
}
$("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-st]"); if (b) go(b.dataset.st); });
function go(st) {
  station = st;
  renderTabs();
  ({ intro: renderIntro, montar: renderMontar, cacar: renderCacar, ferver: renderFerver })[st]();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// ----------------------------------------------------------------------------- 1. COMEÇO (introdução intuitiva)
let slide = 0;
const intro = { h: 0, n: 2, bond: 1, view: "bolas", count: null };
const SLIDES = [
  () => {
    const ex = [["Etanol", "combustível", { n: 2, group: "OH", at: 1 }], ["Vinagre", "ácido etanoico", { n: 2, group: "COOH" }], ["Acetona", "removedor de esmalte", { n: 3, group: "CO", at: 2 }], ["Gás de cozinha", "butano", { n: 4 }]];
    return `<h2>Por que isso cai tanto no ENEM?</h2><p class="lead">Combustível, vinagre, perfume, remédio, açúcar, plástico… quase tudo à sua volta é feito de <b>esqueletos de carbono</b>.</p><p>A prova mostra o desenho de uma molécula e pergunta <b>o que ela tem</b> e <b>como ela se comporta</b>. Nesta trilha você vai aprender a <b>ler esses desenhos</b>, do zero.</p><div class="pieces two">${ex.map(([n, s, sp]) => `<div class="mini">${quick(sp, "tracos", { unit: 34 }).svg}<div>${n}<br><span class="tip">${s}</span></div></div>`).join("")}</div><p class="tip">Repare: todas são carbonos de mãos dadas (C), com H em volta, e às vezes um O pendurado.</p>`;
  },
  () => {
    const h = intro.h;
    const m = blank(); const c = addAtom(m, "C", 0, 0); void c;
    const A = analyze(m);
    // desenho próprio: C no centro e só os H já encaixados
    const pts = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let s = "";
    pts.forEach(([dx, dy], k) => {
      const x = 90 + dx * 48, y = 70 + dy * 48;
      if (k < h) s += `<path d="M90 70L${x} ${y}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M90 70L${x} ${y}" stroke="#c3cad8" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="${ELC.H}" stroke="${INK}" stroke-width="1.8"/>`;
      else s += `<path d="M90 70L${90 + dx * 26} ${70 + dy * 26}" stroke="${INK}" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/><circle cx="${90 + dx * 28} " cy="${70 + dy * 28}" r="4" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
    });
    s += `<circle cx="90" cy="70" r="16" fill="${ELC.C}" stroke="${INK}" stroke-width="2"/><text x="90" y="76" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">C</text>`;
    void A;
    const piece = (el, n, r, label) => { let t = ""; for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 - Math.PI / 2; t += `<path d="M50 45L${r1(50 + Math.cos(a) * 30)} ${r1(45 + Math.sin(a) * 30)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; } return `<div><svg viewBox="0 0 100 92">${t}<circle cx="50" cy="45" r="${el === "H" ? 9 : 14}" fill="${ELC[el]}" stroke="${INK}" stroke-width="2"/><text x="50" y="${el === "H" ? 49 : 50}" text-anchor="middle" font-size="13" font-weight="700" fill="${el === "H" ? INK : "#fff"}">${el}</text></svg>${label}</div>`; };
    return `<h2>As peças: quantas mãos cada uma tem</h2><div class="pieces">${piece("C", 4, 0, "Carbono: <b>4 mãos</b>")}${piece("O", 2, 0, "Oxigênio: <b>2 mãos</b>")}${piece("H", 1, 0, "Hidrogênio: <b>1 mão</b>")}</div><p class="lead">Toda mão precisa estar segurando alguém. Essa é a <b>regra dos 4</b> do carbono (o nome técnico é <b>valência</b>).</p><div class="board" id="introBoard"><svg viewBox="0 0 180 140">${s}</svg><div class="toast" id="introToast"></div></div><div class="row" style="margin-top:8px"><button class="pill main" id="addH" type="button">+ Encaixar um H</button><button class="pill" id="resetH" type="button">Recomeçar</button></div><p id="hMsg" class="tip">${h === 4 ? "<b>Pronto: CH₄, o metano</b> (gás natural). O carbono está com as 4 mãos ocupadas." : `Mãos livres: ${4 - h}. Toque em "Encaixar um H".`}</p>`;
  },
  () => {
    const { A, svg } = quick({ n: intro.n }, "bolas", { unit: 40 });
    return `<h2>Carbonos de mãos dadas</h2><p class="lead">Carbonos se ligam uns aos outros formando uma corrente: a <b>cadeia</b>. Os H ocupam as mãos que sobram.</p><div class="board mini">${svg}</div><div class="row" style="margin-top:8px;justify-content:center"><button class="pill" id="nMinus" type="button" aria-label="Menos um carbono">−</button><span class="big">${intro.n} C</span><button class="pill" id="nPlus" type="button" aria-label="Mais um carbono">+</button></div><p class="lead" style="text-align:center"><b>${esc(A.name)}</b> · ${A.formula}</p><p>O começo do nome conta os carbonos, é o <b>prefixo</b>: <b>1 met</b>, 2 et, 3 prop, 4 but, 5 pent, 6 hex, 7 hept, 8 oct.</p><p class="tip">Repare: cada carbono a mais traz 2 H a mais. Por isso a fórmula dos alcanos é CₙH₂ₙ₊₂.</p>`;
  },
  () => {
    const n = Math.max(2, intro.n);
    const { A, svg } = quick({ n, bond: intro.bond }, "bolas", { unit: 40 });
    const inf = { 1: "an", 2: "en", 3: "in" }[intro.bond];
    return `<h2>Ligação dupla e tripla</h2><p class="lead">Dois carbonos podem se dar <b>2 mãos</b> (dupla) ou <b>3 mãos</b> (tripla). Aí sobram menos mãos para os H.</p><div class="board mini">${svg}</div><div class="seg" style="margin-top:8px">${[1, 2, 3].map((b) => `<button type="button" data-bond="${b}" aria-pressed="${b === intro.bond}">${["simples", "dupla", "tripla"][b - 1]}</button>`).join("")}</div><p class="lead" style="text-align:center"><b>${esc(A.name)}</b> · ${A.formula}</p><p>O meio do nome conta o tipo de ligação, é o <b>infixo</b>: só simples <b>an</b>, uma dupla <b>en</b>, uma tripla <b>in</b>. Aqui: <b>${inf}</b>.</p><p class="tip">Alcano CₙH₂ₙ₊₂ · alceno CₙH₂ₙ · alcino CₙH₂ₙ₋₂. Com dupla ou tripla a cadeia é <b>insaturada</b>; só com simples, <b>saturada</b>.</p>`;
  },
  () => {
    const sp = { n: 4, group: "OH", at: 1 };
    const { A, svg } = quick(sp, intro.view, { unit: 40, letters: true });
    const q = quick({ n: 6 }, "bastao", { unit: 34 });
    const ans = intro.count;
    return `<h2>Três desenhos da mesma molécula</h2><p class="lead">A prova quase sempre usa o desenho mais curto, o <b>bastão</b>. Troque e compare:</p><div class="seg">${["bolas", "tracos", "bastao"].map((v) => `<button type="button" data-view="${v}" aria-pressed="${v === intro.view}">${{ bolas: "Bolas", tracos: "Traços", bastao: "Bastão" }[v]}</button>`).join("")}</div><div class="board mini" style="margin-top:8px">${svg}</div><p><b>${esc(A.name)}</b> · ${A.formula}. ${intro.view === "bastao" ? "No bastão, <b>cada ponta e cada dobra é um carbono</b>. Os H não aparecem: você calcula pela regra dos 4. O e OH sempre aparecem escritos." : intro.view === "tracos" ? "Nos traços cada carbono aparece com seus H juntinhos (CH₃, CH₂)." : "Nas bolas você vê todos os átomos: C escuro, O vermelho, H branco."}</p><h3>Treino: quantos carbonos tem este bastão?</h3><div class="mini" style="max-width:260px">${q.svg}</div><div class="options">${[4, 5, 6, 7].map((k) => `<button type="button" data-count="${k}"${ans !== null ? " disabled" : ""}${ans !== null && k === q.A.count.C ? ' data-res="right"' : ans === k && k !== q.A.count.C ? ' data-res="wrong"' : ""}>${k} carbonos</button>`).join("")}</div><div class="why ${ans === q.A.count.C ? "ok" : "bad"}"${ans === null ? " hidden" : ""}>${ans === q.A.count.C ? "Isso! " : "Quase. "}Conte as 2 pontas e as dobras: são ${q.A.count.C} carbonos, ${q.A.name} (${q.A.formula}).</div>`;
  },
  () => {
    const F = [
      ["alcool", "a mãozinha", "−OH num carbono que só faz ligações simples.", "ol", "etanol: combustível", { n: 2, group: "OH", at: 1 }],
      ["fenol", "a mãozinha no anel", "−OH grudado direto no anel aromático (hexágono com duplas alternadas).", "fenol", "desinfetantes", { ring: 6, aromatic: true, group: "OH" }],
      ["eter", "o sanduíche", "O no meio de dois carbonos: C−O−C.", "…oxi…ano", "éter: solvente", { n: 2, group: "OR", r: 2 }],
      ["aldeido", "o da ponta", "C=O na ponta da cadeia (o C ainda tem um H).", "al", "formol (metanal)", { n: 1, group: "CHO" }],
      ["cetona", "a do meio", "C=O no meio, com carbono dos dois lados.", "ona", "acetona", { n: 3, group: "CO", at: 2 }],
      ["acido", "o azedo", "No mesmo C: um =O e um −OH (−COOH).", "ácido …oico", "vinagre", { n: 2, group: "COOH" }],
      ["ester", "o perfumado", "No mesmo C: um =O e um −O− que vai para outro C.", "…ato de …ila", "essências de fruta", { n: 2, group: "COOR", r: 2 }],
    ];
    return `<h2>Pendurou oxigênio, mudou tudo</h2><p class="lead">O <b>grupo funcional</b> é o pedaço com O pendurado no esqueleto. Ele decide o nome, o cheiro, se ferve fácil, se mistura com água. Conheça os 7 personagens:</p><div class="fcards">${F.map(([f, apelido, como, suf, dia, sp]) => { const q = quick(sp, "tracos", { unit: 30, groups: "all" }); return `<div class="fcard" style="--fc:${FCOLOR[f]}"><div>${q.svg}</div><div><b>${FNAME[f]}</b> <span class="tip">“${apelido}”</span><p>${como}</p><p class="tip">Nome termina em <b>${suf}</b> · ${dia}</p></div></div>`; }).join("")}</div><p class="tip">Dica de ouro: para achar a função, <b>procure os O</b> e olhe quem está em volta de cada um.</p>`;
  },
  () => {
    const ms = [{ n: 4 }, { n: 4, group: "CO", at: 2 }, { n: 4, group: "OH", at: 1 }].map((sp) => quick(sp, "tracos", { unit: 30 }));
    const max = 130, min = -10;
    return `<h2>Por que uns fervem e outros não</h2><p class="lead">Moléculas se puxam umas às outras. Para ferver, o calor precisa <b>separar</b> as moléculas. Quanto mais forte o puxão, mais alta a temperatura.</p><div class="cards3">${[["velcro", "Dispersão de London", "Toda molécula tem. Fraquinho, mas cresce com o tamanho (mais C, mais velcro)."], ["ímã", "Dipolo-dipolo", "Quando tem O, a molécula vira um ímã fraco: um lado puxa o outro."], ["abraço", "Ligação de hidrogênio", "Quando tem O−H, o H abraça o O da vizinha. É o puxão mais forte."]].map(([n, t, d]) => `<div class="mcard" style="cursor:default;grid-template-columns:80px 1fr"><div class="big" style="font-size:20px">${n}</div><div><b>${t}</b><small>${d}</small></div></div>`).join("")}</div><h3>Mesmo tamanho (4 C), puxões diferentes</h3>${ms.map(({ A, svg }) => `<div class="mcard" style="cursor:default"><div>${svg}</div><div><b>${esc(A.name)}</b><span class="temp"> ${fmtT(A.pe)}</span>${forceChips(A)}<div class="prog" style="margin-top:6px"><i style="width:${r1(((A.pe - min) / (max - min)) * 100)}%;background:${A.forces.hbond ? "#e4504a" : A.forces.dipolo ? "#5aa9dd" : "#8d93ae"}"></i></div></div></div>`).join("")}<p><b>Semelhante dissolve semelhante:</b> a água é cheia de O−H. Quem também tem O−H (e é pequeno) se mistura com ela. Quem é só C e H fica separado, como óleo.</p>`;
  },
  () => `<h2>Pronta para praticar!</h2><p class="lead">Você já sabe as peças, a regra dos 4, o bastão, os 7 personagens e os 3 puxões. Agora é treino de verdade:</p><div class="cards3"><button class="mcard" type="button" data-goto="montar"><div class="big">2</div><div><b>Montar</b><small>monte cadeias com as próprias mãos e cumpra 13 missões</small></div></button><button class="mcard" type="button" data-goto="cacar"><div class="big">3</div><div><b>Caçar grupos</b><small>ache as funções em 16 moléculas reais, como na prova</small></div></button><button class="mcard" type="button" data-goto="ferver"><div class="big">4</div><div><b>Ferver e misturar</b><small>quem ferve primeiro? mistura com a água?</small></div></button></div><div class="idea">A grande ideia: o grupo funcional (o que fica pendurado no esqueleto) decide o nome e o comportamento; o esqueleto dá o tamanho.</div>`,
];
function renderIntro() {
  progress.intro = Math.max(progress.intro, slide); save();
  main.innerHTML = `<div class="card">${SLIDES[slide]()}<div class="dots">${SLIDES.map((_, i) => `<i${i === slide ? " data-on" : ""}></i>`).join("")}</div><div class="slidenav"><button class="pill" type="button" id="prev"${slide === 0 ? " disabled" : ""}>← Voltar</button><button class="pill main" type="button" id="next"${slide === SLIDES.length - 1 ? " disabled" : ""}>Próximo →</button></div></div>`;
}
main.addEventListener("click", (e) => {
  if (station !== "intro") return;
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "next") { slide = Math.min(SLIDES.length - 1, slide + 1); renderIntro(); window.scrollTo(0, 0); }
  else if (t.id === "prev") { slide = Math.max(0, slide - 1); renderIntro(); window.scrollTo(0, 0); }
  else if (t.id === "addH") {
    if (intro.h >= 4) { const tb = $("#introBoard"); tb.classList.remove("shake"); void tb.offsetWidth; tb.classList.add("shake"); const to = $("#introToast"); to.textContent = "Não cabe! O carbono só tem 4 mãos. Um 5º H não tem onde segurar."; to.setAttribute("data-on", ""); return; }
    intro.h++; renderIntro();
  } else if (t.id === "resetH") { intro.h = 0; renderIntro(); }
  else if (t.id === "nPlus") { intro.n = Math.min(6, intro.n + 1); renderIntro(); }
  else if (t.id === "nMinus") { intro.n = Math.max(1, intro.n - 1); renderIntro(); }
  else if (t.dataset.bond) { intro.bond = Number(t.dataset.bond); renderIntro(); }
  else if (t.dataset.view) { intro.view = t.dataset.view; renderIntro(); }
  else if (t.dataset.count) { intro.count = Number(t.dataset.count); renderIntro(); }
  else if (t.dataset.goto) go(t.dataset.goto);
});

// ----------------------------------------------------------------------------- 2. MONTAR (montador livre + missões)
const MISSIONS = [
  { t: "Monte o metano: um carbono sozinho", ok: (A) => A.name === "metano", dica: "Escolha Carbono e toque em qualquer ponto. Os 4 H aparecem sozinhos." },
  { t: "Monte o butano (gás do isqueiro): 4 C em fila", ok: (A) => A.name === "butano", dica: "Com o Carbono, toque em pontos vizinhos, um depois do outro, sempre encostando no último." },
  { t: "Faça uma ligação dupla: monte um alceno", ok: (A) => A.family?.nome === "alceno", dica: "Escolha Ligação e toque no meio da vareta entre dois carbonos." },
  { t: "Monte uma cadeia ramificada", ok: (A) => A.valid && !A.rings.length && A.chain?.ram === "ramificada", dica: "Toque num carbono do MEIO da cadeia (ele fica marcado) e ponha outro C grudado nele." },
  { t: "Monte o etanol (álcool do carro)", ok: (A) => A.name === "etanol", dica: "Dois carbonos e um O na ponta. O O ganha um H sozinho e vira OH." },
  { t: "Monte um aldeído", ok: (A) => A.funcs.length === 1 && A.funcs[0] === "aldeido", dica: "Ponha um O na ponta e troque a vareta para dupla: C=O na ponta." },
  { t: "Monte a acetona (propanona)", ok: (A) => A.name === "propanona", dica: "3 carbonos em fila; O no carbono do meio, com ligação dupla." },
  { t: "Monte o ácido do vinagre", ok: (A) => A.name === "ácido etanoico", dica: "2 carbonos. No C da ponta: um O com dupla e outro O com simples (que vira OH)." },
  { t: "Monte um éter", ok: (A) => A.funcs.length === 1 && A.funcs[0] === "eter", dica: "Ponha um O no MEIO da cadeia: C−O−C." },
  { t: "Monte um éster (cheiro de fruta)", ok: (A) => A.funcs.length === 1 && A.funcs[0] === "ester", dica: "Monte um ácido e encoste um carbono no O do OH: C(=O)−O−C." },
  { t: "Desafio: C₂H₆O que NÃO seja álcool", ok: (A) => A.formula === "C₂H₆O" && A.funcs.includes("eter"), dica: "As mesmas peças do etanol, mas o O fica entre os dois C. São isômeros!" },
  { t: "Monte o benzeno (anel aromático)", ok: (A) => A.name === "benzeno", dica: "Faça 6 C em hexágono; para fechar, toque no primeiro C. Depois alterne dupla, simples, dupla…" },
  { t: "Monte um fenol", ok: (A) => A.funcs.includes("fenol"), dica: "Monte o benzeno e pendure um O num carbono do anel." },
];
const EXAMPLES = [["vazio", null], ["etanol", { n: 2, group: "OH", at: 1 }], ["ácido acético", { n: 2, group: "COOH" }], ["acetato de etila", { n: 2, group: "COOR", r: 2 }], ["benzeno", { ring: 6, aromatic: true }], ["hexano", { n: 6 }]];
const BOX = [-3.7, -2.9, 3.7, 2.9];
const mt = { m: blank(), sel: null, tool: "C", view: "bolas", hist: [], toast: "", ok: false, bad: null, showF: true };
function renderMontar() {
  const A = analyze(mt.m);
  const cur = MISSIONS.findIndex((_, i) => !progress.missions.includes(i));
  const d = drawMol(mt.m, A, { view: mt.view, box: BOX, grid: true, sel: mt.sel, bad: mt.bad, groups: mt.showF ? A.groups : [], letters: true, unit: 40 });
  const toolIcon = { C: `<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="${ELC.C}" stroke="${INK}" stroke-width="1.6"/><text x="13" y="17.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">C</text></svg>`, O: `<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="${ELC.O}" stroke="${INK}" stroke-width="1.6"/><text x="13" y="17.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">O</text></svg>`, bond: `<svg viewBox="0 0 26 26"><path d="M4 9H22M4 13H22M4 17H22" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></svg>`, erase: `<svg viewBox="0 0 26 26"><path d="M6 20L16 6L22 10L13 22Z" fill="#f6928b" stroke="${INK}" stroke-width="1.6"/><path d="M4 23H22" stroke="${INK}" stroke-width="1.6"/></svg>` };
  const nm = A.name ? `<span class="nm">${esc(A.name)}</span>` : mt.m.atoms.length ? `<span class="tip">${A.valid ? "Nome: cadeia ramificada, anel com grupo ou várias funções. O ENEM quase nunca pede esse nome; foque na função." : ""}</span>` : "";
  const fam = A.family ? `<span class="chip soft">${A.family.nome}${A.family.geral ? " · " + A.family.geral : ""}</span>` : "";
  const funcs = A.funcs.length ? [...new Set(A.funcs)].map(chipF).join("") : A.func === "hidrocarboneto" ? chipF("hidrocarboneto") : "";
  const chain = A.chain ? Object.values(A.chain).map((v) => `<span class="chip soft">${v}</span>`).join("") : "";
  const beh = A.pe !== null ? `<p>Ferve a <b>${fmtT(A.pe)}</b> (aprox.) · ${A.state} a 25 °C · na água: <b>${A.solub}</b></p>${forceChips(A)}` : A.valid && mt.m.atoms.length ? forceChips(A) : "";
  main.innerHTML = `<div class="card"><h2>Monte você mesma</h2>${cur >= 0 ? `<div class="mission"><span class="n">${cur + 1}</span><div><b>${esc(MISSIONS[cur].t)}</b><small id="dica" hidden>${esc(MISSIONS[cur].dica)}</small><button class="pill" type="button" id="showDica" style="min-height:32px;padding:4px 10px;margin-top:6px;font-size:13px">Dica</button></div></div>` : `<div class="done-banner">Todas as missões feitas! Agora monte o que quiser.</div>`}
  <div class="tools" role="group" aria-label="Ferramentas">${[["C", "Carbono"], ["O", "Oxigênio"], ["bond", "Ligação"], ["erase", "Apagar"]].map(([k2, n]) => `<button type="button" class="tool" data-tool="${k2}" aria-pressed="${mt.tool === k2}">${toolIcon[k2]}${n}</button>`).join("")}</div>
  <div class="board" id="board">${d.svg}<div class="toast${mt.ok ? " ok" : ""}" id="mtoast"${mt.toast ? " data-on" : ""}>${esc(mt.toast)}</div></div>
  <p class="tip">${mt.tool === "bond" ? "Toque no meio de uma vareta para trocar: simples → dupla → tripla. Para fechar um anel, toque num átomo e depois no vizinho." : mt.tool === "erase" ? "Toque num átomo ou numa vareta para apagar." : mt.m.atoms.length ? "Toque num átomo para escolher de onde crescer (fica tracejado) e depois num ponto vizinho." : "Toque em qualquer ponto para pôr o primeiro átomo."}</p>
  <div class="seg">${["bolas", "tracos", "bastao"].map((v) => `<button type="button" data-mview="${v}" aria-pressed="${v === mt.view}">${{ bolas: "Bolas", tracos: "Traços", bastao: "Bastão" }[v]}</button>`).join("")}</div>
  <div class="row" style="margin-top:8px"><button class="pill" type="button" id="undo"${mt.hist.length ? "" : " disabled"}>↶ Desfazer</button><button class="pill" type="button" id="clear">Limpar</button><label class="tip"><input type="checkbox" id="showF"${mt.showF ? " checked" : ""}> pintar as funções</label></div>
  <div class="readout">${mt.m.atoms.length ? `<div class="f">${A.formula}</div>${nm}<div class="chips">${funcs}${fam}</div><div class="chips">${chain}</div>${beh}` : ""}</div>
  <details><summary>Missões (${progress.missions.length} de ${MISSIONS.length})</summary><ul class="mlist">${MISSIONS.map((ms, i) => `<li${progress.missions.includes(i) ? " data-done" : ""}${i === cur ? " data-cur" : ""}><span>${progress.missions.includes(i) ? "✓" : i + 1}</span>${esc(ms.t)}</li>`).join("")}</ul></details>
  <details><summary>Carregar um exemplo pronto</summary><div class="row">${EXAMPLES.map(([n], i) => `<button class="pill" type="button" data-ex="${i}">${n}</button>`).join("")}</div></details></div>`;
}
function tapToLattice(svgEl, ev) {
  const pt = svgEl.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  const p = pt.matrixTransform(svgEl.getScreenCTM().inverse());
  const x = p.x / 40 + BOX[0], y = p.y / 40 + BOX[1];
  const s = x / 0.8660254, d2 = 2 * y;
  const q = Math.round((s - d2) / 2), r = Math.round((s + d2) / 2);
  const [gx, gy] = toXY(q, r);
  return { q, r, x, y, near: Math.hypot(gx - x, gy - y) };
}
function mtApply(change, okMsg) {
  const before = clone(mt.m);
  change();
  const A = analyze(mt.m);
  if (!A.valid) {
    mt.bad = A.errors[0].id;
    mt.m = before; mt.toast = A.errors[0].msg; mt.ok = false;
    renderMontar();
    const b = $("#board"); b.classList.add("shake");
    setTimeout(() => { mt.bad = null; }, 0);
    return false;
  }
  mt.hist.push(before); mt.bad = null; mt.toast = okMsg || ""; mt.ok = !!okMsg;
  checkMissions(A);
  renderMontar();
  return true;
}
function checkMissions(A) {
  MISSIONS.forEach((ms, i) => {
    if (!progress.missions.includes(i) && ms.ok(A)) { progress.missions.push(i); save(); mt.toast = `Missão cumprida: ${ms.t.replace(/^Monte /, "").replace(/^Desafio: /, "")}! ★`; mt.ok = true; }
  });
}
main.addEventListener("click", (e) => {
  if (station !== "montar") return;
  const t = e.target.closest("button,input");
  const svgEl = e.target.closest("#board svg");
  if (svgEl && !t) {
    const p = tapToLattice(svgEl, e);
    const m = mt.m;
    const atom = p.near < 0.42 ? atomAt(m, p.q, p.r) : null;
    // vareta mais perto do toque
    let bond = null, bd = 0.32;
    for (const b of m.bonds) { const A1 = m.atoms.find((a) => a.id === b.a), B1 = m.atoms.find((a) => a.id === b.b); const [x1, y1] = toXY(A1.q, A1.r), [x2, y2] = toXY(B1.q, B1.r); const dd = Math.hypot((x1 + x2) / 2 - p.x, (y1 + y2) / 2 - p.y); if (dd < bd) { bd = dd; bond = b; } }
    if (mt.tool === "erase") {
      if (atom) mtApply(() => { m.atoms = m.atoms.filter((a) => a !== atom); m.bonds = m.bonds.filter((b) => b.a !== atom.id && b.b !== atom.id); if (mt.sel === atom.id) mt.sel = null; });
      else if (bond) mtApply(() => { m.bonds = m.bonds.filter((b) => b !== bond); });
      return;
    }
    if (mt.tool === "bond") {
      if (bond && !atom) { mtApply(() => { bond.o = bond.o % 3 + 1; }, bond.o === 3 ? "" : ""); return; }
      if (atom) {
        const s = m.atoms.find((a) => a.id === mt.sel);
        if (s && s !== atom && adjacent(s, atom) && !bondOf(m, s.id, atom.id)) { mtApply(() => { addBond(m, s.id, atom.id, 1); mt.sel = atom.id; }, "Ligação nova: anel fechado ou ponte feita!"); return; }
        mt.sel = atom.id; mt.toast = ""; renderMontar();
      }
      return;
    }
    // ferramentas C e O
    if (atom) {
      const s = m.atoms.find((a) => a.id === mt.sel);
      if (s && s !== atom && adjacent(s, atom) && !bondOf(m, s.id, atom.id)) { mtApply(() => { addBond(m, s.id, atom.id, 1); mt.sel = atom.id; }); return; }
      if (atom.el !== mt.tool && mt.sel === atom.id) { mtApply(() => { atom.el = mt.tool; }); return; }
      mt.sel = atom.id; mt.toast = atom.el !== mt.tool ? `Toque de novo para trocar esse ${atom.el} por ${mt.tool}.` : ""; mt.ok = true; renderMontar();
      return;
    }
    if (p.near > 0.45) return;
    if (p.x < BOX[0] + 0.3 || p.x > BOX[2] - 0.3 || p.y < BOX[1] + 0.3 || p.y > BOX[3] - 0.3) return;
    if (!m.atoms.length) { mtApply(() => { mt.sel = addAtom(m, mt.tool, p.q, p.r); }); return; }
    const s = m.atoms.find((a) => a.id === mt.sel);
    const anchor = s && adjacent(s, p) ? s : m.atoms.find((a) => adjacent(a, p));
    if (!anchor) { mt.toast = "Encoste o novo átomo num átomo que já está na bancada (num ponto vizinho)."; mt.ok = false; renderMontar(); return; }
    mtApply(() => { const id = addAtom(m, mt.tool, p.q, p.r); addBond(m, anchor.id, id, 1); mt.sel = id; });
    return;
  }
  if (!t) return;
  if (t.dataset.tool) { mt.tool = t.dataset.tool; mt.toast = ""; renderMontar(); }
  else if (t.dataset.mview) { mt.view = t.dataset.mview; renderMontar(); }
  else if (t.id === "undo") { mt.m = mt.hist.pop() || mt.m; mt.sel = null; mt.toast = ""; renderMontar(); }
  else if (t.id === "clear") { if (mt.m.atoms.length) mt.hist.push(clone(mt.m)); mt.m = blank(); mt.sel = null; mt.toast = ""; renderMontar(); }
  else if (t.id === "showDica") { $("#dica").hidden = false; t.remove(); }
  else if (t.id === "showF") { mt.showF = t.checked; renderMontar(); }
  else if (t.dataset.ex) {
    const sp = EXAMPLES[Number(t.dataset.ex)][1];
    mt.hist.push(clone(mt.m));
    mt.m = sp ? fromSpec(sp) : blank();
    // centraliza na bancada
    if (mt.m.atoms.length) { const qs = mt.m.atoms.map((a) => a.q), rs = mt.m.atoms.map((a) => a.r); const dq = -Math.round((Math.min(...qs) + Math.max(...qs)) / 2), dr = -Math.round((Math.min(...rs) + Math.max(...rs)) / 2); for (const a of mt.m.atoms) { a.q += dq; a.r += dr; } }
    mt.sel = null; mt.toast = ""; renderMontar();
  }
});

// ----------------------------------------------------------------------------- 3. CAÇAR GRUPOS (moléculas reais em bastão)
const WHY = {
  alcool: "É álcool: o O tem um H (−OH) e está preso num carbono que só faz ligações simples.",
  fenol: "É fenol: o −OH está grudado direto no anel aromático (o hexágono com duplas alternadas). Não é álcool!",
  eter: "É éter: o O está no meio, entre dois carbonos (C−O−C), e nenhum desses C tem C=O.",
  aldeido: "É aldeído: C=O na ponta, num carbono que tem só um carbono vizinho (e um H escondido).",
  cetona: "É cetona: C=O no meio, com carbono dos dois lados.",
  acido: "É ácido carboxílico: no mesmo C há um =O e um −OH (−COOH).",
  ester: "É éster: no mesmo C há um =O e um −O− que segue para outro carbono (−COO−).",
  enol: "É enol: o −OH está num carbono que faz ligação dupla C=C.",
};
const hunt = { i: 0, found: [], pick: null, msg: null, view: "bastao", noO: null };
function huntState() {
  const h = HUNT[hunt.i % HUNT.length];
  const A = analyze(h.m);
  return { h, A };
}
function renderCacar() {
  const { h, A } = huntState();
  const shown = A.groups.filter((g, gi) => hunt.found.includes(gi));
  const d = drawMol(h.m, A, { view: hunt.view, groups: shown, tags: true, unit: 44, sel: hunt.pick, pad: 1 });
  const total = A.groups.length;
  const done = total ? hunt.found.length === total : hunt.noO === true;
  if (done && !progress.hunted.includes(h.id)) { progress.hunted.push(h.id); save(); }
  const funcsAll = [...new Set(A.groups.map((g) => g.func))];
  main.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="tip">Molécula ${hunt.i % HUNT.length + 1} de ${HUNT.length}</span><span class="tip">${progress.hunted.length} caçada${progress.hunted.length === 1 ? "" : "s"} ★</span></div><h2>${esc(h.nome)}</h2><p class="tip">${esc(h.onde)} · ${A.formula}</p>
  <p class="lead">${total ? `Toque em cada <b style="color:#c23a30">O</b> e diga de que função ele faz parte. Ache todas!` : `Procure os oxigênios… Toque no botão de baixo se achar que não tem nenhum.`}</p>
  <div class="board" id="hboard">${d.svg}</div>
  <div class="row" style="margin-top:8px;justify-content:space-between"><div class="seg" style="flex:1">${["bastao", "tracos"].map((v) => `<button type="button" data-hview="${v}" aria-pressed="${v === hunt.view}">${v === "bastao" ? "Bastão (como na prova)" : "Ver C e H"}</button>`).join("")}</div></div>
  <div class="row" style="margin-top:8px"><span class="tip">Achados: <b>${hunt.found.length} de ${total}</b></span><div class="prog" style="flex:1"><i style="width:${total ? (hunt.found.length / total) * 100 : hunt.noO ? 100 : 0}%"></i></div></div>
  <div class="sheet" id="sheet"${hunt.pick ? "" : " hidden"}><b>Esse O faz parte de qual função?</b><div class="options">${FORDER.map((f) => `<button type="button" data-func="${f}"><i style="background:${FCOLOR[f]}"></i>${FNAME[f]}</button>`).join("")}</div></div>
  <div class="why ${hunt.msg?.ok ? "ok" : "bad"}"${hunt.msg ? "" : " hidden"}>${hunt.msg ? hunt.msg.html : ""}</div>
  ${!done ? `<div class="row" style="margin-top:10px"><button class="pill" type="button" id="noO">Não tem O: só C e H</button></div>` : ""}
  ${done ? `<div class="done-banner popin">Achou tudo! ${total ? `Funções presentes: ${funcsAll.map((f) => FNAME[f]).join(", ")}.` : "Só C e H: é um hidrocarboneto (cheira, mas não tem O)."}</div><p class="tip">${A.chain ? `Cadeia ${A.chain.forma}, ${A.chain.lig}, ${A.chain.ram}, ${A.chain.het}. ` : ""}Assim o ENEM pergunta: “quais funções orgânicas estão presentes na estrutura?”.</p>` : ""}
  <div class="slidenav"><button class="pill" type="button" id="hprev">← Anterior</button><button class="pill main" type="button" id="hnext">Próxima →</button></div></div>`;
}
function huntReset(i) { hunt.i = (i + HUNT.length) % HUNT.length; hunt.found = []; hunt.pick = null; hunt.msg = null; hunt.noO = null; renderCacar(); }
main.addEventListener("click", (e) => {
  if (station !== "cacar") return;
  const t = e.target.closest("button");
  const svgEl = e.target.closest("#hboard svg");
  const { h, A } = huntState();
  if (svgEl && !t) {
    const pt = svgEl.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    const box = drawMol(h.m, A, { view: hunt.view, unit: 44, pad: 1 }).box;
    const x = p.x / 44 + box[0], y = p.y / 44 + box[1];
    let best = null, bd = 0.6;
    for (const a of h.m.atoms) { const [ax, ay] = toXY(a.q, a.r); const dd = Math.hypot(ax - x, ay - y); if (dd < bd) { bd = dd; best = a; } }
    if (!best) return;
    if (best.el !== "O") { hunt.pick = null; hunt.msg = { ok: false, html: "Isso é um carbono. Procure as letras <b>O</b> (oxigênio): é em volta delas que mora a função." }; renderCacar(); return; }
    const gi = A.groups.findIndex((g) => g.atoms.includes(best.id));
    if (hunt.found.includes(gi)) { hunt.pick = null; hunt.msg = { ok: true, html: `Esse você já achou: <b>${FNAME[A.groups[gi].func]}</b>.` }; renderCacar(); return; }
    hunt.pick = best.id; hunt.msg = null; renderCacar();
    $("#sheet").scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  if (!t) return;
  if (t.dataset.func && hunt.pick) {
    const gi = A.groups.findIndex((g) => g.atoms.includes(hunt.pick));
    const real = A.groups[gi].func;
    if (t.dataset.func === real) { hunt.found.push(gi); hunt.msg = { ok: true, html: `<b>Isso!</b> ${WHY[real]}` }; }
    else hunt.msg = { ok: false, html: `<b>Ainda não.</b> ${WHY[real].replace(/^É [^:]+: /, "Olhe em volta desse O: ")} Tente de novo.` };
    if (t.dataset.func === real) hunt.pick = null;
    renderCacar();
  } else if (t.dataset.hview) { hunt.view = t.dataset.hview; renderCacar(); }
  else if (t.id === "noO") { if (A.count.O === 0) { hunt.noO = true; hunt.msg = { ok: true, html: "<b>Isso!</b> Não há nenhum O: só carbono e hidrogênio. É um <b>hidrocarboneto</b>, como a gasolina e o gás de cozinha." }; } else hunt.msg = { ok: false, html: `Ainda tem ${A.count.O} oxigênio${A.count.O > 1 ? "s" : ""} escondido${A.count.O > 1 ? "s" : ""} aqui! Procure as letras O.` }; renderCacar(); }
  else if (t.id === "hnext") huntReset(hunt.i + 1);
  else if (t.id === "hprev") huntReset(hunt.i - 1);
});

// ----------------------------------------------------------------------------- 4. FERVER E MISTURAR
const ROUNDS = [
  { tema: "Tamanho: mais C, mais velcro", specs: [{ n: 6 }, { n: 1 }, { n: 3 }] },
  { tema: "Mesmo tamanho, grupos diferentes", specs: [{ n: 4, group: "OH", at: 1 }, { n: 4 }, { n: 4, group: "CO", at: 2 }] },
  { tema: "Isômeros: mesma fórmula", specs: [{ n: 2, group: "OH", at: 1 }, { n: 2 }, { n: 1, group: "OR", r: 1 }] },
  { tema: "Do aldeído ao ácido", specs: [{ n: 4, group: "COOH" }, { n: 4, group: "CHO" }, { n: 4, group: "OH", at: 1 }] },
  { tema: "Petróleo", specs: [{ n: 8 }, { n: 2, bond: 2 }, { n: 5 }] },
  { tema: "Ácido, cetona e éster", specs: [{ n: 3, group: "CO", at: 2 }, { n: 2, group: "COOH" }, { n: 1, group: "COOR", r: 1 }] },
];
const OIL = [{ n: 2, group: "OH", at: 1 }, { n: 6 }, { n: 2, group: "COOH" }, { n: 8 }, { n: 3, group: "CO", at: 2 }, { n: 4, group: "COOR", r: 2 }, { n: 1, group: "OH", at: 1 }, { ring: 6, aromatic: true }];
const fv = { mode: "termo", round: 0, taps: [], oil: 0, oilPick: null };
function reasonPair(lo, hi) {
  if (hi.forces.hbond && !lo.forces.hbond) return `${capFirst(hi.name)} tem O−H: faz o <b>abraço</b> (ligação de hidrogênio). ${capFirst(lo.name)} não tem.`;
  if (hi.forces.dipolo && !lo.forces.dipolo) return `${capFirst(hi.name)} tem O: vira <b>ímã</b> (dipolo). ${capFirst(lo.name)} é só C e H.`;
  if (hi.count.C > lo.count.C) return `${capFirst(hi.name)} é maior (${hi.count.C} C contra ${lo.count.C}): mais <b>velcro</b>.`;
  if (hi.forces.hbond && lo.forces.hbond) return `Os dois têm O−H, mas ${hi.name} tem mais O puxando (C=O e O−H juntos).`;
  return `${capFirst(hi.name)} puxa mais forte as vizinhas.`;
}
function renderFerver() {
  const tabs = `<div class="seg" style="margin-bottom:10px"><button type="button" data-fmode="termo" aria-pressed="${fv.mode === "termo"}">Quem ferve primeiro?</button><button type="button" data-fmode="oil" aria-pressed="${fv.mode === "oil"}">Água ou óleo?</button></div>`;
  if (fv.mode === "termo") {
    const R = ROUNDS[fv.round % ROUNDS.length];
    const items = R.specs.map((sp) => quick(sp, "tracos", { unit: 28 }));
    const order = [...items.keys()].sort((a, b) => items[a].A.pe - items[b].A.pe);
    const doneR = fv.taps.length === items.length;
    const right = doneR && fv.taps.every((v, i) => v === order[i]);
    if (doneR && right && !progress.thermo.includes(fv.round % ROUNDS.length)) { progress.thermo.push(fv.round % ROUNDS.length); save(); }
    const sorted = order.map((i) => items[i].A);
    main.innerHTML = `<div class="card">${tabs}<h2>Quem ferve primeiro?</h2><p class="tip">Rodada ${fv.round % ROUNDS.length + 1} de ${ROUNDS.length} · ${esc(R.tema)}</p><p class="lead">Toque na ordem: <b>primeiro</b> quem ferve com <b>menos calor</b>, por último quem precisa de mais.</p>
    <div class="cards3">${items.map(({ A, svg }, i) => { const pos = fv.taps.indexOf(i); const res = doneR ? (order[pos] === i ? "right" : "wrong") : ""; return `<button type="button" class="mcard" data-pick="${i}"${res ? ` data-res="${res}"` : ""}${doneR || pos >= 0 ? " disabled" : ""}>${pos >= 0 ? `<span class="badge popin">${pos + 1}</span>` : ""}<div>${svg}</div><div><b>${esc(A.name)}</b><small>${A.formula}</small>${doneR ? `<span class="temp">${fmtT(A.pe)}</span>${forceChips(A)}` : ""}</div></button>`; }).join("")}</div>
    ${doneR ? `<div class="why ${right ? "ok" : "bad"}"><b>${right ? "Acertou a ordem!" : `A ordem certa é: ${sorted.map((a) => a.name).join(" → ")}.`}</b><br>${sorted.slice(1).map((hi, k) => reasonPair(sorted[k], hi)).join("<br>")}<br><span class="tip">Mais puxão entre as moléculas = mais calor para separar = ferve mais alto.</span></div><div class="slidenav"><span></span><button class="pill main" type="button" id="nextRound">Próxima rodada →</button></div>` : `<p class="tip">Lembre: velcro (todos, cresce com o tamanho) &lt; ímã (tem O) &lt; abraço (tem O−H).</p>`}</div>`;
    return;
  }
  const sp = OIL[fv.oil % OIL.length];
  const { A, svg } = quick(sp, "tracos", { unit: 48 });
  const pick = fv.oilPick;
  const right = pick !== null && (pick === "mix") === A.mixes;
  if (pick !== null && right && !progress.oil.includes(fv.oil % OIL.length)) { progress.oil.push(fv.oil % OIL.length); save(); }
  const col = A.func === "hidrocarboneto" ? FCOLOR.hidrocarboneto : FCOLOR[A.funcs[0]] || "#999";
  const beaker = pick === null ? "" : `<div class="beaker"><svg viewBox="0 0 120 120"><path d="M22 18V98Q22 108 32 108H88Q98 108 98 98V18" fill="#eef7fa" stroke="${INK}" stroke-width="2.4"/>${A.mixes ? `<path d="M24 46H96V98Q96 106 88 106H32Q24 106 24 98Z" fill="#9fd3ea"/><path d="M24 46H96V98Q96 106 88 106H32Q24 106 24 98Z" fill="${col}" fill-opacity=".35"/>` : `<path d="M24 62H96V98Q96 106 88 106H32Q24 106 24 98Z" fill="#9fd3ea"/><path d="M24 40H96V62H24Z" fill="${col}" fill-opacity=".75"/><path d="M24 62H96" stroke="${INK}" stroke-width="1.4" stroke-dasharray="4 3"/>`}<path d="M16 18H104" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="${A.mixes ? 82 : 90}" text-anchor="middle" font-size="11" font-weight="700" fill="${INK}">${A.mixes ? "misturou" : "água"}</text>${A.mixes ? "" : `<text x="60" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${esc(A.name)}</text>`}</svg></div>`;
  const why = A.mixes
    ? `${capFirst(A.name)} é pequeno e tem ${A.forces.hbond ? "O−H, que abraça a água" : "O, que a água consegue abraçar"} (ligação de hidrogênio). <b>Semelhante dissolve semelhante</b>: polar com polar.`
    : A.count.O ? `${capFirst(A.name)} tem O, mas a parte só de C e H é grande e ele não tem O−H: a água quase não consegue abraçar. Fica por cima, separado.` : `${capFirst(A.name)} é só C e H: <b>apolar</b>. A água (polar) não se mistura com ele, que fica por cima, como óleo.`;
  main.innerHTML = `<div class="card">${tabs}<h2>Água ou óleo?</h2><p class="tip">Cartão ${fv.oil % OIL.length + 1} de ${OIL.length}</p><p class="lead">Se jogar um pouco desta substância num copo d’água, ela se mistura ou fica separada?</p><div class="board mini" style="padding:6px">${svg}</div><p style="text-align:center"><b>${esc(A.name)}</b> · ${A.formula}</p>
  <div class="big2">${[["mix", "💧 Mistura com a água"], ["sep", "🛢️ Fica separada"]].map(([k2, t2]) => `<button type="button" class="pill" data-oil="${k2}"${pick !== null ? " disabled" : ""}${pick === k2 ? ` data-res="${right ? "right" : "wrong"}"` : ""}>${t2}</button>`).join("")}</div>
  ${pick !== null ? `${beaker}<div class="why ${right ? "ok" : "bad"}"><b>${right ? "Isso!" : "Não é bem assim."}</b> Na água: <b>${A.solub}</b>. ${why}</div><div class="slidenav"><span></span><button class="pill main" type="button" id="nextOil">Próximo cartão →</button></div>` : ""}</div>`;
}
main.addEventListener("click", (e) => {
  if (station !== "ferver") return;
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.fmode) { fv.mode = t.dataset.fmode; renderFerver(); }
  else if (t.dataset.pick !== undefined) { const i = Number(t.dataset.pick); if (!fv.taps.includes(i)) fv.taps.push(i); renderFerver(); }
  else if (t.id === "nextRound") { fv.round++; fv.taps = []; renderFerver(); window.scrollTo(0, 0); }
  else if (t.dataset.oil) { fv.oilPick = t.dataset.oil; renderFerver(); }
  else if (t.id === "nextOil") { fv.oil++; fv.oilPick = null; renderFerver(); window.scrollTo(0, 0); }
});

// ----------------------------------------------------------------------------- início
go(progress.intro > 0 ? "intro" : "intro");
function tapAt(sel, x, y) {
  const svgEl = document.querySelector(sel + " svg");
  const vb = svgEl.viewBox.baseVal, rc = svgEl.getBoundingClientRect();
  svgEl.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: rc.left + (x / vb.width) * rc.width, clientY: rc.top + (y / vb.height) * rc.height }));
}
const tapLattice = (q, r) => { const [x, y] = toXY(q, r); tapAt("#board", (x - BOX[0]) * 40, (y - BOX[1]) * 40); };
const tapHuntAtom = (k) => { const { h, A } = huntState(); const box = drawMol(h.m, A, { view: hunt.view, unit: 44, pad: 1 }).box; const a = h.m.atoms[k]; const [x, y] = toXY(a.q, a.r); tapAt("#hboard", (x - box[0]) * 44, (y - box[1]) * 44); };
window.__trilha = { tapLattice, tapHuntAtom, mtSet: (o) => Object.assign(mt, o), go, state: () => ({ station, slide, progress, mt: { atoms: mt.m.atoms.length, tool: mt.tool }, hunt: { i: hunt.i, found: hunt.found.length } }), analyzeMontador: () => analyze(mt.m), setSlide: (n) => { slide = n; renderIntro(); }, hunt: (i) => { go("cacar"); huntReset(i); }, fv };
