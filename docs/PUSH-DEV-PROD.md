# 📋 Checklist: Push para DEV e depois PROD

## 🎯 Objetivo
Fazer push do código atualizado (com imagens padronizadas em .jpg) para:
1. **DEV** (homologação): `https://www.granjarecantofeliz.com/dev/`
2. **PROD** (produção): `https://www.granjarecantofeliz.com/`

---

## 📝 Pré-requisitos

- [ ] Git configurado localmente
- [ ] AWS CLI instalado e configurado
- [ ] Python 3 instalado
- [ ] Repositório GitHub clonado
- [ ] Todos os arquivos atualizados (imagens em .jpg)
- [ ] Sem erros nos scripts Python/JSON

---

## 🚀 PASSO A PASSO: DEV (Homologação)

### 1️⃣ Testes Locais

```bash
# Mudar para diretório do projeto
cd "f:\DSAI\AWS RECANTO FELIZ\BACKUP-AWS-RECANTO-FELIZ\01-Sites-Web\site-principal"

# Executar testes pré-deploy
bash test-pre-deploy.sh
```

✅ **Esperado:**
```
✨ Todos os testes passaram! Você pode fazer deploy.
```

### 2️⃣ Verificar Status Git

```bash
# Ver branch atual
git branch

# Ver arquivos modificados
git status

# Ver mudanças detalhadas
git diff
```

✅ **Esperado:**
```
On branch develop
Your branch is up to date with 'origin/develop'.

Changes not staged for commit:
  modified: js/scripts-simples.js
  modified: dados/produtos.json
  ...
```

### 3️⃣ Commit das Mudanças

```bash
# Adicionar todos os arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "feat: Padronizar imagens em .jpg e otimizar performance do modal

- Converter todas as imagens para .jpg (reduz ~47% tamanho)
- Otimizar função discoverProductImages() (abre em ~100ms vs 3-5s)
- Atualizar paths em dados/produtos.json
- Atualizar dados hardcoded em scripts-simples.js
- Criar backup de imagens originais em backup/

Issues: #123
Closes: #456
"

# Ver commit criado
git log -1 --stat
```

✅ **Esperado:**
```
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Author: Seu Nome <seu.email@example.com>
Date:   Wed Oct 29 15:30:00 2025 -0300

    feat: Padronizar imagens em .jpg...
```

### 4️⃣ Push para Develop

```bash
# Push do branch develop para o repositório remoto
git push origin develop

# Verificar se foi bem-sucedido
git log origin/develop -1
```

✅ **Esperado:**
```
Total 5 (delta 2), reused 1 (delta 0), pack-reused 0
To github.com:seu-usuario/granja-recanto-feliz.git
   x1y2z3a..b4c5d6e  develop -> develop
```

### 5️⃣ Criar Pull Request (no GitHub)

```
1. Ir para: https://github.com/seu-usuario/granja-recanto-feliz
2. Clicar em "Pull requests"
3. Clicar em "New pull request"
4. Selecionar: develop → develop (ou você pode ter feature branch)
5. Título: "feat: Padronizar imagens e otimizar performance"
6. Descrição: 
   ```
   ## Mudanças
   - ✅ Todas as imagens em .jpg
   - ✅ Modal abre ~97% mais rápido
   - ✅ Backup de imagens originais preservado
   
   ## Testing
   - [x] Testes pré-deploy passaram
   - [x] Testar em DEV
   
   ## Checklist
   - [x] Código testado
   - [x] JSON validado
   - [x] Sem erros de lint
   ```
7. Clicar em "Create pull request"
```

### 6️⃣ GitHub Actions Faz Deploy Automático

```
GitHub → Actions → Seu workflow
```

**Acompanhe o deployment:**

```
⏳ Validação...
✅ Validação concluída
⏳ Build...
✅ Build concluído  
⏳ Deploy para DEV...
✅ Deploy concluído

URL: https://www.granjarecantofeliz.com/dev/
```

### 7️⃣ Testar em DEV

```bash
# Testar acesso
curl -I https://www.granjarecantofeliz.com/dev/

# Verificar se está respondendo com HTTP 200
```

✅ **Esperado:**
```
HTTP/2 200
Content-Type: text/html; charset=utf-8
Cache-Control: no-cache
```

**Checklist visual:**
- [ ] Página carrega rápido (< 3s)
- [ ] Imagens visíveis e sem erros
- [ ] Modal de produto abre instantaneamente (< 100ms)
- [ ] Botões "Comprar" funcionam
- [ ] Carrinho funciona
- [ ] Formulário de checkout funciona
- [ ] Responsivo em mobile
- [ ] Sem erros no console (F12)

---

## 🟢 PASSO A PASSO: PROD (Produção)

**⚠️ SÓ FAZER ISTO APÓS APROVAÇÃO EM DEV**

### 1️⃣ Criar Release Branch (Opcional mas Recomendado)

```bash
# Criar branch de release
git checkout develop
git pull
git checkout -b release/v1.1.0

# Push
git push -u origin release/v1.1.0
```

### 2️⃣ Criar Pull Request: develop → main

```
1. GitHub → Pull requests → New pull request
2. Selecionar: base: main ← compare: develop
3. Título: "release: v1.1.0 - Otimização de imagens"
4. Descrição:
   ```
   ## Release Notes
   - ✅ Padronização de imagens em .jpg
   - ✅ Otimização de performance (+97%)
   - ✅ Compatibilidade melhorada
   
   ## Testado em
   - ✅ DEV Environment
   - ✅ Chrome, Firefox, Safari
   - ✅ Desktop e Mobile
   
   ## Checklist
   - [x] Todos os testes passaram
   - [x] Testado em produção
   - [x] Backup feito
   - [x] Documentação atualizada
   ```
5. Adicionar reviewers (colegas)
6. Clicar em "Create pull request"
```

### 3️⃣ Revisão e Aprovação

- Colegas revisam o PR
- Discutem mudanças se necessário
- Clicam em "Approve" se OK

### 4️⃣ Fazer Merge para Main

```bash
# No GitHub: Clicar em "Merge pull request" → "Confirm merge"
# Ou via terminal:

git checkout main
git pull
git merge develop
git push
```

### 5️⃣ GitHub Actions Faz Deploy para PROD

```
GitHub → Actions → Seu workflow

Status:
⏳ Validação...
✅ Validação concluída
⏳ Build...
✅ Build concluído  
⏳ Backup de PROD...
✅ Backup criado
⏳ Deploy para PROD...
✅ Deploy concluído

URL: https://www.granjarecantofeliz.com/
```

### 6️⃣ Testar em PROD

```bash
# Testar acesso
curl -I https://www.granjarecantofeliz.com/

# Verificar cache
curl -I https://www.granjarecantofeliz.com/ | grep Cache-Control
```

✅ **Esperado:**
```
HTTP/2 200
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
```

**Checklist visual (PROD):**
- [ ] Site carrega normalmente
- [ ] Imagens carregam corretamente
- [ ] Modal de produto abre rápido
- [ ] Carrinho funciona
- [ ] Nenhum erro em produção
- [ ] Performance OK
- [ ] Cache está sendo usado

### 7️⃣ Criar Tag de Release

```bash
# Criar tag para marcar a release
git tag -a v1.1.0 -m "Release v1.1.0: Otimização de imagens"

# Push da tag
git push origin v1.1.0

# Ver tags
git tag -l
```

---

## 🔄 Rollback (Se Necessário)

```bash
# Se algo der errado em PROD, reverter é fácil:

# 1. Identificar commit anterior
git log --oneline | head -5

# 2. Reverter
git revert HEAD
git push

# 3. GitHub Actions automaticamente faz deploy da versão anterior
```

---

## 📊 Resumo do Fluxo

```
┌─────────────────────────────────────┐
│ 1. Testes Locais (test-pre-deploy)  │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 2. Git Commit & Push (develop)      │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 3. GitHub Actions Deploy para DEV   │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 4. Testar em DEV                    │
│    https://www.granjarecantofeliz.com/dev/
└──────────────┬──────────────────────┘
               ▼
        (Aprovado? Sim)
               ▼
┌─────────────────────────────────────┐
│ 5. PR develop → main & Merge        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 6. GitHub Actions Deploy para PROD  │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 7. Testar em PROD                   │
│    https://www.granjarecantofeliz.com/
└─────────────────────────────────────┘
```

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Commit bem-sucedido em develop
- [ ] GitHub Actions passou DEV
- [ ] Testado manualmente em DEV
- [ ] PR criado (develop → main)
- [ ] Revisado por colegas
- [ ] Merge feito para main
- [ ] GitHub Actions passou PROD
- [ ] Testado manualmente em PROD
- [ ] Tag de release criada
- [ ] Documentação atualizada
- [ ] Equipe notificada
- [ ] Backup verificado

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| GitHub Actions falhou | Ver logs em Actions, corrigir e fazer novo push |
| Imagens não aparecem | Verificar cache CloudFront, invalidar se necessário |
| Página lenta | Usar DevTools (F12) para identificar gargalo |
| JSON inválido | Corrigir dados/produtos.json e fazer novo commit |
| Merge conflicts | Resolver conflitos localmente e fazer novo push |

---

## 📞 Contatos

- **Dúvidas CI/CD:** Consultar GUIA-DEPLOY-CICD.md
- **Problemas AWS:** Verificar AWS Console
- **Emergência:** Usar Rollback (ver seção acima)

---

**Pronto? Vamos fazer o push! 🚀**
