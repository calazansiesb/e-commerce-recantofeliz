# E-commerce Granja Recanto Feliz

Site de e-commerce completo para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚦 Status Atual do Projeto

**SISTEMA COMPLETO E FUNCIONAL** - Todas as funcionalidades principais implementadas e testadas.

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
├── index.html              # Página principal do e-commerce
├── admin.html              # Painel administrativo completo
├── CNAME                   # Configuração de domínio
├── .gitignore              # Arquivos ignorados pelo git
├── README.md               # Documentação principal
│
├── js/
│   ├── scripts-simples.js  # Scripts principais do site
│   ├── data-manager.js     # Gerenciamento de dados e layouts
│   └── fix-admin-produtos.js # Scripts do painel admin
│
├── css/
│   └── estilos.css         # Estilos customizados
│
├── imagens/
│   ├── carrocel/           # Imagens dos slides (4 temas)
│   ├── produtos/           # Galeria de produtos (id.numero.extensao)
│   └── agradecimento pedido.png # Imagem de confirmação
│
├── dados/
│   ├── produtos.json       # Base de dados dos produtos
│   ├── produtos-exemplo-atualizado.csv # Backup CSV
│   └── guia/
│       └── DEPLOY.md       # Guia de deploy
│
├── docs/
│   └── database-system.md  # Documentação do sistema
│
├── admin/
│   └── login.html          # Tela de login do admin
│
└── lixobackup/             # Arquivos de backup (ignorado no git)
    ├── backup-arquivos-desnecessarios/
    └── backup-docs-desnecessarios/
```

## 🚀 Como Usar o Sistema

### 👥 **Para Clientes**
1. **Navegação:** Acesse o site e explore os produtos
2. **Carrossel:** Slides automáticos com informações da granja
3. **Produtos:** Use filtros (Todos/Granja/Parceiros) para navegar
4. **Detalhes:** Clique em "Comprar" para ver galeria e descrição
5. **Carrinho:** Adicione produtos e verifique o total
6. **Frete:** Informe CEP para calcular entrega
7. **Pedido:** Finalize com seus dados e envie via WhatsApp
8. **Confirmação:** Receba confirmação visual e aguarde contato

### 🔧 **Para Administradores**
1. **Login:** Acesse `admin.html` (usuário: admin / senha: granja2024)
2. **Produtos:** Gerencie catálogo (adicionar/editar/remover)
3. **Layouts:** Configure temas e layouts automáticos
4. **Carrossel:** Controle slides e conteúdo
5. **Backup:** Exporte/importe dados do sistema

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

### 🖼️ **Sistema de Imagens**
- **Formatos suportados:** PNG, JPG, JPEG
- **Nomenclatura:** `{id}.{numero}.{extensao}` (ex: 1.1.png, 1.2.png)
- **Localização:** `imagens/produtos/`
- **Galeria:** Detecção automática de múltiplas imagens
- **Fallback:** Placeholder para imagens não encontradas

### 💾 **Gerenciamento de Dados**
- **Fonte primária:** localStorage (navegador)
- **Backup:** dados/produtos.json
- **Sincronização:** DataManager com classes especializadas
- **Persistência:** Carrinho salvo automaticamente
- **Admin:** Interface web completa para CRUD

### 🌐 **APIs Integradas**
- **ViaCEP:** Busca automática de endereços
- **WhatsApp:** Envio de pedidos formatados
- **LocalStorage:** Persistência de dados

### 📱 **Responsividade**
- **Framework:** TailwindCSS
- **Design:** Mobile-first
- **Breakpoints:** Adaptação automática
- **Fontes:** Lora (títulos) + Montserrat (corpo)

## 📞 Informações de Contato

- **WhatsApp:** (61) 99000-7376 (integrado ao sistema de pedidos)
- **Localização:** Jardim Botânico, Brasília - DF
- **E-mail:** comercial@granjarecantofeliz.com
- **Área de entrega:** Distrito Federal (frete grátis em bairros selecionados)

## 🔄 **Fluxo Completo do Pedido**

1. **Cliente navega** → Produtos com filtros e detalhes
2. **Adiciona ao carrinho** → Sistema calcula totais
3. **Verifica frete** → CEP consultado via ViaCEP
4. **Finaliza pedido** → Formulário com dados pessoais
5. **Confirma endereço** → Reutiliza CEP + número/complemento
6. **Envia WhatsApp** → Mensagem formatada automaticamente
7. **Recebe confirmação** → Modal com imagem de agradecimento
8. **Aguarda contato** → Granja entra em contato para entrega

## 🗂️ Organização do Projeto

- **Código limpo:** Arquivos desnecessários em `lixobackup/`
- **Versionamento:** Git com .gitignore configurado
- **Deploy:** GitHub Pages (branch gh-pages)
- **Domínio:** granjarecantofeliz.com
- **Backup:** Sistema automático de dados

## 🎯 Status de Desenvolvimento

**✅ PROJETO COMPLETO E FUNCIONAL**

- Sistema de e-commerce totalmente operacional
- Todas as funcionalidades testadas e validadas
- Interface responsiva e intuitiva
- Integração WhatsApp funcionando
- Painel administrativo completo
- Sistema de frete automatizado
- Layouts temáticos implementados

---

**Granja Recanto Feliz** - Produtos frescos e de qualidade direto da nossa granja para sua mesa. 🌱🥚🐔
