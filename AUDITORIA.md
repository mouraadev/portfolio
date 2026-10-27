# Portfólio de Ryan Moura — implementação e validação

Data: 28/09/2026. Resultado local implementado e testado; publicação não realizada.

## Estado atual — restauração direta do backup original

Após nova solicitação expressa para voltar ao design da primeira versão, `index.html` foi restaurado diretamente de `index.backup-2026-09-28-before-audit.html`, sem recompor ou reinterpretar seus componentes. Esta restauração substitui as versões descritas abaixo, inclusive sua organização de conteúdo.

CSS, JavaScript, árvore de elementos e títulos foram comparados automaticamente e são idênticos aos do backup. Apenas caminhos locais de navegação foram convertidos em âncoras, o contato foi mantido como mailto e estados de execução capturados no HTML foram limpos (posição do ponteiro, scrolled, visible e transformação inicial). Não foram acrescentados cartões, estudos expansíveis nem outras estruturas ao original.

A versão imediatamente anterior permanece em `index.backup-2026-09-28-before-exact-restore.html`. Testes específicos: `node audit/browser-tests.cjs --original-design`; resultado em `audit/original-design-results.json`. Cinco larguras sem rolagem horizontal, nome dentro da tela, menu/Escape e âncoras funcionando, sem erros JavaScript observados. Os resultados de acessibilidade e TODOs das versões auditadas abaixo são históricos, não atestam o código restaurado.

## Revisão mais recente — visual anterior restaurado

Por solicitação do usuário, o visual do backup anterior à auditoria voltou a ser a referência, mantendo o conteúdo profissional auditado. Esta revisão substitui as decisões visuais descritas no relatório histórico abaixo.

- Restaurados espaçamentos amplos, tipografia de destaque, materiais translúcidos, iluminação, diagrama do hero, selos flutuantes, cartões assimétricos e painéis técnicos em perspectiva.
- Restauradas as entradas com desfoque/escala, transições de hover, fluxo animado e resposta ao ponteiro. Movimento reduzido cancela as animações e limpa a transformação do painel; toque não ativa o efeito de ponteiro.
- Conteúdo detalhado dos projetos preservado em expansões acessíveis, sem ocupar permanentemente a composição dos cartões. Gráficos fictícios não foram recuperados.
- Mantidos metadados, âncoras portáveis, mailto, foco e teclado, evidências reais, ausência de suporte de TI e pendência do currículo.
- Backup adicional: `index.backup-2026-09-28-content-audit.html`, versão auditada imediatamente anterior à restauração. O primeiro backup também permanece intacto.
- Versão atual: aproximadamente 70 KB, sem dependências de execução. `audit/screenshots/restored-hero.png` mostra o hero com o visual recuperado.
- Validação repetida: HTML/CSS/JS/JSON-LD, âncoras e hierarquia aprovados; 320/375/768/1024/1440 px sem overflow de conteúdo; menu, teclado, expansões, protocolo file e modo sem JS aprovados. Efeito de ponteiro/fluxo animado e cancelamento por movimento reduzido testados. Zero erros de console e zero violações axe nas regras configuradas.
- Os 11 TODOs e a lista de ações externas abaixo continuam válidos. Nenhuma alteração no GitHub nem publicação realizada nesta revisão.

## Histórico da auditoria de conteúdo

## Arquivos e recuperação

- `index.html`: página final, cerca de 51 KB, com CSS e JavaScript organizados no próprio arquivo. Nenhuma dependência de execução, framework, fonte remota ou serviço de analytics.
- `index.backup-2026-09-28-before-audit.html`: cópia integral anterior às alterações. SHA-256: `71C61EACFC9CAB52DB55975E1AE4610170AE71C36C8DE964547A77A691071B75`.
- `audit/validate.cjs`: validação de HTML, sintaxe CSS/JS, JSON-LD, IDs, títulos e âncoras.
- `audit/browser-tests.cjs`: testes locais Playwright autorizados pelo usuário.
- `audit/browser-results.json`: resultados da última execução.
- `audit/screenshots/`: comparação antes/depois e capturas nos cinco tamanhos.
- `.audit-tools/`: dependências exclusivas dos testes, fora do código da página.

Para recuperar o visual anterior, copie o backup sobre `index.html`. Não publique o backup, `.audit-tools`, `audit`, `tmp` ou este relatório junto com o site: o backup contém os antigos caminhos locais. Para hospedar esta versão, o artefato necessário é apenas `index.html`; acrescente o currículo e a imagem social quando aprovados.

## Mudanças implementadas

- Hero com nome em destaque, posicionamento para estágio em back-end e caminhos explícitos para projeto principal, currículo, GitHub, LinkedIn e contato.
- Sobre mais pessoal e sem repetir integralmente o hero, sem reintroduzir experiência de suporte.
- Competências agrupadas por finalidade e vinculadas a evidências; estudos de AWS separados das implementações demonstradas.
- Budget Spring AI priorizado; Design Patterns E-commerce e FRIDAY mantidos como projetos educacionais/protótipos, não produtos em produção.
- Três estudos técnicos expansíveis com contexto, decisões observáveis, limitações e caminhos para examinar o código. Relatos pessoais e próximos passos não confirmados não foram inventados.
- Gráfico decorativo e barras removidos. Diagramas e estruturas agora correspondem a classes, arquivos e fluxos reais, com links para as fontes.
- Formação com início em fevereiro de 2026 e conclusão prevista para julho de 2028, já confirmados no LinkedIn e no currículo. Cursos permanecem em uma lista compacta.
- E-mail universal `mailto:ryandmoura@gmail.com`; removida a dependência de Gmail.
- Âncoras relativas, navegação ativa corrigida e remoção de estados serializados: caminhos locais, estilos inline, posição do mouse, `visible` e `scrolled` iniciais.
- Link de pular conteúdo, foco ao navegar, menu não modal com Escape e `inert`, ressincronização em mudanças de largura, rótulos e links textuais.
- A skill apple-design orientou tipografia, materiais discretos, feedback imediato e redução de movimento. Removidos parallax de ponteiro, animações contínuas e grandes filtros; animações finitas são canceladas ao ativar movimento reduzido.
- Conteúdo visível por padrão, inclusive sem JavaScript. Menu utilizável no modo sem JS.
- Metadados sociais, Twitter Card, favicon vetorial embutido e Person JSON-LD. Domínio e imagem social continuam pendentes, sem URL inventada.

## Evidências verificadas

Revisão somente de leitura de README, árvore de arquivos e trechos relevantes de código. Nenhuma mudança no GitHub e nenhuma execução das aplicações dos repositórios.

| Repositório | Revisão consultada | Evidência / limite relevante |
| --- | --- | --- |
| [Budget Spring AI](https://github.com/mouraadev/budget-spring-ai) | `a07f4927577a6a354ea71a1313bf68377d62c014` | Java 21, Spring Boot 3.4.1, Spring AI, MySQL/JPA. Controller de texto/voz, ferramenta de totalização, adaptador JPA. Compose configura o banco, não uma imagem da aplicação. Não há suíte de testes na árvore consultada. |
| [Design Patterns E-commerce](https://github.com/mouraadev/design-patterns-ecommerce) | `c0b384f6a99657fc2ec783ede936a849fefff82a` | Main e PedidoFacade demonstram a composição dos padrões. Validações simplificadas e notificações impressas no console, não integrações reais. |
| [FRIDAY Terminal AI](https://github.com/mouraadev/friday-terminal-AI) | `fcbc66a568429c0c3fc32255fc2d2549a3e20fab` | Together com `stream=True`, histórico em memória e gravação em arquivo fixo. `/mode` chama `get_prompt_for_mode()` sem o argumento obrigatório; a troca de modos não foi apresentada como validada. |
| [README do perfil](https://github.com/mouraadev/mouraadev) | `8058dec0cd30c48aa311bede5cefab1654cd7f19` | Formação, foco e estudos atuais. O e-mail fictício ainda existe no README; a bio pública ainda usa “SAD Student”. |

O portfólio não afirma testes executados, cobertura, deploy, métricas de desempenho, emprego como desenvolvedor ou certificação AWS. As dependências e os exemplos documentados não foram tratados como prova de que as aplicações passam em testes.

## Resultados da validação

Comandos: `node audit/validate.cjs` e `node audit/browser-tests.cjs`.

| Verificação | Resultado |
| --- | --- |
| HTML | Válido nas regras estruturais e recomendadas configuradas do html-validate. |
| CSS / JavaScript / JSON-LD | Sintaxe analisada sem erros. JSON-LD válido como JSON; não é uma validação de resultados enriquecidos do Google. |
| IDs, âncoras e títulos | Sem IDs duplicados, destinos ausentes ou saltos na hierarquia; um único h1. |
| 320, 375, 768, 1024 e 1440 px | Sem rolagem horizontal ou elementos de conteúdo fora do viewport. Capturas inspecionadas. |
| Navegação | Cinco seções com destaque ativo correto; projeto principal e voltar ao topo funcionando. Corrigido um deslocamento duplicado de âncoras encontrado no teste. |
| Teclado | Pular conteúdo, foco no destino, menu com Tab/Escape e retorno de foco, expansões com Enter/Espaço aprovados. |
| Menu mobile | Abertura/fechamento, aria-expanded e fechamento ao selecionar seção aprovados em 320/375 px. |
| Estudos de caso | Expansão e recolhimento; sem overflow com o Budget expandido em 320 px. |
| Preferências | Movimento reduzido, cancelamento dinâmico das animações, transparência reduzida e contraste aumentado testados. |
| Sem JavaScript | Conteúdo e navegação mobile disponíveis. |
| Portabilidade | Testado por localhost e abertura direta com protocolo file. O código entregue não contém links file. |
| Console | Zero erros de página/console na versão final durante o roteiro executado. |
| Acessibilidade automática | Zero violações no axe-core para tags WCAG 2 A/AA e WCAG 2.1 A/AA. Não equivale a certificação nem substitui testes com leitores de tela e pessoas. |
| Peso e dependências | Cerca de 51 KB no HTML; sem dependências externas de execução. |
| Contato | Destinatário mailto conferido. Não foi enviado e-mail; abrir o cliente depende da configuração do dispositivo. |

### Links externos

Foram consultados todos os 16 destinos HTTPS distintos presentes nos links da página:

- 12 URLs do GitHub: perfil, repositórios, READMEs e arquivos de evidência — HTTP 200.
- 2 credenciais da Alura — HTTP 200.
- 1 credencial da DIO — HTTP 200.
- LinkedIn — status 999, bloqueio de acesso automatizado. URL preservada conforme o perfil previamente consultado na aba autenticada. Não é prova de link quebrado nem de acesso público irrestrito.

Não foram criados botões para demos, Swagger, collections ou serviços que não existam. Metadados TODO não foram contados como URLs públicas válidas.

## Pendências e todos os marcadores TODO

Por decisão explícita do usuário, o currículo encontrado em Downloads **não foi disponibilizado**. O botão “Ver currículo” leva a um aviso de revisão e oferece solicitação por e-mail, sem gerar um link 404.

| Marcador | Informação necessária |
| --- | --- |
| `TODO_CURRICULO_URL` | PDF atualizado e aprovado, com caminho relativo ou URL pública. Atualizar também os href das duas âncoras resume-link para disponibilizar o PDF sem depender de JS. |
| `TODO_SITE_URL` | Domínio/URL definitiva; preencher og:url e acrescentar canonical absoluto. |
| `TODO_OG_IMAGE` | Imagem social e URL pública absoluta; atualizar Open Graph e Twitter. |
| `TODO_SEMESTRE` | Semestre atual confirmado. |
| `TODO_HORARIOS` | Disponibilidade de horário. |
| `TODO_MODALIDADE` | Preferência por presencial, híbrido ou remoto. |
| `TODO_REGIAO_ATUACAO` | Região de São Paulo em que pode atuar. |
| `TODO_BUDGET_RELATO` | Relato pessoal de dificuldade, aprendizado e próximo passo do Budget. |
| `TODO_PATTERNS_RELATO` | Aprendizado pessoal, alternativas consideradas e evolução escolhida para o sistema de pedidos. |
| `TODO_FRIDAY_RELATO` | Detalhamento de autoria, aprendizado e evolução escolhida para o FRIDAY. |
| `TODO_IDIOMAS` | Conciliar nível de inglês entre as fontes antes de exibir proficiência. |

Os campos pessoais opcionais ficaram em comentários, não como afirmações públicas. Currículo, domínio e imagem social são pendências importantes para publicação, compartilhamento e conversão.

## Ações externas recomendadas — não executadas

1. Na bio do GitHub, trocar “SAD Student” por “Systems Analysis and Development student” ou “Estudante de ADS”. Sugestão: “Estudante de ADS | Java e Spring Boot | APIs, MySQL e integrações de IA | Buscando estágio em back-end”.
2. No README do perfil, substituir `SEU-EMAIL-REAL-AQUI@gmail.com` por `ryandmoura@gmail.com`.
3. Fixar Budget Spring AI, Design Patterns E-commerce e FRIDAY; revisar a ordem para começar pelo Budget.
4. Budget: a descrição já existe na API pública consultada, embora o resultado indexado da página estivesse desatualizado. Mantê-la alinhada ao código e adicionar tópicos relevantes (atualmente vazios), como java, spring-boot, spring-ai, mysql e rest-api.
5. Remover o bloco genérico “Publicando no GitHub” do README de Design Patterns E-commerce, incluindo o exemplo com SEU-USUARIO.
6. FRIDAY: corrigir a assinatura/chamada do comando `/mode`, revisar salvamento em arquivo fixo, documentar as limitações e verificar o comportamento antes de anunciá-lo como pronto.
7. Implementar testes nos projetos; publicar instruções e resultados somente após executá-los. Começar por totalização/validação no Budget, fluxos de pedido e comandos/histórico no FRIDAY.
8. Configurar integração contínua que execute os testes reais. Não adicionar selo verde fictício ou de um pipeline que não valida o projeto.
9. Criar tags/releases quando houver marcos funcionais verificáveis; evitar versionamento apenas decorativo.
10. Manter READMEs alinhados ao portfólio: classificação educacional, pré-requisitos, credenciais por ambiente, limites, execução e evidências. No Budget, fechar o último bloco de código Markdown do README.
11. Atualizar o currículo e seus links, conciliar idiomas e só então disponibilizar o PDF. Nenhum arquivo de Downloads foi modificado.

## Avaliação editorial após a implementação

Notas subjetivas, relativas ao objetivo de estágio; não são promessa de entrevista nem resultado de teste com recrutadores.

| Critério | Nota / 10 | Leitura |
| --- | --- | --- |
| Visual | 9,0 | Identidade preservada, menos decoração sem evidência, cinco larguras revisadas. |
| Posicionamento | 9,0 | Foco e objetivo claros no hero. |
| Conteúdo | 8,5 | Específico e prudente; faltam relatos pessoais confirmados. |
| Evidência técnica | 8,0 | Links para código, decisões e limites; aplicações não foram executadas e faltam testes/demos nos projetos. |
| Acessibilidade | 9,0 | Verificações automáticas e teclado aprovados; falta avaliação com usuários/leitores de tela. |
| Conversão para entrevista | 7,0 | Caminhos claros, mas currículo atualizado ainda pendente. |
| SEO e compartilhamento | 7,0 | Estrutura pronta; faltam domínio, canonical final e imagem social. |
| Geral | 8,4 | Evolução consistente e verificável; não é 10/10 enquanto essas pendências permanecerem. |
