// Sistema de Carrossel
let currentSlide = 0;
let carouselInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar DataManager carregar
    setTimeout(() => {
        console.log('🔍 Site principal: Verificando DataManager...');
        if (!window.dataManager) {
            console.log('⚠️ DataManager não encontrado, criando nova instância...');
            window.dataManager = new DataManager();
        }
        
        // Verificar dados no localStorage
        const storageData = localStorage.getItem('granjaRecantoFelizData');
        if (storageData) {
            const parsed = JSON.parse(storageData);
            console.log('💾 Site principal: Dados no localStorage:', parsed.products?.length, 'produtos');
            console.log('💰 Primeiro produto no storage:', parsed.products?.[0]);
        }
        
        initCarousel();
        initProducts();
        
        // Verificar mudanças no localStorage periodicamente
        setInterval(() => {
            const currentData = localStorage.getItem('granjaRecantoFelizData');
            if (currentData && window.dataManager) {
                const parsed = JSON.parse(currentData);
                const currentProducts = window.dataManager.getActiveProducts();
                
                // Verificar se precisa atualizar
                if (parsed.products && parsed.products.length > 0) {
                    const firstProductPrice = parsed.products[0].price;
                    const currentFirstPrice = currentProducts[0]?.price;
                    
                    if (firstProductPrice !== currentFirstPrice) {
                        console.log('🔄 Preços diferentes detectados, atualizando...');
                        console.log('Storage:', firstProductPrice, 'vs Atual:', currentFirstPrice);
                        window.dataManager = new DataManager();
                        initProducts();
                    }
                }
            }
        }, 3000);
    }, 100);
});

// Função para adicionar produto ao carrinho (escopo global)
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const existente = carrinho.find(item => item.id === produto.id);
    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.name,
            preco: produto.price,
            quantidade: 1
        });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Produto adicionado ao carrinho!');
}

// Adiciona evento ao botão "Adicionar ao Carrinho" após renderizar produtos
function adicionarEventosCarrinho() {
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Adicionar ao Carrinho')) {
            btn.addEventListener('click', function() {
                const card = btn.closest('div');
                const nome = card.querySelector('h3').textContent;
                const preco = parseFloat(card.querySelector('span').textContent.replace('R$','').replace(',','.'));
                const id = nome.replace(/\s+/g, '-').toLowerCase();
                adicionarAoCarrinho({id, name: nome, price: preco});
            });
        }
    });
}

// Função para solicitar dados complementares
function solicitarDadosComplementares() {
    return new Promise((resolve) => {
        // Criar formulário modal
        const formularioHTML = `
            <div id="modal-dados-cliente" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
                align-items: center; justify-content: center;
            ">
                <div style="
                    background: white; padding: 30px; border-radius: 10px; 
                    max-width: 500px; width: 90%; max-height: 80%; overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                ">
                    <h3 style="margin-bottom: 20px; color: #5D4037; text-align: center;">📦 Dados para Entrega</h3>
                    <form id="form-dados-cliente">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">👤 Nome Completo *</label>
                            <input type="text" id="nome-cliente" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="Digite seu nome completo">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">📱 Telefone para Contato *</label>
                            <input type="tel" id="telefone-cliente" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="(38) 99999-9999">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">📍 Endereço Completo para Entrega *</label>
                            <textarea id="endereco-cliente" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; height: 80px; 
                                resize: vertical; box-sizing: border-box;
                            " placeholder="Rua, número, bairro, cidade, CEP"></textarea>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">🆔 Documento de Identificação *</label>
                            <select id="tipo-documento" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;
                            ">
                                <option value="">Selecione o tipo de documento</option>
                                <option value="CPF">CPF</option>
                                <option value="RG">RG</option>
                                <option value="CNH">CNH</option>
                            </select>
                            <input type="text" id="numero-documento" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="Número do documento">
                        </div>
                        
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button type="button" id="btn-cancelar" style="
                                padding: 12px 24px; background: #ccc; color: #333; 
                                border: none; border-radius: 6px; cursor: pointer;
                                font-size: 14px; font-weight: bold;
                            ">Cancelar</button>
                            <button type="submit" style="
                                padding: 12px 24px; background: #25D366; color: white; 
                                border: none; border-radius: 6px; cursor: pointer;
                                font-size: 14px; font-weight: bold;
                            ">📱 Enviar via WhatsApp</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Adicionar formulário ao DOM
        document.body.insertAdjacentHTML('beforeend', formularioHTML);
        
        // Função para fechar modal
        function fecharModal() {
            const modal = document.getElementById('modal-dados-cliente');
            if (modal) modal.remove();
        }
        
        // Evento para cancelar
        document.getElementById('btn-cancelar').addEventListener('click', () => {
            fecharModal();
            resolve(null);
        });
        
        // Evento para enviar formulário
        document.getElementById('form-dados-cliente').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Coletar dados
            const nome = document.getElementById('nome-cliente').value.trim();
            const telefone = document.getElementById('telefone-cliente').value.trim();
            const endereco = document.getElementById('endereco-cliente').value.trim();
            const tipoDoc = document.getElementById('tipo-documento').value;
            const numeroDoc = document.getElementById('numero-documento').value.trim();
            
            // Validar campos
            if (!nome || !telefone || !endereco || !tipoDoc || !numeroDoc) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Retornar dados
            const dados = {
                nome,
                telefone,
                endereco,
                documento: `${tipoDoc}: ${numeroDoc}`
            };
            
            fecharModal();
            resolve(dados);
        });
        
        // Focar no primeiro campo
        setTimeout(() => {
            document.getElementById('nome-cliente').focus();
        }, 100);
    });
}

// Função para registrar pedido realizado
async function registrarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    // Solicitar dados complementares
    const dadosComplementares = await solicitarDadosComplementares();
    if (!dadosComplementares) {
        return; // Usuário cancelou
    }
    
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    const pedido = {
        data: new Date().toISOString(),
        itens: carrinho,
        total,
        cliente: dadosComplementares
    };
    
    // Salva pedido em localStorage (simulação)
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    // Gerar mensagem para WhatsApp
    let mensagem = `🛒 *PEDIDO RECANTO FELIZ*\n\n`;
    mensagem += `👤 *Cliente:* ${dadosComplementares.nome}\n`;
    mensagem += `📱 *Telefone:* ${dadosComplementares.telefone}\n`;
    mensagem += `📍 *Endereço:* ${dadosComplementares.endereco}\n`;
    mensagem += `🆔 *Documento:* ${dadosComplementares.documento}\n\n`;
    mensagem += `📦 *ITENS DO PEDIDO:*\n`;
    carrinho.forEach(item => {
        mensagem += `• ${item.nome}: ${item.quantidade}x R$${item.preco.toFixed(2)} = R$${(item.quantidade * item.preco).toFixed(2)}\n`;
    });
    mensagem += `\n💰 *TOTAL: R$${total.toFixed(2)}*\n`;
    mensagem += `📦 *Total de itens:* ${carrinho.length}`;
    
    // Abrir WhatsApp com mensagem
    const numeroWhatsApp = '5538999247376';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Limpa carrinho após registrar
    localStorage.removeItem('carrinho');
    alert('Pedido enviado via WhatsApp! Aguarde o contato para confirmação.');
    
    // Atualizar exibição do carrinho
    if (window.location.pathname.endsWith('carrinho.html')) {
        location.reload();
    }
}

// Adiciona botão e evento para registrar pedido na página do carrinho
if (window.location.pathname.endsWith('carrinho.html')) {
    function exibirCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const container = document.getElementById('carrinho-itens');
        
        if (carrinho.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }
        
        let total = 0;
        let html = '<div class="carrinho-lista">';
        
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            html += `
                <div class="item-carrinho" style="border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:8px;">
                    <h4>${item.nome}</h4>
                    <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                    <p><strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong></p>
                    <button onclick="removerDoCarrinho('${item.id}')" style="background:#f44336;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Remover</button>
                </div>
            `;
        });
        
        html += `</div>
            <div class="total-carrinho" style="margin:20px 0; padding:15px; background:#f5f5f5; border-radius:8px;">
                <h3>Total: R$ ${total.toFixed(2)}</h3>
                <p>Itens: ${carrinho.length}</p>
            </div>`;
        
        container.innerHTML = html;
    }
    
    // Função para remover item do carrinho
    window.removerDoCarrinho = function(id) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(item => item.id !== id);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        exibirCarrinho();
    };
    
    window.addEventListener('DOMContentLoaded', function() {
        exibirCarrinho();
        const btn = document.createElement('button');
        btn.textContent = 'Enviar Pedido via WhatsApp';
        btn.style = 'margin:20px;padding:10px 20px;background:#25D366;color:#fff;font-size:18px;border:none;border-radius:8px;cursor:pointer;';
        btn.onclick = registrarPedido;
        document.getElementById('carrinho-itens').appendChild(btn);
    });
}

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (!slides.length) {
        console.log('Nenhum slide encontrado');
        return;
    }
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play
    carouselInterval = setInterval(nextSlide, 5000);
    
    // Pausar auto-play ao passar o mouse
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Mostrar primeiro slide
    showSlide(0);
}

// Sistema de Produtos
function initProducts() {
    // Garantir que está usando os mesmos dados do admin
    const products = window.dataManager ? window.dataManager.getActiveProducts() : [];
    console.log('🔍 Site principal carregando produtos:', products.length);
    console.log('📊 Primeiro produto:', products[0]);
    const productGrid = document.getElementById('product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productGrid) return;
    
    console.log('Inicializando produtos:', products.length);
    
    // Renderizar produtos
    function renderProducts(filter = 'all') {
        productGrid.innerHTML = '';
        let filtered = products;
        
        if (filter !== 'all') {
            if (filter === 'granja') {
                filtered = products.filter(p => p.category !== 'parceiros');
            } else {
                filtered = products.filter(p => p.category === filter);
            }
        }
        
        filtered.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="imagens/produtos/${product.id}/1.png" alt="${product.name}" onerror="this.src='imagens/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                    <button class="btn-ver-detalhes" data-id="${product.id}">Ver Detalhes</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.getAttribute('data-filter'));
        });
    });
    
    // Ver detalhes do produto
    productGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-ver-detalhes')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            openProductModal(productId);
        }
    });
    
    // Renderizar todos os produtos inicialmente
    renderProducts('all');
    
    // Adicionar eventos do carrinho após renderizar produtos
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            adicionarEventosCarrinho();
        }, 500);
    }
    
    // Debug: Verificar se os dados estão corretos
    console.log('🔍 Produtos renderizados no site:', products.map(p => ({ id: p.id, name: p.name, price: p.price })));
}

// Função para abrir modal de detalhes do produto
function openProductModal(productId) {
    const products = window.dataManager ? window.dataManager.getActiveProducts() : [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    // Descobrir imagens do produto
    discoverProductImages(productId).then(gallery => {
        const productModal = document.getElementById('product-modal');
        const modalContent = productModal.querySelector('#modal-content-grid');
        
        // Criar conteúdo do modal
        modalContent.innerHTML = `
            <div class="p-6 relative">
                <div id="carousel-container" class="relative overflow-hidden rounded-lg">
                    <div id="carousel-track" class="flex transition-transform duration-300 ease-in-out">
                        ${gallery.map((imgSrc, index) => `
                            <div class="w-full flex-shrink-0">
                                <img src="${imgSrc}" alt="${product.name} - ${index + 1}" class="w-full h-80 object-cover">
                            </div>
                        `).join('')}
                    </div>
                    ${gallery.length > 1 ? `
                        <button id="prev-btn" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button id="next-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            ${gallery.map((_, index) => `
                                <div class="carousel-dot w-2 h-2 rounded-full bg-white/50 cursor-pointer hover:bg-white transition" data-index="${index}"></div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="p-6 flex flex-col">
                <h3 class="text-3xl font-bold mb-4 font-lora text-[#5D4037]">${product.name}</h3>
                ${product.partner ? `
                    <div class="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                        <h4 class="font-bold text-blue-700 mb-2 flex items-center">
                            <i class="fas fa-handshake mr-2"></i> Produzido por Parceiro
                        </h4>
                        <div class="text-sm text-blue-600">
                            <p><strong>Produtor:</strong> ${product.partner.producer}</p>
                            <p><strong>Local:</strong> ${product.partner.location}</p>
                            <p><strong>Sobre:</strong> ${product.partner.description}</p>
                        </div>
                    </div>
                ` : ''}
                <p class="text-gray-600 mb-6 leading-relaxed flex-grow">${product.description}</p>
                <span class="text-2xl font-bold text-[#5D4037] mb-6 block">R$ ${product.price.toFixed(2)}</span>
                <button id="btn-add-carrinho" class="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                    <i class="fas fa-cart-plus mr-2"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        
        // Corrigir botão Adicionar ao Carrinho no modal
        const btnAdd = modalContent.querySelector('#btn-add-carrinho');
        if (btnAdd) {
            btnAdd.addEventListener('click', function() {
                const id = product.id || product.name.replace(/\s+/g, '-').toLowerCase();
                adicionarAoCarrinho({id, name: product.name, price: product.price});
            });
        }
        
        // Implementar carrossel de imagens
        let currentIndex = 0;
        const track = modalContent.querySelector('#carousel-track');
        const dots = modalContent.querySelectorAll('.carousel-dot');
        const prevBtn = modalContent.querySelector('#prev-btn');
        const nextBtn = modalContent.querySelector('#next-btn');
        
        function updateCarousel() {
            if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-white', index === currentIndex);
                dot.classList.toggle('bg-white/50', index !== currentIndex);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1;
                updateCarousel();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        updateCarousel();
        productModal.classList.remove('hidden');
        productModal.style.display = 'flex';
    });
}

// Função para descobrir imagens do produto
async function discoverProductImages(productId) {
    const gallery = [];
    const extensions = ['png', 'jpeg', 'jpg'];
    
    for (let i = 1; i <= 10; i++) {
        let foundImage = false;
        
        for (const ext of extensions) {
            const imagePath = `imagens/produtos/${productId}/${i}.${ext}`;
            
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        gallery.push(imagePath);
                        foundImage = true;
                        resolve();
                    };
                    img.onerror = () => reject();
                    img.src = imagePath;
                });
                break;
            } catch (error) {
                continue;
            }
        }
        
        if (!foundImage) break;
    }
    
    // Se não encontrar nenhuma imagem, usar placeholder
    if (gallery.length === 0) {
        gallery.push('imagens/placeholder.jpg');
    }
    
    return gallery;
}

// Modal de produto
const productModal = document.getElementById('product-modal');
if (productModal) {
    const closeBtn = productModal.querySelector('[data-modal-hide="product-modal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            productModal.classList.add('hidden');
            productModal.style.display = 'none';
        });
    }
    
    // Fechar modal clicando fora
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
            productModal.style.display = 'none';
        }
    });
}

// Verificar se DataManager está disponível periodicamente
setInterval(() => {
    if (window.dataManager && document.getElementById('product-grid')) {
        initProducts();
    }
}, 1000);

console.log('📱 Scripts.js carregado - Sistema de carrinho e pedidos implementado!');
