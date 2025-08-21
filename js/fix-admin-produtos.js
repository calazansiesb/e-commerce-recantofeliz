// Correção mínima para exibir produtos no admin
console.log('🔧 Carregando produtos no admin...');

const produtos = [
    { id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Mais do que Adubo: um substrato vivo e completo.", description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.", price: 40.00, image: "imagens/produtos/1/1.png", stock: 25, active: true },
    { id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo de galinha líquido e potente.", description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas. Ideal para hortas, jardins e vasos.", price: 25.00, image: "imagens/produtos/2/1.png", stock: 40, active: true },
    { id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.", price: 18.00, image: "imagens/produtos/3/1.jpeg", stock: 120, active: true },
    { id: 4, name: "Ovos Caipira 20", category: "ovos", slogan: "20 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.", price: 30.00, image: "imagens/produtos/4/1.jpeg", stock: 80, active: true },
    { id: 5, name: "Ovos Caipira 30", category: "ovos", slogan: "30 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.", price: 45.00, image: "imagens/produtos/5/1.png", stock: 50, active: true },
    { id: 6, name: "Galinha Caipira Picada", category: "aves", slogan: "Galinha caipira cortada, pronta para cozinhar.", description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.", price: 60.00, image: "imagens/produtos/6/1.png", stock: 15, active: true },
    { id: 7, name: "Galinha Caipira Inteira", category: "aves", slogan: "Galinha caipira inteira, fresca e saborosa.", description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.", price: 110.00, image: "imagens/produtos/7/1.png", stock: 8, active: true }
];

function renderizarProdutosAdmin() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = produtos.map(p => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">${p.id}</td>
            <td class="px-4 py-3">
                <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="px-4 py-3 font-medium">${p.name}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${p.category}</span>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">R$ ${p.price.toFixed(2)}</td>
            <td class="px-4 py-3">${p.stock}</td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    <button onclick="editarProduto(${p.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="excluirProduto(${p.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${produtos.length} produtos exibidos no admin`);
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    document.getElementById('product-id').value = produto.id;
    document.getElementById('product-name').value = produto.name;
    document.getElementById('product-category').value = produto.category;
    document.getElementById('product-slogan').value = produto.slogan;
    document.getElementById('product-description').value = produto.description || '';
    document.getElementById('product-price').value = produto.price;
    document.getElementById('product-stock').value = produto.stock;
    
    document.getElementById('modal-title').textContent = 'Editar Produto';
    document.getElementById('product-modal').classList.remove('hidden');
}

function excluirProduto(id) {
    if (confirm(`Excluir produto ${id}?`)) {
        const index = produtos.findIndex(p => p.id === id);
        if (index > -1) {
            produtos.splice(index, 1);
            renderizarProdutosAdmin();
            alert('Produto excluído!');
        }
    }
}

function openProductModal() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Salvar produto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            if (id) {
                // Editar produto existente
                const produto = produtos.find(p => p.id == id);
                if (produto) {
                    Object.assign(produto, produtoData);
                    alert('Produto atualizado!');
                }
            } else {
                // Novo produto
                const novoId = Math.max(...produtos.map(p => p.id)) + 1;
                produtos.push({
                    id: novoId,
                    image: `imagens/produtos/${novoId}/1.png`,
                    ...produtoData
                });
                alert('Produto adicionado!');
            }
            
            renderizarProdutosAdmin();
            closeProductModal();
        });
    }
});

function salvarProdutosDefinitivo() {
    const dadosParaSalvar = {
        products: produtos,
        lastUpdate: new Date().toISOString(),
        version: "1.0"
    };
    
    const dataStr = JSON.stringify(dadosParaSalvar, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'produtos.json';
    
    const instrucoes = `Para tornar as alterações DEFINITIVAS:

1. Um arquivo 'produtos.json' será baixado
2. Substitua o arquivo em 'src/data/produtos.json'
3. As alterações ficarão permanentes

Baixar arquivo agora?`;
    
    if (confirm(instrucoes)) {
        link.click();
        alert('✅ Arquivo baixado! Substitua o arquivo em src/data/produtos.json');
    }
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarProdutosAdmin);
} else {
    renderizarProdutosAdmin();
}

// Tornar funções globais
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;