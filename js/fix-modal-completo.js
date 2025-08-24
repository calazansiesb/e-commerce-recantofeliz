// Correção Completa do Modal
console.log('🔧 Correção completa do modal...');

const originalOpenModal = window.openProductModal;

window.openProductModal = function(productId) {
    console.log('🔄 Abrindo modal:', productId);
    
    const product = window.produtos ? window.produtos.find(p => p.id == productId) : null;
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('#modal-content-grid');
    
    if (modalContent) {
        // Substituir todo o conteúdo do modal
        modalContent.innerHTML = `
            <div class="p-6">
                <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover rounded-lg">
            </div>
            <div class="p-6">
                <h3 class="text-3xl font-bold mb-4 font-lora text-[#5D4037]">${product.name}</h3>
                <p class="text-gray-600 mb-6">${product.slogan}</p>
                <span class="text-2xl font-bold text-[#5D4037] mb-6 block">R$ ${product.price.toFixed(2)}</span>
                
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Quantidade:</label>
                    <div class="flex items-center space-x-3">
                        <button onclick="
                            const qty = document.getElementById('qty-${productId}');
                            const current = parseInt(qty.value) || 1;
                            if (current > 1) qty.value = current - 1;
                        " class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">-</button>
                        
                        <input id="qty-${productId}" type="number" value="1" min="1" max="99" class="w-20 text-center border rounded py-2">
                        
                        <button onclick="
                            const qty = document.getElementById('qty-${productId}');
                            const current = parseInt(qty.value) || 1;
                            qty.value = current + 1;
                        " class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">+</button>
                    </div>
                </div>
                
                <button onclick="
                    const qty = document.getElementById('qty-${productId}').value;
                    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                    for(let i = 0; i < qty; i++) {
                        carrinho.push({id: ${product.id}, name: '${product.name}', price: ${product.price}});
                    }
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    document.getElementById('cart-count').textContent = carrinho.length;
                    const total = carrinho.reduce((s,i) => s + i.price, 0);
                    document.getElementById('cart-total-display').textContent = 'R$ ' + total.toFixed(2);
                    alert('✅ Produto adicionado!');
                    document.getElementById('product-modal').classList.add('hidden');
                    document.getElementById('product-modal').style.display = 'none';
                " class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        
        // Atualizar título
        const title = modal.querySelector('#modal-product-title');
        if (title) title.textContent = product.name;
        
        // Mostrar modal
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        console.log('✅ Modal recriado completamente');
    }
};

console.log('✅ Correção completa carregada');