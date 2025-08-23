# E-commerce Granja Recanto Feliz

Site de e-commerce para a Granja Recanto Feliz, especializada em produtos orgânicos e agricultura familiar.

## 🚦 Status Atual do Projeto

Quase tudo funcionando! Principais funcionalidades operacionais, mas há pendências:

### ✅ Correções Realizadas (27/01/2025)
- ✅ **Estrutura de arquivos padronizada** - Pasta `src/` removida, arquivos na raiz
- ✅ **Regra de imagens definida** - `imagens/produtos/{id}.{numero}.{extensao}`
- ✅ **Admin funcional** - Página administrativa carregando corretamente
- ✅ **Caminhos corrigidos** - Todos os scripts apontando para estrutura correta

### Próximos Passos
1. ✅ Corrigir carregamento das imagens.
2. Testar funcionalidade do botão de frete.
3. Registrar um commit com essas atualizações.
4. Deploy para branch `develop` seguindo guia DEPLOY.md.

## ✅ Funcionalidades Implementadas

### 🎠 Carrossel Hero
- Auto-play a cada 5 segundos
- Navegação manual (botões anterior/próximo)
- Indicadores clicáveis
- Pausa no hover
- 4 slides temáticos

### 🛍️ Sistema de Produtos
- Renderização dinâmica via JavaScript
- 7 produtos padrão (fertilizantes, ovos, aves)
- Filtros funcionais por categoria
- Cards responsivos com imagens
- Integração com DataManager

### 🎨 Layouts Temáticos
- Layout padrão da granja
- Layout especial Dia das Mães
- Sistema de cores dinâmicas
- Carrossel temático por layout

### 📱 Interface Responsiva
- Design mobile-first
- Navegação adaptativa
- Cards de produtos responsivos
- Modais informativos

## 📁 Estrutura de Arquivos

```


├── admin.html              # Página administrativa
├── index.html              # Página principal
├── js/
│   ├── scripts.js          # Carrossel + Produtos
│   ├── data-manager.js     # Gerenciamento de dados
│   └── fix-admin-produtos.js # Admin funcional
├── css/
│   └── estilos.css         # Estilos customizados
├── imagens/
│   ├── carrocel/           # Imagens do carrossel
│   └── produtos/           # Imagens dos produtos
├── dados/
│   └── produtos.json       # Dados dos produtos

```


### ⚠️ **IMPORTANTE: Nova Estrutura**
- Todos os arquivos principais estão agora na RAIZ do projeto.
- Pasta `src/` foi eliminada.
- URLs: `admin.html` e `index.html` diretamente na raiz.
- GitHub Pages funciona automaticamente com arquivos da raiz.

## 🔧 Arquivos JavaScript

### scripts.js
- `initCarousel()` - Inicializa carrossel
- `initProducts()` - Renderiza produtos
- Controles de navegação
- Sistema de filtros

### data-manager.js
- Gerenciamento de produtos
- Layouts temáticos
- Persistência localStorage
- API para administração

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. O carrossel inicia automaticamente
3. Produtos são carregados via JavaScript
4. Use filtros para navegar por categorias

## 🛠️ Correções Realizadas

### Carrossel
- ✅ Código JavaScript implementado
- ✅ Auto-play funcional
- ✅ Controles manuais ativos
- ✅ Indicadores responsivos

### Produtos
- ✅ Renderização dinâmica
- ✅ Filtros por categoria
- ✅ Integração com DataManager
- ✅ Cards responsivos

## 📋 Produtos Disponíveis

1. **Substrato BioFértil 3 Anos** - R$ 40,00
2. **FertiGota** - R$ 25,00
3. **Ovos Caipira 10** - R$ 18,00
4. **Ovos Caipira 20** - R$ 30,00
5. **Ovos Caipira 30** - R$ 45,00
6. **Galinha Caipira Picada** - R$ 60,00
7. **Galinha Caipira Inteira** - R$ 110,00

## 🎯 Filtros de Produtos

- **Todos** - Exibe todos os produtos
- **Fertilizantes** - Substratos e adubos
- **Aves** - Galinhas caipira
- **Ovos** - Ovos caipira frescos
- **Parceiros** - Produtos de parceiros
- **Só da Granja** - Produtos próprios

## 🔄 Status do Sistema

- ✅ Carrossel funcionando
- ✅ Produtos sendo exibidos
- ✅ Filtros operacionais
- ✅ Layout responsivo
- ✅ DataManager integrado
- ✅ Sistema de pedidos com banco de dados
- ✅ Interface administrativa simplificada
- ✅ **Correção: Erro ao salvar produto (20/08/2025)**

## 🐛 Correções Recentes

### 20/08/2025 (09:30) - Sincronização de Dados na Edição
- **Problema:** Valores editados não eram refletidos na interface após salvamento
- **Causa:** Inconsistência entre fontes de dados (SQLite vs localStorage)
- **Solução:** Sistema de sincronização automática entre ambos os sistemas
- **Status:** ✅ Resolvido
- **Documentação:** [CORRECAO-SINCRONIZACAO-DADOS.md](./CORRECAO-SINCRONIZACAO-DADOS.md)

### 20/08/2025 (09:00) - Erro ao Salvar Produto
- **Problema:** Interface administrativa apresentava erro ao tentar salvar novos produtos
- **Causa:** Falhas na inicialização do SQLiteManager e validações inadequadas
- **Solução:** Sistema robusto de fallback entre SQLite e localStorage
- **Status:** ✅ Resolvido
- **Documentação:** [CORRECAO-ERRO-SALVAMENTO.md](./CORRECAO-ERRO-SALVAMENTO.md)

### Melhorias Implementadas
- 🔒 Validações extensivas de campos obrigatórios
- 🔄 Sistema de fallback automático (SQLite → localStorage)
- 📝 Logs detalhados para diagnóstico
- 💬 Mensagens de erro específicas e acionáveis
- 🛡️ Inicialização defensiva com verificações múltiplas

## 📚 Documentação

### Arquivos de Documentação
- [CHANGELOG-DETALHADO.md](./CHANGELOG-DETALHADO.md) - Histórico completo de mudanças
- [SISTEMA-BANCO-PEDIDOS.md](./SISTEMA-BANCO-PEDIDOS.md) - Documentação do sistema de banco
- [CORRECAO-ERRO-SALVAMENTO.md](./CORRECAO-ERRO-SALVAMENTO.md) - Detalhes da correção recente
- [INTERFACE-ADMIN-SIMPLIFICADA.md](./INTERFACE-ADMIN-SIMPLIFICADA.md) - Simplificação da interface

### Links Úteis
- **Administração:** `/admin.html`
- **Gestão de Pedidos:** `/gestao-pedidos.html`
- **Site Principal:** `/index.html`

### Documentação de Mudanças
- [MUDANCA-ESTRUTURA-ARQUIVOS.md](./docs/MUDANCA-ESTRUTURA-ARQUIVOS.md) - Padronização de arquivos na raiz
- [CORRECAO-PRODUTOS-ADMIN-LISTAGEM.md](./docs/erros%20corrigidos/CORRECAO-PRODUTOS-ADMIN-LISTAGEM.md) - Correção de listagem

## 📝 Observações Técnicas
- Sistema usa localStorage como fonte primária de dados
- Sincronização com `dados/produtos.json` como fallback
- Imagens organizadas por padrão `{id}.{numero}.{extensao}`
- **Estrutura padronizada:** Arquivos principais na raiz para GitHub Pages
- **Desenvolvimento:** Usar sempre arquivos da raiz, não da pasta `src/`