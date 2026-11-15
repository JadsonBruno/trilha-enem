// Registro de tipos de exercício. Tipo novo = arquivo novo em app/exercicios/ + uma linha aqui; o motor não tem switch por tipo.
//
// Contrato de cada tipo (objeto):
//   rotulo                       texto curto do tipo
//   render(ex, ctx) → html       ctx = { est, pronto(bool), modo }; `est` é o estado deste exercício (o tipo guarda o que quiser nele)
//   ligar(el, ex, ctx)           liga os eventos; chama ctx.pronto(true|false) para habilitar/desabilitar CONFERIR
//   conferir(ex, est) → boolean  acertou?
//   revelar(el, ex, est, ok)     pinta certa/errada (+ figuras em mode "reveal"); usado fora do Desafio
//   travar(el, est)              (opcional) só bloqueia os toques, sem revelar (Desafio)
//   certaTexto(ex) → string      texto da resposta certa (rodapé de erro e revisão do Desafio)
//   escolhaTexto(ex, est)        (opcional) texto do que o aluno escolheu
//   auto(el, ex, est, certo)     (opcional) responde de verdade por cliques; usado só pelo gancho de teste
import mc from "./mc.js";
import mcFigura from "./mc-figura.js";
import enem from "./enem.js";
import tf from "./tf.js";
import match from "./match.js";
import order from "./order.js";
import fill from "./fill.js";

export const EXERCICIOS = { mc, "mc-figura": mcFigura, enem, tf, match, order, fill };
