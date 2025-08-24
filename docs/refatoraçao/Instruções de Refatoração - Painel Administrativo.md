1. Objetivo Principal

O objetivo desta fase é simplificar o painel administrativo (admin.html) removendo botões obsoletos. Simultaneamente, devemos garantir que os módulos principais estejam 100% funcionais e conectados à nova arquitetura de banco de dados e APIs, com especial atenção à gestão de pedidos e controle de estoque.

2. Tarefas Detalhadas

Tarefa 2.1: Remoção de Funcionalidades Legadas
Remova os seguintes botões e suas lógicas associadas da página admin.html:

Gestão de Pedidos SALVAR DEFINITIVO

Backup Sistema

Restaurar Backup

Recarregar do JSON

Tarefa 2.2: Garantia de Funcionalidade dos Módulos Principais
Certifique-se de que os módulos a seguir estejam totalmente funcionais e conectados aos respectivos endpoints da API, operando exclusivamente com o banco de dados da AWS.

Produtos:

Verifique se as operações de CRUD (criar, ler, atualizar, deletar) estão funcionando perfeitamente, usando a API de produtos (/api/produtos).

Garanta que a funcionalidade de upload de imagens esteja salvando os arquivos no Amazon S3 e armazenando as URLs no banco de dados.

Pedidos (Com Lógica de Gestão de Status):

Crie uma nova seção ou um módulo dedicado para a gestão de pedidos.

Implemente um campo de status no banco de dados para cada pedido, com os seguintes valores:

pendente: O pedido foi feito, mas ainda não foi processado.

em preparacao: O pedido está sendo separado.

enviado: O pedido saiu para entrega.

concluido: O pedido foi entregue com sucesso.

cancelado: O cliente desistiu do pedido.

No painel administrativo, adicione botões ou um menu dropdown para o administrador mudar o status do pedido (ex: "Marcar como Enviado", "Confirmar Entrega", "Cancelar Pedido").

Estoque (Com Lógica de Retorno):

Implemente a lógica no backend para gerenciar a quantidade de cada produto.

O estoque deve ser decrementado no momento da confirmação do pedido.

CRÍTICO: Se o status de um pedido for alterado para cancelado, o sistema deve automaticamente reverter a baixa no estoque, devolvendo a quantidade de produtos para o inventário.

No painel administrativo, adicione uma interface para o administrador visualizar e ajustar manualmente o estoque dos produtos.

Gestão Financeira:

A API de relatórios financeiros (a ser criada) deve contabilizar apenas os pedidos com o status concluido. Pedidos cancelados não devem ser contabilizados para o faturamento.

Layouts & Carrossel:

Garanta que a funcionalidade de layouts dinâmicos esteja funcionando, conforme a lógica de API baseada em datas.

Refatore o módulo do carrossel para que as imagens e textos sejam gerenciados pelo banco de dados (via API).

3. Critérios de Sucesso

A página admin.html deve ter uma interface limpa, sem os botões obsoletos.

Todas as operações de gestão de produtos, pedidos, estoque, layouts e carrossel devem ser persistentes no banco de dados.

A lógica de status e reversão de estoque em caso de cancelamento deve funcionar perfeitamente.

A contabilidade financeira deve ignorar pedidos cancelados.