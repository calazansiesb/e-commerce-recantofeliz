# E-commerce Granja Recanto Feliz

Site de e-commerce para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚀 Funcionalidades Principais

### 🛍️ Site Principal (index.html)
- **Carrossel Hero** com 4 slides temáticos
- **Sistema de Produtos** com filtros por categoria
- **Carrinho de Compras** completo
- **Checkout via WhatsApp** com dados do cliente
- **Layouts Temáticos** dinâmicos por data
- **Design Responsivo** mobile/desktop

### 🔧 Painel Administrativo (admin.html)
- **Gestão de Produtos** (CRUD completo)
- **Controle de Estoque** visual
- **Layouts Temáticos** editáveis
- **Temas de Carrossel** personalizáveis
- **Mensagens Personalizadas**
- **Sistema de Autenticação**

## 📁 Estrutura do Projeto

```
src/
├── index.html              # Site principal
├── admin.html              # Painel administrativo
├── js/
│   ├── data-manager.js     # Gerenciamento de dados
│   ├── admin.js            # Lógica administrativa
│   ├── scripts.js          # Funcionalidades do site
│   └── fix-admin-produtos.js # Correções admin
├── data/
│   └── produtos.json       # Base de dados
└── imagens/
    ├── carrocel/           # Imagens do carrossel
    └── produtos/           # Imagens dos produtos
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** + **CSS3** + **JavaScript ES6**
- **Tailwind CSS** para estilização
- **Font Awesome** para ícones
- **Google Fonts** (Lora, Montserrat)
- **localStorage** para persistência
- **WhatsApp Business API** para pedidos

## 📋 Produtos Disponíveis

1. **Substrato BioFértil 3 Anos** - R$ 15,00
2. **FertiGota** - R$ 5,00
3. **Ovos Caipira 10** - R$ 15,00
4. **Ovos Caipira 20** - R$ 25,00
5. **Ovos Caipira 30** - R$ 34,00
6. **Galinha Caipira Picada** - R$ 45,00
7. **Galinha Caipira Inteira** - R$ 40,00

## 🎯 Categorias de Filtros

- **Todos** - Exibe todos os produtos
- **Produtos da Granja** - Fertilizantes, Aves, Ovos
- **Parceiros** - Produtos de parceiros

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Navegue pelos produtos usando os filtros
3. Adicione produtos ao carrinho
4. Finalize o pedido via WhatsApp

### Acesso Administrativo
1. Acesse `admin.html`
2. Faça login (se configurado)
3. Gerencie produtos, estoque e layouts

## 🔄 Sistema de Dados

- **Fonte Principal:** localStorage
- **Backup:** data/produtos.json
- **Sincronização:** Automática entre admin e site
- **Histórico:** Todas as alterações são logadas

## 📱 Responsividade

- **Mobile First** design
- **Breakpoints:** sm, md, lg, xl
- **Touch Friendly** para dispositivos móveis
- **Menu Adaptativo** para diferentes telas

## 🎨 Layouts Temáticos

- **Padrão** - Verde e marrom da granja
- **Dia das Mães** - Rosa e roxo (maio)
- **Configurável** - Cores personalizáveis via admin

## 🔧 Configuração

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Conexão com internet (para fontes e ícones)

### Instalação
1. Clone ou baixe os arquivos
2. Abra `index.html` em um servidor web
3. Configure o admin em `admin.html`

## 📊 Status do Sistema

- ✅ **Carrossel** funcionando
- ✅ **Produtos** sendo exibidos
- ✅ **Filtros** operacionais
- ✅ **Carrinho** funcional
- ✅ **Admin** completo
- ✅ **Layouts** dinâmicos

## 📞 Contato

- **WhatsApp:** Integrado no sistema
- **Localização:** Jardim Botânico e Lago Sul - DF

---

**Versão:** 2.1.0  
**Última Atualização:** 21 de Agosto de 2025  
**Desenvolvido para:** Granja Recanto Feliz