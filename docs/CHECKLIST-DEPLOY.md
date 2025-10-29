# ✅ CHECKLIST - Deploy DEV/PROD

## 📋 Pré-Deploy (Antes de fazer push)

### Preparação Local
- [ ] Git instalado e configurado
- [ ] Credenciais GitHub configuradas
- [ ] AWS CLI instalado (para troubleshooting)
- [ ] Bash/PowerShell disponível

### Validação de Código
```bash
bash test-pre-deploy.sh
```
- [ ] ✅ Estrutura de pastas validada
- [ ] ✅ JSON válido (dados/produtos.json)
- [ ] ✅ Imagens presentes (33 .jpg)
- [ ] ✅ HTML5 tags verificadas
- [ ] ✅ Sem erros no console

### Confirmações
- [ ] Fiz backup local (git stash se necessário)
- [ ] Testei em navegador localmente
- [ ] Revisei todas as mudanças (git diff)

---

## 🚀 FASE 1: Configurar GitHub Secrets

**Local:** GitHub.com → Seu Repo → Settings → Secrets and variables → Actions

### Adicionar 4 Secrets Novo

#### Secret 1: AWS_ACCESS_KEY_ID
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA***XXXXX (seu access key da AWS)
```
- [ ] Criado

#### Secret 2: AWS_SECRET_ACCESS_KEY
```
Name: AWS_SECRET_ACCESS_KEY
Value: ****SECRET KEY**** (sua secret key da AWS)
```
- [ ] Criado

#### Secret 3: CLOUDFRONT_DEV_ID
```
Name: CLOUDFRONT_DEV_ID
Value: E123456ABCDEFG (seu Distribution ID de DEV)
```
- [ ] Criado

#### Secret 4: CLOUDFRONT_PROD_ID
```
Name: CLOUDFRONT_PROD_ID
Value: E654321FEDCBA (seu Distribution ID de PROD)
```
- [ ] Criado

### Verificação
- [ ] Todos 4 secrets aparecem em Actions → Secrets
- [ ] Nenhum secret está visível (masked em logs)

**Tempo estimado:** 5 minutos

---

## 🌳 FASE 2: Push para DEV (Branch Develop)

### Preparar Commit
```bash
cd "f:\DSAI\AWS RECANTO FELIZ\BACKUP-AWS-RECANTO-FELIZ\01-Sites-Web\site-principal"
git status
```
- [ ] Status mostra arquivos modificados esperados

### Adicionar Mudanças
```bash
git add .
```
- [ ] Todos arquivos staged (git status mostra "Changes to be committed")

### Criar Commit
```bash
git commit -m "feat: Padronizar imagens em .jpg e otimizar performance de modals com CI/CD"
```
- [ ] Commit criado com sucesso

### Push para DEV (Develop)
```bash
git push origin develop
```
- [ ] Push bem-sucedido
- [ ] Vê mensagem: "Everything up-to-date" ou sucesso

**Tempo estimado:** 2 minutos

---

## 🔄 FASE 3: Monitorar GitHub Actions (DEV)

### Acessar Workflow
Local: GitHub.com → Seu Repo → Actions

### Verificar Execução
- [ ] Workflow iniciou (vê nome do commit)
- [ ] Job "validate" executando
- [ ] Job "build" na fila
- [ ] Job "deploy-dev" na fila

### Acompanhar Logs
Para cada job:
1. Clique no job
2. Expanda "Deploy to S3 DEV" ou similar
3. Procure por:
   - ✅ "✓ Upload complete"
   - ✅ "✓ CloudFront invalidation"
   - ❌ Qualquer mensagem de erro

### Sucesso Esperado
```
✓ Validation completed
✓ Build completed  
✓ DEV deployment completed
✓ Artifacts uploaded
```

- [ ] Todos jobs completados com sucesso
- [ ] Nenhum job com status ❌ FAILED

**Tempo estimado:** 3-5 minutos

---

## 🌐 FASE 4: Testar em DEV

### Abrir DEV
URL: `https://www.granjarecantofeliz.com/dev/`

**Nota:** Pode levar 30-60s para ficar online após deploy

### Testes Funcionais

#### Carregamento
- [ ] Página carrega sem erro 404
- [ ] Layout aparece corretamente
- [ ] Imagens carregam visíveis

#### Performance
```
Abrir DevTools (F12) → Performance → Record
Clicar em produto → Medir tempo do modal abrir
```
- [ ] Modal abre em < 500ms ⚡
- [ ] Antes: 3-5 segundos ❌
- [ ] Depois: <500ms ✅

#### Produtos
- [ ] 3+ produtos visíveis
- [ ] Cada produto tem imagem .jpg
- [ ] Filtros funcionam (se houver)
- [ ] Paginação funciona (se houver)

#### Carrinho
- [ ] Clicar "Adicionar ao Carrinho" funciona
- [ ] Carrinho atualiza quantidade
- [ ] Remover item funciona
- [ ] Checkout carrega

#### Console (F12)
```
DevTools → Console
```
- [ ] Sem mensagens de erro vermelho ❌
- [ ] Sem avisos críticos

### Bugs Encontrados?
```
1. Documento o erro (screenshot/console log)
2. Retorno à secção "Troubleshooting" no PROXIMOS-PASSOS.md
3. Corrija e faça novo push
```

**Tempo estimado:** 15-30 minutos

---

## 📤 FASE 5: Deploy para PRODUÇÃO

**Pré-requisito:** DEV testado e aprovado ✅

### Criar Pull Request (Recomendado)

Local: GitHub.com → Seu Repo → Pull Requests

#### Paso 1: Novo PR
```
Clique: "New Pull Request"
```

#### Paso 2: Configurar
```
Base branch: main
Compare branch: develop
```
- [ ] Configurado corretamente

#### Paso 3: Criar PR
```
Title: "chore: Deploy v1 - Imagens otimizadas e performance melhorada"

Description:
- Padronização de imagens em .jpg
- Otimização de modal (3-5s → 100ms)
- Implementação de CI/CD com GitHub Actions
- Deploy com cache inteligente
- Backup automático antes de deploy

Fixes: #X (se houver issue)
Closes: #Y (se houver issue)
```
- [ ] PR criado

#### Paso 4: Review
- [ ] Review solicitado a colega (opcional)
- [ ] Aprovado
- [ ] Ready to merge

#### Paso 5: Merge
```
Clique: "Merge pull request"
```
- [ ] Mergido com sucesso
- [ ] Branch deletado após merge (recomendado)

**Alternativa (Sem PR):**
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

**Tempo estimado:** 5-10 minutos (incluindo review)

---

## 🔄 FASE 6: Monitorar GitHub Actions (PROD)

### Acessar Workflow
Local: GitHub.com → Seu Repo → Actions

### Verificar Execução
- [ ] Novo workflow iniciou (diferente do DEV)
- [ ] Executando job "validate"
- [ ] Job "build" na fila
- [ ] Job "deploy-prod" na fila (pode ser aprovação manual)

### Acompanhar Logs
- [ ] ✅ Validation concluído
- [ ] ✅ Build concluído
- [ ] ✅ Backup criado (Log: "✓ Backup completed")
- [ ] ✅ PROD deployment concluído
- [ ] ✅ CloudFront invalidado

### Sucesso Esperado
```
✓ Pre-deployment backup: CREATED
✓ PROD deployment: COMPLETED
✓ CloudFront invalidation: SUCCESSFUL
✓ Health check: PASSED (200 OK)
```

- [ ] Todos jobs com ✅ SUCCESS
- [ ] Nenhum ❌ FAILED

**Nota:** Se houver aprovação manual, aparecerá tela de review antes de fazer deploy

**Tempo estimado:** 3-5 minutos

---

## ✨ FASE 7: Validar PROD

### Abrir PROD
URL: `https://www.granjarecantofeliz.com/`

**Nota:** Pode levar 1-2 minutos se cache foi invalidado

### Testes Críticos (Rápidos)

#### Funcionalidade
- [ ] Homepage carrega sem erro
- [ ] Produtos visíveis
- [ ] Modal abre rápido
- [ ] Carrinho funciona
- [ ] Sem erros no console (F12)

#### Performance
```
Open DevTools (F12) → Network
Recarregar página (Ctrl+Shift+Del para cache limpo)
```
- [ ] Imagens carregam de CDN (vê "CloudFront" ou "amazonaws.com")
- [ ] Tempo total < 3 segundos
- [ ] Tamanho das imagens ~80KB cada (não 150KB+)

#### Comparação Antes/Depois
| Item | Antes | Depois | Esperado |
|------|-------|--------|----------|
| Modal | 3-5s | <500ms | ✅ |
| Img size | 150KB | 80KB | ✅ |
| Requests | 15+ | 1 | ✅ |

### Testes Completos (15-30 min)
- [ ] Todos produtos aparecem com imagens
- [ ] Imagens são .jpg (não webp, png, etc)
- [ ] Modal abre em tempo real (não pula/flutua)
- [ ] Textos estão alinhados
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Checkout funciona
- [ ] Analytics funcionam (se houver)

### Bugs Encontrados?

**Opção 1: Rollback Rápido (< 5 min)**
```bash
git revert HEAD --no-edit
git push origin main
```
GitHub Actions fará deploy da versão anterior automaticamente

**Opção 2: Hotfix
```bash
# Corrigir bug em develop
git checkout develop
# Fazer fix
git add .
git commit -m "fix: Corrigir bug em PROD"
git push origin develop

# Testar em DEV
# Depois fazer novo merge para main
```

**Tempo estimado:** 15-30 minutos

---

## 📊 RESUMO FINAL

### Checklists Completos?

#### Antes de Iniciar
- [ ] GitHub Secrets configurados
- [ ] Teste pré-deploy passou
- [ ] Mudanças revisadas

#### Deploy DEV
- [ ] Push para develop completou
- [ ] GitHub Actions passou
- [ ] DEV testado e aprovado

#### Deploy PROD
- [ ] Pull Request criado/aprovado
- [ ] Mergido para main
- [ ] GitHub Actions passou
- [ ] PROD testado e validado

### Métricas Confirmadas?

| Métrica | Valor | Status |
|---------|-------|--------|
| Modal opening | <500ms | ✅ |
| Erro console | 0 | ✅ |
| Imagens .jpg | 100% | ✅ |
| Cache PROD | 3600s | ✅ |
| Health check | 200 OK | ✅ |

---

## 🎉 DEPLOY CONCLUÍDO!

- [x] Código otimizado
- [x] Imagens padronizadas
- [x] CI/CD funcionando
- [x] DEV validado
- [x] PROD ao vivo

### Próximas Tarefas (Opcional)

1. **Monitoramento**
   - [ ] Configurar alertas CloudWatch
   - [ ] Monitorar logs de erro

2. **Otimizações Futuras**
   - [ ] Implementar lazy loading
   - [ ] Adicionar minificação CSS/JS
   - [ ] Implementar service workers

3. **Documentação**
   - [ ] Treinar time em novo fluxo
   - [ ] Documentar procedimentos de rollback
   - [ ] Criar playbooks para devs

---

**Status:** 🟢 READY FOR PRODUCTION

**Suporte:** Ver docs em `docs/` para troubleshooting
