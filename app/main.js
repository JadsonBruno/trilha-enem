// Ponto de entrada do bundle. `@conteudo` é um alias do esbuild (build.mjs): conteudo/_manifesto.gen.mjs ou app/_teste/conteudo-exemplo.mjs.
import { CONTEUDO } from "@conteudo";
import { iniciar } from "./app.js";

iniciar(CONTEUDO);
