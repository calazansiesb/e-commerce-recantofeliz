# 🛠️ Gestão de Produtos e Imagens - Guia Completo

## 📋 Processo Atual (v1.0)

### 🔒 **Limitação Técnica**
- **JavaScript não pode escrever arquivos** diretamente no servidor
- **Navegadores bloqueiam** acesso ao sistema de arquivos por segurança
- **Processo manual necessário** para upload de imagens

### 📸 **Fluxo de Trabalho para Imagens**

#### 1. **Preparação Local**
```bash
# Clone o repositório
git clone https://github.com/usuario/e-commerce-recantofeliz.git
cd e-commerce-recantofeliz

# Certifique-se de estar na branch develop
git checkout develop
git pull origin develop
```

#### 2. **Edição de Produtos**
1. **Abra** `admin.html` no navegador local
2. **Faça login** com credenciais: `admin` / `granja2024`
3. **Clique** "Editar" no produto desejado ou "Novo Produto"
4. **Arraste e solte** ou selecione imagens (PNG, JPG, JPEG)
5. **Sistema valida** formato e tamanho (máx 5MB)
6. **Converte automaticamente** para PNG
7. **Salve** o produto
8. **Clique "SALVAR DEFINITIVO"** → Downloads automáticos

#### 3. **Organização de Arquivos**
```
Downloads/
├── 9.1.png    # Primeira imagem do produto 9
├── 9.2.png    # Segunda imagem do produto 9
└── produtos.json  # Dados atualizados

# Mover para:
imagens/produtos/
├── 9.1.png    ✅
├── 9.2.png    ✅
└── ...

dados/
└── produtos.json  ✅ (substituir)
```

#### 4. **Deploy**
```bash
# Adicionar arquivos
git add imagens/produtos/
git add dados/produtos.json

# Commit com mensagem descritiva
git commit -m "feat: Adiciona imagens produto 9 - Queijo Minas Artesanal"

# Push para develop
git push origin develop

# Testar em ambiente de desenvolvimento
# URL: https://granjarecantofeliz.com/dev/

# Se aprovado, merge para main
git checkout main
git merge develop
git push origin main
```

## 🎯 **Regras e Validações**

### 📸 **Imagens**
- **Formatos aceitos:** PNG, JPG, JPEG
- **Conversão automática:** Tudo vira PNG
- **Tamanho máximo:** 5MB por arquivo
- **Nomenclatura:** `{id}.{numero}.png`
- **Exemplos:** `1.1.png`, `3.2.png`, `10.1.png`

### 📁 **Estrutura de Pastas**
```
imagens/produtos/
├── 1.1.png          # Produto 1, imagem 1
├── 3.1.jpeg         # Produto 3, imagem 1
├── 3.2.jpeg         # Produto 3, imagem 2
├── 9.1.png          # Produto 9, imagem 1
├── 9.2.png          # Produto 9, imagem 2
└── default/
    └── placeholder.png
```

## 🚀 **Roadmap Futuro**

### v2.0 - Upload Direto (Planejado)
- **Backend PHP/Node.js** para upload real
- **API REST** para gerenciamento de imagens
- **Interface web** sem necessidade de processo manual

### v2.1 - Gestão Avançada (Planejado)
- **Redimensionamento automático** de imagens
- **Múltiplos formatos** de saída (WebP, AVIF)
- **CDN integration** para performance

### v2.2 - Admin Remoto (Planejado)
- **Autenticação robusta** com JWT
- **Permissões de usuário** (admin, editor, viewer)
- **Histórico de alterações** completo

## 🔧 **Troubleshooting**

### ❌ **Problemas Comuns**

#### "Imagem não aparece no site"
- ✅ Verifique se arquivo está em `imagens/produtos/`
- ✅ Confirme nomenclatura: `{id}.{numero}.{extensao}`
- ✅ Teste se arquivo não está corrompido

#### "Erro ao fazer upload"
- ✅ Verifique formato (apenas PNG, JPG, JPEG)
- ✅ Confirme tamanho (máximo 5MB)
- ✅ Teste com arquivo diferente

#### "Produto não salva"
- ✅ Preencha todos os campos obrigatórios
- ✅ Verifique console do navegador (F12)
- ✅ Recarregue a página e tente novamente

## 📞 **Suporte**

Para dúvidas sobre este processo:
1. **Consulte** este documento
2. **Verifique** logs do console (F12)
3. **Teste** em navegador diferente
4. **Documente** o erro para futuras melhorias

---

**Versão:** 1.0  
**Última atualização:** 27/01/2025  
**Próxima revisão:** Quando implementar v2.0