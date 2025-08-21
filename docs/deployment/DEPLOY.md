# Guia de Publicação - Granja Recanto Feliz

## 🚀 Preparação para Publicação

### Arquivos para Publicar (Pasta `src/`)
```
src/
├── index.html              ✅ Site principal
├── js/
│   ├── scripts.js          ✅ Carrossel + Produtos  
│   └── data-manager.js     ✅ Gerenciamento de dados
├── css/
│   └── estilos.css         ✅ Estilos (se existir)
└── imagens/                ✅ Todas as imagens
    ├── carrocel/
    └── produtos/
```

### 🔒 Área Administrativa Separada

#### Acesso Admin:
- **URL**: `seusite.com/admin/login.html`
- **Usuário**: `admin`
- **Senha**: `granja2024`

#### Arquivos Admin (Pasta `admin/`):
```
admin/
├── login.html              🔐 Página de login
└── ../admin.html           🔐 Painel administrativo
```

## 📋 Checklist de Publicação

### ✅ Site Público
- [x] Carrossel funcionando
- [x] Produtos sendo exibidos
- [x] Filtros operacionais
- [x] Links de admin removidos
- [x] Layout responsivo

### 🔐 Área Administrativa
- [x] Login com senha
- [x] Verificação de autenticação
- [x] Redirecionamento automático
- [x] Botão de logout

## 🌐 Estrutura de Hospedagem

### Opção 1: Hospedagem Tradicional
```
public_html/
├── index.html              (site público)
├── js/
├── imagens/
└── admin/
    ├── login.html          (login admin)
    └── admin.html          (painel admin)
```

### Opção 2: Subdomínio Admin
```
www.granjarecantofeliz.com/     (site público)
admin.granjarecantofeliz.com/   (área admin)
```

## 🔧 Configurações de Segurança

### 1. Alterar Senha Padrão
No arquivo `admin/login.html`, linha 47:
```javascript
if (username === 'admin' && password === 'SUA_NOVA_SENHA') {
```

### 2. Proteção por .htaccess (Opcional)
Criar arquivo `.htaccess` na pasta admin:
```apache
AuthType Basic
AuthName "Área Restrita"
AuthUserFile /caminho/para/.htpasswd
Require valid-user
```

### 3. HTTPS Obrigatório
Configurar SSL/TLS no servidor para proteger login.

## 📱 Teste Pré-Publicação

### Site Público:
1. ✅ Carrossel roda automaticamente
2. ✅ Produtos aparecem na grade
3. ✅ Filtros funcionam
4. ✅ Links de contato funcionam
5. ✅ Responsivo em mobile

### Área Admin:
1. ✅ Login funciona com credenciais
2. ✅ Redireciona se não autenticado
3. ✅ Painel carrega produtos
4. ✅ Logout funciona

## 🚀 Passos para Publicar

1. **Upload dos arquivos da pasta `src/`** para o servidor
2. **Criar pasta `admin/`** no servidor
3. **Upload do `login.html`** para pasta admin
4. **Mover `admin.html`** para pasta admin
5. **Testar acesso público** em `seusite.com`
6. **Testar acesso admin** em `seusite.com/admin/login.html`
7. **Alterar senha padrão** por segurança

## 🔐 Credenciais Padrão

**⚠️ ALTERAR APÓS PUBLICAÇÃO**
- Usuário: `admin`
- Senha: `granja2024`

## 📞 Suporte

Para dúvidas sobre a publicação ou configuração:
- Verificar logs do servidor
- Testar em ambiente local primeiro
- Confirmar permissões de arquivo no servidor