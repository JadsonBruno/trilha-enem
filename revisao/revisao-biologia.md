# Revisão independente: Biologia (Trilha ENEM)

Escopo: `conteudo/biologia/**` (matéria, 4 unidades, 19 lições, 4 desafios, `_util.mjs`, `_modelos.mjs`) e `checks/check-biologia.mjs`. Conferi o conteúdo resolvido pelo manifesto (145 exercícios em lições: 68 mc, 31 tf, 18 match, 16 fill, 11 order, 1 mc-figura; 40 nos desafios), os 18 exercícios `origem: "manual"` contra a `ref`, os dados das figuras (gel, heredogramas, fita de RNA, ciclos, cladogramas, quadros) e as contas dos exercícios gerados.

Resultado geral: **nenhum erro de resposta encontrado**. Refiz à mão as contas e leituras de figura que consegui checar (pirâmides 10%, bioacumulação ×10, Punnett, heredogramas, ABO/Rh, transcrição/tradução e mutações, gel de paternidade, osmose, n/2n, cladogramas, ciclos C/N/água, coração, quadros). As respostas certas estão certas e não achei alternativa errada que também sirva. Os problemas são de didática (cobra-se o que não se ensina), imprecisão de explicação e ambiguidade pontual.

## ALTA (erro de conteúdo ou de resposta)

Nenhum.

## MÉDIA (ambiguidade, didática, imprecisão)

**M1. Código genético cobrado sem tabela e sem ensino da tabela**
- Arquivos: `02-genetica/04-codigo-genetico.mjs`; desafio `bio-gen-codigo-mutacao-menor-proteina` (fonte `fonte/show-do-enem/bio-genetica.mjs`).
- Ids: `bio-u2-l4:order-aminoacidos`, `bio-u2-l4:match-codon-aa`, `bio-u2-l4:tf-mutacao-silenciosa`, `bio-u2-l4:fill-aug`.
- Problema: a figura `gen-fita` em modo "ask" não mostra aminoácidos nem tabela, e nenhum cartão traz a tabela. Para ligar UUU a fenilalanina, ordenar Met-Phe-Gly-Trp ou saber que CCC e CCG são prolina, o aluno precisa decorar o código. O ENEM sempre fornece a tabela. O desafio de mutação também depende de saber que UUC para UUU é silenciosa.
- Correção: acrescentar um cartão ou figura com a tabela (ou um recorte com os códons usados: AUG, UUU/UUC, GGC, UGG, CCC/CCG, UAA/UAG/UGA) e dizer no enunciado "use a tabela". Ou trocar `match-codon-aa` e `order-aminoacidos` por exercícios que dão a tabela na figura.

**M2. Rh e anticorpos: cartão e explicação imprecisos**
- Arquivo: `02-genetica/03-sangue-abo.mjs`.
- Ids: cartão conceito "Antígenos e anticorpos"; `bio-u2-l3:tf-o-negativo-recebe-positivo`.
- Problema: o cartão diz que o plasma tem anticorpos contra o antígeno que a pessoa NÃO tem, incluindo o D. Anti-D não existe naturalmente: só se forma após sensibilização (é o que a questão ENEM PPL 2017 sobre anti-Rh cobra). A explicação do tf diz "o plasma do receptor reage e ele fica sensibilizado", misturando reação imediata com sensibilização. A resposta (falso) continua correta.
- Correção: no cartão, "anti-A e anti-B já existem no plasma; anti-D só aparece depois do contato com Rh+". Na explicação do tf: "O+ leva o D; a pessoa O− ainda não tem anti-D, mas passa a produzir (sensibilização) e reage numa próxima exposição."

**M3. CRISPR cobrado sem ter sido ensinado**
- Arquivo: `02-genetica/05-biotecnologia.mjs`.
- Ids: `bio-biotec-crispr` (n3, Show), `bio-u2-l5:match-tecnicas`.
- Problema: os cartões da lição tratam de transgênico, clone, PCR e eletroforese; CRISPR-Cas9 (RNA guia, Cas9) não aparece em cartão nenhum, mas é cobrado em dois exercícios.
- Correção: incluir CRISPR no cartão conceito ou criar um cartão "exemplo" curto: "O RNA guia pareia com a sequência-alvo; a Cas9 corta ali."

**M4. Genética: ligada ao X, letal e diíbrido cobrados sem cartão**
- Arquivos: `02-genetica/unidade.mjs` (desafio), `01-cruzamentos.mjs`, `02-heredogramas.mjs`.
- Ids: `bio-gen-x-daltonismo-filhos`, `bio-gen-x-heredograma-1-4`, `bio-gen-punnett-letal-amarelo` (letal só citado de passagem no cartão enem), `bio-gen-lei2-diibrido-3-16`, `bio-u2-l1:fill-aabb` (n3 na 1ª lição).
- Problema: herança ligada ao X e dois genes (gametas de AaBb) não têm cartão. As explicações usam X, mas o aluno nunca viu "XD Xd" nem "A_bb".
- Correção: um cartão "exemplo" em `02-heredogramas` sobre ligada ao X (homem tem um X; filha de homem afetado recebe o X dele) e um em `01-cruzamentos` sobre dois genes (cada genitor faz 4 gametas; A_ bb na legenda). Ou mover `fill-aabb` para depois desse cartão.

**M5. Desafio de Corpo e saúde cobra temas sem lição**
- Arquivo: `03-corpo-saude/unidade.mjs`.
- Ids: `bio-corpo-alveolo-trocas`, `bio-corpo-sinapse-neurotransmissor`, `bio-corpo-rim-reabsorcao`, `bio-saude-wolbachia-dengue`, `bio-saude-rnam-ordem`, `bio-saude-resistencia-selecao`.
- Problema: as 4 lições cobrem digestão/circulação, glicemia, vetores e vacinas. Respiração, neurônio, rim, Wolbachia, vacina de RNAm e seleção de bactérias resistentes só aparecem no desafio: 6 dos 10 itens são inéditos para quem seguiu a trilha. As questões em si estão corretas.
- Correção: uma lição extra (respiração, sistema nervoso, excreção) e um cartão sobre RNAm/resistência, ou trocar parte do desafio por itens dos temas ensinados.

**M6. Célula e evolução: desafio e filogenia cobram o que não foi ensinado**
- Arquivos: `04-celula-evolucao/unidade.mjs`, `04-evolucao.mjs`.
- Ids: `bio-evo-especiacao`, `bio-cel-fot-espectro`, `bio-evo-fossil-transicao`, `bio-plan-cordado`; e `bio-u4-l4:mc-monofiletico-mamiferos` (n3 numa lição cujos cartões não definem "monofilético").
- Problema: especiação/isolamento reprodutivo, espectro de absorção da clorofila, fósseis de transição e características dos cordados não têm cartão. "Monofilético" aparece só no enunciado.
- Correção: cartão curto "monofilético = ancestral + todos os descendentes" em `04-evolucao`; cartões ou itens de lição para especiação e cordados; ou trocar itens do desafio.

**M7. Lição "Ciclos e impactos": exercícios sem cartão correspondente**
- Arquivo: `01-ecologia/04-ciclos-impactos.mjs`.
- Ids: `bio-eco-imp-fragmento-especies` (n3), `bio-eco-pop-capacidade-suporte`, `bio-u1-l4:tf-seta3-agua` (ciclo da água), `bio-eco-ciclo-agua-desmatamento` (desafio).
- Problema: os cartões ensinam carbono, nitrogênio e eutrofização. Fragmentação de habitat, capacidade de suporte (K) e ciclo da água (evaporação, transpiração, precipitação) são cobrados sem ensino.
- Correção: o schema limita a 4 cartões; condensar o cartão "exemplo" do carbono e usar o espaço para "habitat, K e água".

**M8. tf de glicemia no limite da faixa**
- Arquivo: `03-corpo-saude/02-glicemia-hormonios.mjs`.
- Id: `bio-u3-l2:tf-2h-acima-normal`.
- Problema: a curva chega a 100 mg/dL em 2 h e a faixa normal é 70 a 100. O gabarito "falso" depende de tratar 100 como "dentro". Um aluno cuidadoso pode ler "no limite, ainda não abaixo".
- Correção: ajustar o dado para 95 mg/dL em 2 h, ou reformular: "Duas horas depois, a glicemia já está dentro da faixa normal" (verdadeiro).

**M9. tf de pirâmide "possível" com taxas distantes de 10%**
- Arquivo: `01-ecologia/02-energia-piramides.mjs`.
- Ids: `bio-u1-l2:tf-piramide-possivel`, `bio-u1-l2:tf-piramide-invertida`.
- Problema: os valores 8 000, 900, 150, 10 dão 11%, 17% e 7% de transferência. Depois de um cartão que diz "só uns 10%", o aluno pode achar que não é possível. O gabarito (possível: só exige que diminua) está certo, mas o enunciado não diz que esse é o critério.
- Correção: enunciado "...podem representar a energia por nível de uma cadeia alimentar (basta que a energia diminua a cada nível)" ou valores perto de 10%.

**M10. "Bioacumulação" ensina biomagnificação; "plâncton" como produtor**
- Arquivo: `01-ecologia/03-bioacumulacao.mjs`.
- Ids: cartões conceito e analogia; `bio-u1-l3:mc-topo-ave`, `tf-produtor-maior`, `match-niveis-valor`.
- Problema: (a) o cartão chama de acúmulo o que é aumento ao longo da cadeia (biomagnificação); só a explicação do fill menciona "biomagnificação", sem apresentá-la. Bioacumulação é o acúmulo no organismo ao longo da vida; biomagnificação é o aumento a cada nível. (b) "Plâncton" como produtor/1º nível: plâncton inclui zooplâncton; o produtor é o fitoplâncton.
- Correção: cartão: "Bioacumulação: o poluente se acumula no organismo. Biomagnificação: a concentração sobe a cada nível da cadeia." Trocar "Plâncton" por "Fitoplâncton" ou "Alga" nos três exercícios.

**M11. Ordem discutível no ciclo da lombriga**
- Arquivo: `03-corpo-saude/03-vetores-parasitas.mjs`.
- Id: `bio-u3-l3:order-ciclo-lombriga`.
- Problema: "Solo, água e alimentos sujos" e "Mãos e verduras contaminadas" se sobrepõem (verdura é alimento; a mão toca o solo antes ou depois). A ordem 3 e 4 é uma escolha do autor.
- Correção: itens menos sobrepostos, por exemplo: "Ovos nas fezes", "Ovos no solo", "Ovos nas mãos ou na verdura", "Ovos engolidos", "Lombriga no intestino".

**M12. Rótulos "(certo)" no match de heredograma**
- Arquivo: `02-genetica/02-heredogramas.mjs`.
- Id: `bio-u2-l2:match-genotipos`.
- Problema: "Heterozigoto Aa (certo)" e "Recessivo aa (certo)" parecem marcas de gabarito e confundem; a terceira opção ("Aa com chance 2/3") não é um genótipo.
- Correção: "Aa (portador)", "aa (afetada)", "AA ou Aa (2/3 de ser Aa)".

**M13. Explicação imprecisa de célula de memória**
- Arquivo: `03-corpo-saude/04-vacinas-imunidade.mjs`.
- Id: `bio-u3-l4:fill-celulas-memoria`.
- Problema: "células de memória guardam o antígeno 'fichado'" sugere armazenar o antígeno. Elas guardam a capacidade de reconhecê-lo e se diferenciam rápido em plasmócitos.
- Correção: "Células de memória reconhecem o antígeno já visto e viram produtoras de anticorpos mais depressa."

**M14. Nenhum item com texto-base e nenhum `enem`**
- Arquivos: todas as lições e desafios de Biologia.
- Problema: os cartões "Como cai no ENEM" prometem o formato, mas nenhum exercício usa `base` nem o tipo `enem` (alternativas com `analise` por alternativa, previsto no PLANO). O ENEM de Biologia cobra muita leitura de texto de divulgação.
- Correção: 1 a 2 itens `enem` por unidade (da 2ª lição em diante): um texto curto sobre garimpo e mercúrio (u1), transgênicos (u2), vacinas (u3) e seleção natural (u4), com `analise` por alternativa. Respeitar o limite de 30% por unidade.

**M15. order e match sem figura que dependem de uma cadeia não mostrada**
- Arquivos: `01-ecologia/01-teias-niveis.mjs`, `03-bioacumulacao.mjs`.
- Ids: `bio-u1-l1:order-cadeia-amazonia`, `bio-u1-l1:match-niveis-cerrado`, `bio-u1-l3:order-contaminacao`.
- Problema: sem figura, o aluno ordena "Folhas, Insetos, Sapo, Jiboia, Onça" ou liga "Cobra: 4º nível" por senso comum. Funciona, mas "quem come quem" não está no enunciado (alga, girino, peixe, garça; capim, gafanhoto, sapo, cobra).
- Correção: escrever a cadeia no enunciado ("Cadeia: capim, gafanhoto, sapo, cobra") ou incluir a figura `eco-teia`.

## BAIXA (estilo)

- **B1. Desafio repete conceito da lição e cartões dão a resposta.** `bio-eco-teia-manguezal-retirada` é quase o mesmo problema de `bio-u1-l1:tf-sem-caramujo-tainha`; os cartões "pegadinha" já resolvem `bio-eco-teia-sagui-niveis` (sagui) e `bio-eco-rel-erva-passarinho` (erva-de-passarinho x orquídea). Trocar o exemplo do cartão ou do desafio.
- **B2. Distratores fracos.** `bio-u3-l4:fill-celulas-memoria` ("hemácias", "gordura"), `bio-u4-l1:fill-fotossintese-cloroplasto` (núcleo, lisossomo), `bio-u2-l5:fill-gel-menores` ("mais escuros"). Usar distratores plausíveis (p. ex. "plaquetas", "linfócitos T").
- **B3. Figuras `eco-relacao` mostram os sinais.** `mc-abelha-flor`, `mc-arvores-luz` e `tf-carrapato-comensal` trazem +/- na figura em modo "ask"; o exercício vira só leitura de sinal. Aceitável no n1, mas `mc-arvores-luz` está em n2.
- **B4. Dica do cladograma confusa.** `bio-evo-clado-humano`: "o nó do anel (gorila + orangotango)" é o nó raiz, não um grupo. Melhor: "Compare o ramo que junta humano e chimpanzé com o que junta o gorila".
- **B5. `bio-u4-l5:match-planta-funcao`.** O enunciado diz "estrutura da planta", mas "Transpiração" é processo. Escrever "estrutura ou processo".
- **B6. RE rugoso "sintetiza proteínas".** Simplificação comum (`bio-cel-org-rer`, cartão de organelas): quem sintetiza são os ribossomos presos ao RE. O `order-secrecao-proteina` já está correto; alinhar o cartão.
- **B7. Termos não definidos.** "Dominante puro" (`bio-u2-l1:match-cruzamento-genotipos`) não aparece nos cartões (usar "homozigoto dominante"); "decompositor" e "predação" aparecem em alternativas (u1-l1, u1-l5) sem cartão; "consumidor terciário" só no match.
- **B8. `src` do desafio de mercúrio.** `bio-eco-bio-mercurio-cadeias`: "como no ENEM PPL 2020 (quadro de cadeias, TBT em moluscos)" **é sustentado** por `pesquisa/pesquisa-biologia-enem.md` (tabela, item 13: ENEM PPL 2020, bioacumulação, quadro de 5 cadeias, molusco com maior TBT, gabarito E). Ressalvas: a fonte é o Projeto Agatha (secundária, com gabarito assumido A=1...E=5, como a própria pesquisa avisa) e a `ref` do exercício cita só OpenStax. Sugestão: citar a fonte da pesquisa na `ref` ou conferir no caderno do Inep. O exercício é adaptação (4 cadeias, mercúrio); o "como no" é honesto.
- **B9. Níveis fora de ordem crescente dentro da lição.** Ex.: `bio-u1-l2` tem um n3 (`mc-volta-2-nivel`) em 3º lugar e um fill n1 no fim; `bio-u2-l1` termina com n3 (`fill-aabb`). Se o motor não reordena, a curva de dificuldade fica irregular.
- **B10. Variabilidade na meiose.** O cartão de divisão não menciona crossing-over e variabilidade (tema frequente). Opcional.
- **B11. Gráfico de jejum.** `bio-u3-l2:tf-jejum-insulina-maior` compara insulina e glucagon no mesmo eixo "nível relativo"; ok como escala relativa, mas vale dizer "(escala relativa)" no enunciado.

## Conferências feitas (sem problema)

- **Cartões:** corretos e curtos; analogias (bastão, imposto de 90%, bola de neve, duas moedas, bandeira e alarme, receita e cozinha, termostato, entregador, fábrica, canudo e esteira) não ensinam errado. Nenhum cartão "Como cai no ENEM" cita ano ou número de prova.
- **Manuais (18):** os fatos conferem com a `ref` (OpenStax, CDC): técnicas de DNA, enzimas (bile não é enzima), caminho do sangue, órgãos e hormônios, ordem pós-refeição, vetores (CDC para dengue e leishmaniose; malária e Chagas vêm do Show), termos de imunidade, organelas, secreção de proteína (RE rugoso, Golgi, vesícula), fases da mitose, termos de evolução, seleção natural, xilema/floema/transpiração. A única nuance é M13.
- **Gerados que reaproveitam figura com pergunta nova:** a pergunta casa com a figura em todos os casos. `eco-ciclo` (seta 6 combustão, seta 3 transpiração, seta 3 absorção de nitrato), `eco-bioacum` (cadeias A a D: 400, 200, 300 e 250 µg/g; topo em A), `gen-fita` (CAUGGGCUUUUAAG dá 3 aa; AUGAAACCCGGGUAA dá 4 aa e cai para 1; 9ª base CCC para CCG é silenciosa), `cel-gel` (bandas 4 e 10 só no Pai A; desafio: suspeitos C e D excluídos), `cel-celula` (letras de núcleo, mitocôndria e cloroplasto), `corpo-coracao` (câmaras 2 e 4), `corpo-circuito` (vaso C é a veia pulmonar), `cel-quadro`, `cel-flor`, `cel-cladograma` (crocodilo + ave; humano + chimpanzé), mutação do desafio (7ª base C para U cria UAG no 3º códon; a 12ª cria UGA no 4º; a 6ª é silenciosa; a 19ª remove a parada).
- **V/F, match, order, fill:** sem par trocável nem duas opções aceitáveis, exceto os pontos M8, M9, M11, M12 e M15.
- **Progressão e variedade:** a 1ª lição de cada unidade não tem `enem`; variedade de tipos boa nas lições. O gargalo é "ensinar antes de cobrar" (M1, M3 a M7) e o formato ENEM (M14).
- **`checks/check-biologia.mjs`:** refaz as contas dos gerados com código próprio e confere as 80 do Show; cobre bem as respostas numéricas. Não verifica "cobrado sem cartão" (M1, M3 a M7). Sugestão: avisar quando um item do desafio usa um `kind` de figura ou um conceito que nenhuma lição da unidade usa.

## Resumo

Conteúdo biologicamente correto: nenhuma resposta errada, nenhuma alternativa extra aceitável e nenhuma figura em desacordo com a pergunta. Prioridades: (1) o código genético é cobrado sem tabela (M1); (2) cartão e explicação de Rh imprecisos (M2); (3) ensinar antes de cobrar nas unidades 2, 3 e 4 e nos desafios (M3 a M7); (4) tf de glicemia no limite (M8) e tf de pirâmide (M9); (5) bioacumulação x biomagnificação e "plâncton" como produtor (M10); (6) nenhum item com texto-base ou `enem` (M14). O `src` "como no ENEM PPL 2020" é sustentado pela pesquisa (item 13), com a ressalva de ser fonte secundária.

**Contagem: ALTA 0, MÉDIA 15, BAIXA 11.**
