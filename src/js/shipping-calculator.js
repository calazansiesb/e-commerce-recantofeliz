// js/shipping-calculator.js
class ShippingCalculator {
    constructor() {
        this.zones = {
            'jardimBotanico': {
                name: 'Jardim Botânico',
                ceps: /^7300[0-9]/,
                taxa: 5.00,
                prazo: '24h'
            },
            'lagoSul': {
                name: 'Lago Sul',
                ceps: /^7160[0-9]/,
                taxa: 7.00,
                prazo: '24h'
            },
            'asaSul': {
                name: 'Asa Sul',
                ceps: /^7001[0-9]/,
                taxa: 10.00,
                prazo: '48h'
            },
            'outras': {
                name: 'Outras regiões',
                ceps: /.*/,
                taxa: 15.00,
                prazo: '72h'
            }
        };
        
        this.freeShippingThreshold = 100.00;
    }
    
    calculateShipping(cep, cartTotal, weight = 0) {
        const cleanCep = String(cep).replace(/\D/g, ''); // Ensure cep is a string
        
        if (cleanCep.length !== 8) {
            throw new Error('CEP inválido');
        }
        
        // Encontrar zona
        let zone = this.zones.outras;
        for (let [key, zoneData] of Object.entries(this.zones)) {
            if (key !== 'outras' && zoneData.ceps.test(cleanCep)) {
                zone = zoneData;
                break;
            }
        }
        
        // Calcular taxa
        let shippingCost = zone.taxa;
        
        // Frete grátis acima do valor mínimo
        if (cartTotal >= this.freeShippingThreshold) {
            shippingCost = 0;
        }
        
        // Taxa adicional por peso (produtos pesados)
        if (weight > 5) {
            shippingCost += Math.ceil((weight - 5) / 2) * 2.00;
        }
        
        return {
            zone: zone.name,
            cost: shippingCost,
            deadline: zone.prazo,
            isFree: shippingCost === 0,
            freeShippingMissing: Math.max(0, this.freeShippingThreshold - cartTotal)
        };
    }
    
    async validateCEP(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            
            return { valid: true, address: data };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}