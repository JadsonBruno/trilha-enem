import { show as doShow, comDica } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u2-l3";
export default {
  id: L, titulo: "O nome revela a função", temas: ["alcool-fenol", "aldeido-cetona"],
  cartoes: [
    { tipo: "conceito", titulo: "Final do nome = função", texto: "-ol é álcool, -al é aldeído, -ona é cetona. Leia o final do nome primeiro. Os finais de ácido, éster e éter vêm na unidade 3.", fig: G.molFig("propanona", "cetona") },
    { tipo: "analogia", titulo: "Sobrenome da família", texto: "O final do nome é o sobrenome. Etanol, propanol, butanol: todos da família -ol. Etanal e propanal: família -al." },
    { tipo: "pegadinha", titulo: "Fenol é exceção", texto: "Fenol termina em -ol, mas o OH está preso no anel aromático. Álcool de verdade tem OH num carbono de cadeia.", fig: G.molFig("fenol", "fenol") },
  ],
  exercicios: [
    G.matchFuncNome(L, ["etanol", "etanal", "propanona", "fenol"]),
    G.fillSufixo(L, "cetona", ["alcool", "aldeido", "fenol"]),
    G.fillSufixo(L, "aldeido", ["alcool", "cetona", "fenol"]),
    G.mcNomeFuncao(L, "butan-2-ol", ["alcool", "fenol", "aldeido", "cetona"]),
    G.mcNomeFuncao(L, "heptan-2-ona", ["alcool", "fenol", "aldeido", "cetona"], 2),
    comDica(doShow("marca-metanal-1"), "Aldeído: o C=O tem pelo menos um H preso. Cetona: o C=O tem carbono dos dois lados."),
    G.tfFuncao(L, "butanal", "cetona"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
