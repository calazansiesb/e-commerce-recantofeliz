// Teste completo do sistema SQLite
// Verificação abrangente de todas as bibliotecas e dependências

console.log('🔍 INICIANDO TESTE COMPLETO DO SISTEMA SQLITE');
console.log('================================================');

class SQLiteSystemTester {
    constructor() {
        this.results = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        
        if (type === 'error') {
            console.error('❌', logMessage);
            this.errors.push(logMessage);
        } else if (type === 'success') {
            console.log('✅', logMessage);
            this.results.push({ status: 'success', message: logMessage });
        } else if (type === 'warning') {
            console.warn('⚠️', logMessage);
            this.results.push({ status: 'warning', message: logMessage });
        } else {
            console.log('ℹ️', logMessage);
            this.results.push({ status: 'info', message: logMessage });
        }
    }

    async testSQLjsLibrary() {
        this.log('=== TESTE 1: Biblioteca SQL.js ===');
        
        try {
            // Verificar se SQL.js está carregado
            if (typeof window.SQL === 'undefined') {
                this.log('SQL.js não encontrado no window.SQL', 'error');
                return false;
            }
            
            this.log('SQL.js encontrado', 'success');
            
            // Verificar se podemos inicializar o SQL
            const SQL = window.SQL;
            this.log(`Versão SQL.js: ${SQL.toString().substring(0, 50)}...`);
            
            // Tentar criar uma instância
            const db = new SQL.Database();
            this.log('Database SQLite criado com sucesso', 'success');
            
            // Teste básico de SQL
            db.run("CREATE TABLE test (id INTEGER, name TEXT);");
            db.run("INSERT INTO test VALUES (1, 'teste');");
            const result = db.exec("SELECT * FROM test;");
            
            if (result.length > 0 && result[0].values.length > 0) {
                this.log('Teste básico de SQL executado com sucesso', 'success');
                db.close();
                return true;
            } else {
                this.log('Falha no teste básico de SQL', 'error');
                return false;
            }
            
        } catch (error) {
            this.log(`Erro ao testar SQL.js: ${error.message}`, 'error');
            return false;
        }
    }

    async testSQLiteManager() {
        this.log('=== TESTE 2: SQLiteManager ===');
        
        try {
            if (typeof window.SQLiteManager === 'undefined') {
                this.log('Classe SQLiteManager não encontrada', 'error');
                return false;
            }
            
            this.log('Classe SQLiteManager encontrada', 'success');
            
            // Verificar instância global
            if (typeof window.sqliteManager === 'undefined') {
                this.log('Instância global sqliteManager não encontrada, criando...', 'warning');
                window.sqliteManager = new SQLiteManager();
            }
            
            this.log('Instância SQLiteManager disponível', 'success');
            
            // Verificar se está inicializado
            if (!window.sqliteManager.db) {
                this.log('SQLiteManager não inicializado, tentando inicializar...', 'warning');
                await window.sqliteManager.init();
            }
            
            if (window.sqliteManager.db) {
                this.log('SQLiteManager inicializado com sucesso', 'success');
                
                // Testar operações básicas
                const produtos = window.sqliteManager.getProducts();
                this.log(`SQLiteManager possui ${produtos.length} produtos`, 'info');
                
                return true;
            } else {
                this.log('Falha na inicialização do SQLiteManager', 'error');
                return false;
            }
            
        } catch (error) {
            this.log(`Erro ao testar SQLiteManager: ${error.message}`, 'error');
            return false;
        }
    }

    async testRobustInitializer() {
        this.log('=== TESTE 3: Robust Initializer ===');
        
        try {
            if (typeof window.SQLiteRobustInitializer === 'undefined') {
                this.log('SQLiteRobustInitializer não encontrado', 'error');
                return false;
            }
            
            this.log('SQLiteRobustInitializer encontrado', 'success');
            
            // Verificar se o inicializador foi executado
            if (window.sqliteInitialized) {
                this.log('Sistema SQLite já foi inicializado pelo RobustInitializer', 'success');
            } else {
                this.log('RobustInitializer não foi executado ainda', 'warning');
            }
            
            return true;
            
        } catch (error) {
            this.log(`Erro ao testar RobustInitializer: ${error.message}`, 'error');
            return false;
        }
    }

    async testDataManager() {
        this.log('=== TESTE 4: DataManager ===');
        
        try {
            if (typeof window.DataManager === 'undefined') {
                this.log('Classe DataManager não encontrada', 'error');
                return false;
            }
            
            this.log('Classe DataManager encontrada', 'success');
            
            // Verificar instância global
            if (typeof window.dataManager === 'undefined') {
                this.log('Instância global dataManager não encontrada, criando...', 'warning');
                window.dataManager = new DataManager();
            }
            
            this.log('Instância DataManager disponível', 'success');
            
            // Testar operações básicas
            const produtos = window.dataManager.getProducts();
            this.log(`DataManager possui ${produtos.length} produtos`, 'info');
            
            if (produtos.length === 0) {
                this.log('Nenhum produto encontrado, forçando inicialização...', 'warning');
                window.dataManager.forceInitializeWithDefaults();
                const novosProdutos = window.dataManager.getProducts();
                this.log(`Após inicialização: ${novosProdutos.length} produtos`, 'success');
            }
            
            return true;
            
        } catch (error) {
            this.log(`Erro ao testar DataManager: ${error.message}`, 'error');
            return false;
        }
    }

    async testIntegration() {
        this.log('=== TESTE 5: Integração entre Componentes ===');
        
        try {
            // Verificar se SQLite e DataManager estão sincronizados
            if (window.sqliteManager && window.sqliteManager.db && window.dataManager) {
                const sqliteProdutos = window.sqliteManager.getProducts();
                const dataManagerProdutos = window.dataManager.getProducts();
                
                this.log(`SQLite: ${sqliteProdutos.length} produtos`, 'info');
                this.log(`DataManager: ${dataManagerProdutos.length} produtos`, 'info');
                
                if (sqliteProdutos.length === dataManagerProdutos.length) {
                    this.log('SQLite e DataManager sincronizados', 'success');
                } else {
                    this.log('SQLite e DataManager dessincronizados', 'warning');
                    
                    // Tentar sincronizar
                    if (dataManagerProdutos.length > 0) {
                        this.log('Sincronizando DataManager -> SQLite...', 'info');
                        for (const produto of dataManagerProdutos) {
                            try {
                                window.sqliteManager.saveProduct(produto);
                            } catch (e) {
                                this.log(`Erro ao sincronizar produto ${produto.name}: ${e.message}`, 'error');
                            }
                        }
                        
                        const novosSqliteProdutos = window.sqliteManager.getProducts();
                        this.log(`Após sincronização: SQLite tem ${novosSqliteProdutos.length} produtos`, 'success');
                    }
                }
            } else {
                this.log('Nem todos os componentes estão disponíveis para teste de integração', 'warning');
            }
            
            return true;
            
        } catch (error) {
            this.log(`Erro no teste de integração: ${error.message}`, 'error');
            return false;
        }
    }

    generateReport() {
        this.log('=== RELATÓRIO FINAL ===');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const warningCount = this.results.filter(r => r.status === 'warning').length;
        const errorCount = this.errors.length;
        
        this.log(`Total de sucessos: ${successCount}`, 'success');
        this.log(`Total de avisos: ${warningCount}`, 'warning');
        this.log(`Total de erros: ${errorCount}`, errorCount > 0 ? 'error' : 'success');
        
        if (errorCount === 0) {
            this.log('🎉 SISTEMA SQLITE TOTALMENTE FUNCIONAL!', 'success');
        } else {
            this.log('⚠️ Sistema SQLite com problemas - verifique os erros acima', 'error');
        }
        
        return {
            success: successCount,
            warnings: warningCount,
            errors: errorCount,
            functional: errorCount === 0
        };
    }

    async runFullTest() {
        this.log('Iniciando teste completo do sistema SQLite...');
        
        await this.testSQLjsLibrary();
        await this.testSQLiteManager();
        await this.testRobustInitializer();
        await this.testDataManager();
        await this.testIntegration();
        
        return this.generateReport();
    }
}

// Executar teste automaticamente após 3 segundos
setTimeout(async () => {
    const tester = new SQLiteSystemTester();
    const result = await tester.runFullTest();
    
    // Disponibilizar globalmente para execução manual
    window.sqliteSystemTester = tester;
    window.testSQLiteComplete = () => tester.runFullTest();
    
    console.log('\n💡 Para executar novamente: testSQLiteComplete()');
    
}, 3000);

console.log('🔧 Teste SQLite carregado. Aguarde 3 segundos para execução automática...');
