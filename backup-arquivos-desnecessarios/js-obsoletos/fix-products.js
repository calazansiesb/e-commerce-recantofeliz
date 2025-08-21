// Correção imediata - produtos funcionando
const produtos = [
    {id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", price: 40.00, stock: 25, slogan: "Mais do que Adubo: um substrato vivo e completo.", description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.", image: "imagens/produtos/1/1.png", active: true},
    {id: 2, name: "FertiGota", category: "fertilizantes", price: 25.00, stock: 40, slogan: "Adubo de galinha líquido e potente.", description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.", image: "imagens/produtos/2/1.png", active: true},
    {id: 3, name: "Ovos Caipira 10", category: "ovos", price: 18.00, stock: 120, slogan: "10 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.", image: "imagens/produtos/3/1.jpeg", active: true},
    {id: 4, name: "Ovos Caipira 20", category: "ovos", price: 30.00, stock: 80, slogan: "20 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.", image: "imagens/produtos/4/1.jpeg", active: true},
    {id: 5, name: "Ovos Caipira 30", category: "ovos", price: 45.00, stock: 50, slogan: "30 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.", image: "imagens/produtos/5/1.png", active: true},
    {id: 6, name: "Galinha Caipira Picada", category: "aves", price: 60.00, stock: 15, slogan: "Galinha caipira cortada, pronta para cozinhar.", description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.", image: "imagens/produtos/6/1.png", active: true},
    {id: 7, name: "Galinha Caipira Inteira", category: "aves", price: 110.00, stock: 8, slogan: "Galinha caipira inteira, fresca e saborosa.", description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.", image: "imagens/produtos/7/1.png", active: true}
];

// Salvar no localStorage
localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
    products: produtos,
    lastUpdate: new Date().toISOString()
}));

// DataManager simples que funciona
window.dataManager = {
    getProducts() {
        const data = localStorage.getItem('granjaRecantoFelizData');
        return data ? JSON.parse(data).products : produtos;
    },
    
    getActiveProducts() {
        return this.getProducts().filter(p => p.active !== false);
    },
    
    updateProduct(id, productData) {
        const data = JSON.parse(localStorage.getItem('granjaRecantoFelizData') || '{}');
        if (!data.products) data.products = produtos;
        
        const index = data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            data.products[index] = { ...data.products[index], ...productData };
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
            return true;
        }
        return false;
    },
    
    addProduct(productData) {
        const data = JSON.parse(localStorage.getItem('granjaRecantoFelizData') || '{}');
        if (!data.products) data.products = produtos;
        
        const newId = Math.max(...data.products.map(p => p.id), 0) + 1;
        const newProduct = { id: newId, ...productData, active: true };
        
        data.products.push(newProduct);
        data.lastUpdate = new Date().toISOString();
        localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
        return true;
    },
    
    getStats() {
        const products = this.getActiveProducts();
        return {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            lowStock: products.filter(p => p.stock <= 10).length,
            outOfStock: products.filter(p => p.stock === 0).length
        };
    }
};

console.log('✅ Sistema de produtos corrigido - funcionando!');