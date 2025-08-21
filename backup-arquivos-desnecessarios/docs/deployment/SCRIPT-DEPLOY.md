# 🚀 Script Prático: Deploy Granja Recanto Feliz

## 📋 Preparação dos Arquivos

### 1. Verificar Estrutura do Site
```bash
# Navegar para o diretório do projeto
cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz/src"

# Listar arquivos para verificar
ls -la

# Verificar se index.html está presente
ls index.html
```

### 2. Preparar Arquivos para Upload
```bash
# Criar backup local primeiro
cp -r . ../backup-site/

# Verificar se todas as imagens estão presentes
find imagens/ -name "*.png" -o -name "*.jpg" -o -name "*.gif"

# Verificar arquivos CSS e JS
ls js/*.js
ls *.html
```

---

## 🔧 Comandos Git para Deploy (GitHub Pages)

### Opção A: Deploy via GitHub Pages
```bash
# 1. Navegar para o repositório
cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz"

# 2. Criar branch de deploy
git checkout -b deploy

# 3. Mover arquivos src para raiz
cp src/* .
cp -r src/js .
cp -r src/imagens .

# 4. Ajustar index.html (remover prefixo src/ dos caminhos)
# Este ajuste deve ser feito manualmente no editor

# 5. Commit das mudanças
git add .
git commit -m "🚀 Deploy para produção - granjarecantofeliz.com"

# 6. Push para o repositório
git push origin deploy

# 7. Configurar GitHub Pages
# Ir no GitHub > Settings > Pages > Source: Deploy from branch > deploy
```

### Comandos de Ajuste de Caminhos
```bash
# Ajustar caminhos no HTML (executar no diretório raiz após mover arquivos)
# Substituir caminhos relativos se necessário

# Verificar links quebrados
grep -r "src/" *.html
```

---

## 📁 Estrutura para Upload Manual (GoDaddy)

### Arquivos que devem estar na pasta public_html:
```
public_html/
├── index.html              ← Página principal
├── admin.html             ← Painel administrativo  
├── js/
│   ├── data-manager.js    ← Sistema de dados
│   ├── admin.js           ← Funcionalidades admin
│   └── scripts.js         ← Scripts gerais
├── imagens/
│   ├── LOGO 2023.jpg      ← Logo da empresa
│   ├── produtos/          ← Imagens de produtos
│   └── carrocel/          ← Imagens do carrossel
├── teste-layout-maes.html ← Páginas de teste
├── verificar-layout.html
└── outros arquivos HTML
```

---

## 🌐 Configuração DNS (GoDaddy)

### Acessar Configurações DNS
1. **Login GoDaddy:** https://sso.godaddy.com/
2. **Meus Produtos** > **DNS** (ao lado do domínio)
3. **Gerenciar DNS**

### Registros DNS para GitHub Pages
```
Tipo    Nome    Valor                   TTL
A       @       185.199.108.153        600
A       @       185.199.109.153        600  
A       @       185.199.110.153        600
A       @       185.199.111.153        600
CNAME   www     calazansiesb.github.io  600
```

### Registros DNS para Hospedagem GoDaddy
```
Tipo    Nome    Valor                          TTL
A       @       [IP fornecido pela GoDaddy]    600
CNAME   www     granjarecantofeliz.com         600
```

---

## 📧 Comandos para Verificação

### Verificar DNS
```bash
# Windows
nslookup granjarecantofeliz.com
nslookup www.granjarecantofeliz.com

# Verificar propagação DNS
ping granjarecantofeliz.com
```

### Testar Site
```bash
# Testar conectividade
curl -I https://granjarecantofeliz.com

# Verificar SSL
openssl s_client -connect granjarecantofeliz.com:443
```

---

## 🔨 Script de Otimização Pré-Deploy

### Otimizar Imagens (Opcional)
```bash
# Instalar ferramentas de otimização (se disponível)
# Para Windows, usar ferramentas online ou software

# Verificar tamanho das imagens
du -sh imagens/*

# Listar imagens grandes (>1MB)
find imagens/ -size +1M -exec ls -lh {} \;
```

### Minificar CSS (Manual)
```bash
# Backup dos arquivos originais
cp style.css style-original.css

# Usar ferramenta online para minificar:
# https://cssminifier.com/
# ou
# https://www.toptal.com/developers/cssminifier
```

---

## 🚀 Checklist de Deploy

### Antes do Deploy
- [ ] ✅ Testar site localmente
- [ ] ✅ Verificar todas as imagens carregam
- [ ] ✅ Verificar sistema de layouts funciona
- [ ] ✅ Verificar painel admin funciona
- [ ] ✅ Backup dos arquivos criado
- [ ] ✅ Domínio granjarecantofeliz.com ativo

### Durante o Deploy
- [ ] 🔄 Upload de todos os arquivos
- [ ] 🔄 Configurar DNS corretamente
- [ ] 🔄 Ativar SSL/HTTPS
- [ ] 🔄 Configurar redirecionamentos

### Após o Deploy
- [ ] ✅ Site abre em https://granjarecantofeliz.com
- [ ] ✅ www.granjarecantofeliz.com redireciona corretamente
- [ ] ✅ Todas as páginas carregam
- [ ] ✅ Imagens e recursos carregam
- [ ] ✅ Sistema responsivo funciona
- [ ] ✅ Painel admin acessível

---

## 🆘 Comandos de Emergência

### Restaurar Backup
```bash
# Se algo der errado, restaurar backup
cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz"
cp -r backup-site/* src/
```

### Rollback Git
```bash
# Voltar para commit anterior
git log --oneline -5  # Ver últimos 5 commits
git reset --hard HEAD~1  # Voltar 1 commit
git push --force origin deploy  # Forçar update
```

### Verificar Logs de Erro
```bash
# No cPanel da GoDaddy
# Ir em "Error Logs" para ver erros do servidor
# Comum: 404 (arquivo não encontrado), 500 (erro do servidor)
```

---

## 📞 Contatos e Recursos

### Suporte Técnico
- **GoDaddy:** 0800-888-4636
- **GitHub Support:** https://support.github.com/

### Ferramentas Úteis
- **DNS Propagation Check:** https://dnschecker.org/
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **PageSpeed:** https://pagespeed.web.dev/
- **Mobile Test:** https://search.google.com/test/mobile-friendly

### URLs Importantes
- **Painel GoDaddy:** https://account.godaddy.com/
- **GitHub Repo:** https://github.com/calazansiesb/e-commerce-recantofeliz
- **Site Atual:** https://granjarecantofeliz.com (após deploy)

---

## 🎯 Próxima Ação Recomendada

### Para Deploy Rápido (Recomendado)
1. **Usar GitHub Pages + Domínio Personalizado**
2. **Seguir comandos da seção "GitHub Pages"**
3. **Configurar DNS conforme instruções**
4. **Aguardar propagação (2-48h)**

### Comando Único para Iniciar
```bash
cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz"
git status  # Verificar estado atual
```

---

*Script atualizado: Agosto 2025*  
*Versão: 1.0 - Granja Recanto Feliz*
