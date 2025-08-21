// Debug de Persistência - Teste Direto
console.log('🔍 INICIANDO DEBUG DE PERSISTÊNCIA');

// Função para testar persistência
function testPersistencia() {
    console.log('=== TESTE DE PERSISTÊNCIA ===');
    
    // 1. Verificar localStorage atual
    const data = localStorage.getItem('granjaRecantoFelizData');
    console.log('📊 Dados atuais:', data ? JSON.parse(data) : 'VAZIO');
    
    // 2. Salvar dados de teste
    const testData = {
        products: [
            {
                id: 999,
                name: 'PRODUTO TESTE',
                price: 999.99,
                category: 'teste',
                stock: 1,
                active: true
            }
        ],
        lastUpdate: new Date().toISOString(),
        testSave: true
    };
    
    console.log('💾 Salvando dados de teste...');
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(testData));
    
    // 3. Verificar se salvou
    const saved = localStorage.getItem('granjaRecantoFelizData');
    const parsed = JSON.parse(saved);
    
    console.log('✅ Dados salvos:', parsed);
    console.log('🔍 Produto teste encontrado:', parsed.products.find(p => p.id === 999));
    
    return parsed;
}

// Função para verificar DataManager
function testDataManager() {
    console.log('=== TESTE DATAMANAGER ===');
    
    if (!window.dataManager) {
        console.error('❌ DataManager não existe');
        return false;
    }
    
    const products = window.dataManager.getProducts();
    console.log('📦 Produtos via DataManager:', products.length);
    console.log('🔍 Primeiro produto:', products[0]);
    
    return products;
}

// Executar testes
window.testPersistencia = testPersistencia;
window.testDataManager = testDataManager;

console.log('🔧 Funções de teste carregadas:');
console.log('- testPersistencia()');
console.log('- testDataManager()');