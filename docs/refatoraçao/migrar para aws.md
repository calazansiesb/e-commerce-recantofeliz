# Guia de Publicação - AWS (Recursos Gratuitos)

Este guia apresenta um passo a passo para migrar o projeto **E-commerce Granja Recanto Feliz** para a AWS, utilizando os recursos da camada gratuita. O objetivo é estabelecer a infraestrutura para a futura integração de um banco de dados, permitindo a implementação de novas funcionalidades.

---

### **1. Estratégia de Hospedagem**

Atualmente, seu site é estático e hospedado no GitHub Pages. Para a migração, usaremos o **Amazon S3** para hospedar os arquivos e o **Amazon Route 53** para gerenciar seu domínio. O banco de dados será configurado separadamente usando o **Amazon RDS**.

### **2. O que você precisa**

* Uma conta AWS ativa.
* Os arquivos completos do seu projeto.

---

### **3. Passo a Passo do Deploy na AWS**

#### **Passo 1: Hospedagem dos Arquivos Estáticos (Amazon S3)**

1.  **Crie um "Bucket" no S3**:
    * Acesse o console da AWS e procure por **S3**.
    * Clique em "Create bucket".
    * Dê ao bucket o mesmo nome do seu domínio: `granjarecantofeliz.com`.
    * Escolha a região que for mais próxima de você (ex: `sa-east-1` para São Paulo).
    * Em "Object Ownership", selecione "ACLs enabled" e marque "I acknowledge...".
    * **Importante:** Desmarque a opção "Block all public access" e confirme a mudança. Isso é necessário para que o site seja público.
    * Clique em "Create bucket".

2.  **Configure a Hospedagem de Site Estático**:
    * Dentro do bucket que você criou, vá para a aba **Properties**.
    * Role até o final e encontre a opção "Static website hosting".
    * Clique em "Edit", selecione "Enable" e defina `index.html` como "Index document" e "Error document".
    * Anote o **Endpoint do seu site**. Você vai precisar dele no próximo passo.

3.  **Faça o Upload dos Arquivos**:
    * Vá para a aba **Objects** no seu bucket.
    * Clique em "Upload" e arraste todos os arquivos e pastas do seu projeto (`.html`, `js/`, `css/`, etc.).
    * Certifique-se de que a estrutura de pastas seja mantida.

#### **Passo 2: Configuração do Domínio (Amazon Route 53)**

* **Atenção:** Embora a maior parte da infraestrutura seja gratuita, o Route 53 tem um custo mínimo (geralmente menos de **$1 por mês**).

1.  **Crie uma "Hosted Zone"**:
    * Acesse o console da AWS e procure por **Route 53**.
    * Em "Dashboard", clique em "Hosted zones" e depois em "Create hosted zone".
    * Digite seu nome de domínio (`granjarecantofeliz.com`).

2.  **Crie um "Record" (Registro)**:
    * Dentro da Hosted Zone que você criou, clique em "Create record".
    * Em "Record type", selecione "A" (IPv4).
    * Habilite a opção "Alias".
    * No campo "Route traffic to", selecione "Alias to S3 website endpoint" e escolha a região do seu bucket.
    * O seu bucket (`granjarecantofeliz.com`) deve aparecer na lista. Selecione-o.
    * Clique em "Create records".

3.  **Atualize os Servidores DNS**:
    * Volte para a lista de "Hosted zones".
    * Clique na sua zona e copie os quatro endereços de "Name servers" que a AWS forneceu.
    * Vá para a plataforma onde você registrou o seu domínio (`granjarecantofeliz.com`) e atualize os servidores DNS com os que você copiou da AWS.

#### **Passo 3: Configuração do Banco de Dados (Amazon RDS)**

1.  **Crie a Instância de Banco de Dados**:
    * Acesse o console da AWS e procure por **RDS**.
    * Clique em "Create database".
    * Escolha a opção "Standard create".
    * Selecione o tipo de motor de banco de dados que você prefere (ex: **MySQL** ou **PostgreSQL**).
    * Em "Templates", selecione **Free Tier** (Camada gratuita).
    * Configure as credenciais (usuário e senha) para o seu banco de dados.

2.  **Configure a Conectividade**:
    * Em "Connectivity", certifique-se de que a opção "Public access" esteja **marcada**.
    * Em "VPC security group", crie um novo grupo de segurança. Você precisará editá-lo para permitir conexões do seu IP ou de outra instância da AWS (se você criar um servidor futuramente).

3.  **Finalize a Criação**:
    * Clique em "Create database". A criação pode levar alguns minutos.
    * Anote o **Endpoint** e as credenciais. Você precisará dessas informações para conectar seu backend.

---

### **4. Próximos Passos (Integração de Banco de Dados)**

Seu site está agora hospedado na AWS, mas as funcionalidades de gerenciamento de produtos ainda usam `localStorage` e arquivos `.json`.

Para usar o banco de dados do RDS, você precisará de um **servidor backend**. O site `index.html` e os scripts atuais não conseguem se conectar diretamente a um banco de dados.

Você deve:

1.  **Criar um Backend**: Use uma linguagem de programação como **Node.js, Python, PHP** ou outra de sua preferência. Este servidor será responsável por:
    * Conectar-se ao banco de dados do RDS.
    * Criar rotas de API (ex: `/api/produtos`) para gerenciar os dados.
    * Realizar o gerenciamento de produtos (CRUD).

2.  **Hospedar o Backend**: Você pode hospedar este servidor em uma instância do **Amazon EC2**, que também possui uma camada gratuita generosa.

3.  **Atualizar o Frontend**: Seu site precisará ser modificado para se comunicar com as novas APIs do backend para carregar produtos, adicionar ao carrinho, etc.

Esta nova arquitetura proporcionará mais segurança, escalabilidade e controle sobre os dados do seu e-commerce.

---

**Granja Recanto Feliz** - Produtos frescos e de qualidade direto da nossa granja para sua mesa. 🌱🥚🐔