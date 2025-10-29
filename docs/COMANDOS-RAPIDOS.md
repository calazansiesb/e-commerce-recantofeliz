# 🔧 COMANDOS RÁPIDOS - CI/CD

Copie e cole os comandos abaixo no terminal PowerShell.

---

## 📍 Navegar até o Projeto

```powershell
cd "f:\DSAI\AWS RECANTO FELIZ\BACKUP-AWS-RECANTO-FELIZ\01-Sites-Web\site-principal"
```

---

## ✅ Validar Código Antes de Push

```powershell
bash test-pre-deploy.sh
```

**Esperado:** Todos ✅ OK

---

## 🌳 Fazer Push para DEV

### 1️⃣ Ver o que vai fazer commit
```powershell
git status
```

### 2️⃣ Adicionar todos arquivos
```powershell
git add .
```

### 3️⃣ Criar commit
```powershell
git commit -m "feat: Padronizar imagens .jpg e otimizar performance"
```

### 4️⃣ Fazer push para develop (DEV)
```powershell
git push origin develop
```

**Resultado:** GitHub Actions começa automaticamente ⚡

---

## 📊 Ver Status do Deploy

### Abrir Dashboard
```
GitHub → Seu Repo → Actions
```

Ou no Terminal (Linux/Mac):
```bash
# Ver último commit e status
git log --oneline -5
```

---

## 🌐 Testar DEV Online

Após deploy terminar (3-5 min):

```
https://www.granjarecantofeliz.com/dev/
```

**Abrir DevTools (F12) e testar:**
- Página carrega? ✅
- Imagens aparecem? ✅
- Modal abre rápido (<500ms)? ✅
- Console limpo (sem erros)? ✅

---

## 🚀 Fazer Push para PROD

### Opção A: Via Git (Terminal)

```powershell
# 1. Ir para main
git checkout main

# 2. Atualizar main
git pull origin main

# 3. Integrar develop em main
git merge develop

# 4. Enviar para PROD
git push origin main
```

### Opção B: Via GitHub (Browser)

1. GitHub → Pull Requests → New
2. Compare: `develop` → `main`
3. Create Pull Request
4. Approvar review
5. Merge Pull Request

**Resultado:** GitHub Actions começa automaticamente ⚡

---

## ✨ Testar PROD Online

Após deploy terminar (3-5 min):

```
https://www.granjarecantofeliz.com/
```

**Testes rápidos (F12):**
- Homepage carrega? ✅
- Produtos visíveis? ✅
- Modal rápido? ✅
- Carrinho funciona? ✅

---

## 🆘 Troubleshooting Rápido

### Deploy falhou?

```powershell
# Ver último erro
git log --oneline -3
git show HEAD
```

Ir em: GitHub → Actions → [workflow que falhou] → Ver logs

### Fazer rollback PROD?

```powershell
# Reverter último commit
git revert HEAD --no-edit
git push origin main
```

GitHub Actions fará deploy da versão anterior 🔄

### Sincronizar tudo?

```powershell
# Puxar todas as branches
git fetch --all

# Atualizar develop
git checkout develop
git pull origin develop

# Atualizar main
git checkout main
git pull origin main
```

---

## 📝 Ver Histórico de Deploys

```powershell
# Últimas 10 alterações
git log --oneline -10

# Ver quem fez commit e quando
git log --pretty=format:"%h %an %ar %s" -10
```

---

## 🔐 Verificar Secrets (Sem expor valores)

Local: GitHub → Settings → Secrets → Actions

- [ ] AWS_ACCESS_KEY_ID ✓
- [ ] AWS_SECRET_ACCESS_KEY ✓
- [ ] CLOUDFRONT_DEV_ID ✓
- [ ] CLOUDFRONT_PROD_ID ✓

---

## 🎯 Sequência Completa (5 min)

```powershell
# 1. Validar
bash test-pre-deploy.sh

# 2. Preparar
git add .

# 3. Commitar
git commit -m "feat: Deploy CI/CD - Imagens otimizadas"

# 4. Push DEV
git push origin develop

# 5. Aguardar 3-5 min, depois testar em:
# https://www.granjarecantofeliz.com/dev/

# 6. Após testes OK, fazer push PROD
git checkout main
git pull origin main
git merge develop
git push origin main

# 7. Aguardar 3-5 min, depois testar em:
# https://www.granjarecantofeliz.com/
```

---

## 📱 Atalhos Úteis

| Ação | Comando |
|------|---------|
| Status | `git status` |
| Ver mudanças | `git diff` |
| Adicionar tudo | `git add .` |
| Commit | `git commit -m "msg"` |
| Push DEV | `git push origin develop` |
| Push PROD | `git push origin main` |
| Reverter | `git revert HEAD --no-edit` |
| Ver log | `git log --oneline -10` |
| Branches | `git branch -a` |
| Validar | `bash test-pre-deploy.sh` |

---

## 🌳 Branch Strategy Explicado

```
main (PRODUÇÃO)
  ↑
  └─ MERGE quando pronto
  
develop (DESENVOLVIMENTO/STAGING)
  ↑
  └─ PUSH quando commitar

feature/* (FEATURES)
  └─ Branches temporários para trabalho
```

**Fluxo:**
1. Trabalha em `feature/nome` → Commit
2. Merge em `develop` → Push
3. GitHub Actions: Deploy DEV automático
4. Testar em DEV
5. Pull Request `develop` → `main`
6. Após review: Merge
7. GitHub Actions: Deploy PROD automático

---

## 💡 Dicas Profissionais

### ✅ Boas Práticas

- **Sempre validar antes de push:** `bash test-pre-deploy.sh`
- **Commits descritivos:** `"feat: Descrição clara do que mudou"`
- **Testar em DEV antes de PROD:** Sempre!
- **Fazer backup local:** `git stash` se não tiver certeza

### ❌ Evitar

- ❌ Push direto para `main` (sempre via `develop`)
- ❌ Commits sem mensagem descritiva
- ❌ Modificar `main` localmente sem git pull
- ❌ Ignorar erros do GitHub Actions

### 🚀 Otimizações

```powershell
# Criar alias para comandos longos
git config --global alias.devpush "push origin develop"
git config --global alias.prodpush "push origin main"
git config --global alias.validate "!bash test-pre-deploy.sh"

# Depois pode usar:
git devpush     # Em vez de: git push origin develop
git prodpush    # Em vez de: git push origin main
git validate    # Em vez de: bash test-pre-deploy.sh
```

---

## 🔗 Links Úteis

- **Documentação Completa:** `docs/GUIA-DEPLOY-CICD.md`
- **Passo-a-Passo:** `docs/PUSH-DEV-PROD.md`
- **Checklist:** `docs/CHECKLIST-DEPLOY.md`
- **GitHub Actions:** GitHub → Repo → Actions
- **AWS CloudFront:** AWS Console → CloudFront Distributions

---

## ⏱️ Tempos Esperados

| Operação | Tempo |
|----------|-------|
| Validação local | 30 seg |
| Push git | 5-10 seg |
| GitHub Actions | 3-5 min |
| Deploy S3 | 2-3 min |
| Cache invalidação | 30-60 seg |
| Total (DEV) | ~5 min |
| Total (PROD) | ~5 min |

---

**Sucesso?** 🎉 Seu deploy está live! 

Checklist: ✅ DEV tested → ✅ PROD deployed → ✅ Monitoring active
