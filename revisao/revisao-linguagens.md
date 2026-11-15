# Revisão independente: Linguagens (Trilha ENEM)

Escopo: `conteudo/linguagens/**` (4 unidades, 19 lições, desafios, `_gerar.mjs`, `_leitura.mjs`). Li o conteúdo resolvido pelo manifesto (todas as lições, cartões, exercícios e desafios) e confrontei `src` com `pesquisa/pesquisa-linguagens-enem.md`.
Limites desta revisão: não reabri `checks/check-linguagens.mjs` linha a linha, não abri as URLs de `_leitura.mjs` (só conferi que são páginas citadas, de fontes abertas) e não consegui verificar offline a numeração exata de alguns poemas (marcados "conferir").

## ALTA (erro de resposta ou copyright)

Nenhum erro de gabarito nem problema de copyright encontrado.
- Autores dos textos-base reais: Machado, Lima Barreto, Aluísio Azevedo, Gregório de Matos, Camões, Castro Alves, Bilac, Augusto dos Anjos, Cruz e Sousa, Casimiro de Abreu, Álvares de Azevedo, Gonçalves Dias, Pessoa/Álvaro de Campos (m. 1935), Caminha. Todos mortos há mais de 70 anos, portanto domínio público.
- Textos de jogo (campanha de sangue, editorial da calçada, resenha, notícias, anúncio, verbete, 3 crônicas de `_leitura.mjs`, abaixo-assinado, carta do leitor, carta aberta, app de áudio): todos trazem "Texto elaborado para o jogo".
- Sem letra de música.
- Os 8 `src` "como no ENEM <ano>" têm respaldo na pesquisa: 2013, 2014 (editorial), 2016 (resenha), 2017, 2018 (app), 2019 (campanha), 2021 PPL (poema que fala de si) e 2023 (carta aberta). Nenhum ano inventado.

## MÉDIA (ambiguidade, didática)

1. `conteudo/linguagens/_leitura.mjs`, ARMADILHAS (`extrapolacao`, `recurso-ausente`, `efeito-trocado`): as definições se sobrepõem.
   - "Tira do texto algo que ele não diz" descreve também "Compara, com 'como'…" (recurso ausente) e "Suaviza o problema…" (efeito trocado).
   - Só extrapolação × generalização foi declarada como coexistente.
   - Afeta os mc "Que armadilha esta alternativa traz?" e os V/F `tf-armadilha-*`: `lin-u4-l3:mc-armadilha-a-*`, `lin-u4-l5:mc-armadilha-b-recurso-ausente` ("Exagera, com hipérbole, o cansaço" também é suposição sem apoio), `lin-u4-d:mc-armadilha-c-*`.
   - Correção sugerida: restringir a definição de extrapolação ("conclui um fato, causa ou culpado que o texto não afirma") e mover recurso ausente/efeito trocado para fora de `confunde` da extrapolação, ou declarar os pares em `SOBREPOSTAS_ARM`.
2. `_leitura.mjs`, `generalizacao.marca` ("Traz sempre, nunca, todos, qualquer") contradiz o cartão `lin-u4-l3` "Palavra absoluta", que diz que a palavra não corta sozinha.
   - Isso afeta `lin-u4-l3:fill-marca-generalizacao`.
   - Correção sugerida: marca = "Transforma um caso em regra, em geral com 'todo', 'sempre'".
3. `lin-fig-metafora-n2d` (lição u1-l1), `lin-fig-catacrese-d2n` (u1-l4) e `lin-fig-catacrese-n2d` (desafio u1): catacrese e metáfora aparecem como distratoras uma da outra. Catacrese é metáfora cristalizada (o próprio cartão diz isso). Em `lin-fig-metafora-n2d`, "Palavra emprestada que virou o nome da coisa" é defensável. Em `lin-fig-catacrese-n2d`, "Dá a algo o nome de outra coisa, por analogia" também.
   - Correção sugerida: trocar o distrator por outra figura, ou pedir "a mais específica".
4. `lin-fun-poetica`/`lin-enem-fun-tabacaria` (u3-l3): o cartão `lin-u3-l4` diz "poema tende à poética", mas a resposta é emotiva. A alternativa C ("repetição de 'nada'… forma") é defensável como poética.
   - Correção sugerida: marcar no enunciado "o que o eu diz de si", ou trocar o trecho por um menos poético.
5. `lin-enem-fun-meus-oito-anos` (desafio u3): o enunciado já entrega a resposta ("Como o foco é o sentimento de quem fala…"). Correção sugerida: usar "A função predominante se evidencia pelo(a)…".
6. `lin-enem-gen-cronica-ontem-hoje` (desafio u2): o trecho de Lima Barreto está tão fragmentado ("[...]") que não dá para entender a cena (quem é "o nosso homem"). A alternativa B ("só cerca o homem de poder…") exige inferência sem base visível, o que é a armadilha de extrapolação que o próprio app ensina.
   - Correção sugerida: incluir mais um parágrafo do original ou trocar por crônica de jogo.
7. `lin-enem-gen-cronica-bons-dias` (u2-l3): a transcrição omite vírgulas e o "e": "digo juro se necessário for". O original é "digo, e juro se necessário for". Altera o sentido. Corrigir.
8. `lin-u2-l5:match-def-verbete-receita-resumo-resenha`: "Resenha = Resume e avalia uma obra" ao lado de "Resumo = Condensa…". A palavra "resume" atrai o par errado. Correção sugerida: "Descreve e julga uma obra".
9. Unidade de Leitura: `lin-u4-l4` (Intenção do autor) tem como único `enem` uma questão de função da linguagem (`lin-enem-fun-anuncio-colchao`). Não treina intenção (informar, convencer, criticar, emocionar) no formato ENEM. Correção sugerida: um `enem` de intenção com texto de jogo.
10. `lin-gen-editorial-f2` (u2-l2): o distrator "Vocativo público e assinatura de grupo" mistura carta aberta e editorial, e o editorial pode ser tomado como "assinatura institucional". Correção sugerida: "Vocativo ao prefeito e lista de assinaturas".
11. Progressão: lições começam com itens mais difíceis que os finais, por herança do Show.
    - `lin-fun-fatica-nome2def-6` é nível 3 e abre a u3-l3.
    - `lin-fig-elipse-e2n` (nível 3) cai no desafio sem lição que o prepare além do cartão.
    - Correção sugerida: reordenar dentro da lição por nível crescente.
12. Variedade: u1-l1 e u4-l1 têm só 6 exercícios, 3 deles V/F ou fill do mesmo tipo de definição. u3-l1 não tem `enem` (esperado para a 1ª lição) e tem 3 mc de definição seguidos. Correção sugerida: trocar um por exemplo→função.

## BAIXA (estilo, conferência)

1. `lin-u1-l1:match-marca-…`: a explicação sai "Metáfora: a é B, sem 'como'" (minúscula forçada por `lc`). Tratar siglas/letras isoladas em `lc()` do `_gerar.mjs`.
2. `lin-enem-fig-hiperbole-quaresma`: o texto-base não diz que a personagem é "major" (o enunciado diz). O trecho também é uma comparação ("como se fosse… um eclipse"). Acrescentar o nome ou trocar por "o personagem".
3. `lin-enem-fig-refrao-morresse`: "Obras, 1862" é dúvida de edição. O poema está em Lira dos Vinte Anos (1853). Conferir e ajustar a fonte.
4. `lin-enem-fig-comparacao-floresta` e `lin-enem-fig-gradacao-vulto` (Bilac, "Via Láctea IV" e "II") e `lin-enem-fig-sinestesia-harmonia` (Castro Alves, "parte I"): conferir numeração nos textos originais.
5. `lin-enem-fig-aliteracao-sussurro` e `lin-enem-fun-violoes-cruz` usam o mesmo poema de Cruz e Sousa. Também há a frase `lin-fig-aliteracao-e2n`, do mesmo poema. Variar a fonte.
6. `lin-enem-fun-app-audio`: o título diz "conversa de aplicativo de mensagens", mas o texto é chamada de voz. Ajustar a fonte.
7. `lin-enem-fig-ironia-joalheiros`: as alternativas A e C são plausíveis para quem lê "gramática" literal. A análise está boa, mas vale um cartão curto lembrando que ironia é inferência pelo contexto.
8. Cartões: todos dentro de ~240 caracteres e sem textão. Algumas analogias são ótimas (foto × álbum, botão de volume, escada). Os 3 `enem` dos cartões repetem "Como cai no ENEM" sem exemplo concreto. Opcional: ligar a uma questão real da pesquisa (sem copiar o enunciado).
9. Passos de leitura (`PASSOS`): não há passo "ler as alternativas". O cartão diz "só então olhe as alternativas", e o último passo é "eliminar". Coerente, mas explicitar na ordem.

## Conferências positivas
- Figuras que coexistem (elipse/zeugma, metáfora/catacrese/personificação/sinestesia, ironia/antítese) estão declaradas em `SOBRE_DEF_FIG`/`SOBREPOSTAS_*`. Os V/F e mc gerados não as colocam juntas, e a lógica de `_gerar.mjs` impede (`tfDef`, `matchPares`, `fill`, `mcTab`).
- Match: pares com marca ou definição distinta; sem pares trocáveis de fato, exceto o item 8 acima.
- Fill: as 3 opções erradas saem de `confunde` sem sobreposição. Não achei opções duplamente aceitáveis.
- Order: `gradacao` (chuvisco, chuva, tempestade), partes de gênero e passos de leitura são consistentes com a tabela e os cartões.
- Os 3 casos do `_leitura.mjs` (a, b, c): a certa é inequívoca e cada alternativa-armadilha tem uma só leitura plausível, com a ressalva da MÉDIA 1.
- `src`: nenhum número de prova inventado. Os "como no ENEM <ano>" batem com os itens 1, 3, 5, 7, 15, 18, 19 e 23 da pesquisa.
- Fontes de `_leitura.mjs` são abertas, com URL, e o arquivo declara que os 5 tipos de armadilha são convenção didática do app, não termo oficial do Inep. Honesto e correto.

## Resumo
Conteúdo sólido: sem erro de gabarito, sem material protegido, textos de jogo todos rotulados. Os pontos a corrigir são sobreposição conceitual nas armadilhas de alternativa (o item novo e mais sensível), dois distratores de definição (metáfora/catacrese), um enunciado que entrega a resposta, um trecho de crônica fragmentado, uma transcrição com pontuação errada e pequenas melhorias de progressão e variedade.

Contagem: ALTA 0, MÉDIA 12, BAIXA 9.
