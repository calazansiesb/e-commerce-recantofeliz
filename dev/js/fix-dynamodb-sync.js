// Correção para sincronização Admin <-> DynamoDB
console.log('🔧 Carregando correção DynamoDB...');

// Sobrescrever função de salvar produto para usar API
window.salvarProdutoOriginal = window.salvarProduto;

window.salvarProduto = async function(event) {
    event.preventDefault();
    
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
    
    // Verificar se há imagens selecionadas
    if (window.currentProductImages && window.currentProductImages.length > 0) {
        produtoData.image = window.currentProductImages[0];
        if (window.currentProductImages.length > 1) {
            produtoData.additionalImages = window.currentProductImages.slice(1);
        }
    }
    
    try {
        if (id) {
            // Editar produto existente via API
            console.log('📝 Atualizando produto via API:', id);
            await window.granjaAPI.updateProduto(id, produtoData);
            alert('Produto atualizado com sucesso!');
        } else {
            // Novo produto via API
            console.log('➕ Criando produto via API');
            const novoId = Date.now(); // ID temporário
            produtoData.id = novoId;
            
            await window.granjaAPI.createProduto(produtoData);
            alert('Produto adicionado com sucesso!');
        }
        
        // Recarregar lista de produtos
        await window.renderizarProdutosAdmin();
        window.closeProductModal();
        
        // Baixar imagens se houver
        if (produtoData.image || produtoData.additionalImages) {
            setTimeout(() => {
                const productId = id || novoId;
                
                if (produtoData.image) {
                    window.baixarImagemPNG(produtoData.image, `${productId}.1.png`);
                }
                
                if (produtoData.additionalImages) {
                    produtoData.additionalImages.forEach((imageData, index) => {
                        window.baixarImagemPNG(imageData, `${productId}.${index + 2}.png`);
                    });
                }
                
                alert(`📸 ${1 + (produtoData.additionalImages?.length || 0)} imagens PNG baixadas! Coloque-as na pasta imagens/produtos/`);
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Erro ao salvar produto:', error);
        alert('Erro ao salvar produto: ' + error.message);
        
        // Fallback: salvar localmente se API falhar
        console.log('🔄 Tentando salvar localmente como fallback...');
        if (window.salvarProdutoOriginal) {
            window.salvarProdutoOriginal(event);
        }
    }
};

// Sobrescrever função de carregar produtos para usar API
window.renderizarProdutosAdminOriginal = window.renderizarProdutosAdmin;

window.renderizarProdutosAdmin = async function() {
    try {
        console.log('📦 Carregando produtos via API...');
        
        // Tentar carregar da API primeiro
        const data = await window.granjaAPI.getProdutos();
        const produtos = data.products || [];
        
        console.log(`✅ ${produtos.length} produtos carregados da API`);
        
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;
        
        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                        <i class="fas fa-box-open text-4xl mb-4 block"></i>
                        <p class="text-lg font-medium">Nenhum produto encontrado</p>
                        <p class="text-sm">Adicione produtos usando o botão "Novo Produto"</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = produtos.map(produto => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">${produto.id}</td>
                <td class="px-4 py-3">
                    <img src="${produto.image}" alt="${produto.name}" class="w-12 h-12 object-cover rounded" onerror="this.src='imagens/produtos/default/placeholder.png'">
                </td>
                <td class="px-4 py-3 font-medium">${produto.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${produto.category}</span>
                </td>
                <td class="px-4 py-3 font-bold text-green-600">R$ ${produto.price.toFixed(2)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 ${produto.stock > 10 ? 'bg-green-100 text-green-800' : produto.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded-full text-xs">
                        ${produto.stock || 0}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="excluirProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos da API:', error);
        console.log('🔄 Tentando carregar produtos locais como fallback...');
        
        // Fallback: usar função original se API falhar
        if (window.renderizarProdutosAdminOriginal) {
            window.renderizarProdutosAdminOriginal();
        } else {
            const tbody = document.getElementById('products-table-body');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="px-4 py-8 text-center text-red-500">
                            <i class="fas fa-exclamation-triangle text-4xl mb-4 block"></i>
                            <p class="text-lg font-medium">Erro ao carregar produtos</p>
                            <p class="text-sm">Verifique a conexão com a API</p>
                            <button onclick="window.renderizarProdutosAdmin()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                <i class="fas fa-sync mr-2"></i>Tentar Novamente
                            </button>
                        </td>
                    </tr>
                `;
            }
        }
    }
};

// Sobrescrever função de excluir produto para usar API
window.excluirProdutoOriginal = window.excluirProduto;

window.excluirProduto = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        console.log('🗑️ Excluindo produto via API:', id);
        await window.granjaAPI.deleteProduto(id);
        alert('Produto excluído com sucesso!');
        await window.renderizarProdutosAdmin();
        
    } catch (error) {
        console.error('❌ Erro ao excluir produto:', error);
        alert('Erro ao excluir produto: ' + error.message);
        
        // Fallback: excluir localmente se API falhar
        console.log('🔄 Tentando excluir localmente como fallback...');
        if (window.excluirProdutoOriginal) {
            window.excluirProdutoOriginal(id);
        }
    }
};

// Sobrescrever função de editar produto para usar API
window.editarProdutoOriginal = window.editarProduto;

window.editarProduto = async function(id) {
    try {
        console.log('📝 Carregando produto para edição via API:', id);
        const produto = await window.granjaAPI.getProduto(id);
        
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
        
    } catch (error) {
        console.error('❌ Erro ao carregar produto para edição:', error);
        alert('Erro ao carregar produto: ' + error.message);
        
        // Fallback: usar função original se API falhar
        if (window.editarProdutoOriginal) {
            window.editarProdutoOriginal(id);
        }
    }
};

// Função para sincronizar produtos locais com DynamoDB
window.sincronizarComDynamoDB = async function() {
    try {
        console.log('🔄 Iniciando sincronização com DynamoDB...');
        
        // Obter produtos locais
        const produtosLocais = JSON.parse(localStorage.getItem('granjaRecantoFelizData') || '{}').products || [];
        
        if (produtosLocais.length === 0) {
            alert('Nenhum produto local para sincronizar');
            return;
        }
        
        let sucessos = 0;
        let erros = 0;
        
        for (const produto of produtosLocais) {
            try {
                await window.granjaAPI.createProduto(produto);
                sucessos++;
                console.log(`✅ Produto ${produto.name} sincronizado`);
            } catch (error) {
                erros++;
                console.error(`❌ Erro ao sincronizar ${produto.name}:`, error);
            }
        }
        
        alert(`Sincronização concluída!\n✅ Sucessos: ${sucessos}\n❌ Erros: ${erros}`);
        
        // Recarregar produtos
        await window.renderizarProdutosAdmin();
        
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
        alert('Erro na sincronização: ' + error.message);
    }
};

// Função para verificar status da API
window.verificarStatusAPI = async function() {
    try {
        console.log('🔍 Verificando status da API...');
        const data = await window.granjaAPI.getProdutos();
        const produtos = data.products || [];
        
        alert(`✅ API funcionando!\n📦 ${produtos.length} produtos encontrados no DynamoDB`);
        
        return true;
    } catch (error) {
        console.error('❌ API não está funcionando:', error);
        alert(`❌ API não está funcionando:\n${error.message}\n\nVerifique:\n- Conexão com internet\n- Configuração da API Gateway\n- Permissões do DynamoDB`);
        
        return false;
    }
};

// Adicionar botões de diagnóstico no admin
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const produtosSection = document.querySelector('#produtos-section .flex.justify-between');
        if (produtosSection) {
            const diagnosticButtons = document.createElement('div');
            diagnosticButtons.className = 'flex space-x-2 ml-4';
            diagnosticButtons.innerHTML = `
                <button onclick="verificarStatusAPI()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    <i class="fas fa-heartbeat mr-2"></i>Status API
                </button>
                <button onclick="sincronizarComDynamoDB()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    <i class="fas fa-sync mr-2"></i>Sincronizar
                </button>
            `;
            produtosSection.appendChild(diagnosticButtons);
        }
    }, 2000);
});

console.log('✅ Correção DynamoDB carregada');