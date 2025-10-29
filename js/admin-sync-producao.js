// Sincronização automática Admin → DynamoDB → S3 → Produção
console.log('🔄 Carregando sincronização em tempo real...');

// Sobrescrever função de salvar para sincronizar automaticamente
window.salvarProdutoOriginal = window.salvarProduto;

window.salvarProduto = async function(event) {
    event.preventDefault();
    
    const produtoData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        slogan: document.getElementById('product-slogan').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        active: true
    };
    
    const id = document.getElementById('product-id').value || Date.now();
    produtoData.id = parseInt(id);
    
    try {
        // 1. Salvar no DynamoDB
        console.log('💾 Salvando no DynamoDB...');
        await salvarNoDynamoDB(produtoData);
        
        // 2. Atualizar JSON no S3
        console.log('📤 Atualizando S3...');
        await atualizarJSONNoS3();
        
        // 3. Invalidar cache CloudFront
        console.log('🔄 Invalidando cache...');
        await invalidarCacheCloudFront();
        
        alert('✅ Produto salvo e publicado em produção!');
        
        await window.renderizarProdutosAdmin();
        window.closeProductModal();
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('❌ Erro ao salvar: ' + error.message);
    }
};

// Salvar diretamente no DynamoDB
async function salvarNoDynamoDB(produto) {
    const params = {
        TableName: 'GranjaRecantoFelizProdutos',
        Item: {
            id: { S: produto.id.toString() },
            name: { S: produto.name },
            category: { S: produto.category },
            slogan: { S: produto.slogan },
            description: { S: produto.description },
            price: { N: produto.price.toString() },
            stock: { N: produto.stock.toString() },
            active: { BOOL: true },
            image: { S: produto.image || `imagens/produtos/${produto.id}.1.jpg` },
            lastUpdate: { S: new Date().toISOString() }
        }
    };
    
    // Usar AWS SDK via fetch (simulação)
    const response = await fetch('/admin/save-dynamodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
    
    if (!response.ok) throw new Error('Erro ao salvar no DynamoDB');
}

// Atualizar JSON no S3
async function atualizarJSONNoS3() {
    // Buscar todos os produtos do DynamoDB
    const produtos = await buscarTodosProdutosDynamoDB();
    
    const jsonData = {
        products: produtos,
        lastUpdate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Upload para S3
    const response = await fetch('/admin/update-s3-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar S3');
}

// Buscar produtos do DynamoDB
async function buscarTodosProdutosDynamoDB() {
    const response = await fetch('/admin/get-dynamodb-products');
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    
    const data = await response.json();
    return data.products || [];
}

// Invalidar cache CloudFront
async function invalidarCacheCloudFront() {
    const response = await fetch('/admin/invalidate-cloudfront', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            distributionId: 'E10QPOHV1RNFOA',
            paths: ['/dados/produtos.json', '/index.html']
        })
    });
    
    if (!response.ok) throw new Error('Erro ao invalidar cache');
}

console.log('✅ Sincronização em tempo real ativada');