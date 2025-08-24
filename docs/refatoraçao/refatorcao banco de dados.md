Instruções de Refatoração do Projeto Granja Recanto Feliz
PARA: Equipe de Desenvolvimento
De: Analista Sênior
ASSUNTO: Início da Refatoração da Camada de Dados para AWS (Fase 2)

1. Objetivo Principal

O objetivo desta fase é migrar a gestão de dados do projeto, que atualmente se baseia em localStorage e arquivos .json, para uma arquitetura com banco de dados. A partir de agora, a administração de produtos e o upload de imagens devem ser realizados de forma dinâmica e persistente, com o sistema salvando as alterações instantaneamente.

2. Arquitetura Proposta (Recursos AWS Gratuita)

Vamos utilizar uma arquitetura com uma camada de backend dedicada para gerenciar a lógica de dados, consumindo os seguintes serviços AWS da camada gratuita:

Banco de Dados: Amazon RDS (Relational Database Service) com motor MySQL ou PostgreSQL. A instância a ser utilizada deve ser a db.t2.micro (camada gratuita).

Armazenamento de Imagens: Amazon S3 para hospedar todas as imagens dos produtos. O painel administrativo fará o upload das imagens diretamente para o S3.

Backend Server: Criação de uma API RESTful para intermediar a comunicação entre o frontend e o banco de dados/S3. Este servidor pode ser construído com Node.js (Express), Python (Flask) ou PHP, e será hospedado em uma instância EC2 (camada gratuita) ou Lambda/EC2 Container Service.

3. Tarefas Detalhadas (Passo a Passo)

Configuração de Infraestrutura AWS:

Crie uma instância de banco de dados no Amazon RDS (camada gratuita).

Crie um bucket no Amazon S3 para armazenar as imagens dos produtos.

Configure as permissões de acesso (IAM) necessárias para que o servidor backend possa se comunicar com o RDS e o S3 de forma segura.

Desenvolvimento do Backend (API RESTful):

Crie uma API com os seguintes endpoints para gerenciamento de produtos:

GET /api/produtos: Listar todos os produtos.

GET /api/produtos/:id: Obter detalhes de um produto específico.

POST /api/produtos: Adicionar um novo produto.

PUT /api/produtos/:id: Editar um produto existente.

DELETE /api/produtos/:id: Remover um produto.

Implemente a lógica de upload de imagens. O backend deve receber o arquivo de imagem do painel admin e enviá-lo para o S3, armazenando a URL pública da imagem no banco de dados.

Refatoração do Frontend (Painel Administrativo):

Modifique o painel administrativo (admin.html e fix-admin-produtos.js) para que, em vez de usar localStorage ou o arquivo .json, ele consuma os novos endpoints da API.

Implemente a funcionalidade de upload de arquivos para que o administrador possa enviar novas imagens de produtos. A URL da imagem será salva no banco de dados.

A tela de edição de produtos agora deve carregar e salvar as informações diretamente no banco de dados.

4. Considerações Técnicas e de Segurança

Credenciais: Não salve credenciais do banco de dados ou do S3 diretamente no código do servidor. Use variáveis de ambiente.

Estrutura de Dados: Defina um esquema de tabela para os produtos no banco de dados que inclua campos para nome, preço, descrição, e a URL da imagem.

Validação: O backend deve conter validação de dados para garantir a integridade das informações salvas no banco de dados.

5. Critérios de Sucesso

O painel administrativo deve funcionar de forma completamente independente do localStorage.

A edição, adição e exclusão de produtos devem ser refletidas em tempo real no banco de dados e no site.

A nova funcionalidade de upload de imagens deve armazenar os arquivos no S3 e as referências no banco de dados.

Esta refatoração é essencial para a evolução do nosso projeto. Por favor, comunique qualquer dúvida e mantenha-me informado sobre o progresso.