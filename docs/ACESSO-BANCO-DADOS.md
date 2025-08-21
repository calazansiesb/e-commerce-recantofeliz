# 🗄️ Acesso ao Banco de Dados - Granja Recanto Feliz

## 📊 Sistema de Persistência

### 🔧 SQLite Manager
**Arquivo:** `src/js/sqlite-manager.js`
**Status:** ✅ Ativo e funcionando

```javascript
// Acessar instância global
window.sqliteManager

// Verificar se está funcionando
console.log(window.sqliteManager.db ? '✅ SQLite ativo' : '❌ SQLite inativo');

// Obter produtos
const produtos = window.sqliteManager.getProducts();
console.log('Produtos no SQLite:', produtos.length);
```

### 💾 Estrutura do Banco

**Tabela:** `produtos`
```sql
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT,
    slogan TEXT,
    descricao TEXT,
    preco REAL NOT NULL,
    estoque INTEGER DEFAULT 0,
    imagem TEXT,
    ativo BOOLEAN DEFAULT 1,
    parceiro_nome TEXT,
    parceiro_produtor TEXT,
    parceiro_local TEXT,
    parceiro_descricao TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 Como Verificar os Dados

### 1. **Console do Navegador**
```javascript
// Verificar produtos no SQLite
window.sqliteManager.getProducts()

// Verificar localStorage
JSON.parse(localStorage.getItem('granjaRecantoFelizData'))

// Debug completo
window.debugStorage()
```

### 2. **Interface Admin**
- Acesse: `http://localhost:8080/admin.html`
- Login: `admin` / `granja2023`
- Seção "Produtos" mostra dados do banco

### 3. **Verificação Manual**
```javascript
// No console do navegador
const produtos = window.sqliteManager.getProducts();
console.table(produtos);

// Verificar último produto adicionado
const ultimoProduto = produtos[produtos.length - 1];
console.log('Último produto:', ultimoProduto);
```

## 🛠️ Operações CRUD

### ➕ Adicionar Produto
```javascript
const novoProduto = {
    name: "Produto Teste",
    category: "teste",
    slogan: "Produto para teste",
    description: "Descrição do produto teste",
    price: 10.00,
    stock: 5,
    image: "imagens/produtos/teste.png"
};

window.sqliteManager.addProduct(novoProduto);
```

### ✏️ Atualizar Produto
```javascript
const dadosAtualizados = {
    name: "Nome Atualizado",
    price: 15.00,
    stock: 10
};

window.sqliteManager.updateProduct(1, dadosAtualizados);
```

### 🗑️ Remover Produto
```javascript
window.sqliteManager.deleteProduct(1);
```

## 📋 Status Atual do Sistema

### ✅ **Funcionando**
- SQLite Manager carregado
- Tabela produtos criada
- Dados iniciais inseridos
- CRUD operations funcionais
- Persistência no localStorage

### ❌ **Desabilitado**
- Backup automático CSV
- Downloads automáticos
- Sincronização CSV

### 🔧 **Configuração Atual**
```javascript
// DataManager - CSV desabilitado
saveProductsToCSV() {
    console.log('💾 CSV backup desabilitado - usando SQLite');
    return true;
}

// Admin.js - Salva apenas no SQLite
handleProductSubmit() {
    // Salva APENAS no SQLite
    window.sqliteManager.updateProduct(id, data);
}
```

## 🚨 Solução de Problemas

### **Problema:** CSV ainda sendo gerado
**Solução:**
1. Limpar cache do navegador
2. Recarregar página admin
3. Verificar console: deve mostrar "SQLite ativo"

### **Problema:** Dados não persistem
**Verificação:**
```javascript
// Verificar se SQLite está salvando
localStorage.getItem('sqliteDb') ? '✅ Banco salvo' : '❌ Banco não salvo'

// Forçar salvamento
window.sqliteManager.saveToLocalStorage();
```

### **Problema:** Produtos não aparecem
**Debug:**
```javascript
// Verificar produtos no banco
const produtos = window.sqliteManager.getProducts();
console.log('Total produtos:', produtos.length);

// Verificar se tabela existe
window.sqliteManager.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
```

## 📊 Comandos de Debug

### **Verificação Completa**
```javascript
// Status geral
console.log('=== STATUS DO SISTEMA ===');
console.log('SQLite:', window.sqliteManager.db ? '✅' : '❌');
console.log('DataManager:', window.dataManager ? '✅' : '❌');

// Contagem de produtos
const sqliteProdutos = window.sqliteManager.getProducts().length;
const localStorageProdutos = window.dataManager.getProducts().length;
console.log('Produtos SQLite:', sqliteProdutos);
console.log('Produtos localStorage:', localStorageProdutos);

// Último backup
const backup = localStorage.getItem('sqliteDb');
console.log('Backup SQLite:', backup ? '✅ Existe' : '❌ Não existe');
```

### **Exportar Dados**
```javascript
// Exportar para CSV (manual)
window.sqliteManager.exportToCSV();

// Exportar JSON
const dados = window.sqliteManager.getProducts();
console.log(JSON.stringify(dados, null, 2));
```

## 🔐 Acesso Administrativo

**URL:** `http://localhost:8080/admin.html`
**Credenciais:**
- Usuário: `admin`
- Senha: `granja2023`

**Seções Disponíveis:**
- 📦 Produtos (CRUD completo)
- 📊 Estoque (controle de quantidades)
- 🎨 Layouts (temas visuais)
- 📈 Relatórios (estatísticas)
- 🎠 Carrossel (slides)

---

**Última atualização:** Sistema configurado para usar APENAS SQLite, CSV completamente desabilitado.