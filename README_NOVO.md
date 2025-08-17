# 🥚 E-commerce Granja Recanto Feliz

Um sistema completo de e-commerce para produtos da granja, com administração profissional e carrossel dinâmico de imagens.

## 🌟 **Características Principais**

- 🛒 **E-commerce Completo** - Catálogo de produtos com filtros dinâmicos
- 🎠 **Carrossel Inteligente** - Detecção automática de múltiplas imagens por produto
- 🔧 **Painel Administrativo** - Gestão completa de produtos e estoque
- 💾 **Sistema Persistente** - Dados salvos automaticamente com backup/restauração
- 📱 **Design Responsivo** - Interface adaptada para desktop e mobile
- 🔄 **Sincronização Real-time** - Alterações na admin refletem instantaneamente no site

## 🚀 **Funcionalidades**

### **Site Principal (index.html)**
- ✅ Catálogo de produtos com cards visuais
- ✅ Filtros por categoria (Fertilizantes, Ovos, Aves)
- ✅ Modal de detalhes com carrossel de imagens
- ✅ Sistema de carrinho de compras
- ✅ Design profissional com Tailwind CSS

### **Painel Administrativo (admin.html)**
- ✅ **Gestão de Produtos**: Adicionar, editar, excluir produtos
- ✅ **Controle de Estoque**: Visualização e ajuste de quantidades
- ✅ **Dashboard**: Estatísticas e relatórios em tempo real
- ✅ **Upload de Imagens**: Suporte a múltiplas imagens por produto
- ✅ **Backup/Restauração**: Export/import de dados em JSON
- ✅ **Notificações**: Feedback visual para todas as ações

### **Sistema de Imagens Dinâmico**
- 🔍 **Detecção Automática**: Encontra todas as imagens em pastas numeradas
- 🎨 **Múltiplos Formatos**: Suporte a .png, .jpeg, .jpg
- 📂 **Organização Inteligente**: Estrutura de pastas por produto
- 🎠 **Carrossel Responsivo**: Navegação com setas e indicadores

## 📁 **Estrutura do Projeto**

```
e-commerce-recantofeliz/
├── src/
│   ├── index.html              # Site principal (e-commerce)
│   ├── admin.html              # Painel administrativo
│   ├── css/
│   │   └── estilos.css         # Estilos customizados
│   ├── js/
│   │   ├── data-manager.js     # Sistema de dados persistentes
│   │   └── admin.js           # Funcionalidades administrativas
│   ├── imagens/
│   │   ├── logo-granja.png     # Logo da granja
│   │   └── produtos/           # Imagens dos produtos
│   │       ├── 1/              # Substrato BioFértil
│   │       ├── 2/              # FertiGota
│   │       ├── 3/              # Ovos Caipira 10
│   │       ├── 4/              # Ovos Caipira 20
│   │       ├── 5/              # Ovos Caipira 30
│   │       ├── 6/              # Galinha Caipira Picada
│   │       └── 7/              # Galinha Caipira Inteira
│   └── dados/
│       └── produtos.csv        # Dados de produtos (referência)
├── docs/
│   ├── guia-publicacao.md      # Guia de publicação
│   └── sistema-administrativo.md # Documentação da admin
├── .gitignore                  # Arquivos ignorados pelo Git
└── README.md                   # Este arquivo
```

## 🛠️ **Instalação e Uso**

### **Pré-requisitos**
- Python 3.x instalado
- Navegador web moderno
- Editor de código (VS Code recomendado)

### **Instalação Rápida**

1. **Clone ou baixe o projeto**
2. **Abra o terminal na pasta do projeto**
3. **Inicie o servidor local**:
   ```bash
   cd src
   python -m http.server 8080
   ```
4. **Acesse no navegador**:
   - Site principal: `http://localhost:8080/index.html`
   - Administração: `http://localhost:8080/admin.html`

### **Usando VS Code (Recomendado)**

O projeto inclui configuração para VS Code com task automática:

1. **Abra o projeto no VS Code**
2. **Use Ctrl+Shift+P** → "Tasks: Run Task" → "Start Local Server"
3. **Ou use o terminal integrado**:
   ```bash
   cd src && python -m http.server 8080
   ```

## 🎯 **Como Usar**

### **Para Clientes (Site Principal)**

1. **Navegar produtos**: Use os filtros por categoria
2. **Ver detalhes**: Clique "Ver Detalhes" para abrir carrossel
3. **Adicionar ao carrinho**: Use o botão "Adicionar ao Carrinho"
4. **Finalizar compra**: Acesse o carrinho e finalize

### **Para Administradores**

1. **Acesse**: `http://localhost:8080/admin.html`
2. **Gerencie produtos**: Aba "Produtos" para CRUD completo
3. **Controle estoque**: Aba "Estoque" para ajustar quantidades
4. **Veja relatórios**: Aba "Relatórios" para estatísticas
5. **Faça backup**: Botão "Backup" para salvar dados

## 📸 **Sistema de Imagens**

### **Organização das Imagens**

Cada produto tem uma pasta numerada correspondente ao seu ID:

```
src/imagens/produtos/
├── 1/                    # Substrato BioFértil
│   ├── 1.png            # Imagem principal
│   ├── 2.jpeg           # Imagem adicional
│   └── 3.jpg            # Outra imagem
├── 2/                    # FertiGota
│   └── 1.png            # Imagem única
└── 3/                    # Ovos Caipira 10
    ├── 1.jpeg           # Imagem principal
    ├── 2.jpeg           # Segunda imagem
    ├── 3.jpeg           # Terceira imagem
    └── 7.jpeg           # Sétima imagem
```

### **Nomenclatura**
- **Formato**: `[número].[extensão]`
- **Extensões suportadas**: `.png`, `.jpeg`, `.jpg`
- **Ordem**: Números sequenciais (1, 2, 3, ...)
- **Detecção**: Automática - não precisa editar código

### **Adicionar Novas Imagens**

1. **Vá para a pasta do produto**: `src/imagens/produtos/[ID]/`
2. **Adicione imagem**: Nomeie como próximo número (ex: `4.png`)
3. **Teste**: O carrossel detectará automaticamente
4. **Formatos aceitos**: PNG, JPEG, JPG

## 🔧 **Tecnologias Utilizadas**

### **Frontend**
- **HTML5**: Estrutura semântica
- **CSS3**: Animações e layout responsivo
- **JavaScript ES6+**: Funcionalidades dinâmicas
- **Tailwind CSS**: Framework de estilos
- **Font Awesome**: Ícones profissionais

### **Backend/Dados**
- **Python HTTP Server**: Servidor local para desenvolvimento
- **localStorage**: Persistência de dados no navegador
- **JSON**: Formato de dados e backup

### **Ferramentas de Desenvolvimento**
- **VS Code**: Editor recomendado
- **Git**: Controle de versão
- **Chrome DevTools**: Debug e testes

## 📊 **Funcionalidades Avançadas**

### **Sistema de Dados Persistentes**
- ✅ **AutoSave**: Todas as alterações salvas automaticamente
- ✅ **Backup**: Exportação completa dos dados
- ✅ **Restauração**: Importação de backups
- ✅ **Sincronização**: Admin ↔ Site em tempo real

### **Carrossel Inteligente**
- 🔍 **Detecção Automática**: Encontra imagens sem programação
- 🎨 **Multi-formato**: PNG, JPEG, JPG suportados
- 📱 **Responsivo**: Funciona em mobile e desktop
- ⚡ **Performance**: Carregamento otimizado

### **Dashboard Administrativo**
- 📈 **Estatísticas em Tempo Real**:
  - Total de produtos cadastrados
  - Valor total do estoque
  - Produtos com estoque baixo
  - Produtos sem estoque
- 🎨 **Interface Intuitiva**: Cores e ícones claros
- 🔔 **Notificações**: Feedback para todas as ações

## 🚀 **Publicação Online**

### **Opções de Hospedagem**

1. **Netlify** (Recomendado - Gratuito)
   - Deploy direto do repositório Git
   - HTTPS automático
   - CDN global

2. **Vercel** (Gratuito)
   - Integração com GitHub
   - Deploy automático

3. **GitHub Pages** (Gratuito)
   - Hospedagem direta do repositório
   - Ideal para projetos open source

### **Preparação para Produção**

1. **Configure domínio personalizado**
2. **Otimize imagens** (compressão)
3. **Configure analytics** (Google Analytics)
4. **Adicione certificado SSL** (HTTPS)

## 🔒 **Segurança e Backup**

### **Backup Regular**
- Use a função "Backup" na administração
- Salve arquivos JSON em local seguro
- Faça backups antes de grandes alterações

### **Dados Locais**
- Dados salvos no localStorage do navegador
- Limpar dados do navegador apaga informações
- Use backup antes de limpar cache

## 🐛 **Solução de Problemas**

### **Imagens não carregam**
- ✅ Verifique se estão na pasta correta
- ✅ Confirme nomenclatura (1.png, 2.jpeg, etc.)
- ✅ Teste extensões suportadas

### **Alterações não salvam**
- ✅ Verifique se JavaScript está habilitado
- ✅ Confirme se não há erros no console (F12)
- ✅ Teste em modo privado do navegador

### **Servidor não inicia**
- ✅ Confirme se Python está instalado
- ✅ Verifique se a porta 8080 está livre
- ✅ Execute comando na pasta `src/`

## 📝 **Contribuição**

### **Como Contribuir**
1. Fork do repositório
2. Crie branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das alterações (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

### **Padrões de Código**
- Use nomes descritivos para variáveis
- Comente código complexo
- Mantenha funções pequenas e focadas
- Teste antes de committar

## 📞 **Suporte**

### **Contato**
- **Desenvolvedor**: GitHub Copilot
- **E-mail**: suporte@recantofeliz.com.br
- **WhatsApp**: (11) 99999-9999

### **Recursos Úteis**
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Guia Font Awesome](https://fontawesome.com/icons)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**🎉 Desenvolvido com ❤️ para Granja Recanto Feliz**

*Sistema completo de e-commerce com administração profissional e carrossel dinâmico de imagens.*
