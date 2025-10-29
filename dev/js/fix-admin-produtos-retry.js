// Admin simples para gerenciar produtos
console.log('🔧 Carregando admin simples...');

let produtos = [];
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

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
            retryCount = 0; // Resetar contador de tentativas
            
            // Debug dos produtos carregados
            if (produtos.length > 0) {
                console.log('Primeiros produtos:');
                produtos.slice(0, 3).forEach((p, i) => {
                    console.log(`  ${i + 1}. ${p.name} - R$ ${p.price}`);
                });
            }
        } else {
            console.error(`❌ API retornou status ${response.status}`);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`🔄 Tentativa ${retryCount} de ${MAX_RETRIES}...`);
                setTimeout(carregarProdutos, RETRY_DELAY);
                return [];
            } else {
                console.error('❌ Número máximo de tentativas atingido');
                return [];
            }
        }
        
        return produtos;
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`🔄 Tentativa ${retryCount} de ${MAX_RETRIES}...`);
            setTimeout(carregarProdutos, RETRY_DELAY);
            return [];
        } else {
            console.error('❌ Número máximo de tentativas atingido');
            return [];
        }
    }
}

// Renderizar produtos na tabela admin
async function renderizarProdutosAdmin() {
    await carregarProdutos();
    
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    if (produtos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    Carregando produtos...
                </td>
            </tr>
        `;
        return;
    }
    
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

[... resto do código permanece igual ...]