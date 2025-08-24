# E-commerce Granja Recanto Feliz

Site de e-commerce para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚦 Status Atual do Projeto

Sistema funcionando com todas as funcionalidades principais operacionais.

### ✅ Funcionalidades Implementadas

- 🎠 **Carrossel Hero** - Auto-play 8 segundos, navegação manual, 4 slides temáticos
- 🛍️ **Sistema de Produtos** - Renderização dinâmica, filtros por categoria, modal com múltiplas imagens
- 🛒 **Carrinho de Compras** - Adicionar/remover produtos, cálculo de totais, persistência localStorage
- 🚚 **Sistema de Frete** - Frete grátis para bairros específicos de Brasília/DF (R$ 100+ mínimo)
- 📱 **Interface Responsiva** - Design mobile-first, navegação adaptativa
- 🔧 **Painel Admin** - Gerenciamento de produtos via admin.html

### 🎯 Regras de Frete

- **Frete Grátis:** Asa Sul, Asa Norte, Lago Sul, Jardim Botânico (compras ≥ R$ 100)
- **Taxa de Entrega:** Outros bairros de Brasília/DF (combinada via WhatsApp)
- **Restrição:** Não entregamos fora do Distrito Federal

## 📁 Estrutura Principal

```
├── index.html              # Página principal
├── admin.html              # Painel administrativo
├── js/
│   ├── scripts-simples.js  # Scripts principais
│   └── data-manager.js     # Gerenciamento de dados
├── css/
│   └── estilos.css         # Estilos customizados
├── imagens/
│   ├── carrocel/           # Imagens do carrossel
│   └── produtos/           # Imagens dos produtos (formato: id.numero.extensao)
├── dados/
│   └── produtos.json       # Dados dos produtos
└── lixobackup/             # Arquivos de backup (ignorado no git)
```

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. O carrossel inicia automaticamente
3. Produtos são carregados via JavaScript
4. Use filtros para navegar por categorias
5. Acesse `admin.html` para gerenciar produtos (login: admin/granja2024)

## 📋 Produtos Disponíveis

- **Substrato BioFértil 3 Anos** - R$ 15,00
- **FertiGota** - R$ 5,00
- **Ovos Caipira 10** - R$ 15,00
- **Queijo Minas Artesanal** - R$ 37,00

## 🔧 Desenvolvimento

### Regras de Imagens
- **Formato:** PNG, JPG, JPEG
- **Nomenclatura:** `{id}.{numero}.{extensao}` (ex: 1.1.png, 1.2.png)
- **Localização:** `imagens/produtos/`

### Sistema de Dados
- **Fonte primária:** localStorage
- **Fallback:** dados/produtos.json
- **Admin:** Gerenciamento via interface web

## 📞 Contato

- **WhatsApp:** (38) 99924-7376
- **Localização:** Jardim Botânico, Brasília - DF
- **E-mail:** comercial@granjarecantofeliz.com

## 🗂️ Arquivos de Backup

Todos os arquivos de backup, documentação antiga e arquivos desnecessários foram movidos para a pasta `lixobackup/` que é ignorada pelo git.

---

**Granja Recanto Feliz** - Produtos frescos e de qualidade direto da nossa granja para sua mesa.