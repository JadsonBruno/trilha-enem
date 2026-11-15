import { doShow, mcG, tfG, matchG, orderG, porNivel } from "../_util.mjs";
import { figShow, clone, REF } from "../_modelos.mjs";

const L = "bio-u3-l1";
const dig = figShow("bio-corpo-amido-boca"), cor = figShow("bio-corpo-coracao-camara-2"), circ = figShow("bio-corpo-arteria-venoso");
const primeiro = (sub) => dig.tube.find((t) => t.subs.includes(sub)).nome;
const camara = (n) => {
  const c = cor.chambers.find((x) => x.n === n);
  if (c.linha === "cima") return c.entra === "pulmões" ? "Átrio esquerdo" : "Átrio direito";
  return c.sai === "pulmões" ? "Ventrículo direito" : "Ventrículo esquerdo";
};
const ehArteria = (id) => circ.vessels.find((v) => v.id === id).de === "coração";
const figDig = { ...clone(dig), hl: "estomago", cap: "Tubo digestório (esquema)" };
const figCor = { ...clone(cor), hl: 4, cap: "Coração em vista frontal" };
const figCirc = { ...clone(circ), hl: "C", cap: "Setas mostram o sentido do sangue" };

export default {
  id: L, titulo: "Digestão e circulação", temas: ["fisiologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Cada enzima, um serviço", texto: "Amilase quebra o amido, pepsina quebra proteínas e lipase quebra gorduras. A bile ajuda na digestão da gordura, mas não é enzima. O intestino delgado é onde quase tudo termina e é absorvido.", fig: figDig },
    { tipo: "analogia", titulo: "Linha de montagem", texto: "O alimento passa por estações: boca, estômago, intestino. Cada uma tem as “ferramentas” (enzimas) para um tipo de nutriente. Sem a ferramenta, o nutriente passa sem ser quebrado." },
    { tipo: "exemplo", titulo: "Sangue em circuito", texto: "O sangue do corpo entra no átrio direito, vai ao ventrículo direito, passa pelos pulmões, volta ao átrio esquerdo e sai do ventrículo esquerdo para o corpo.", fig: figCor },
    { tipo: "pegadinha", titulo: "Artéria sai do coração", texto: "Artéria é o vaso que sai do coração, tenha o sangue muito ou pouco oxigênio. A artéria pulmonar leva sangue pobre em O₂; a veia pulmonar traz sangue rico em O₂.", fig: figCirc },
  ],
  exercicios: porNivel([
    doShow("bio-corpo-amido-boca"),
    doShow("bio-corpo-coracao-camara-2"),
    mcG(L, "mc-inicio-proteina", { k: "dig-inicio", substancia: "proteína" }, {
      n: 1, q: "Em qual órgão do esquema começa a digestão das proteínas?", fig: [figDig],
      certo: primeiro("proteína"), errados: ["Boca", "Intestino delgado", "Intestino grosso"], pos: 1,
      why: "No estômago, a pepsina com o ácido quebra as proteínas. A digestão termina no intestino delgado.", ref: REF.dig,
    }),
    mcG(L, "mc-camara-4", { k: "cor-camara", n: 4 }, {
      n: 2, q: "No esquema do coração, como se chama a câmara marcada com o número 4?", fig: [figCor],
      certo: camara(4), errados: ["Ventrículo direito", "Átrio esquerdo", "Átrio direito"], pos: 3,
      why: "É uma câmara de baixo (ventrículo), de parede grossa, que bombeia o sangue para o corpo: ventrículo esquerdo.", ref: REF.cor,
    }),
    tfG(L, "tf-vaso-c-arteria", { k: "circ-arteria", vaso: "C" }, {
      n: 2, q: "No esquema, o vaso C é uma artéria.", fig: [figCirc],
      certa: ehArteria("C"), why: "O vaso C leva sangue dos pulmões ao coração: é uma veia (a pulmonar), com sangue rico em O₂.", ref: REF.cor,
    }),
    orderG(L, "order-caminho-alimento", { k: "dig-ordem" }, {
      n: 1, q: "Ordene o caminho do alimento pelo tubo digestório do esquema.", itens: dig.tube.map((t) => t.nome),
      why: "O alimento entra pela boca, passa pelo estômago, pelo intestino delgado (absorção) e termina no grosso.", ref: REF.dig,
    }),
    orderG(L, "order-caminho-sangue", null, {
      manual: true, n: 2, q: "Ordene o caminho do sangue que chega do corpo e volta a sair para ele.",
      itens: ["Átrio direito", "Ventrículo direito", "Pulmões", "Átrio esquerdo", "Ventrículo esquerdo"],
      why: "Do corpo ao átrio direito, ventrículo direito, pulmões, átrio esquerdo e ventrículo esquerdo, que o envia ao corpo.", ref: REF.cor,
    }),
    matchG(L, "match-enzimas", null, {
      manual: true, n: 1, q: "Ligue cada substância digestiva ao que ela faz.",
      pares: [["Amilase", "Quebra o amido"], ["Pepsina", "Quebra proteínas"], ["Lipase", "Quebra gorduras"], ["Bile", "Ajuda com gorduras; não é enzima"]],
      why: "Amilase digere amido, pepsina digere proteínas e lipase digere gorduras. A bile auxilia a gordura, mas não é enzima.", ref: REF.dig,
    }),
  ]),
};
