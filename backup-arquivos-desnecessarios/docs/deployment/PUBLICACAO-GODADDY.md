# 🌐 Guia Completo: Publicação do Site Granja Recanto Feliz no GoDaddy

## 📋 Pré-requisitos
- [x] Domínio granjarecantofeliz.com comprado na GoDaddy
- [x] Site desenvolvido e testado localmente
- [x] Conta de hosting/servidor web
- [x] Acesso ao painel de controle da GoDaddy

---

## 🎯 Opções de Hospedagem

### Opção 1: Hospedagem Web GoDaddy (Recomendada para iniciantes)
### Opção 2: GitHub Pages + Domínio Personalizado (Gratuita)
### Opção 3: Servidor VPS/Cloud (Avançada)

---

## 🚀 OPÇÃO 1: Hospedagem Web GoDaddy

### Passo 1: Contratar Hospedagem Web
1. **Acesse sua conta GoDaddy:**
   - Vá para [godaddy.com](https://godaddy.com)
   - Faça login na sua conta

2. **Contratar Web Hosting:**
   - No painel, clique em "Web Hosting"
   - Escolha um plano (Economy é suficiente para começar)
   - Selecione o domínio `granjarecantofeliz.com`
   - Complete a compra

### Passo 2: Configurar o cPanel
1. **Acessar cPanel:**
   - No painel GoDaddy, vá em "Web Hosting"
   - Clique em "Manage" ao lado do seu hosting
   - Clique em "cPanel Admin"

2. **Configurações iniciais:**
   - Anote os dados de FTP fornecidos
   - Verifique se o SSL está ativado

### Passo 3: Preparar os Arquivos do Site
1. **Comprimir arquivos:**
   ```bash
   # No diretório do projeto
   cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz/src"
   
   # Criar um arquivo ZIP com todos os arquivos
   # Selecione todos os arquivos da pasta src/
   # Clique com botão direito > "Enviar para" > "Pasta compactada"
   ```

2. **Verificar estrutura:**
   ```
   site.zip
   ├── index.html (arquivo principal)
   ├── admin.html
   ├── css/
   ├── js/
   ├── imagens/
   └── outros arquivos...
   ```

### Passo 4: Upload via File Manager
1. **Acessar File Manager:**
   - No cPanel, clique em "File Manager"
   - Navegue até a pasta `public_html`

2. **Fazer upload:**
   - Clique em "Upload"
   - Selecione o arquivo site.zip
   - Aguarde o upload completar
   - Clique com botão direito no arquivo > "Extract"
   - Mova todos os arquivos para a raiz de `public_html`
   - Delete o arquivo ZIP

### Passo 5: Configurar HTTPS (SSL)
1. **Ativar SSL:**
   - No painel GoDaddy, vá em "SSL Certificates"
   - Ative o SSL gratuito para o domínio
   - Aguarde a propagação (até 24h)

2. **Forçar HTTPS:**
   - Crie um arquivo `.htaccess` na raiz:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## 🆓 OPÇÃO 2: GitHub Pages (Gratuita)

### Passo 1: Preparar Repositório
1. **Configurar branch gh-pages:**
   ```bash
   cd "E:/RECANTO FELIZ/SITE GEMINI/e-commerce-recantofeliz"
   
   # Criar branch para GitHub Pages
   git checkout -b gh-pages
   
   # Mover arquivos src/ para raiz
   cp -r src/* .
   git add .
   git commit -m "Deploy para GitHub Pages"
   git push origin gh-pages
   ```

### Passo 2: Ativar GitHub Pages
1. **No repositório GitHub:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / root
   - Clique em Save

### Passo 3: Configurar Domínio Personalizado
1. **No GitHub:**
   - Em Settings > Pages > Custom domain
   - Digite: `granjarecantofeliz.com`
   - Marque "Enforce HTTPS"

2. **Configurar DNS na GoDaddy:**
   - Acesse o painel DNS da GoDaddy
   - Adicione os seguintes registros:
   ```
   Tipo    Nome    Valor
   A       @       185.199.108.153
   A       @       185.199.109.153
   A       @       185.199.110.153
   A       @       185.199.111.153
   CNAME   www     calazansiesb.github.io
   ```

---

## ⚙️ OPÇÃO 3: Servidor VPS/Cloud

### Passo 1: Contratar VPS
- **Provedores recomendados:**
  - DigitalOcean (a partir de $5/mês)
  - Linode
  - AWS Lightsail
  - Google Cloud Platform

### Passo 2: Configurar Servidor
1. **Instalar stack LAMP:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install apache2 mysql-server php libapache2-mod-php
   
   # CentOS/RHEL
   sudo yum install httpd mariadb-server php
   ```

2. **Configurar Virtual Host:**
   ```apache
   <VirtualHost *:80>
       ServerName granjarecantofeliz.com
       ServerAlias www.granjarecantofeliz.com
       DocumentRoot /var/www/granjarecantofeliz
       ErrorLog ${APACHE_LOG_DIR}/error.log
       CustomLog ${APACHE_LOG_DIR}/access.log combined
   </VirtualHost>
   ```

### Passo 3: Configurar DNS
```
Tipo    Nome    Valor
A       @       [IP do seu servidor]
A       www     [IP do seu servidor]
```

---

## 🔧 Configurações Específicas do Site

### Ajustes Necessários
1. **Caminhos relativos:**
   - Verificar se todos os links usam caminhos relativos
   - Testar imagens e CSS

2. **Banco de dados (se necessário):**
   - Configurar MySQL/MariaDB
   - Importar dados de produtos

3. **Permissões de arquivos:**
   ```bash
   # Definir permissões corretas
   find /var/www/granjarecantofeliz -type f -exec chmod 644 {} \;
   find /var/www/granjarecantofeliz -type d -exec chmod 755 {} \;
   ```

---

## 📧 Configuração de Email

### Email Profissional
1. **Via GoDaddy Email:**
   - Contratar Email Essentials
   - Configurar contato@granjarecantofeliz.com
   - Configurar vendas@granjarecantofeliz.com

2. **Via Google Workspace:**
   - Mais profissional e recursos avançados
   - Integração com Gmail, Drive, etc.

---

## 🔍 Testes Pós-Publicação

### Checklist de Verificação
- [ ] Site carrega em https://granjarecantofeliz.com
- [ ] Todas as páginas funcionam
- [ ] Imagens carregam corretamente
- [ ] Carrossel funciona
- [ ] Sistema de layouts funciona
- [ ] Painel admin acessível
- [ ] Responsividade mobile
- [ ] Velocidade de carregamento
- [ ] SSL ativo (cadeado verde)

### Ferramentas de Teste
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **Mobile Test:** https://search.google.com/test/mobile-friendly

---

## 🚀 Pós-Publicação

### SEO Básico
1. **Google Search Console:**
   - Adicionar propriedade
   - Verificar domínio
   - Enviar sitemap

2. **Google Analytics:**
   - Criar conta
   - Adicionar código de rastreamento

3. **Meta tags essenciais:**
   ```html
   <meta name="description" content="Granja Recanto Feliz - Produtos frescos direto da fazenda">
   <meta name="keywords" content="ovos caipira, galinhas, adubo orgânico, brasília">
   <meta property="og:title" content="Granja Recanto Feliz">
   <meta property="og:description" content="Produtos frescos da fazenda">
   <meta property="og:image" content="https://granjarecantofeliz.com/imagens/logo.jpg">
   ```

### Backup Automático
1. **Configurar backup regular:**
   - Arquivos do site
   - Banco de dados (se houver)
   - Configurações

2. **Monitoramento:**
   - Uptime monitoring
   - Alertas de erro

---

## 🆘 Solução de Problemas

### Problemas Comuns

1. **Site não carrega:**
   - Verificar DNS (pode levar até 48h)
   - Verificar configuração do servidor
   - Verificar arquivo index.html na raiz

2. **Imagens quebradas:**
   - Verificar caminhos das imagens
   - Verificar permissões dos arquivos
   - Verificar se arquivos foram enviados

3. **CSS não carrega:**
   - Verificar caminhos relativos
   - Verificar se arquivos CSS foram enviados
   - Limpar cache do navegador

4. **HTTPS não funciona:**
   - Aguardar propagação do SSL
   - Verificar configuração do .htaccess
   - Verificar links mistos (http em https)

### Contatos de Suporte
- **GoDaddy Support:** https://br.godaddy.com/help
- **Telefone GoDaddy:** 0800-888-4636

---

## 💡 Dicas Importantes

### Performance
- **Otimizar imagens:** Use formatos WebP quando possível
- **Minificar CSS/JS:** Use ferramentas de compressão
- **CDN:** Considere usar CloudFlare gratuito

### Segurança
- **Backup regular:** Sempre mantenha backups atualizados
- **Atualizações:** Mantenha servidor e scripts atualizados
- **Senhas fortes:** Use senhas complexas em todos os acessos

### Manutenção
- **Monitor regular:** Verifique o site semanalmente
- **Updates:** Atualize conteúdo regularmente
- **Analytics:** Monitore métricas de acesso

---

## 📞 Próximos Passos

1. **Escolher opção de hospedagem** (Recomendo Opção 1 para facilidade)
2. **Seguir passo a passo** da opção escolhida
3. **Testar funcionalidades** após publicação
4. **Configurar email profissional**
5. **Implementar SEO básico**
6. **Configurar monitoramento**

---

*Documento criado em: Agosto 2025*  
*Versão: 1.0*  
*Autor: GitHub Copilot para Granja Recanto Feliz*
