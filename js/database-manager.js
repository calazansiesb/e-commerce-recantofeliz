// Database Manager - Seguindo database-system.md
class DatabaseManager {
    constructor() {
        this.db = null;
        this.dbPath = 'granja-recanto-feliz.db';
    }

    async init() {
        try {
            // Carregar SQL.js
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // Tentar carregar banco existente
            try {
                const response = await fetch(this.dbPath);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    this.db = new SQL.Database(new Uint8Array(arrayBuffer));
                    console.log('✅ Banco SQLite carregado');
                } else {
                    throw new Error('Banco não encontrado');
                }
            } catch {
                // Criar novo banco
                this.db = new SQL.Database();
                await this.createTables();
                await this.seedData();
                console.log('✅ Novo banco SQLite criado');
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar banco:', error);
            return false;
        }
    }

    async createTables() {
        const schema = `
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                slogan TEXT,
                description TEXT,
                price REAL NOT NULL CHECK(price >= 0),
                stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
                image TEXT,
                active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
            CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
        `;

        this.db.exec(schema);
    }

    async seedData() {
        const products = [
            [1, 'Substrato BioFértil 3 Anos', 'fertilizantes', 'Mais do que Adubo: um substrato vivo e completo.', 'Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.', 40.00, 25, 'imagens/produtos/1/1.png'],
            [2, 'FertiGota', 'fertilizantes', 'Adubo de galinha líquido e potente.', 'Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.', 25.00, 40, 'imagens/produtos/2/1.png'],
            [3, 'Ovos Caipira 10', 'ovos', '10 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.', 18.00, 120, 'imagens/produtos/3/1.jpeg'],
            [4, 'Ovos Caipira 20', 'ovos', '20 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.', 30.00, 80, 'imagens/produtos/4/1.jpeg'],
            [5, 'Ovos Caipira 30', 'ovos', '30 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.', 45.00, 50, 'imagens/produtos/5/1.png'],
            [6, 'Galinha Caipira Picada', 'aves', 'Galinha caipira cortada, pronta para cozinhar.', 'Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.', 60.00, 15, 'imagens/produtos/6/1.png'],
            [7, 'Galinha Caipira Inteira', 'aves', 'Galinha caipira inteira, fresca e saborosa.', 'Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.', 110.00, 8, 'imagens/produtos/7/1.png']
        ];

        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO products (id, name, category, slogan, description, price, stock, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        products.forEach(product => stmt.run(product));
        stmt.free();
    }

    getProducts() {
        if (!this.db) return [];
        
        const stmt = this.db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY id');
        const products = [];
        
        while (stmt.step()) {
            const row = stmt.getAsObject();
            products.push({
                id: row.id,
                name: row.name,
                category: row.category,
                slogan: row.slogan,
                description: row.description,
                price: row.price,
                stock: row.stock,
                image: row.image,
                active: Boolean(row.active)
            });
        }
        
        stmt.free();
        return products;
    }

    updateProduct(id, productData) {
        if (!this.db) return false;

        try {
            const stmt = this.db.prepare(`
                UPDATE products 
                SET name = ?, category = ?, slogan = ?, description = ?, 
                    price = ?, stock = ?, image = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);

            const result = stmt.run([
                productData.name,
                productData.category,
                productData.slogan,
                productData.description,
                productData.price,
                productData.stock,
                productData.image,
                id
            ]);

            stmt.free();

            if (result.changes > 0) {
                this.saveDatabase();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return false;
        }
    }

    addProduct(productData) {
        if (!this.db) return false;

        try {
            const stmt = this.db.prepare(`
                INSERT INTO products (name, category, slogan, description, price, stock, image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run([
                productData.name,
                productData.category,
                productData.slogan,
                productData.description,
                productData.price,
                productData.stock,
                productData.image
            ]);

            stmt.free();

            if (result.changes > 0) {
                this.saveDatabase();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            return false;
        }
    }

    saveDatabase() {
        try {
            const data = this.db.export();
            const blob = new Blob([data], {type: 'application/x-sqlite3'});
            const url = URL.createObjectURL(blob);
            
            // Auto-download do banco atualizado
            const a = document.createElement('a');
            a.href = url;
            a.download = this.dbPath;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('💾 Banco SQLite salvo automaticamente');
            alert('💾 Banco atualizado! Substitua o arquivo na pasta src/');
        } catch (error) {
            console.error('Erro ao salvar banco:', error);
        }
    }
}

// DataManager seguindo database-system.md
window.dataManager = {
    db: null,
    
    async init() {
        this.db = new DatabaseManager();
        return await this.db.init();
    },
    
    getProducts() {
        return this.db ? this.db.getProducts() : [];
    },
    
    getActiveProducts() {
        return this.getProducts().filter(p => p.active !== false);
    },
    
    updateProduct(id, productData) {
        if (this.db) {
            const success = this.db.updateProduct(id, productData);
            if (success) {
                window.dispatchEvent(new CustomEvent('productsUpdated'));
            }
            return success;
        }
        return false;
    },
    
    addProduct(productData) {
        if (this.db) {
            const success = this.db.addProduct(productData);
            if (success) {
                window.dispatchEvent(new CustomEvent('productsUpdated'));
            }
            return success;
        }
        return false;
    },
    
    getStats() {
        const products = this.getActiveProducts();
        return {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            lowStock: products.filter(p => p.stock <= 10).length,
            outOfStock: products.filter(p => p.stock === 0).length
        };
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🗄️ Inicializando DatabaseManager...');
    const success = await window.dataManager.init();
    if (success) {
        console.log('✅ DatabaseManager inicializado seguindo database-system.md');
    } else {
        console.error('❌ Falha na inicialização do DatabaseManager');
    }
});