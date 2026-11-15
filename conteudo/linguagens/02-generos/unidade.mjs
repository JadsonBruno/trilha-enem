import { doShow } from "../../_comum/show.mjs";
import { porNivel } from "../_gerar.mjs";

export default {
  id: "lin-u2", titulo: "Gêneros textuais",
  descricao: "Notícia, editorial, crônica, anúncio, charge e outros: função social, estrutura e marcas de cada gênero.",
  temas: ["generos"],
  desafio: porNivel([
    doShow("lin-gen-charge-f2"),
    doShow("lin-enem-gen-noticia-biblioteca"),
    doShow("lin-gen-reportagem-c"),
    doShow("lin-gen-charge-f3"),
    doShow("lin-enem-gen-reportagem-medicos"),
    doShow("lin-gen-institucional-f1"),
    doShow("lin-gen-cartaleitor-f1"),
    doShow("lin-enem-gen-carta-leitor-ciclovia"),
    doShow("lin-gen-resenha-c"),
    doShow("lin-enem-gen-carta-aberta-posto"),
  ]),
};
