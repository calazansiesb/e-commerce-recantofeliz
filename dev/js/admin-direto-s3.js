// Admin que salva DIRETAMENTE no S3 do site
console.log('📤 Carregando admin direto S3...');

window.salvarProduto = async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value || Date.now();
    const produtoData = {
        id: parseInt(id),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        slogan: document.getElementById('product-slogan').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        active: true,
        image: `imagens/produtos/${id}.1.jpg`
    };
    
    try {
        // 1. Upload da imagem para S3
        if (window.currentProductImages && window.currentProductImages.length > 0) {
            console.log('📸 Fazendo upload da imagem...');
            await uploadImagemParaS3(id, window.currentProductImages[0]);
        }
        
        // 2. Atualizar produtos.json no S3
        console.log('📝 Atualizando produtos.json...');
        await atualizarProdutosJSON(produtoData);
        
        // 3. Invalidar cache CloudFront
        console.log('🔄 Invalidando cache...');
        await invalidarCache();
        
        alert('✅ Produto publicado no site!');
        
        await window.renderizarProdutosAdmin();
        window.closeProductModal();
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('❌ Erro: ' + error.message);
    }
};

// Upload direto da imagem para S3
async function uploadImagemParaS3(produtoId, imageData) {
    const base64Data = imageData.split(',')[1];
    
    const response = await fetch('/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bucket: 'granjarecantofeliz-site',
            key: `imagens/produtos/${produtoId}.1.jpg`,
            data: base64Data,
            contentType: 'image/jpeg'
        })
    });
    
    if (!response.ok) throw new Error('Erro no upload da imagem');
}

// Atualizar produtos.json diretamente no S3
async function atualizarProdutosJSON(novoProduto) {
    // 1. Baixar JSON atual
    const response = await fetch('https://granjarecantofeliz-site.s3.sa-east-1.amazonaws.com/dados/produtos.json');
    let produtosAtuais = [];
    
    if (response.ok) {
        const data = await response.json();
        produtosAtuais = data.products || [];
    }
    
    // 2. Adicionar/atualizar produto
    const index = produtosAtuais.findIndex(p => p.id === novoProduto.id);
    if (index >= 0) {
        produtosAtuais[index] = novoProduto;
    } else {
        produtosAtuais.push(novoProduto);
    }
    
    // 3. Criar novo JSON
    const novoJSON = {
        products: produtosAtuais,
        lastUpdate: new Date().toISOString(),
        version: '1.0'
    };
    
    // 4. Upload para S3
    const uploadResponse = await fetch('/admin/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bucket: 'granjarecantofeliz-site',
            key: 'dados/produtos.json',
            data: JSON.stringify(novoJSON, null, 2)
        })
    });
    
    if (!uploadResponse.ok) throw new Error('Erro ao atualizar JSON');
}

// Invalidar cache CloudFront
async function invalidarCache() {
    const response = await fetch('/admin/invalidate-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            distributionId: 'E10QPOHV1RNFOA',
            paths: ['/dados/produtos.json', '/imagens/produtos/*']
        })
    });
    
    if (!response.ok) throw new Error('Erro ao invalidar cache');
}

console.log('✅ Admin direto S3 carregado');