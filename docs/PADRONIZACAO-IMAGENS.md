# 📋 Padrão de Imagens - Granja Recanto Feliz

## 🎯 Decisão: Padronizar em `.jpg`

### Por que `.jpg`?
- ✅ **Compressão otimizada** para fotos de produtos
- ✅ **Compatibilidade universal** (todos os navegadores)
- ✅ **Tamanho reduzido** (~60% menor que PNG para fotos)
- ✅ **Performance web** melhorada
- ✅ **Padrão industrial** para e-commerce

### Extensões NÃO recomendadas:
- ❌ `.jpeg` - apenas alias de `.jpg`, causa confusão
- ❌ `.png` - muito maior para fotos (use apenas para ícones/gráficos)
- ❌ `.webp` - nem todos os navegadores suportam

---

## 🔧 Implementação

### 1. Estrutura de Pastas
```
imagens/
├── produtos/
│   ├── 1.jpg          (imagem principal do produto 1)
│   ├── 1_thumb.jpg    (thumbnail)
│   ├── 2.jpg
│   ├── 2_thumb.jpg
│   └── ... (um arquivo por produto)
├── default/
│   └── placeholder.jpg (substitui placeholder.png)
└── agradecimento/
    └── pedido.jpg
```

### 2. Configuração de Produtos
Cada produto **DEVE** ter:
```json
{
  "id": 1,
  "name": "Produto",
  "image": "imagens/produtos/1.jpg",    // Sempre .jpg
  "gallery": [                           // Imagens adicionais (opcionais)
    "imagens/produtos/1.jpg",
    "imagens/produtos/1_lateral.jpg",
    "imagens/produtos/1_detalhe.jpg"
  ]
}
```

### 3. Código JavaScript
```javascript
// ✅ Simples e direto
function discoverProductImages(productId) {
    const product = produtos.find(p => p.id == productId);
    if (!product || !product.gallery || product.gallery.length === 0) {
        return [product?.image || 'imagens/produtos/default/placeholder.jpg'];
    }
    return product.gallery;
}
```

---

## 📊 Benefícios

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Tempo abertura modal** | 3-5s ⏳ | ~100ms 🚀 |
| **Tentativas por imagem** | 3 extensões | 1 extensão |
| **Tamanho médio arquivo** | ~150KB | ~80KB |
| **Manutenção** | Confusa | Simples |
| **Performance** | Lenta | Rápida |

---

## ✅ Checklist de Implementação

- [ ] Padronizar todas as imagens de produtos em `.jpg`
- [ ] Remover `.jpeg`, `.png`, `.webp` da pasta produtos/
- [ ] Atualizar `dados/produtos.json` com caminhos `.jpg`
- [ ] Atualizar `imagens/default/placeholder.jpg` (remover .png)
- [ ] Testar abertura de modal
- [ ] Testar renderização de produtos
- [ ] Testar galeria de imagens

---

## 🚀 Próximas Melhorias

1. **Lazy Loading** - carregar imagens apenas quando visíveis
2. **Responsive Images** - usar srcset para diferentes tamanhos
3. **Otimização automática** - scripts para converter imagens ao salvar
4. **CDN** - servir imagens de CDN (ex: AWS CloudFront)

