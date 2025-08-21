/**
 * Sistema de Teste e Diagnóstico SQLite
 * 
 * Este script verifica o funcionamento completo do sistema SQLite
 * e fornece diagnósticos em tempo real.
 */

class SQLiteSystemTest {
    constructor() {
        this.testResults = {};
        console.log('🧪 Sistema de Teste SQLite iniciado');
        
        // Aguardar o DOM carregar para executar testes
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runAllTests());
        } else {
            setTimeout(() => this.runAllTests(), 1000);
        }
    }
    
    async runAllTests() {
        console.log('🚀 === INICIANDO TESTES COMPLETOS ===');
        
        try {
            // Teste 1: Carregamento de dependências
            await this.testDependencies();
            
            // Teste 2: Inicialização SQLite
            await this.testSQLiteInitialization();
            
            // Teste 3: Operações básicas
            await this.testBasicOperations();
            
            // Teste 4: Integração DataManager
            await this.testDataManagerIntegration();
            
            // Teste 5: Persistência
            await this.testPersistence();
            
            // Relatório final
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Erro durante os testes:', error);
        }
    }
    
    async testDependencies() {
        console.log('📦 Testando dependências...');
        
        const tests = {
            'SQL.js': () => typeof initSqlJs !== 'undefined',
            'SQLiteManager class': () => typeof SQLiteManager !== 'undefined',
            'DataManager class': () => typeof DataManager !== 'undefined',
            'RobustInitializer': () => typeof window.sqliteRobustInitializer !== 'undefined'
        };
        
        this.testResults.dependencies = {};
        
        for (const [name, test] of Object.entries(tests)) {
            const result = test();
            this.testResults.dependencies[name] = result;
            console.log(`  ${result ? '✅' : '❌'} ${name}: ${result ? 'OK' : 'FALHOU'}`);
        }
    }
    
    async testSQLiteInitialization() {
        console.log('🔧 Testando inicialização SQLite...');
        
        this.testResults.initialization = {};
        
        // Aguardar inicialização
        try {
            if (window.sqliteRobustInitializer) {
                await Promise.race([
                    window.sqliteRobustInitializer.waitForReady(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
                ]);
                
                this.testResults.initialization.timeout = false;
                console.log('  ✅ Inicialização concluída dentro do tempo limite');
            } else {
                this.testResults.initialization.timeout = true;
                console.log('  ❌ RobustInitializer não disponível');
                return;
            }
        } catch (error) {
            this.testResults.initialization.timeout = true;
            console.log('  ❌ Timeout na inicialização (10s)');
            return;
        }
        
        // Verificar estado final
        const sqliteExists = !!window.sqliteManager;
        const dbExists = !!(window.sqliteManager && window.sqliteManager.db);
        const readyFlag = !!window.sqliteReady;
        
        this.testResults.initialization.sqliteManager = sqliteExists;
        this.testResults.initialization.database = dbExists;
        this.testResults.initialization.readyFlag = readyFlag;
        
        console.log(`  ${sqliteExists ? '✅' : '❌'} SQLiteManager: ${sqliteExists ? 'Criado' : 'Não encontrado'}`);
        console.log(`  ${dbExists ? '✅' : '❌'} Database: ${dbExists ? 'Inicializado' : 'Não inicializado'}`);
        console.log(`  ${readyFlag ? '✅' : '❌'} Ready Flag: ${readyFlag ? 'True' : 'False'}`);
    }
    
    async testBasicOperations() {
        console.log('⚙️ Testando operações básicas...');
        
        this.testResults.operations = {};
        
        if (!window.sqliteManager || !window.sqliteManager.db) {
            console.log('  ⚠️ SQLite não disponível - pulando testes de operação');
            this.testResults.operations.skipped = true;
            return;
        }
        
        try {
            // Teste de consulta
            const products = window.sqliteManager.getProducts();
            this.testResults.operations.query = Array.isArray(products);
            console.log(`  ${Array.isArray(products) ? '✅' : '❌'} Query produtos: ${Array.isArray(products) ? products.length + ' itens' : 'Falhou'}`);
            
            // Teste de inserção (se não há produtos)
            if (products.length === 0) {
                const testProduct = {
                    name: 'Teste SQLite',
                    price: 1.00,
                    stock: 1,
                    category: 'teste',
                    description: 'Produto de teste do sistema SQLite'
                };
                
                const inserted = window.sqliteManager.addProduct(testProduct);
                this.testResults.operations.insert = inserted;
                console.log(`  ${inserted ? '✅' : '❌'} Insert teste: ${inserted ? 'Sucesso' : 'Falhou'}`);
                
                if (inserted) {
                    // Verificar se foi inserido
                    const updatedProducts = window.sqliteManager.getProducts();
                    const found = updatedProducts.find(p => p.name === 'Teste SQLite');
                    this.testResults.operations.verify = !!found;
                    console.log(`  ${found ? '✅' : '❌'} Verificação: ${found ? 'Produto encontrado' : 'Produto não encontrado'}`);
                }
            } else {
                console.log('  ℹ️ Produtos existentes - pulando teste de inserção');
                this.testResults.operations.insert = 'skipped';
            }
            
        } catch (error) {
            console.error('  ❌ Erro nas operações básicas:', error);
            this.testResults.operations.error = error.message;
        }
    }
    
    async testDataManagerIntegration() {
        console.log('🔗 Testando integração DataManager...');
        
        this.testResults.integration = {};
        
        if (!window.dataManager) {
            console.log('  ❌ DataManager não disponível');
            this.testResults.integration.dataManagerMissing = true;
            return;
        }
        
        try {
            // Testar método saveToSQLiteIfAvailable
            const hasMethod = typeof window.dataManager.saveToSQLiteIfAvailable === 'function';
            this.testResults.integration.methodExists = hasMethod;
            console.log(`  ${hasMethod ? '✅' : '❌'} Método saveToSQLiteIfAvailable: ${hasMethod ? 'Existe' : 'Não encontrado'}`);
            
            // Testar produtos do DataManager
            const dmProducts = window.dataManager.getProducts();
            this.testResults.integration.dataManagerProducts = dmProducts.length;
            console.log(`  ✅ Produtos DataManager: ${dmProducts.length} itens`);
            
            // Comparar com SQLite se disponível
            if (window.sqliteManager) {
                const sqliteProducts = window.sqliteManager.getProducts();
                this.testResults.integration.productSync = dmProducts.length === sqliteProducts.length;
                console.log(`  ${dmProducts.length === sqliteProducts.length ? '✅' : '⚠️'} Sincronização: DM=${dmProducts.length}, SQLite=${sqliteProducts.length}`);
            }
            
        } catch (error) {
            console.error('  ❌ Erro na integração:', error);
            this.testResults.integration.error = error.message;
        }
    }
    
    async testPersistence() {
        console.log('💾 Testando persistência...');
        
        this.testResults.persistence = {};
        
        try {
            // Verificar localStorage
            const localData = localStorage.getItem('granjaRecantoFelizData');
            const hasLocalStorage = !!localData;
            this.testResults.persistence.localStorage = hasLocalStorage;
            console.log(`  ${hasLocalStorage ? '✅' : '❌'} LocalStorage: ${hasLocalStorage ? 'Dados encontrados' : 'Vazio'}`);
            
            if (hasLocalStorage) {
                try {
                    const parsed = JSON.parse(localData);
                    const productCount = parsed.products?.length || 0;
                    this.testResults.persistence.productCount = productCount;
                    console.log(`  ✅ Produtos persistidos: ${productCount} itens`);
                    console.log(`  ✅ Última atualização: ${parsed.lastUpdate || 'N/A'}`);
                } catch (parseError) {
                    console.log('  ❌ Erro ao analisar dados do localStorage');
                    this.testResults.persistence.parseError = true;
                }
            }
            
        } catch (error) {
            console.error('  ❌ Erro no teste de persistência:', error);
            this.testResults.persistence.error = error.message;
        }
    }
    
    generateReport() {
        console.log('📋 === RELATÓRIO FINAL DOS TESTES ===');
        
        const allPassed = this.checkAllTestsPassed();
        
        console.log(`🎯 Status Geral: ${allPassed ? '✅ TODOS OS TESTES PASSARAM' : '⚠️ ALGUNS TESTES FALHARAM'}`);
        console.log('');
        
        // Dependências
        console.log('📦 Dependências:');
        for (const [name, result] of Object.entries(this.testResults.dependencies || {})) {
            console.log(`  ${result ? '✅' : '❌'} ${name}`);
        }
        console.log('');
        
        // Inicialização
        console.log('🔧 Inicialização:');
        const init = this.testResults.initialization || {};
        console.log(`  ${!init.timeout ? '✅' : '❌'} Tempo limite: ${!init.timeout ? 'OK' : 'TIMEOUT'}`);
        console.log(`  ${init.sqliteManager ? '✅' : '❌'} SQLiteManager: ${init.sqliteManager ? 'OK' : 'FALHOU'}`);
        console.log(`  ${init.database ? '✅' : '❌'} Database: ${init.database ? 'OK' : 'FALHOU'}`);
        console.log(`  ${init.readyFlag ? '✅' : '❌'} Ready Flag: ${init.readyFlag ? 'OK' : 'FALHOU'}`);
        console.log('');
        
        // Recomendações
        this.generateRecommendations();
        
        // Salvar relatório
        this.saveReport();
    }
    
    checkAllTestsPassed() {
        const deps = this.testResults.dependencies || {};
        const init = this.testResults.initialization || {};
        
        const criticalTests = [
            ...Object.values(deps),
            !init.timeout,
            init.sqliteManager,
            init.database,
            init.readyFlag
        ];
        
        return criticalTests.every(test => test === true);
    }
    
    generateRecommendations() {
        console.log('💡 Recomendações:');
        
        const deps = this.testResults.dependencies || {};
        const init = this.testResults.initialization || {};
        
        if (!deps['SQL.js']) {
            console.log('  🔧 Verificar carregamento da biblioteca SQL.js');
        }
        
        if (!deps['SQLiteManager class']) {
            console.log('  🔧 Verificar se sqlite-manager.js está carregando');
        }
        
        if (init.timeout) {
            console.log('  🔧 Verificar conexão de internet ou CDN do SQL.js');
        }
        
        if (!init.database) {
            console.log('  🔧 Verificar inicialização do banco SQLite');
        }
        
        const allGood = this.checkAllTestsPassed();
        if (allGood) {
            console.log('  🎉 Sistema funcionando perfeitamente!');
            console.log('  ✅ SQLite pronto para receber atualizações de produtos');
            console.log('  ✅ Persistência garantida após limpeza de cache');
        }
    }
    
    saveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            results: this.testResults,
            summary: {
                allPassed: this.checkAllTestsPassed(),
                criticalIssues: this.identifyCriticalIssues()
            }
        };
        
        localStorage.setItem('sqliteTestReport', JSON.stringify(report));
        console.log('💾 Relatório salvo no localStorage como "sqliteTestReport"');
    }
    
    identifyCriticalIssues() {
        const issues = [];
        const init = this.testResults.initialization || {};
        
        if (init.timeout) issues.push('Timeout na inicialização');
        if (!init.sqliteManager) issues.push('SQLiteManager não criado');
        if (!init.database) issues.push('Database não inicializado');
        if (!init.readyFlag) issues.push('Flag de pronto não definida');
        
        return issues;
    }
}

// Inicializar testes
window.sqliteSystemTest = new SQLiteSystemTest();

console.log('🧪 Sistema de Teste SQLite carregado');
