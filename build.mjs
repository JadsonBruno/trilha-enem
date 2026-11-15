// Build da Trilha ENEM: um HTML só (esbuild, iife).
//   node build.mjs            → conteúdo real (conteudo/_manifesto.gen.mjs): dist/trilha-enem.html (legível, com gancho) + dist/index.html (minificado, SEM gancho)
//   node build.mjs --exemplo  → conteúdo de teste do motor (app/_teste/conteudo-exemplo.mjs): dist/trilha-enem.html + dist/exemplo-index.html (o público de teste nunca vira dist/index.html)
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

process.noDeprecation = true;
const RAIZ = dirname(fileURLToPath(import.meta.url));
const EXEMPLO = process.argv.includes("--exemplo");
const DIST = join(RAIZ, "dist");
const fwd = (p) => p.replace(/\\/g, "/");

let origem;
if (EXEMPLO) {
  origem = join(RAIZ, "app/_teste/conteudo-exemplo.mjs");
} else {
  const { gerarManifesto } = await import("./ferramentas/manifesto.mjs");
  await gerarManifesto();
  origem = join(RAIZ, "conteudo/_manifesto.gen.mjs");
  const src = readFileSync(origem, "utf8");
  if (!/CONTEUDO = \[\s*\{/.test(src)) { console.error("ERRO: o manifesto não tem nenhuma matéria (conteudo/ ainda está vazio ou incompleto)."); process.exit(1); }
}

const tmp = mkdtempSync(join(tmpdir(), "trilha-"));
function empacotar(hook, minify) {
  const saida = join(tmp, `bundle-${hook ? "dev" : "pub"}.js`);
  const args = ["-y", "esbuild@0.24.0", join(RAIZ, "app/main.js"), "--bundle", "--format=iife", "--charset=utf8", "--target=es2020",
    `--define:__HOOK__=${hook}`, `--alias:@conteudo=${fwd(origem)}`, `--outfile=${fwd(saida)}`, "--log-level=warning", ...(minify ? ["--minify"] : [])];
  const r = spawnSync("npx", args, { cwd: RAIZ, encoding: "utf8", shell: true });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); throw new Error("esbuild falhou"); }
  if (r.stderr && r.stderr.trim()) console.warn(r.stderr.trim());
  return readFileSync(saida, "utf8");
}

const seguro = (js) => js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
function montar(js) {
  const css = readFileSync(join(RAIZ, "app/estilo.css"), "utf8").replace(/<\/style/gi, "<\\/style");
  const shell = readFileSync(join(RAIZ, "app/shell.html"), "utf8");
  return shell.replace("/*__CSS__*/", () => css).replace("/*__JS__*/", () => seguro(js));
}

try {
  mkdirSync(DIST, { recursive: true });
  const dev = montar(empacotar(true, false));
  const pub = montar(empacotar(false, true));
  if (/__trilha|__HOOK__/.test(pub)) throw new Error("o build público contém o gancho de teste (__trilha/__HOOK__)");
  if (!/<title>Trilha ENEM<\/title>/.test(pub) || !/lang="pt-BR"/.test(pub)) throw new Error("shell sem title/lang");
  writeFileSync(join(DIST, "trilha-enem.html"), dev);
  const nomePub = EXEMPLO ? "exemplo-index.html" : "index.html";
  writeFileSync(join(DIST, nomePub), pub);
  const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + " KB";
  console.log(`${EXEMPLO ? "[EXEMPLO] " : ""}dist/trilha-enem.html ${kb(dev)} (legível, com gancho) · dist/${nomePub} ${kb(pub)} (minificado, sem gancho)`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
