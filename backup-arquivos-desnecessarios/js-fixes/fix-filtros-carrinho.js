// Correção Específica: Filtros e Carrinho
// Data: 20/08/2025 - Correção dos problemas identificados

console.log('🔧 Carregando correção de filtros e carrinho...');

// ==================== SISTEMA DE FILTROS CORRIGIDO ====================

// Função global de filtros (substitui todas as outras)
window.filterProducts = function(category) {
    console.log('🔍 FILTRO ATIVO:', category);
    
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.error('❌ Grid não encontrado');
        return;
    }
    
    const allCards = grid.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    allCards.forEach(card => {
        const button = card.querySelector('.detail-btn');
        const productId = button ? parseInt(button.getAttribute('data-id')) : null;
        
        if (!productId) {
            card.style.display = 'none';
            return;
        }
        
        // Buscar produto nos dados carregados
        const product = window.produtos ? window.produtos.find(p => p.id === productId) : null;
        
        if (!product) {
            card.style.display = 'none';
            return;
        }
        
        let shouldShow = false;
        
        switch(category) {
            case 'all':
                shouldShow = true;
                break;
            case 'granja':
                shouldShow = ['fertilizantes', 'aves', 'ovos'].includes(product.category);
                break;
            case 'parceiros':
                shouldShow = ['parceiros', 'mel', 'laticinios', 'outros-parceiros'].includes(product.category);
                break;
            case 'fertilizantes':
            case 'aves':
            case 'ovos':
            case 'mel':
            case 'laticinios':
            case 'outros-parceiros':
                shouldShow = product.category === category;
                break;
            default:
                shouldShow = product.category === category;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`✅ Filtro aplicado: ${visibleCount} produtos visíveis de ${allCards.length}`);
    
    // Bloquear outros sistemas por 5 segundos
    window.filterLocked = true;
    setTimeout(() => {
        window.filterLocked = false;
    }, 5000);
};

// Função para definir botão ativo
window.setActiveButton = function(button) {
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    console.log('🎯 Botão ativo:', button?.textContent?.trim());
};

// ==================== SISTEMA DE CARRINHO CORRIGIDO ====================

// Carrinho global
window.carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(produto) {
    if (!produto) {
        console.error('❌ Produto inválido para adicionar ao carrinho');
        return;
    }
    
    window.carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(window.carrinho));
    updateCartDisplay();
    
    console.log('✅ Produto adicionado ao carrinho:', produto.name);
    
    // Mostrar notificação visual
    if (window.showCartNotification) {
        window.showCartNotification(`${produto.name} adicionado ao carrinho!`);
    }
};

// Função para mostrar notificação do carrinho
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Tornar função global
window.showCartNotification = showCartNotification;

// Atualizar display do carrinho
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-display');
    
    if (cartCount) cartCount.textContent = window.carrinho.length;
    
    if (cartTotal) {
        const total = window.carrinho.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Atualizar modal do carrinho
window.updateCartModal = function() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartItems) return;
    
    if (window.carrinho.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
        if (cartTotalEl) cartTotalEl.textContent = 'R$ 0,00';
        return;
    }
    
    const total = window.carrinho.reduce((sum, item) => sum + item.price, 0);
    
    cartItems.innerHTML = window.carrinho.map((item, index) => `
        <div class="flex justify-between items-center py-2 border-b">
            <div>
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-600">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removerDoCarrinho(${index})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    if (cartSubtotal) cartSubtotal.textContent = `R$ ${total.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `R$ ${total.toFixed(2)}`;
};

// Remover do carrinho
window.removerDoCarrinho = function(index) {
    window.carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(window.carrinho));
    updateCartDisplay();
    updateCartModal();
};

// Mostrar notificação do carrinho
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==================== CORREÇÃO DOS EVENT LISTENERS ====================

// Event listener principal para botões de comprar
document.addEventListener('click', function(e) {
    // Verificar se clicou em botão de comprar
    const button = e.target.closest('.detail-btn');
    if (button) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = parseInt(button.getAttribute('data-id'));
        console.log('🛒 Botão comprar clicado, ID:', productId);
        
        // Encontrar produto
        const product = window.produtos ? window.produtos.find(p => p.id === productId) : null;
        
        if (product) {
            // Abrir modal de detalhes do produto
            if (window.openProductModal) {
                window.openProductModal(productId);
            } else {
                // Fallback: adicionar direto ao carrinho
                window.adicionarAoCarrinho(product);
            }
        } else {
            console.error('❌ Produto não encontrado:', productId);
            alert('Produto não encontrado!');
        }
    }
    
    // CORREÇÃO: Botão adicionar ao carrinho no modal
    if (e.target && (e.target.id === 'add-to-cart-modal' || e.target.closest('#add-to-cart-modal'))) {
        console.log('🛒 Botão adicionar ao carrinho no modal clicado!');
        
        const modal = document.getElementById('product-modal');
        if (modal && !modal.classList.contains('hidden')) {
            const qtyInput = modal.querySelector('#product-quantity');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
            
            const productTitle = modal.querySelector('#modal-product-title');
            if (productTitle) {
                const productName = productTitle.textContent;
                const product = window.produtos ? window.produtos.find(p => p.name === productName) : null;
                
                if (product) {
                    for (let i = 0; i < quantity; i++) {
                        window.adicionarAoCarrinho(product);
                    }
                    
                    // Fechar modal
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                    
                    console.log(`✅ ${quantity}x ${product.name} adicionado(s) ao carrinho`);
                } else {
                    console.error('❌ Produto não encontrado no modal');
                }
            }
        }
    }
});

// ==================== INICIALIZAÇÃO ====================

// Aguardar DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando correção de filtros e carrinho...');
    
    // Atualizar display do carrinho
    updateCartDisplay();
    
    // Aplicar filtro "todos" após 1 segundo
    setTimeout(() => {
        if (window.filterProducts) {
            window.filterProducts('all');
        }
    }, 1000);
    
    console.log('✅ Correção de filtros e carrinho inicializada');
});

// Executar imediatamente se DOM já estiver pronto
if (document.readyState !== 'loading') {
    updateCartDisplay();
    setTimeout(() => {
        if (window.filterProducts) {
            window.filterProducts('all');
        }
    }, 1000);
}

console.log('✅ Correção de filtros e carrinho carregada');