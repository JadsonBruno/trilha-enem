// Moléculas reais para o caça-grupos, desenhadas na grade hexagonal (formato bastão, como no ENEM).
// Vértices do anel em volta do centro c: v0 = c+(1,0) direita-alto, v1 = c+(0,1) direita-baixo, v2 = c+(-1,1) embaixo,
// v3 = c+(-1,0) esquerda-baixo, v4 = c+(0,-1) esquerda-alto, v5 = c+(1,-1) no alto. Para fora de vk: c + 2·DIRS[k].
// As funções NÃO estão escritas aqui: quem acha os grupos é analyze() (chem.mjs).
import { mol, ringAtoms, ringBonds } from "./chem.mjs";

const R = (aromatic, extra, bonds, dbl = []) => mol([...ringAtoms(0, 0), ...extra], [...ringBonds(0, aromatic).map((b, k) => (dbl.includes(k) ? [b[0], b[1], 2] : b)), ...bonds]);

export const HUNT = [
  { id: "etanol", nome: "Etanol", onde: "álcool combustível e das bebidas", m: mol([["C", 0, 0], ["C", 1, 0], ["O", 1, 1]], [[0, 1], [1, 2]]) },
  { id: "acetona", nome: "Acetona (propanona)", onde: "removedor de esmalte", m: mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["O", 2, -1]], [[0, 1], [1, 2], [1, 3, 2]]) },
  { id: "vinagre", nome: "Ácido acético (etanoico)", onde: "vinagre", m: mol([["C", 0, 0], ["C", 1, 0], ["O", 2, -1], ["O", 1, 1]], [[0, 1], [1, 2, 2], [1, 3]]) },
  { id: "eter", nome: "Éter dietílico (etoxietano)", onde: "solvente; foi usado como anestésico", m: mol([["C", 0, 0], ["C", 1, 0], ["O", 1, 1], ["C", 2, 1], ["C", 2, 2]], [[0, 1], [1, 2], [2, 3], [3, 4]]) },
  { id: "banana", nome: "Acetato de isoamila", onde: "aroma de banana", m: mol([["C", 0, 0], ["C", 1, 0], ["O", 2, -1], ["O", 1, 1], ["C", 2, 1], ["C", 2, 2], ["C", 3, 2], ["C", 3, 3], ["C", 4, 1]], [[0, 1], [1, 2, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [6, 8]]) },
  { id: "limoneno", nome: "Limoneno", onde: "cheiro da casca da laranja", m: R(false, [["C", 2, -2], ["C", -2, 2], ["C", -2, 3], ["C", -3, 2]], [[5, 6], [2, 7], [7, 8, 2], [7, 9]], [5]) },
  { id: "latico", nome: "Ácido lático", onde: "leite azedo e músculo cansado", m: mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["O", 0, 2], ["O", 2, 1], ["O", 2, -1]], [[0, 1], [1, 2], [2, 3, 2], [2, 4], [1, 5]]) },
  { id: "mentol", nome: "Mentol", onde: "sensação gelada da hortelã", m: R(false, [["O", 2, -2], ["C", 2, 0], ["C", 3, -1], ["C", 2, 1], ["C", -2, 0]], [[5, 6], [0, 7], [7, 8], [7, 9], [3, 10]]) },
  { id: "timol", nome: "Timol", onde: "tomilho; antisséptico bucal", m: R(true, [["O", 2, -2], ["C", 2, 0], ["C", 3, -1], ["C", 2, 1], ["C", -2, 0]], [[5, 6], [0, 7], [7, 8], [7, 9], [3, 10]]) },
  { id: "canela", nome: "Cinamaldeído", onde: "cheiro da canela", m: R(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["O", 3, 2]], [[0, 6], [6, 7, 2], [7, 8], [8, 9, 2]]) },
  { id: "carvona", nome: "Carvona", onde: "hortelã e cominho", m: R(false, [["O", 2, -2], ["C", 2, 0], ["C", -2, 0], ["C", -2, -1], ["C", -3, 1]], [[5, 6, 2], [0, 7], [3, 8], [8, 9, 2], [8, 10]], [0]) },
  { id: "vanilina", nome: "Vanilina", onde: "aroma de baunilha", m: R(true, [["C", 2, -2], ["O", 3, -2], ["O", -2, 2], ["O", 0, 2], ["C", 1, 2]], [[5, 6], [6, 7, 2], [2, 8], [1, 9], [9, 10]]) },
  { id: "eugenol", nome: "Eugenol", onde: "cravo-da-índia; usado por dentistas", m: R(true, [["O", -2, 2], ["O", 0, 2], ["C", 1, 2], ["C", 2, -2], ["C", 3, -2], ["C", 3, -1]], [[2, 6], [1, 7], [7, 8], [5, 9], [9, 10], [10, 11, 2]]) },
  { id: "salicilato", nome: "Salicilato de metila", onde: "pomadas para dor muscular", m: R(true, [["C", 2, -2], ["O", 2, -3], ["O", 3, -2], ["C", 4, -3], ["O", 2, 0]], [[5, 6], [6, 7, 2], [6, 8], [8, 9], [0, 10]]) },
  { id: "aspirina", nome: "Ácido acetilsalicílico", onde: "aspirina (remédio para dor)", m: R(true, [["C", 2, -2], ["O", 2, -3], ["O", 3, -2], ["O", 2, 0], ["C", 2, 1], ["O", 1, 2], ["C", 3, 1]], [[5, 6], [6, 7, 2], [6, 8], [0, 9], [9, 10], [10, 11, 2], [10, 12]]) },
  { id: "glicose", nome: "Glicose (cadeia aberta)", onde: "açúcar do sangue e das frutas", m: mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 2, 2], ["C", 3, 2], ["O", 0, -1], ["O", 2, -1], ["O", 0, 2], ["O", 3, 0], ["O", 1, 3], ["O", 3, 3]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6, 2], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]]) },
];

// as funções que cada molécula deve ter (só para a conferência; a página usa analyze())
export const EXPECTED = {
  etanol: ["alcool"], acetona: ["cetona"], vinagre: ["acido"], eter: ["eter"], banana: ["ester"], limoneno: [], latico: ["acido", "alcool"],
  mentol: ["alcool"], timol: ["fenol"], canela: ["aldeido"], carvona: ["cetona"], vanilina: ["aldeido", "eter", "fenol"], eugenol: ["eter", "fenol"],
  salicilato: ["ester", "fenol"], aspirina: ["acido", "ester"], glicose: ["aldeido", "alcool"],
};
export const EXPECTED_FORMULA = {
  etanol: "C₂H₆O", acetona: "C₃H₆O", vinagre: "C₂H₄O₂", eter: "C₄H₁₀O", banana: "C₇H₁₄O₂", limoneno: "C₁₀H₁₆", latico: "C₃H₆O₃", mentol: "C₁₀H₂₀O",
  timol: "C₁₀H₁₄O", canela: "C₉H₈O", carvona: "C₁₀H₁₄O", vanilina: "C₈H₈O₃", eugenol: "C₁₀H₁₂O₂", salicilato: "C₈H₈O₃", aspirina: "C₉H₈O₄", glicose: "C₆H₁₂O₆",
};
