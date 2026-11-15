# Revisão independente: Química (Trilha ENEM)

Escopo: `conteudo/quimica/**` (matéria, 4 unidades, 16 lições, 4 desafios) e `checks/check-quimica.mjs` (lido só na abertura; não auditei as verificações uma a uma). Conferi a química de cada resposta, as explicações, os cartões, a ordem de ensino e a cobertura. Não editei nada além deste arquivo. Quase todos os exercícios vêm do Show (`doShow`) ou de geradores; as respostas numéricas (fórmulas, H, O₂, PE) conferem. Os problemas são sobretudo de didática e ordem de ensino, com poucos erros factuais.

## ALTA (erro de conteúdo)

**A1. Bafômetro: o cartão e o enunciado dizem que o produto é o etanal.**
- Arquivo: `04-reacoes-e-isomeria/01-oxidacao.mjs`. Itens: cartão `enem` "Como cai no ENEM" e `qui-bafometro`.
- Problema: no bafômetro de dicromato o etanol é oxidado a ácido etanoico (acético), com o etanal só como intermediário. O cartão afirma que "a prova pergunta qual produto se forma: o etanal". O enunciado usa "perde 2 H" para forçar o etanal. A resposta fica coerente com a dica, mas ensina uma química do bafômetro que não é a real. O `qui-vinagre-final` mostra o etanol indo "até o fim" no ácido, o que contradiz o bafômetro.
- Correção: reescrever o cartão como "No bafômetro o etanol é oxidado (etanal → ácido etanoico) e o dicromato muda de cor". Trocar o enunciado por "o etanol é oxidado em duas etapas; qual é o produto final?", ou tirar a palavra "bafômetro" e deixar "oxidação branda: perde 2 H".

**A2. Cartão "Do vinho ao vinagre" diz que cada etapa "troca H por O".**
- Arquivo: `04-reacoes-e-isomeria/01-oxidacao.mjs`, cartão analogia.
- Problema: etanol → etanal só perde 2 H e não ganha O. Só etanal → ácido insere um O. O cartão contradiz o próprio conceito ("oxidar é tirar 2 H") e a explicação do `order-oxidacao`.
- Correção: "Etanol perde 2 H e vira etanal. O etanal ganha um O e vira ácido etanoico."

## MÉDIA (ambiguidade, ordem de ensino, didática)

**M1. A lição cobra o que ainda não ensinou (ordem).**
- `qui-u1-l2:fill-alcano-h-4` (CₙH₂ₙ₊₂) aparece na lição 2, mas a fórmula geral só é ensinada na lição 4 da unidade 1. Mover para a lição 4 ou antecipar a regra num cartão da lição 2.
- `qui-u2-l1:match-grupo-alcool-fenol-aldeido` cobra aldeído ("−CHO na ponta"), que só é ensinado na lição 2 da unidade 2. Trocar o 3º par por algo da lição ou mover o exercício.
- `qui-u2-l4:match-dia-a-dia` cobra "Ácido carboxílico" (vinagre) e "Éster" (banana), que só são ensinados na unidade 3. O cartão exemplo da lição 4 também fala de −COOH. Trocar os pares por funções já vistas (álcool, cetona, aldeído, fenol) ou mover.
- `qui-u1-desafio`: `qui-pi-limoneno` e `qui-pi-citral` cobram "ligação pi", que nenhuma lição da unidade 1 ensina. Adicionar um cartão ("cada traço duplo = 1 ligação pi") ou trocar as questões.

**M2. Classificação "saturada/insaturada" sem delimitar entre carbonos.**
- Arquivo: `01-ler-o-bastao/03-classificar-cadeias.mjs`, cartão conceito ("Saturada (só simples) ou insaturada (dupla ou tripla)").
- Problema: em `qui-cadeia-banana` o éster tem C=O e a resposta é "saturada". Quem leu o cartão ao pé da letra erra.
- Correção: "Saturada: só ligações simples entre carbonos. Insaturada: dupla ou tripla entre carbonos (o C=O não conta)."

**M3. Dica "conte os carbonos ligados ao C=O" falha no metanal.**
- Arquivos: `qui-marca-metanal-1` (`02-o-nome-revela-a-funcao.mjs`) e o cartão analogia "Fim de linha ou meio" (`02-aldeido-ou-cetona.mjs`: "só um carbono vizinho").
- Problema: o metanal tem zero carbono vizinho do C=O, e a dica manda "um só ou dois". Os dois critérios deixam o metanal fora da regra.
- Correção: dica "aldeído: o C=O tem pelo menos um H. Cetona: carbono dos dois lados". Acrescentar "(no metanal, dois H)" ao cartão.

**M4. `qui-u3-l3:order-pe-etoxietano` contradiz a regra ensinada.**
- Arquivo: `03-acido-ester-eter-propriedades/03-quem-ferve-primeiro.mjs`.
- Ordem: etoxietano 35 < propanona 56 < etanol 78 < ácido 118. Os PE estão corretos, mas a lição ensina "sem O−H, pesa a cadeia maior". O éter (74 g/mol) é mais pesado que a cetona (58 g/mol) e ferve menos, porque o dipolo do C=O é mais forte. O aluno que aplica o cartão erra, e a explicação só lista os valores.
- Correção: acrescentar ao cartão "dipolo da C=O > éter, com massas próximas", ou trocar por `etoxietano, butano-ol…` sem esse conflito. No mínimo explicar na `explicacao`: "propanona tem C=O, mais polar que o éter".

**M5. `qui-u3-l4:order-solub-etanol` ordena propanal acima de butan-1-ol.**
- Arquivo: `04-mistura-com-a-agua.mjs`.
- Problema: os dados reais são propanal ~30 g/100 mL e butan-1-ol ~7,7 g/100 mL, então a ordem está correta. Mas o cartão ensina "quem tem O−H se mistura", e o aluno colocaria o butanol acima do propanal. O butanol já é citado como "pouco solúvel", o que ajuda só em parte.
- Correção: trocar propanal por propan-1-ol (miscível), com a ordem etanol/propan-1-ol/butan-1-ol/éster. Ou dizer na explicação: "propanal (C=O) aceita ligação de H da água e tem só 3 C".

**M6. Cartão de solubilidade incompleto (acetona e éter).**
- Arquivo: `04-mistura-com-a-agua.mjs`, cartões conceito e pegadinha.
- Problema: "quem tem O−H e é pequeno se mistura" e "éter e cetona não fazem [H-bond] entre si" deixam a acetona sem explicação, e ela é miscível (`qui-sol-max-propanona`, `qui-nao-mistura-hexano`).
- Correção: acrescentar "O com par livre recebe o H da água; por isso acetona e éter pequenos se misturam".

**M7. Isomeria só cobre função, cadeia e posição.**
- Arquivo: `04-reacoes-e-isomeria/04-isomeria.mjs`.
- Problema: isomeria geométrica (cis-trans) e óptica (carbono quiral) são das mais cobradas no ENEM. A unidade cobre só os tipos planos, e a matéria declara o tema "isomeria" com frequência "média".
- Correção: ao menos um cartão e 2 a 3 exercícios de cis-trans (but-2-eno) e carbono quiral. Se estiver fora do escopo, documentar no `materia.mjs`.

**M8. Zero exercícios do tipo `enem` com texto-base.**
- Arquivos: toda a matéria. Só aparecem `mc`, `mc-figura`, `tf`, `match`, `order` e `fill`.
- Problema: os desafios são "estilo ENEM", mas não têm contexto nem texto-base (rótulo, notícia, uso). Isso pesa sobretudo em propriedades e reações.
- Correção: criar ao menos 2 `enem` por unidade (3 e 4 em prioridade), com `analise` por alternativa. Respeitar o limite de 30%.

**M9. Cartão e legenda "músculo cansado" para o ácido lático.**
- Arquivos: `02-alcool-fenol-aldeido-cetona/04-varias-funcoes.mjs` (cartão exemplo e legendas `qui-marca-latico-5` e `qui-comum-latico-glicose`, vindas do Show).
- Problema: o ácido lático não causa a dor muscular nem o "cansaço" (mito comum). O ENEM e os professores atuais evitam isso.
- Correção: trocar por "leite azedo, iogurte".

**M10. Match de função com descrições que se confundem.**
- Arquivo: `03-acido-ester-eter-propriedades/01-acido-ou-ester.mjs`, `match-grupo-acido-ester-eter`.
- Problema: "−COO− entre carbonos" (éster) e "−O− entre dois carbonos" (éter) parecem a mesma frase, e o éster também tem um O entre carbonos. A explicação genérica ("O que decide a função é o grupo…") não desfaz a dúvida.
- Correção: éter = "−O− sem C=O ao lado", éster = "C=O ligado a −O−C". Explicação específica sobre o =O.

**M11. Lição "O nome revela a função" cobra pouco de nomes.**
- Arquivo: `02-alcool-fenol-aldeido-cetona/03-o-nome-revela-a-funcao.mjs`.
- Problema: só o match e os dois fills usam nomes. Os outros 4 exercícios são "função marcada" ou "comum às duas". O sufixo do éter (…oxi…ano) aparece como distrator em `qui-u3-l2:fill-sufixo-ester` sem ter sido ensinado.
- Correção: 2 mc "qual a função de butan-2-ol / butanal / ácido propanoico?", e incluir "…oxi…ano" no cartão da lição 2 da unidade 3.

**M12. `qui-u1-l4:match-familia` mistura fórmula geral com "anel benzênico".**
- Arquivo: `01-ler-o-bastao/04-hidrocarbonetos.mjs`.
- Problema: o enunciado pede "fórmula geral", e o 4º par ("benzeno / anel benzênico") não é fórmula. Além disso o cartão exemplo de fórmulas gerais mostra a figura do benzeno, que não segue nenhuma delas.
- Correção: enunciado "ligue ao que identifica a família", e figura do ciclo-hexano ou do propeno no cartão.

**M13. Desafio da unidade 1 não cobre hidrocarbonetos nem a fórmula geral.**
- Arquivo: `01-ler-o-bastao/unidade.mjs`.
- Problema: 3 de fórmula, 2 de H, 2 de cadeia, 2 de pi e 1 aromático; a lição 4 (alcano/alceno/alcino) só tem o aromático. Com M1, o desafio fica deslocado do que a unidade ensinou.
- Correção: trocar uma `pi` e uma `hesc` por alceno/alcino e por fórmula geral.

**M14. Desafio da unidade 2 pesa em álcool/fenol.**
- Arquivo: `02-alcool-fenol-aldeido-cetona/unidade.mjs`.
- Problema: 6 de 10 são álcool/fenol (`qual-fenol-timol`, `qual-alcool-alcool_benzilico`, 3 `marca` e `comum-timol-resveratrol`) e 4 de aldeído/cetona. Nenhuma questão exercita "quantas funções diferentes" (o objetivo da lição 4).
- Correção: trocar uma `marca` por `nfunc` e outra por uma de aldeído/cetona.

**M15. Repetição de moléculas na mesma lição e entre lições.**
- Arquivos: `qui-u2-l4` (`marca-canela-9` e `marca-carvona-6` repetem as moléculas do tf da lição 2, que ainda reaparecem no desafio); `qui-u3-l1` (`marca-vinagre-3`/`qual-acido-vinagre` e `marca-banana-3`/`qual-ester-banana` perguntam a mesma coisa com a mesma molécula); `qui-u3-l2` (`marca-eter-2`/`qual-eter-etoxietano`).
- Correção: trocar o 2º de cada par por outra molécula (ex.: ácido benzoico, acetato de benzila, anetol).

**M16. `match-oxidacao` sem a dica "perde 2 H".**
- Arquivo: `04-reacoes-e-isomeria/01-oxidacao.mjs`.
- Problema: etanol → etanal e butan-1-ol → butanal estão certos só se a oxidação for branda. Sem a dica, o etanol "poderia" ir ao ácido (embora não haja ácidos entre as opções).
- Correção: "Ligue cada álcool ao produto da oxidação (perde 2 H)".

**M17. Lição de esterificação só tem exercícios de nível 2, e a unidade 4 começa difícil.**
- Arquivos: `04-reacoes-e-isomeria/02-esterificacao.mjs`. A lição 1 também começa em n2, e o n1 (`oxida-metanol`) é o 4º exercício.
- Correção: reordenar do fácil ao difícil, com o primeiro exercício em n1 (ex.: `fill-agua` como abertura).

## BAIXA (estilo)

- **B1.** `qui-u1-l2`: o último exercício (`fill-formula-etanol`, n1) vem depois de três n2. Mover para o início.
- **B2.** Dicas `qui-hesc-isopreno` e semelhantes repetem "o H do OH está escrito" em moléculas sem OH.
- **B3.** Frases "O nome de um(a) cetona termina em ___" (`fill-sufixo-*`): "um(a)" é desajeitado. Gerar "O nome de uma cetona" / "de um aldeído". A opção "ácido …oico" não é terminação, é uma estrutura; trocar por "oico" ou "ico".
- **B4.** `qui-hidrolise-acetato_benzila`: "fenol + ácido propanoico" está em minúscula, diferente das outras alternativas.
- **B5.** O biodiesel é ilustrado por `octanoato de metila` com legenda "éster metílico do biodiesel". Os ésteres reais do biodiesel têm 16 a 18 C. Usar "modelo pequeno de um éster do biodiesel".
- **B6.** Cartão "Éster é ... ganha cheiro de fruta" generaliza demais (gorduras e biodiesel não cheiram a fruta). Dizer "os ésteres pequenos têm cheiro de fruta".
- **B7.** `qui-oxida-propan-2-ol`: "o do álcool de limpeza". No Brasil, o álcool de limpeza é etanol. Dizer "álcool isopropílico (limpa-telas)".
- **B8.** Sinal de menos misto nas explicações do Show ("-162 °C" e "−162"). Padronizar para "−".
- **B9.** Cartão "Como cai no ENEM" da lição 4 da unidade 1 afirma "A prova mostra o bastão e pergunta a família ou a fórmula geral". É plausível, mas generalizado; sem ano de prova, o que está dentro da regra. Suavizar para "costuma mostrar".
- **B10.** O cartão `enem` da lição 3 da unidade 3 e o de esterificação usam "dois abraços" e "o ácido faz dois", que simplificam a dimerização. Aceitável; acrescentar "(forma pares)" se houver espaço.
- **B11.** `qui-u4-l3` não ensina um atalho para o O₂ (n + m/4 − o/2). Opcional, mas ajudaria a entender os coeficientes fracionários (6,5; 12,5; 4,5).
- **B12.** `qui-transester` é n3 e a transesterificação não foi ensinada. O enunciado explica; considerar um cartão curto na lição 2 da unidade 4.
- **B13.** `qui-gordura-limoneno` e `qui-gas-propano` são n1, mas dependem de conceitos (lipossolubilidade, PE de referência) que o cartão só toca de leve.

## Verificações sem problema

- Fórmulas e H em carbonos: eugenol C₁₀H₁₂O₂, ibuprofeno C₁₃H₁₈O₂, vanilina C₈H₈O₃, mentol C₁₀H₂₀O, aspirina C₉H₈O₄, cinamaldeído C₉H₈O, timol C₁₀H₁₄O, isopreno 8 H e sórbico 7 H.
- Classificações de cadeia, funções marcadas e "comum às duas": todas coerentes. Nos distratores não há alternativa que também fosse certa.
- PE e solubilidades: valores aproximados corretos (etano −89, propano −42, butano −0,5, metoximetano −24, etoxietano 35, propanona 56, etanol 78, ácido etanoico 118, butan-1-ol 118, octano 126 °C). As ordens dos desafios estão certas (`pe-max` e `pe-min`).
- Combustão (todas conferem pela contagem de O): metano 2, etano 3,5, propano 5, butano 6,5, etanol 3, propan-1-ol 4,5, octano 12,5, glicose 6.
- Isômeros: etanol × metoximetano (função), propan-1-ol × propan-2-ol (posição), butano × metilpropano (cadeia), propanal × propanona (função), anetol × estragol (posição), ácido butanoico × etanoato de etila (função).
- Esterificação: nomes ácido+álcool → éster corretos, incluindo as armadilhas (metanoato de etila × etanoato de metila).
- Sem ano ou número de prova inventado. Os enunciados são curtos. Os cartões respeitam a regra de frases curtas.

## Resumo

A Química está sólida nos números e nas respostas. Os 2 erros ALTA são conceituais e ficam na lição de oxidação: o produto do bafômetro (é ácido etanoico, não etanal) e a analogia "cada etapa troca H por O". Corrigir os dois antes de publicar.

Os problemas MÉDIA se agrupam em quatro frentes:
- Ordem de ensino (M1): fórmula geral de alcano antes da lição 4, aldeído e −COOH cobrados antes de ensinados, ligação pi no desafio.
- Cartões que deixam o aluno errar: saturação com C=O (M2), PE do éter contra a cetona (M4), solubilidade da acetona (M6).
- Cobertura: isomeria geométrica e óptica ausentes (M7), nenhum exercício `enem` com texto-base (M8), desafios desequilibrados nas unidades 1 e 2 (M13, M14).
- Repetição de moléculas (M15).

**Contagem: ALTA 2, MÉDIA 17, BAIXA 13.**
