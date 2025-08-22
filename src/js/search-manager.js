// js/search-manager.js
class SearchManager {
    constructor(products) {
        this.products = products;
        this.searchIndex = this.buildSearchIndex();
    }
    
    buildSearchIndex() {
        return this.products.map(product => ({
            ...product,
            searchText: `${product.name} ${product.description} ${product.category}`.toLowerCase()
        }));
    }
    
    search(query, filters = {}) {
        const normalizedQuery = query.toLowerCase().trim();
        
        let results = this.searchIndex.filter(product => {
            const matchesQuery = !normalizedQuery || 
                product.searchText.includes(normalizedQuery);
            
            const matchesCategory = !filters.category || 
                product.category === filters.category;
            
            const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                (!filters.maxPrice || product.price <= filters.maxPrice);
            
            return matchesQuery && matchesCategory && matchesPrice;
        });
        
        // Ordenação por relevância
        if (normalizedQuery) {
            results.sort((a, b) => {
                const aScore = this.calculateRelevance(a, normalizedQuery);
                const bScore = this.calculateRelevance(b, normalizedQuery);
                return bScore - aScore;
            });
        }
        
        return results;
    }
    
    calculateRelevance(product, query) {
        let score = 0;
        if (product.name.toLowerCase().includes(query)) score += 10;
        if (product.category.toLowerCase().includes(query)) score += 5;
        if (product.description.toLowerCase().includes(query)) score += 2;
        return score;
    }
    
    getSuggestions(query) {
        const suggestions = new Set();
        const normalizedQuery = query.toLowerCase();
        
        this.products.forEach(product => {
            if (product.name.toLowerCase().includes(normalizedQuery)) {
                suggestions.add(product.name);
            }
        });
        
        return Array.from(suggestions).slice(0, 5);
    }
}