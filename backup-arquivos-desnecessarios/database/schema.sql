-- Schema do Banco de Dados - Granja Recanto Feliz
-- Arquivo: database-schema.sql
-- Descrição: Estrutura completa das tabelas SQLite

-- ======================================
-- TABELA: products
-- Descrição: Armazena todos os produtos da granja
-- ======================================
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) > 0),
    category TEXT NOT NULL CHECK(category IN ('fertilizantes', 'ovos', 'aves', 'parceiros', 'outros')),
    slogan TEXT,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    image TEXT, -- URL ou caminho da imagem principal
    gallery TEXT, -- JSON array com URLs de todas as imagens: ["img1.jpg", "img2.jpg"]
    active BOOLEAN DEFAULT 1, -- 1 = ativo, 0 = inativo
    partner_id INTEGER, -- ID do parceiro (se aplicável)
    metadata TEXT, -- JSON para dados extras: {"peso": "1kg", "validade": "30 dias"}
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- ======================================
-- TABELA: orders
-- Descrição: Armazena todos os pedidos realizados
-- ======================================
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL CHECK(length(customer_name) > 0),
    customer_phone TEXT NOT NULL CHECK(length(customer_phone) >= 10),
    customer_email TEXT CHECK(customer_email IS NULL OR customer_email LIKE '%@%'),
    customer_address TEXT,
    items TEXT NOT NULL, -- JSON array: [{"id": 1, "name": "Produto", "price": 10.00, "quantity": 2}]
    total_amount REAL NOT NULL CHECK(total_amount >= 0),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT CHECK(payment_method IN ('pix', 'dinheiro', 'cartao', 'transferencia', NULL)),
    notes TEXT, -- Observações do cliente
    whatsapp_sent BOOLEAN DEFAULT 0, -- Se foi enviado para WhatsApp
    whatsapp_message TEXT, -- Mensagem formatada enviada
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- TABELA: partners
-- Descrição: Parceiros que vendem produtos na plataforma
-- ======================================
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) > 0), -- Nome da empresa/marca
    producer TEXT NOT NULL CHECK(length(producer) > 0), -- Nome do produtor
    phone TEXT,
    email TEXT CHECK(email IS NULL OR email LIKE '%@%'),
    address TEXT,
    commission_rate REAL DEFAULT 0 CHECK(commission_rate >= 0 AND commission_rate <= 100), -- % de comissão
    active BOOLEAN DEFAULT 1,
    notes TEXT, -- Observações sobre o parceiro
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- TABELA: order_items
-- Descrição: Itens individuais de cada pedido (normalizada)
-- ======================================
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL, -- Nome do produto no momento do pedido
    product_price REAL NOT NULL CHECK(product_price >= 0), -- Preço no momento do pedido
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    subtotal REAL NOT NULL CHECK(subtotal >= 0), -- price * quantity
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ======================================
-- TABELA: inventory_logs
-- Descrição: Log de movimentações de estoque
-- ======================================
CREATE TABLE IF NOT EXISTS inventory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('addition', 'subtraction', 'adjustment', 'sale')),
    quantity_before INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL, -- Pode ser negativo
    quantity_after INTEGER NOT NULL,
    reason TEXT, -- Motivo da movimentação
    reference_id INTEGER, -- ID de referência (ex: order_id se for venda)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ======================================
-- ÍNDICES PARA PERFORMANCE
-- ======================================

-- Índices para tabela products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Índices para tabela orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON orders(total_amount);

-- Índices para tabela order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Índices para tabela partners
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(active);
CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);

-- Índices para tabela inventory_logs
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_type ON inventory_logs(type);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at);

-- ======================================
-- TRIGGERS PARA AUDITORIA
-- ======================================

-- Trigger para atualizar updated_at em products
CREATE TRIGGER IF NOT EXISTS products_updated_at 
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at em orders
CREATE TRIGGER IF NOT EXISTS orders_updated_at 
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at em partners
CREATE TRIGGER IF NOT EXISTS partners_updated_at 
    AFTER UPDATE ON partners
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE partners SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para log de estoque quando produto é atualizado
CREATE TRIGGER IF NOT EXISTS product_stock_log 
    AFTER UPDATE OF stock ON products
    FOR EACH ROW
    WHEN NEW.stock != OLD.stock
BEGIN
    INSERT INTO inventory_logs (product_id, type, quantity_before, quantity_change, quantity_after, reason)
    VALUES (
        NEW.id,
        CASE 
            WHEN NEW.stock > OLD.stock THEN 'addition'
            WHEN NEW.stock < OLD.stock THEN 'subtraction'
            ELSE 'adjustment'
        END,
        OLD.stock,
        NEW.stock - OLD.stock,
        NEW.stock,
        'Stock updated via admin panel'
    );
END;

-- ======================================
-- VIEWS ÚTEIS
-- ======================================

-- View para produtos com informações de parceiros
CREATE VIEW IF NOT EXISTS products_with_partners AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.slogan,
    p.description,
    p.price,
    p.stock,
    p.image,
    p.active,
    pt.name as partner_name,
    pt.producer as partner_producer,
    pt.commission_rate,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN partners pt ON p.partner_id = pt.id;

-- View para pedidos com valor total dos itens
CREATE VIEW IF NOT EXISTS orders_summary AS
SELECT 
    o.id,
    o.customer_name,
    o.customer_phone,
    o.customer_email,
    o.status,
    o.total_amount,
    COUNT(oi.id) as items_count,
    SUM(oi.quantity) as total_items,
    o.created_at
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View para relatório de vendas por produto
CREATE VIEW IF NOT EXISTS sales_by_product AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(oi.id) as orders_count,
    SUM(oi.quantity) as total_sold,
    SUM(oi.subtotal) as total_revenue,
    AVG(oi.product_price) as avg_price,
    p.stock as current_stock
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled' OR o.status IS NULL
GROUP BY p.id;
