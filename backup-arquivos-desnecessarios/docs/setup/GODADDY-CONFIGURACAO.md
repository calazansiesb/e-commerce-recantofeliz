# 📋 GoDaddy: Configuração Passo a Passo

## 🔐 Acesso à Conta GoDaddy

### Login
1. **Acesse:** https://sso.godaddy.com/
2. **Digite:** Seu email e senha da conta GoDaddy
3. **Verifique:** Se o domínio `granjarecantofeliz.com` aparece em "Meus Produtos"

---

## 🏠 Opção 1: Hospedagem Web GoDaddy (Paga)

### Passo 1: Contratar Hospedagem
1. **No painel principal:**
   - Clique em "Hospedagem Web" ou "Web Hosting"
   - Se não tiver, clique em "Adicionar produto"

2. **Escolher plano:**
   - **Economy:** R$ 15-25/mês (básico, suficiente)
   - **Deluxe:** R$ 25-35/mês (recomendado)
   - **Ultimate:** R$ 35-45/mês (recursos extras)

3. **Configurar:**
   - Selecione o domínio `granjarecantofeliz.com`
   - Complete a compra

### Passo 2: Acessar cPanel
1. **Ir para hospedagem:**
   - Painel GoDaddy > "Hospedagem Web"
   - Clique em "Gerenciar" ao lado do seu plano

2. **Abrir cPanel:**
   - Clique em "cPanel Admin"
   - Anote a URL do cPanel para acesso futuro

### Passo 3: Upload dos Arquivos
1. **File Manager:**
   - No cPanel, clique em "Gerenciador de Arquivos"
   - Navegue até a pasta `public_html`

2. **Upload:**
   ```
   1. Clique em "Upload"
   2. Selecione todos os arquivos da pasta src/
   3. Aguarde upload completar
   4. Extrair se necessário
   ```

3. **Estrutura final em public_html:**
   ```
   public_html/
   ├── index.html
   ├── admin.html
   ├── js/
   ├── imagens/
   └── outros arquivos...
   ```

---

## 🆓 Opção 2: GitHub Pages + Domínio GoDaddy (Gratuita)

### Passo 1: Configurar DNS no GoDaddy
1. **Acessar DNS:**
   - Painel GoDaddy > "Meus Produtos"
   - Ao lado de `granjarecantofeliz.com`, clique em "DNS"

2. **Adicionar Registros A:**
   ```
   Clique em "Adicionar" > Tipo: A
   
   Registro 1:
   - Nome: @ (deixe em branco)
   - Valor: 185.199.108.153
   - TTL: 600
   
   Registro 2:
   - Nome: @ (deixe em branco)  
   - Valor: 185.199.109.153
   - TTL: 600
   
   Registro 3:
   - Nome: @ (deixe em branco)
   - Valor: 185.199.110.153
   - TTL: 600
   
   Registro 4:
   - Nome: @ (deixe em branco)
   - Valor: 185.199.111.153
   - TTL: 600
   ```

3. **Adicionar Registro CNAME:**
   ```
   Clique em "Adicionar" > Tipo: CNAME
   - Nome: www
   - Valor: calazansiesb.github.io
   - TTL: 600
   ```

### Passo 2: Configurar GitHub Pages
1. **No repositório GitHub:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: master (ou main) / root
   - Custom domain: `granjarecantofeliz.com`
   - ✅ Enforce HTTPS

### Passo 3: Aguardar Propagação
- **Tempo:** 2 a 48 horas
- **Verificar:** https://dnschecker.org/

---

## 📧 Configuração de Email Profissional

### Email Essentials GoDaddy
1. **Contratar:**
   - Painel > "Email" > "Email Essentials"
   - Plano básico: ~R$ 15/mês

2. **Criar emails:**
   ```
   contato@granjarecantofeliz.com
   vendas@granjarecantofeliz.com
   admin@granjarecantofeliz.com
   ```

3. **Configurar cliente:**
   - **Webmail:** Acesso via navegador
   - **Outlook/Gmail:** Configurar IMAP/SMTP

### Configurações SMTP/IMAP
```
Servidor IMAP: imap.secureserver.net
Porta IMAP: 993 (SSL)

Servidor SMTP: smtpout.secureserver.net  
Porta SMTP: 465 (SSL) ou 587 (TLS)

Usuário: seu-email@granjarecantofeliz.com
Senha: a senha que você definiu
```

---

## 🔒 Configuração SSL (HTTPS)

### SSL GoDaddy (Automático)
1. **Ativar SSL:**
   - Painel > "SSL Certificates"
   - Clique em "Set Up" no domínio
   - Escolha "Free SSL" (DV)

2. **Aguardar ativação:**
   - Tempo: 5 minutos a 24 horas
   - Verificar: https://granjarecantofeliz.com

### Forçar HTTPS
1. **Criar arquivo .htaccess:**
   - No File Manager, criar arquivo `.htaccess` na pasta `public_html`
   - Conteúdo:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## 🎛️ Configurações Avançadas

### Configurar Subdomínios
1. **No painel DNS:**
   ```
   admin.granjarecantofeliz.com
   - Tipo: CNAME
   - Valor: granjarecantofeliz.com
   ```

### Configurar Redirecionamentos
1. **No cPanel:**
   - "Redirecionamentos"
   - www.granjarecantofeliz.com → granjarecantofeliz.com

### Backup Automático
1. **No cPanel:**
   - "Backup Wizard"
   - Configurar backup semanal
   - Download manual quando necessário

---

## 🔍 Verificações e Testes

### Teste Básico
1. **Abrir URLs:**
   ```
   https://granjarecantofeliz.com
   https://www.granjarecantofeliz.com
   http://granjarecantofeliz.com (deve redirecionar para HTTPS)
   ```

2. **Verificar funcionalidades:**
   - Carrossel funciona
   - Painel admin acessível
   - Imagens carregam
   - Layout responsivo

### Ferramentas de Teste
```
1. SSL Test: https://www.ssllabs.com/ssltest/
   Digite: granjarecantofeliz.com

2. PageSpeed: https://pagespeed.web.dev/
   Digite: https://granjarecantofeliz.com

3. Mobile Test: https://search.google.com/test/mobile-friendly
   Digite: https://granjarecantofeliz.com
```

---

## 🆘 Solução de Problemas

### Site não carrega
**Possíveis causas:**
1. DNS ainda propagando (aguardar até 48h)
2. Arquivo index.html não está na raiz de public_html
3. Erro de configuração DNS

**Soluções:**
```bash
# Verificar DNS
nslookup granjarecantofeliz.com

# Deve retornar um dos IPs:
# 185.199.108.153 (GitHub Pages)
# ou IP da GoDaddy (hosting pago)
```

### SSL não funciona
**Verificar:**
1. Certificado ativado no painel GoDaddy
2. Arquivo .htaccess configurado corretamente
3. Aguardar até 24h para ativação

### Imagens não carregam
**Verificar:**
1. Caminhos das imagens estão corretos
2. Arquivos foram enviados para o servidor
3. Permissões dos arquivos (644 para arquivos, 755 para pastas)

### Email não funciona
**Verificar:**
1. Plano de email foi contratado
2. Registros MX estão configurados
3. Email foi criado no painel

---

## 📋 Dados Importantes para Anotar

### Informações da Conta
```
Domínio: granjarecantofeliz.com
Registrar: GoDaddy
Login GoDaddy: [seu email]
Data de renovação: [verificar no painel]
```

### Configurações Técnicas
```
DNS Servers: (GoDaddy padrão)
- ns07.domaincontrol.com
- ns08.domaincontrol.com

Hospedagem IP: [anotar após configurar]
cPanel URL: [anotar após configurar]
FTP Server: [anotar se usar FTP]
```

### Emails Criados
```
contato@granjarecantofeliz.com - [senha]
vendas@granjarecantofeliz.com - [senha]
admin@granjarecantofeliz.com - [senha]
```

---

## 📞 Contatos de Suporte

### GoDaddy Brasil
- **Telefone:** 0800-888-4636
- **Chat:** Disponível no painel da conta
- **Email:** Via sistema de tickets no painel

### Horários de Atendimento
- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 14h
- **Suporte técnico 24/7:** Disponível em inglês

---

## ✅ Checklist Final

### Pré-Deploy
- [ ] Domínio granjarecantofeliz.com ativo na GoDaddy
- [ ] Hospedagem contratada OU GitHub configurado
- [ ] Arquivos do site prontos na pasta src/
- [ ] Backup local criado

### Deploy
- [ ] DNS configurado corretamente
- [ ] Arquivos enviados para servidor
- [ ] SSL ativado e funcionando
- [ ] Email profissional configurado

### Pós-Deploy
- [ ] Site acessível via https://granjarecantofeliz.com
- [ ] Todas as páginas funcionam
- [ ] Sistema responsivo testado
- [ ] Velocidade do site verificada
- [ ] Google Analytics configurado (opcional)

---

*Documento específico GoDaddy - Agosto 2025*  
*Granja Recanto Feliz - granjarecantofeliz.com*
