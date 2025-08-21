const fs = require('fs');

// Simular verificação do localStorage (em um ambiente real seria diferente)
console.log('🔍 Verificando status dos layouts...\n');

// Dados que estariam no localStorage baseados no que foi configurado
const layoutsData = {
    "currentLayout": {
        "name": "Layout Padrão",
        "theme": "default",
        "colors": {
            "primary": "#2D5016",
            "secondary": "#8B4513", 
            "accent": "#228B22",
            "background": "#F0F8E8"
        },
        "hero": {
            "title": "Produtos frescos direto da granja",
            "subtitle": "Uma tradição familiar de carinho e respeito pela natureza...",
            "backgroundImage": "https://images.unsplash.com/photo-1586771107445-d3ca888129ce",
            "buttonPrimary": "Compre agora",
            "buttonSecondary": "Conheça nossa história"
        }
    },
    "layouts": {
        "default": { "active": true },
        "diadasMaes": { "active": false },
        "natal": { "active": false },
        "pascoa": { "active": false },
        "aniversarioBrasilia": { "active": false },
        "diaDoCerrado": { "active": false },
        "festaJuninaPlanalto": { "active": false },
        "conscienciaNegraBsb": { "active": false },
        "modernoRustico": { "active": false }
    }
};

console.log('📍 LAYOUT ATUALMENTE ATIVO:');
console.log(`   Nome: ${layoutsData.currentLayout.name}`);
console.log(`   Tema: ${layoutsData.currentLayout.theme}`);
console.log(`   Cores: ${layoutsData.currentLayout.colors.primary} (primária)`);
console.log(`   Hero: ${layoutsData.currentLayout.hero.title}`);

console.log('\n📋 STATUS DE TODOS OS LAYOUTS:');
Object.entries(layoutsData.layouts).forEach(([key, layout]) => {
    const status = layout.active ? '✅ ATIVO' : '⭕ INATIVO';
    console.log(`   ${key}: ${status}`);
});

console.log('\n💡 Para verificar o layout real, acesse: http://localhost:8080/verificar-layout.html');
