import { doShow } from "../../_comum/show.mjs";
import { tfRecorte, matchPares, porNivel } from "../_gerar.mjs";

const L = "lin-u2-l4";
export default {
  id: L, titulo: "Anúncio, campanha, charge e tirinha", temas: ["generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Anúncio e campanha", texto: "Anúncio publicitário quer vender: slogan, imagem do produto e imperativo. Campanha social mobiliza o público por uma causa, sem fim comercial.", fig: { kind: "lin-gen-recorte", genero: "anuncio", hl: ["slogan", "imagem"] } },
    { tipo: "pegadinha", titulo: "Anúncio × propaganda institucional", texto: "O anúncio vende um produto. A propaganda institucional promove a imagem ou as ações de quem assina. Olhe o canto inferior: produto ou instituição?" },
    { tipo: "exemplo", titulo: "Charge × cartum", texto: "Charge critica com humor um fato do momento e só funciona com esse contexto. Cartum faz humor atemporal e se entende sem data.", fig: { kind: "lin-gen-recorte", genero: "charge", hl: ["fato"] } },
    { tipo: "conceito", titulo: "Tirinha: piada em quadros", texto: "Tirinha conta uma cena curta, em geral cômica, em poucos quadros com balões. O desfecho vem no último quadro.", fig: { kind: "lin-gen-recorte", genero: "tirinha", hl: ["q1", "q2", "q3", "balao"] } },
  ],
  exercicios: porNivel([
    doShow("lin-gen-anuncio-d"),
    doShow("lin-gen-charge-d"),
    doShow("lin-enem-gen-campanha-sangue"),
    doShow("lin-gen-tirinha-f3"),
    tfRecorte(L, "tirinha", "tirinha", 1),
    doShow("lin-gen-cartum-d"),
    matchPares(L, "gen", ["anuncio", "charge", "cartum", "poema"], "def", { nivel: 2 }),
  ]),
};
