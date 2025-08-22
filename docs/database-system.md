# Sistema de Banco de Dados - Granja Recanto Feliz

## 📋 Visão Geral

Este documento descreve a implementação do sistema de banco de dados SQLite para o e-commerce da Granja Recanto Feliz, seguindo boas práticas de desenvolvimento e estrutura de dados.

## 🎯 Objetivos

- **Persistência**: Armazenar dados de produtos e pedidos de forma permanente
- **Integridade**: Garantir consistência e validação dos dados
- **Performance**: Otimizar consultas e operações
- **Manutenibilidade**: Código limpo e bem documentado

## 🗄️ Estrutura do Banco de Dados

### Tabela: `products`
```sql
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    slogan TEXT,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    image TEXT,
    gallery TEXT, -- JSON array de imagens
    active BOOLEAN DEFAULT 1,
    partner_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `orders`
```sql
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    items TEXT NOT NULL, -- JSON array dos itens
    total_amount REAL NOT NULL CHECK(total_amount >= 0),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT,
    notes TEXT,
    whatsapp_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `partners`
```sql
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    producer TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    commission_rate REAL DEFAULT 0 CHECK(commission_rate >= 0 AND commission_rate <= 100),
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Índices para Performance
```sql
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at);
```

## 🔧 Implementação

### Arquivo: `database-manager.js`
Classe principal para gerenciamento do banco SQLite com métodos para:
- Inicialização e criação de tabelas
- CRUD completo para produtos
- CRUD completo para pedidos
- Validação de dados
- Backup e restauração

### Arquivo: `database-schema.sql`
Arquivo com todos os comandos SQL para criação do banco.

### Arquivo: `database-seeds.js`
Dados iniciais para popular o banco (produtos padrão).

## 📊 Fluxo de Dados

1. **Inicialização**: Criar banco e tabelas se não existirem
2. **Produtos**: CRUD através da interface administrativa
3. **Pedidos**: Criação via carrinho de compras
4. **Sincronização**: Atualização em tempo real entre páginas

## ✅ Validações Implementadas

- **Produtos**: Nome obrigatório, preço >= 0, estoque >= 0
- **Pedidos**: Dados do cliente obrigatórios, valor total válido
- **Integridade**: Foreign keys e constraints
- **Tipos**: Validação de tipos de dados

## 🔒 Segurança

- Sanitização de inputs
- Prepared statements para evitar SQL injection
- Validação no frontend e backend
- Logs de auditoria

## 📈 Performance

- Índices em campos frequentemente consultados
- Consultas otimizadas
- Paginação para grandes volumes
- Cache inteligente

## 🚀 Como Usar

```javascript
// Inicializar
const db = new DatabaseManager();
await db.init();

// Produtos
const produtos = db.getProducts();
db.addProduct(productData);
db.updateProduct(id, productData);

// Pedidos
const pedidos = db.getOrders();
db.addOrder(orderData);
```

## 📝 Próximos Passos

1. Implementar DatabaseManager
2. Criar schema SQL
3. Implementar seeds
4. Integrar com interface administrativa
5. Testes unitários
6. Documentação de API
