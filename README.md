# E-commerce Granja Recanto Feliz

Site de e-commerce para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚀 Início Rápido

```bash
# 1. Clone o repositório
git clone [url-do-repositorio]

# 2. Abra o projeto
cd e-commerce-recantofeliz

# 3. Execute o site
# Abra src/index.html em um navegador
# Ou use um servidor local (recomendado)
python -m http.server 8000
```

## 📁 Estrutura do Projeto

```
e-commerce-recantofeliz/
├── src/                    # Código fonte
│   ├── index.html         # Site principal
│   ├── admin.html         # Painel administrativo
│   ├── js/               # Scripts JavaScript
│   ├── data/             # Base de dados
│   └── imagens/          # Assets de imagem
├── docs/                 # Documentação completa
├── backup-docs-desnecessarios/  # Arquivos históricos
└── README.md            # Este arquivo
```

## ✨ Funcionalidades

- 🛍️ **E-commerce Completo** - Carrinho, checkout, WhatsApp
- 🔧 **Painel Admin** - Gestão de produtos e estoque
- 🎨 **Layouts Temáticos** - Dinâmicos por data
- 📱 **Responsivo** - Mobile e desktop
- 🔄 **Sincronização** - Dados em tempo real

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript ES6
- Tailwind CSS
- Font Awesome
- localStorage para persistência

## 📖 Documentação

Toda a documentação está organizada na pasta `docs/`:

- **[Funcionalidades Ativas](docs/DOCUMENTACAO-FUNCIONALIDADES-ATIVAS.md)** - Marco de restauração
- **[Guia de Deploy](docs/DEPLOY.md)** - Instruções de publicação
- **[Sistema Administrativo](docs/sistema-administrativo.md)** - Guia do admin

## 🚀 Deploy

1. **Desenvolvimento Local:**
   ```bash
   # Servidor Python
   cd src && python -m http.server 8000
   
   # Ou servidor Node.js
   npx serve src
   ```

2. **Produção:**
   - Upload da pasta `src/` para servidor web
   - Configurar domínio para apontar para `index.html`

## 📞 Suporte

- **Localização:** Jardim Botânico e Lago Sul - DF
- **WhatsApp:** Integrado no sistema

---

**Versão:** 2.1.0 | **Atualização:** 21/08/2025