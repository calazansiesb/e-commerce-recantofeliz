# 📋 Instruções para Manter Dados Permanentes

## 🎯 **Como Funciona Agora:**

### **1. Ao Salvar Produto no Admin:**
- ✅ Arquivo `produtos.json` é baixado automaticamente
- ✅ Contém todos os produtos atualizados
- ✅ Backup CSV também é criado

### **2. Para Manter Dados Permanentes:**
1. **Substitua** o arquivo `data/produtos.json` pelo arquivo baixado
2. **Mantenha** uma cópia de backup em local seguro
3. **Repita** sempre que fizer alterações

## 📁 **Estrutura de Arquivos:**

```
src/
├── data/
│   └── produtos.json          ← Substitua este arquivo
├── js/
├── imagens/
└── index.html
```

## 🔄 **Processo Completo:**

### **Editando Produtos:**
1. Abra admin → Edite produto → Salve
2. Arquivo `produtos.json` é baixado
3. **IMPORTANTE:** Substitua `src/data/produtos.json` pelo arquivo baixado
4. Agora os dados são permanentes!

### **Se Limpar Cache:**
- Site carrega do arquivo `data/produtos.json`
- Dados permanecem salvos ✅

## 🚨 **ATENÇÃO:**

### **SEM Substituir Arquivo:**
- Dados ficam apenas no navegador
- Limpar cache = perder alterações ❌

### **COM Substituir Arquivo:**
- Dados ficam no arquivo permanente
- Limpar cache = dados mantidos ✅

## 🎯 **Resumo:**

1. **Edite** produtos no admin
2. **Baixe** o arquivo produtos.json
3. **Substitua** o arquivo em `src/data/produtos.json`
4. **Pronto!** Dados permanentes

**Sempre substitua o arquivo para manter as alterações!** 📁✅