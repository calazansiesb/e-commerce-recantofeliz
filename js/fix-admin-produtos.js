// Admin simples para gerenciar produtos
console.log('🔧 Carregando admin simples...');

let produtos = [];

// Carregar produtos direto da API
async function carregarProdutos() {
    try {
        console.log('=== CARREGANDO PRODUTOS DO DYNAMODB ===');
        
        const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos', {
            cache: 'no-store'
        });
        
        if (response.ok) {
            produtos = await response.json();
            console.log(`✅ ${produtos.length} produtos carregados do DynamoDB`);
            
            // Debug dos produtos carregados
            if (produtos.length > 0) {
                console.log('Primeiros produtos:');
                produtos.slice(0, 3).forEach((p, i) => {
                    console.log(`  ${i + 1}. ${p.name} - R$ ${p.price}`);
                });
            }
        } else {
            console.error(`❌ API retornou status ${response.status}`);
            return [];
        }
        
        return produtos;
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        return [];
    }
}

// Renderizar produtos na tabela admin
async function renderizarProdutosAdmin() {
    await carregarProdutos();
    
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = produtos.map(produto => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">${produto.id}</td>
            <td class="px-4 py-3">
                <img src="${produto.image}" alt="${produto.name}" class="w-16 h-16 object-cover rounded" onerror="this.src='imagens/produtos/default/placeholder.png'">
                ${produto.imageData ? '<div class="text-xs text-green-600 mt-1">✓ Nova</div>' : ''}
            </td>
            <td class="px-4 py-3 font-medium">${produto.name}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${produto.category}</span>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">R$ ${produto.price.toFixed(2)}</td>
            <td class="px-4 py-3">${produto.stock}</td>
            <td class="px-4 py-3">
                <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="excluirProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Funções básicas do admin
function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    // Preencher modal com dados do produto
    document.getElementById('product-id').value = produto.id;
    document.getElementById('product-name').value = produto.name;
    document.getElementById('product-category').value = produto.category;
    document.getElementById('product-slogan').value = produto.slogan;
    document.getElementById('product-description').value = produto.description;
    document.getElementById('product-price').value = produto.price;
    document.getElementById('product-stock').value = produto.stock;
    
    // Mostrar imagem atual no preview
    const imagePreview = document.getElementById('image-preview');
    if (produto.image) {
        imagePreview.innerHTML = `
            <div class="relative">
                <img src="${produto.image}" alt="${produto.name}" class="w-32 h-32 object-cover rounded border-2 border-blue-500" onerror="this.src='imagens/produtos/default/placeholder.png'">
                <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">Atual</div>
            </div>
        `;
    }
    
    document.getElementById('modal-title').textContent = `Editar Produto: ${produto.name}`;
    document.getElementById('product-modal').classList.remove('hidden');
}

async function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const response = await fetch(`https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Produto excluído do DynamoDB!');
                await carregarProdutos();
                renderizarProdutosAdmin();
            } else {
                throw new Error('Erro ao excluir produto');
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            alert('Erro ao excluir produto: ' + error.message);
        }
    }
}

function openProductModal() {
    // Limpar formulário
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    
    // Limpar preview de imagem
    document.getElementById('image-preview').innerHTML = '';
    
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Salvar produto (novo ou editado)
async function salvarProduto(event) {
    event.preventDefault();
    
    // Mostrar mensagem de processamento
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
    submitBtn.disabled = true;
    
    try {
        const id = document.getElementById('product-id').value;
        const produtoData = {
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            slogan: document.getElementById('product-slogan').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            active: true
        };
        
        // Verificar se há imagens selecionadas (sempre PNG)
        if (window.currentProductImages && window.currentProductImages.length > 0) {
            try {
                // Gerar ID do produto para nomes das imagens
                const productId = id || (Math.max(...produtos.map(p => p.id), 0) + 1);
                
                // Upload da imagem principal para S3
                const mainImageName = `${productId}.1.png`;
                const mainImageUrl = await window.s3Uploader.uploadImage(
                    window.currentProductImages[0], 
                    mainImageName
                );
                produtoData.image = mainImageUrl;
                
                // Upload das imagens adicionais para S3
                if (window.currentProductImages.length > 1) {
                    produtoData.additionalImages = [];
                    for (let i = 1; i < window.currentProductImages.length; i++) {
                        const additionalImageName = `${productId}.${i + 1}.png`;
                        const additionalImageUrl = await window.s3Uploader.uploadImage(
                            window.currentProductImages[i],
                            additionalImageName
                        );
                        produtoData.additionalImages.push(additionalImageUrl);
                    }
                }
                
                console.log(`📸 ${window.currentProductImages.length} imagens enviadas para S3`);
            } catch (uploadError) {
                console.error('Erro no upload de imagens:', uploadError);
                throw new Error('Falha ao enviar imagens para S3: ' + uploadError.message);
            }
        }
        
        try {
            // Salvar produto no DynamoDB via API
            if (id) {
                // Editar produto existente
                const produtoCompleto = { id: parseInt(id), ...produtoData };
                if (!produtoData.image) {
                    const produtoExistente = produtos.find(p => p.id == id);
                    if (produtoExistente) produtoCompleto.image = produtoExistente.image;
                }
                
                const response = await fetch(`https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produtoCompleto)
                });
                
                if (!response.ok) throw new Error('Erro ao atualizar produto no DynamoDB');
                
                console.log('✅ Produto atualizado no DynamoDB');
                alert('Produto atualizado com sucesso!');
            } else {
                // Novo produto
                const novoId = Math.max(...produtos.map(p => p.id), 0) + 1;
                const novoProduto = {
                    id: novoId,
                    ...produtoData
                };
                
                const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoProduto)
                });
                
                if (!response.ok) throw new Error('Erro ao adicionar produto no DynamoDB');
                
                console.log('✅ Produto adicionado ao DynamoDB');
                alert('Produto adicionado com sucesso!');
            }
            
            // Recarregar lista e fechar modal
            await carregarProdutos();
            renderizarProdutosAdmin();
            closeProductModal();
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto: ' + error.message);
        }
        
    } finally {
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Função para preview de múltiplas imagens com conversão para PNG
function setupImagePreview() {
    const imageInput = document.getElementById('product-images');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(event) {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;
            processarArquivos(files);
        });
    }
}

// Converter qualquer imagem para PNG padronizado
function convertToPNG(file, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // Definir tamanho padrão (máximo 800x600 para otimizar)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Fundo branco para transparências
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Desenhar imagem
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para PNG
        const pngDataUrl = canvas.toDataURL('image/png', 0.9);
        const filename = file.name.replace(/\.[^/.]+$/, '') + '.png';
        
        callback(pngDataUrl, filename);
    };
    
    img.src = URL.createObjectURL(file);
}

function salvarProdutosDefinitivo() {
    const data = {
        products: produtos,
        lastUpdate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Salvar no localStorage
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
    
    // Download do JSON atualizado
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Baixar imagens convertidas se houver
    baixarImagensConvertidas();
    
    alert('Produtos salvos! JSON e imagens PNG baixados. Substitua os arquivos na pasta do projeto.');
}

// Baixar todas as imagens convertidas como PNG
function baixarImagensConvertidas() {
    produtos.forEach(produto => {
        // Baixar imagem principal
        if (produto.imageData && produto.imageData.startsWith('data:image')) {
            baixarImagemPNG(produto.imageData, `${produto.id}.1.png`);
        }
        
        // Baixar imagens adicionais
        if (produto.additionalImages && Array.isArray(produto.additionalImages)) {
            produto.additionalImages.forEach((imageData, index) => {
                if (imageData && imageData.startsWith('data:image')) {
                    baixarImagemPNG(imageData, `${produto.id}.${index + 2}.png`);
                }
            });
        }
    });
}

// Função auxiliar para baixar imagem PNG
function baixarImagemPNG(imageData, filename) {
    const base64Data = imageData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`📥 Baixando: ${filename}`);
}

function exportData() {
    const data = {
        products: produtos,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-produtos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Backup exportado com sucesso!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.products) {
                produtos = data.products;
                renderizarProdutosAdmin();
                alert('Dados importados com sucesso!');
            }
        } catch (error) {
            alert('Erro ao importar dados: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Tornar funções globais
window.renderizarProdutosAdmin = renderizarProdutosAdmin;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.salvarProduto = salvarProduto;
window.setupImagePreview = setupImagePreview;
window.setupDragDrop = setupDragDrop;
window.processarArquivos = processarArquivos;
window.convertToPNG = convertToPNG;
window.baixarImagemPNG = baixarImagemPNG;
window.baixarImagensConvertidas = baixarImagensConvertidas;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;
window.exportData = exportData;
window.importData = importData;

// Setup drag & drop
function setupDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        
        const files = Array.from(e.dataTransfer.files);
        processarArquivos(files);
    });
}

// Processar arquivos (drag & drop ou seleção)
function processarArquivos(files) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';
    window.currentProductImages = [];
    
    files.forEach((file, index) => {
        // Validação rigorosa
        const formatosPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!formatosPermitidos.includes(file.type)) {
            alert(`❌ Formato rejeitado: ${file.name}\n\nApenas PNG, JPG e JPEG!`);
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert(`❌ Arquivo muito grande: ${file.name}\n\nMáximo: 5MB`);
            return;
        }
        
        // Converter para PNG
        convertToPNG(file, function(pngDataUrl, filename) {
            window.currentProductImages.push(pngDataUrl);
            
            const imageDiv = document.createElement('div');
            imageDiv.className = 'relative inline-block mr-2 mb-2';
            imageDiv.innerHTML = `
                <img src="${pngDataUrl}" alt="Preview ${index + 1}" class="w-24 h-24 object-cover rounded border-2 border-green-500">
                <div class="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl">${index + 1}</div>
                <div class="absolute bottom-0 left-0 bg-black bg-opacity-75 text-white text-xs px-1">PNG</div>
                ${index === 0 ? '<div class="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-br">Principal</div>' : ''}
            `;
            imagePreview.appendChild(imageDiv);
        });
    });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderizarProdutosAdmin();
        document.getElementById('product-form').addEventListener('submit', salvarProduto);
        setupImagePreview();
        setupDragDrop();
    });
} else {
    renderizarProdutosAdmin();
    document.getElementById('product-form').addEventListener('submit', salvarProduto);
    setupImagePreview();
    setupDragDrop();
}

console.log('✅ Admin simples carregado');