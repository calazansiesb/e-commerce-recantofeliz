1. Objetivo Principal

O objetivo desta fase é tornar o site granjarecantofeliz.com mais dinâmico, automatizando a mudança de layout em datas comemorativas e exibindo notícias relevantes em um widget dedicado. O ponto de partida é o botão "Layouts" já presente no painel administrativo.

2. Tarefas Detalhadas

Tarefa 2.1: Sistema de Layouts Dinâmicos
Refatorar a Lógica do Backend:

O servidor backend (criado na fase anterior) será o responsável por esta lógica.

Crie um novo endpoint, por exemplo: GET /api/site/layout.

Este endpoint deve consultar a data atual e, com base em um calendário de datas comemorativas (incluindo Dia das Mães, Dia dos Pais e Aniversário de Brasília), retornar um JSON com o nome do tema a ser aplicado (ex: {"tema": "aniversario-brasilia"}).

Crie uma lógica de fallback para o tema padrão da granja caso não haja uma data comemorativa correspondente.

Integrar o Frontend Existente:

Modifique o código JavaScript associado ao botão "Layouts" no painel administrativo.

Faça uma chamada assíncrona ao novo endpoint (/api/site/layout) no carregamento da página para determinar qual layout aplicar.

Com base na resposta do backend, o frontend deve carregar o CSS, imagens do carrossel e outros recursos visuais específicos do tema, de forma automática.

Se houver a necessidade de adicionar a funcionalidade de agendamento de layout, ela deve ser adicionada a este endpoint.

Tarefa 2.2: Widget de Notícias Dinâmico
Desenvolvimento do Backend (API Intermediária):

O backend servirá como um "proxy" para as APIs de notícias externas. Crie um endpoint, por exemplo: GET /api/noticias.

Este endpoint deve fazer requisições a APIs de notícias externas para coletar os dados e formatá-los.

Pesquisa e Integração de APIs de Notícias:

Para notícias de Agronegócio/Bem-Estar: Pesquise por APIs de notícias gratuitas que permitam a busca por palavras-chave (ex: "agronegócio", "saúde alimentar").

Para notícias mais acessadas: Pesquise por APIs que forneçam "top headlines" ou notícias populares do Brasil.

Refatoração do Frontend:

Crie um novo componente visual no HTML para o widget de notícias.

O JavaScript do frontend deve chamar o endpoint GET /api/noticias e renderizar as manchetes e links de forma dinâmica no widget.

O componente deve exibir: título, um resumo curto e o link para a matéria completa.

3. Critérios de Sucesso

O site deve mudar de tema automaticamente nas datas comemorativas definidas, utilizando a lógica do backend.

O widget de notícias deve carregar de forma assíncrona, exibindo um mínimo de 5 notícias de cada categoria.

A edição e o agendamento de layouts, se implementados, devem ser feitos através do painel administrativo existente.

Esta fase aprimorará significativamente a experiência do usuário. A arquitetura proposta permite que as funcionalidades sejam adicionadas sem sobrecarregar a base de dados, mantendo os custos baixos e a performance alta.