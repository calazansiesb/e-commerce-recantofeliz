// js/seo-manager.js
class SEOManager {
    static updateProductMeta(product) {
        // Title
        document.title = `${product.name} - R$ ${product.price.toFixed(2)} | Granja Recanto Feliz`;
        
        // Description
        this.updateMetaTag('description', 
            `${product.description.substring(0, 150)}... Compre online na Granja Recanto Feliz com entrega rápida.`
        );
        
        // Open Graph
        this.updateMetaTag('og:title', product.name, 'property');
        this.updateMetaTag('og:description', product.description, 'property');
        this.updateMetaTag('og:image', product.image, 'property');
        this.updateMetaTag('og:url', window.location.href, 'property');
        this.updateMetaTag('og:type', 'product', 'property');
        
        // Twitter Cards
        this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
        this.updateMetaTag('twitter:title', product.name, 'name');
        this.updateMetaTag('twitter:description', product.description, 'name');
        this.updateMetaTag('twitter:image', product.image, 'name');
        
        // Schema.org JSON-LD
        this.updateProductSchema(product);
    }
    
    static updateMetaTag(property, content, type = 'name') {
        let meta;
        if (type === 'property') {
            meta = document.querySelector(`meta[property="${property}"]`);
        } else {
            meta = document.querySelector(`meta[name="${property}"]`);
        }
        
        if (!meta) {
            meta = document.createElement('meta');
            if (type === 'property') {
                meta.setAttribute('property', property);
            } else {
                meta.setAttribute('name', property);
            }
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }
    
    static updateProductSchema(product) {
        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "brand": {
                "@type": "Brand",
                "name": "Granja Recanto Feliz"
            },
            "offers": {
                "@type": "Offer",
                "price": product.price.toFixed(2),
                "priceCurrency": "BRL",
                "availability": product.stock > 0 ? 
                    "https://schema.org/InStock" : 
                    "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Granja Recanto Feliz"
                }
            }
        };
        
        let scriptTag = document.getElementById('product-schema');
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = 'product-schema';
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }
        
        scriptTag.textContent = JSON.stringify(schema);
    }
}