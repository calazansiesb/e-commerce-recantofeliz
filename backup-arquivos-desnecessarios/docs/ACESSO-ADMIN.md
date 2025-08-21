# 🔐 Como Acessar a Administração

## 📍 **URLs de Acesso**

### Após Publicação:
```
🌐 Site Público: https://granjarecantofeliz.com
🔐 Login Admin:  https://granjarecantofeliz.com/admin/login.html
```

### Durante Desenvolvimento Local:
```
🌐 Site Local:   file:///E:/RECANTO%20FELIZ/SITE%20GEMINI/e-commerce-recantofeliz/src/index.html
🔐 Admin Local:  file:///E:/RECANTO%20FELIZ/SITE%20GEMINI/e-commerce-recantofeliz/src/admin/login.html
```

## 💻 **Acesso Local Passo a Passo**

### Método 1: Duplo Clique (Mais Fácil)
1. **Navegue até a pasta:**
   ```
   E:\RECANTO FELIZ\SITE GEMINI\e-commerce-recantofeliz\src\admin\
   ```

2. **Clique duplo em:**
   ```
   login.html
   ```

3. **Digite as credenciais:**
   - Usuário: `admin`
   - Senha: `granja2024`
   - Clique "Entrar"

4. **Será redirecionado automaticamente para:**
   ```
   file:///E:/RECANTO%20FELIZ/SITE%20GEMINI/e-commerce-recantofeliz/src/admin.html
   ```

### Método 2: Copiar URL no Navegador
1. **Abra seu navegador (Chrome, Firefox, Edge)**

2. **Cole na barra de endereços:**
   ```
   file:///E:/RECANTO%20FELIZ/SITE%20GEMINI/e-commerce-recantofeliz/src/admin/login.html
   ```

3. **Pressione Enter e faça login**

### Método 3: Arrastar Arquivo
1. **Abra o Windows Explorer**
2. **Navegue até:** `src\admin\login.html`
3. **Arraste o arquivo para o navegador**
4. **Faça login normalmente**

## 🔑 **Credenciais Padrão**
```
Usuário: admin
Senha:   granja2024
```

## ⚡ **Atalhos Rápidos**

### Windows Explorer:
1. **Pressione:** `Windows + E`
2. **Cole no endereço:** `E:\RECANTO FELIZ\SITE GEMINI\e-commerce-recantofeliz\src\admin`
3. **Duplo clique:** `login.html`

### Navegador:
1. **Pressione:** `Ctrl + L`
2. **Cole:** `file:///E:/RECANTO%20FELIZ/SITE%20GEMINI/e-commerce-recantofeliz/src/admin/login.html`
3. **Pressione:** `Enter`

## 📱 **Compatibilidade**

### Navegadores Testados:
- ✅ Google Chrome
- ✅ Mozilla Firefox  
- ✅ Microsoft Edge
- ✅ Safari (Mac)

### Dispositivos:
- ✅ Desktop/Laptop
- ✅ Tablet (funciona, mas otimizado para desktop)
- ⚠️ Mobile (funciona, mas melhor em desktop)

## 📁 **Estrutura de Arquivos para Publicação**

### No Servidor (public_html/):
```
public_html/
├── index.html              ← Site público
├── js/
│   ├── scripts.js
│   └── data-manager.js
├── imagens/
│   ├── carrocel/
│   └── produtos/
└── admin/
    ├── login.html          ← Página de login
    └── admin.html          ← Painel administrativo
```

## 🚀 **Passos para Configurar**

### 1. Mover admin.html para pasta admin:
```bash
# Criar pasta admin no servidor
mkdir admin

# Mover admin.html para dentro da pasta admin
mv admin.html admin/admin.html
```

### 2. Ajustar caminho no login.html:
O arquivo `admin/login.html` já está configurado para redirecionar para `../admin.html`, mas se mover o arquivo, altere para:
```javascript
window.location.href = 'admin.html';
```

## 🔧 **Teste Local**

### Para testar localmente:
1. Abra: `src/admin/login.html`
2. Digite: admin / granja2024
3. Será redirecionado para o painel

## ⚠️ **Importante**

### Alterar Senha Após Publicação:
1. Edite o arquivo `admin/login.html`
2. Linha 47, altere:
```javascript
if (username === 'admin' && password === 'SUA_NOVA_SENHA_FORTE') {
```

### Segurança Adicional:
- Use HTTPS sempre (apenas no servidor)
- Considere adicionar .htaccess na pasta admin (servidor)
- Monitore tentativas de acesso (servidor)
- **Local:** Sem riscos de segurança (apenas você tem acesso)

## 🎯 **Resumo Rápido**

### Para Acessar Localmente:
1. **Abra:** `src\admin\login.html`
2. **Login:** admin / granja2024
3. **Pronto!** ✅

### Para Acessar no Servidor:
1. **URL:** `https://seudominio.com/admin/login.html`
2. **Login:** admin / granja2024
3. **Altere a senha** após primeiro acesso

## 📱 **Acesso Mobile**
A administração funciona em dispositivos móveis, mas é otimizada para desktop.

## 🔄 **Teste Completo Local**

### Checklist de Verificação:
- [ ] Arquivo `src\admin\login.html` existe
- [ ] Arquivo `src\admin.html` existe  
- [ ] Login abre no navegador
- [ ] Credenciais admin/granja2024 funcionam
- [ ] Redireciona para painel admin
- [ ] Painel carrega produtos
- [ ] Botão logout funciona

### Se Tudo Funcionar Localmente:
✅ **Está pronto para publicação!**

## 🆘 **Problemas Comuns**

### Problemas Locais:

#### "Página não encontrada" (Local):
- ✅ Verifique se o arquivo existe: `src\admin\login.html`
- ✅ Verifique se o arquivo existe: `src\admin.html`
- ✅ Tente abrir em navegador diferente

#### "Não consegue logar" (Local):
- ✅ Credenciais corretas: admin / granja2024
- ✅ JavaScript habilitado no navegador
- ✅ Limpe cache: Ctrl+F5
- ✅ Teste em modo anônimo/privado

#### "Redireciona para página errada" (Local):
- ✅ Verifique se `admin.html` está na pasta `src/`
- ✅ Caminho no login.html deve ser: `../admin.html`

### Problemas no Servidor:

#### "Página não encontrada" (Servidor):
- Verifique se a pasta `admin/` foi criada no servidor
- Verifique se `login.html` está dentro da pasta admin
- Verifique se `admin.html` está na pasta admin

#### "Não consegue logar" (Servidor):
- Verifique as credenciais: admin / granja2024
- Limpe o cache do navegador
- Verifique se JavaScript está habilitado
- Teste HTTPS vs HTTP

#### "Redireciona para página errada" (Servidor):
- Verifique o caminho no login.html (linha 49)
- Certifique-se que admin.html está no local correto
- Ajuste caminho para: `admin.html` (se ambos na pasta admin)

## 🔧 **Estrutura de Arquivos Correta**

### Local (Desenvolvimento):
```
src/
├── index.html              ← Site principal
├── admin.html              ← Painel admin (raiz)
├── admin/
│   └── login.html          ← Login admin
├── js/
└── imagens/
```

### Servidor (Produção):
```
public_html/
├── index.html              ← Site principal
├── admin/
│   ├── login.html          ← Login admin
│   └── admin.html          ← Painel admin (movido)
├── js/
└── imagens/
```