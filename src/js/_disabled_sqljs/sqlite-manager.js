// Arquivo movido para _disabled_sqljs para desativar o uso de SQL.js no cliente
// Conteúdo original preservado para referência futura.

// Sistema SQLite para Granja Recanto Feliz
class SQLiteManager {
    constructor() {
        this.db = null;
        this.dbName = 'granja_recanto_feliz.db';
        this.init();
    }

    // Inicializar banco SQLite
    async init() {
        try {
            console.log('🔄 Iniciando SQLite...');
            
            // Verificar se SQL.js já está carregado
            if (typeof window.initSqlJs === 'undefined') {
                console.log('📥 Carregando biblioteca SQL.js...');
                await this.loadSqlJs();
            }
            
            // Usar SQL.js (SQLite para JavaScript)
            const SQL = await window.initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
            
            // TENTAR CARREGAR BANCO REAL SALVO
            try {
                console.log('🗄️ Tentando carregar banco real...');
                const response = await fetch('./granja-recanto-feliz.db');
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    this.db = new SQL.Database(uint8Array);
                    console.log('✅ Banco SQLite REAL carregado do arquivo!');
                    
                    // Verificar se tem dados
                    const products = this.getProducts();
                    console.log(`📊 Banco real contém ${products.length} produtos`);
                    
                    return; // Sucesso - usar banco real
                } else {
                    throw new Error('Arquivo não encontrado');
                }
            } catch (fileError) {
                console.log('⚠️ Banco real não encontrado, usando backup...');
                
                // Fallback para backup
                const savedDb = localStorage.getItem('sqliteDb_backup');
                if (savedDb) {
                    try {
                        const uInt8Array = new Uint8Array(JSON.parse(savedDb));
                        this.db = new SQL.Database(uInt8Array);
                        console.log('✅ Banco SQLite carregado do backup');
                    } catch (loadError) {
                        console.warn('⚠️ Erro ao carregar backup, criando novo:', loadError);
                        this.db = new SQL.Database();
                        await this.createTables();
                        await this.syncFromDataManager();
                    }
                } else {
                    // Criar novo banco e sincronizar com DataManager
                    this.db = new SQL.Database();
                    await this.createTables();
                    await this.syncFromDataManager();
                    console.log('✅ Novo banco SQLite criado e sincronizado');
                }
            }
            
            this.saveToLocalStorage();
        } catch (error) {
            console.error('❌ Erro ao inicializar SQLite:', error);
            console.log('🔄 Usando fallback localStorage...');
            // Fallback para localStorage
            this.useFallback();
        }
    }

    // Carregar SQL.js
    async loadSqlJs() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://sql.js.org/dist/sql-wasm.js';
            script.onload = () => {
                console.log('✅ SQL.js carregado com sucesso');
                resolve();
            };
            script.onerror = (error) => {
                console.error('❌ Erro ao carregar SQL.js:', error);
                reject(error);
            };
            script.timeout = 10000; // 10 segundos de timeout
            document.head.appendChild(script);
            
            // Timeout manual
            setTimeout(() => {
                if (typeof window.initSqlJs === 'undefined') {
                    reject(new Error('Timeout ao carregar SQL.js'));
                }
            }, 10000);
        });
    }

    // Criar tabelas
    async createTables() {
        const createProductsTable = `
            CREATE TABLE IF NOT EXISTS produtos (
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
            )
        `;
        
        this.db.run(createProductsTable);
        console.log('📋 Tabela produtos criada');
    }

    // CORREÇÃO: Sincronizar com DataManager ao invés de dados hardcoded
    async syncFromDataManager() {
        try {
            console.log('🔄 Sincronizando SQLite com DataManager...');
            
            // Obter produtos do DataManager (fonte única de verdade)
            if (window.dataManager) {
                const products = window.dataManager.getProducts();
                console.log(`📊 DataManager tem ${products.length} produtos`);
                
                if (products && products.length > 0) {
                    // Limpar tabela existente
                    this.db.run('DELETE FROM produtos');
                    
                    // Inserir produtos do DataManager
                    const stmt = this.db.prepare(`
                        INSERT INTO produtos (id, nome, categoria, slogan, descricao, preco, estoque, imagem, ativo, parceiro_nome, parceiro_produtor, parceiro_local, parceiro_descricao)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);
                    
                    products.forEach(product => {
                        const partner = product.partner || {};
                        stmt.run([
                            product.id,
                            product.name,
                            product.category || '',
                            product.slogan || '',
                            product.description || '',
                            product.price,
                            product.stock || 0,
                            product.image || '',
                            product.active !== false ? 1 : 0,
                            partner.name || null,
                            partner.producer || null,
                            partner.location || null,
                            partner.description || null
                        ]);
                    });
                    
                    stmt.free();
                    console.log(`✅ ${products.length} produtos sincronizados do DataManager`);
                    return;
                }
            }
            
            // Fallback: inserir dados padrão apenas se DataManager não estiver disponível
            console.log('⚠️ DataManager não disponível, usando dados padrão...');
            await this.insertInitialData();
            
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            await this.insertInitialData();
        }
    }

    // Inserir dados iniciais (apenas como fallback)
    async insertInitialData() {
        const produtos = [
            [1, 'Substrato BioFértil 3 Anos', 'fertilizantes', 'Mais do que Adubo: um substrato vivo e completo.', 'Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.', 40.00, 25, 'imagens/produtos/1/1.png', 1],
            [2, 'FertiGota', 'fertilizantes', 'Adubo de galinha líquido e potente.', 'Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.', 25.00, 40, 'imagens/produtos/2/1.png', 1],
            [3, 'Ovos Caipira 10', 'ovos', '10 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.', 18.00, 120, 'imagens/produtos/3/1.jpeg', 1],
            [4, 'Ovos Caipira 20', 'ovos', '20 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.', 30.00, 80, 'imagens/produtos/4/1.jpeg', 1],
            [5, 'Ovos Caipira 30', 'ovos', '30 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.', 45.00, 50, 'imagens/produtos/5/1.png', 1],
            [6, 'Galinha Caipira Picada', 'aves', 'Galinha caipira cortada, pronta para cozinhar.', 'Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.', 60.00, 15, 'imagens/produtos/6/1.png', 1],
            [7, 'Galinha Caipira Inteira', 'aves', 'Galinha caipira inteira, fresca e saborosa.', 'Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.', 110.00, 8, 'imagens/produtos/7/1.png', 1]
        ];

        const stmt = this.db.prepare(`
            INSERT INTO produtos (id, nome, categoria, slogan, descricao, preco, estoque, imagem, ativo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        produtos.forEach(produto => {
            stmt.run(produto);
        });

        stmt.free();
        console.log('📦 Dados padrão inseridos como fallback');
    }

    // Obter todos os produtos
    getProducts() {
        try {
            const stmt = this.db.prepare('SELECT * FROM produtos WHERE ativo = 1 ORDER BY id');
            const products = [];
            
            while (stmt.step()) {
                const row = stmt.getAsObject();
                products.push({
                    id: row.id,
                    name: row.nome,
                    category: row.categoria,
                    slogan: row.slogan,
                    description: row.descricao,
                    price: row.preco,
                    stock: row.estoque,
                    image: row.imagem,
                    active: row.ativo === 1,
                    partner: row.parceiro_nome ? {
                        name: row.parceiro_nome,
                        producer: row.parceiro_produtor,
                        location: row.parceiro_local,
                        description: row.parceiro_descricao
                    } : null
                });
            }
            
            stmt.free();
            return products;
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            return this.getFallbackProducts();
        }
    }

    // Adicionar produto
    addProduct(productData) {
        try {
            if (!this.db) {
                console.warn('⚠️ SQLite não disponível para addProduct');
                return false;
            }

            // Validar dados obrigatórios
            if (!productData.name || !productData.price || productData.price <= 0) {
                console.error('❌ Dados do produto inválidos:', productData);
                return false;
            }

            const stmt = this.db.prepare(`
                INSERT INTO produtos (nome, categoria, slogan, descricao, preco, estoque, imagem, ativo, parceiro_nome, parceiro_produtor, parceiro_local, parceiro_descricao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const partner = productData.partner || {};
            const image = productData.image || '';
            
            stmt.run([
                productData.name,
                productData.category || '',
                productData.slogan || '',
                productData.description || '',
                productData.price,
                productData.stock || 0,
                image,
                1, // ativo
                partner.name || null,
                partner.producer || null,
                partner.location || null,
                partner.description || null
            ]);
            
            stmt.free();
            this.saveToLocalStorage();
            console.log('✅ Produto adicionado ao SQLite:', productData.name);
            return true;
        } catch (error) {
            console.error('❌ Erro ao adicionar produto no SQLite:', error);
            return false;
        }
    }

*** End Patch
