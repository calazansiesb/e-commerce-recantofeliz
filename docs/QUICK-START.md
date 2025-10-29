# 🚀 Quick Start - Deploy em 5 Minutos

## ⚡ TL;DR (Muito Longo; Não Li)

```bash
# 1. Testes
bash test-pre-deploy.sh

# 2. Commit & Push para DEV
git add .
git commit -m "feat: Descrição da mudança"
git push origin develop

# 3. Aguardar GitHub Actions (1-2 min)
# 4. Testar em: https://www.granjarecantofeliz.com/dev/

# 5. Se OK, fazer para PROD:
# - Abrir PR develop → main no GitHub
# - Revisar & Aprovar
# - Merge
# - GitHub Actions faz deploy automático
# - Testar em: https://www.granjarecantofeliz.com/
```

---

## 📋 Checklist Rápido

```
☐ Mudanças feitas localmente
☐ bash test-pre-deploy.sh passou
☐ git commit feito
☐ git push origin develop executado
☐ GitHub Actions passou (verde ✅)
☐ Testado em DEV manualmente
☐ PR criado develop → main (se indo para PROD)
☐ PR aprovado por 1+ reviewer
☐ Merge feito
☐ GitHub Actions PROD passou (verde ✅)
☐ Testado em PROD manualmente
```

---

## 🔴 Algo Deu Errado?

### GitHub Actions falhou (❌ vermelho)

1. Clique no workflow vermelho
2. Veja o log e identifique o erro
3. Corrija localmente
4. `git add . && git commit -m "fix: ..." && git push`
5. Tente de novo

### Imagens não aparecem

```bash
# Invalidar cache CloudFront
aws cloudfront create-invalidation \
  --distribution-id CLOUDFRONT_ID \
  --paths "/*"
```

### Quer reverter?

```bash
# Se em DEV
git revert HEAD
git push origin develop

# Se em PROD (cuidado!)
git revert HEAD
git push origin main
# GitHub Actions automaticamente faz rollback
```

---

## 📚 Documentação Completa

Se precisar de mais detalhes:

1. **Setup (primeira vez):** `docs/GUIA-DEPLOY-CICD.md`
2. **Passo a passo:** `docs/PUSH-DEV-PROD.md`
3. **Troubleshooting:** `docs/RESUMO-EXECUTIVO.md`
4. **Perguntas?** Ver `docs/CI-CD-PIPELINE.md`

---

## 🎯 Comandos Mais Usados

```bash
# Ver branch atual
git branch

# Ver mudanças
git status

# Ver commits
git log --oneline -5

# Adicionar tudo
git add .

# Commit
git commit -m "seu message aqui"

# Push para develop
git push origin develop

# Pull (sempre antes de começar)
git pull origin develop

# Ver logs GitHub Actions
# → GitHub → Actions → seu workflow
```

---

## ⏱️ Tempo Estimado

| Tarefa | Tempo |
|--------|-------|
| Testes locais | 30s |
| Commit & Push | 20s |
| GitHub Actions DEV | 1-2 min |
| Testes manuais | 2-5 min |
| PR & Merge PROD | 1 min |
| GitHub Actions PROD | 1-2 min |
| **Total** | **~7-10 min** |

---

## 🎉 Pronto!

O site está atualizado em DEV ou PROD. Você é um herói! 🦸

---

**Dúvidas rápidas?**
- `ls docs/` para ver todos os guias
- GitHub Issues para problemas
- Slack #dev-granja para bate-papo

