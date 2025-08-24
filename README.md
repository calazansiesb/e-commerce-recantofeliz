# E-commerce Granja Recanto Feliz

Site de e-commerce completo para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚦 Status Atual do Projeto

**SISTEMA REFATORADO PARA AWS** - Arquitetura moderna com API DynamoDB, infraestrutura 100% gratuita e alta disponibilidade.

### 🏗️ **Nova Arquitetura AWS (2025)**

#### 🆓 **Infraestrutura 100% Gratuita:**
- **DynamoDB:** Banco NoSQL (25GB gratuitos permanente)
- **Lambda:** API serverless (1M execuções/mês gratuitas)
- **S3:** Hospedagem + imagens (5GB gratuitos)
- **API Gateway:** Endpoints REST (1M requests/mês gratuitos)
- **Custo total:** $0.00/mês

#### 🔗 **Endpoints da API:**
- **GET** `/api/produtos` - Listar todos os produtos
- **POST** `/api/produtos` - Criar novo produto
- **GET** `/api/produtos/{id}` - Buscar produto por ID
- **PUT** `/api/produtos/{id}` - Atualizar produto
- **DELETE** `/api/produtos/{id}` - Remover produto

#### 🌐 **URLs do Sistema:**
- **Site:** http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com
- **API:** https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod
- **Admin:** [site]/admin.html

### ✅ Funcionalidades Implementadas

#### 🎠 **Sistema de Carrossel**
- Auto-play 8 segundos com navegação manual
- 4 slides temáticos personalizáveis
- Layouts automáticos por datas comemorativas
- Gerenciamento via painel admin

#### 🛍️ **Sistema de Produtos**
- Renderização dinâmica com fallback JSON
- Filtros por categoria (Granja/Parceiros)
- Modal com galeria de múltiplas imagens
- Ícones identificadores para produtos de parceiros
- Sistema de quantidade no modal

#### 🛒 **Carrinho de Compras Avançado**
- Adicionar/remover produtos com notificações
- Cálculo automático de totais
- Persistência em localStorage
- Modal de carrinho com resumo completo
- Contador visual no header

#### 🚚 **Sistema de Frete Inteligente**
- Consulta automática por CEP via ViaCEP
- Frete grátis para bairros específicos (R$ 100+ mínimo)
- Regras diferenciadas para Brasília/DF
- Validação de área de entrega
- Banner informativo de frete grátis

#### 📱 **Finalização de Pedidos**
- Formulário de dados do cliente
- Reutilização do CEP já informado
- Busca automática de endereço
- Campos para número e complemento
- Observações opcionais
- Envio via WhatsApp formatado
- Modal de agradecimento com imagem

#### 🔧 **Painel Administrativo Completo**
- Gerenciamento de produtos (CRUD)
- Seção de layouts temáticos
- Controle do carrossel
- Sistema de backup/restore
- Interface responsiva

#### 🎨 **Layouts Temáticos Automáticos**
- Layout padrão da granja
- Layout especial Dia das Mães (05/01 a 05/15)
- Aplicação automática por data
- Cores e elementos personalizados
- Carrossel temático integrado

### 🎯 Regras de Frete Detalhadas

#### 🆓 **Frete Grátis**
- **Bairros:** Asa Sul, Asa Norte, Lago Sul, Jardim Botânico
- **Condição:** Compras ≥ R$ 100,00
- **CEPs:** 70000-70005, 70710-70715, 71600-71605, 71680-71685

#### 💰 **Taxa de Entrega**
- **Mesmos bairros:** R$ 8,00 (compras < R$ 100,00)
- **Outros bairros DF:** Taxa combinada via WhatsApp
- **Validação:** Sistema verifica CEP automaticamente

#### 🚫 **Restrições**
- **Área:** Apenas Distrito Federal
- **Verificação:** Automática por faixa de CEP (70000-73699)

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal (conectada à API)
├── admin.html              # Painel admin refatorado (sem botões obsoletos)
├── CNAME                   # Configuração de domínio
├── .gitignore              # Arquivos ignorados pelo git
├── README.md               # Documentação atualizada
│
├── js/
│   ├── granja-api-client.js    # Cliente API DynamoDB (NOVO)
│   ├── admin-api-pure.js       # Admin conectado à API (NOVO)
│   ├── scripts-simples.js      # Scripts principais (API pura)
│   └── fix-admin-produtos.js   # Scripts do painel admin
│
├── css/
│   └── estilos.css         # Estilos customizados
│
├── imagens/
│   ├── carrocel/           # Imagens dos slides (4 temas)
│   ├── produtos/           # Galeria otimizada (JPG/WebP)
│   └── agradecimento pedido.jpg # Imagem de confirmação
│
├── dados/
│   └── produtos.json       # Backup/referência (sistema usa DynamoDB)
│
├── docs/
│   ├── refatoracao/        # Documentação da refatoração
│   └── migrar para aws.md  # Guia de migração AWS
│
├── admin/
│   └── login.html          # Tela de login do admin
│
└── AWS Infrastructure/     # Configurações da infraestrutura
    ├── aws-free-config.json    # Config infraestrutura gratuita
    ├── aws-api-config.json     # Config da API Lambda
    └── frontend-api-config.json # Config do frontend
```

## 🚀 Como Usar o Sistema

### 👥 **Para Clientes**
1. **Navegação:** Acesse o site e explore os produtos (carregados via API)
2. **Carrossel:** Slides automáticos com informações da granja
3. **Produtos:** Use filtros (Todos/Granja/Parceiros) para navegar
4. **Detalhes:** Clique em "Comprar" para ver galeria e descrição
5. **Carrinho:** Adicione produtos e verifique o total
6. **Frete:** Informe CEP para calcular entrega
7. **Pedido:** Finalize com seus dados e envie via WhatsApp
8. **Confirmação:** Receba confirmação visual e aguarde contato

### 🔧 **Para Administradores**
1. **Login:** Acesse `admin.html` (usuário: admin / senha: granja2024)
2. **Produtos:** Gerencie catálogo via API DynamoDB (CRUD completo)
3. **Estoque:** Controle de inventário com interface visual
4. **Layouts:** Gerenciamento de temas e layouts automáticos
5. **Carrossel:** Controle de slides e conteúdo
6. **Interface:** Limpa e moderna (funcionalidades obsoletas removidas)

## 📋 Catálogo de Produtos

### 🌱 **Produtos da Granja**
- **Substrato BioFértil 3 Anos** - R$ 15,00 (Fertilizante orgânico)
- **FertiGota** - R$ 5,00 (Adubo líquido de galinha)
- **Ovos Caipira 10 unidades** - R$ 15,00 (Galinhas criadas soltas)

### 🤝 **Produtos de Parceiros** (identificados com ícone)
- **Queijo Minas Artesanal** - R$ 37,00 (Laticínios Serra Verde)

### 🔧 **Gerenciamento**
- **Sistema dinâmico:** Produtos carregados via JavaScript
- **Fallback:** dados/produtos.json como backup
- **Admin:** Adicione/edite produtos pelo painel
- **Imagens:** Suporte a múltiplas fotos por produto

## 🔧 Especificações Técnicas

### 🏗️ **Arquitetura AWS Serverless**
- **Frontend:** S3 Static Website Hosting
- **API:** Lambda Functions + API Gateway
- **Banco:** DynamoDB (NoSQL)
- **Imagens:** S3 Bucket com CDN
- **DNS:** Route 53 (opcional)

### 🖼️ **Sistema de Imagens Otimizado**
- **Formatos:** JPG, WebP (otimizados 73% menores)
- **Nomenclatura:** `{id}.{numero}.{extensao}` (ex: 1.1.jpg, 1.2.webp)
- **Localização:** S3 Bucket `granja-recanto-feliz-images`
- **Galeria:** Detecção automática de múltiplas imagens
- **Performance:** Cache inteligente + CDN

### 💾 **Gerenciamento de Dados Moderno**
- **Banco principal:** DynamoDB (25GB gratuitos)
- **API REST:** Lambda serverless (1M execuções gratuitas)
- **Cache:** Cliente JavaScript (2 minutos)
- **Persistência:** 100% na nuvem AWS
- **Admin:** Interface conectada à API

### 🌐 **APIs e Integrações**
- **Granja API:** Endpoints REST para produtos
- **ViaCEP:** Busca automática de endereços
- **WhatsApp:** Envio de pedidos formatados
- **AWS SDK:** Integração nativa com serviços

### 📱 **Performance e Responsividade**
- **Framework:** TailwindCSS
- **Design:** Mobile-first
- **CDN:** CloudFront (opcional)
- **Cache:** Estratégias múltiplas
- **Fontes:** Lora (títulos) + Montserrat (corpo)

## 📞 Informações de Contato

- **WhatsApp:** (38) 99924-7376 (integrado ao sistema de pedidos)
- **Localização:** Jardim Botânico, Brasília - DF
- **E-mail:** comercial@granjarecantofeliz.com
- **Área de entrega:** Distrito Federal (frete grátis em bairros selecionados)

## 🔄 **Fluxo Completo do Pedido**

1. **Cliente navega** → Produtos carregados via API DynamoDB
2. **Adiciona ao carrinho** → Sistema calcula totais
3. **Verifica frete** → CEP consultado via ViaCEP
4. **Finaliza pedido** → Formulário com dados pessoais
5. **Confirma endereço** → Reutiliza CEP + número/complemento
6. **Envia WhatsApp** → Mensagem formatada automaticamente
7. **Recebe confirmação** → Modal com imagem de agradecimento
8. **Gestão admin** → Pedido gerenciado via painel (status + estoque)

## 🗂️ Organização do Projeto

- **Arquitetura:** Serverless AWS (DynamoDB + Lambda + S3)
- **Versionamento:** Git com .gitignore configurado
- **Deploy:** AWS S3 Static Website + API Gateway
- **Domínio:** granjarecantofeliz.com (Route 53)
- **Backup:** DynamoDB com backup automático

## 🎯 Status de Desenvolvimento

**✅ PROJETO REFATORADO PARA AWS - PRODUÇÃO FINAL**

### 🏗️ **Arquitetura Serverless Completa:**
- ✅ **DynamoDB:** Banco NoSQL (25GB gratuitos permanente)
- ✅ **Lambda:** API REST serverless (1M execuções/mês)
- ✅ **S3:** Hospedagem + imagens (5GB gratuitos)
- ✅ **API Gateway:** Endpoints REST (1M requests/mês)

### 🔧 **Admin Refatorado (Conforme Instruções):**
- ❌ **Removido:** SALVAR DEFINITIVO (obsoleto com DynamoDB)
- ❌ **Removido:** Backup Sistema (automático na AWS)
- ❌ **Removido:** Restaurar Backup (não necessário)
- ❌ **Removido:** Recarregar do JSON (sistema usa API)
- ✅ **Mantido:** Gestão de Produtos (CRUD via API)
- ✅ **Mantido:** Controle de Estoque
- ✅ **Mantido:** Layouts Temáticos
- ✅ **Mantido:** Gerenciamento do Carrossel

### 📊 **Performance e Custos:**
- ✅ Sistema otimizado (73% menor)
- ✅ Cache inteligente (2 minutos)
- ✅ API pura (sem fallback JSON)
- ✅ **Custo operacional: $0.00/mês**

### 🌐 **URLs Finais:**
- **Site:** http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com
- **Admin:** http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com/admin.html
- **API:** https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod

---

**Granja Recanto Feliz** - Produtos frescos e de qualidade direto da nossa granja para sua mesa. 🌱🥚🐔

## 🚀 **Comandos de Deploy**

### **Deploy Completo (Primeira vez):**
```bash
# 1. Configurar infraestrutura AWS
python etapa2-gratuito.py

# 2. Criar API Lambda + DynamoDB
python etapa3-api-lambda.py

# 3. Migrar dados JSON → DynamoDB
python etapa4-migrar-dados.py

# 4. Atualizar frontend para API pura
python etapa5-api-pura.py

# 5. Deploy final
python deploy-auto.py
```

### **Deploy de Atualizações:**
```bash
# Deploy geral
python deploy-auto.py

# Deploy apenas admin
python deploy-admin.py
```

### **Desenvolvimento Local:**
```bash
# Servidor local para testes
python -m http.server 8080
```

### **Limpeza e Manutenção:**
```bash
# Limpar admin (remover funcionalidades obsoletas)
python limpar-admin-final.py

# Corrigir função Lambda
python fix-lambda.py
```