# 🚀 Guia de Configuração de CI/CD

## Pré-requisitos

- ✅ Repositório GitHub
- ✅ AWS (S3, CloudFront, IAM)
- ✅ Git configurado localmente

---

## 1️⃣ Estrutura de Branches

```
main (produção)
  ↑
  └─ Pull Request + Aprovação
  ↑
develop (homologação/DEV)
  ↑
  └─ Feature branches
     - feature/melhoria-x
     - bugfix/correcao-y
     - release/v1.0.0
```

### Criando branches localmente

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/granja-recanto-feliz.git
cd granja-recanto-feliz

# Criar branch develop (se não existir)
git checkout -b develop
git push -u origin develop

# Criar feature branch
git checkout develop
git pull
git checkout -b feature/padronizacao-imagens
```

---

## 2️⃣ Configurar AWS para CI/CD

### Criar Usuário IAM para Deploy

1. **Acessar AWS IAM Console**
   ```
   https://console.aws.amazon.com/iam/
   ```

2. **Criar novo usuário (Programmatic Access)**
   ```
   Nome: github-deployer
   Tipo: Programmatic Access
   ```

3. **Adicionar permissões inline**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket",
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::granja-recanto-feliz-dev/*",
           "arn:aws:s3:::granja-recanto-feliz-prod/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation",
           "cloudfront:GetInvalidation"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

4. **Copiar credenciais**
   - Access Key ID
   - Secret Access Key
   - ⚠️ **NUNCA compartilhar ou commitar essas credenciais!**

---

## 3️⃣ Configurar GitHub Secrets

1. **Acessar Configurações do Repositório**
   ```
   GitHub → Settings → Secrets and variables → Actions
   ```

2. **Adicionar Secrets (New Repository Secret)**

   | Nome | Valor |
   |------|-------|
   | `AWS_ACCESS_KEY_ID` | Access Key do usuário IAM |
   | `AWS_SECRET_ACCESS_KEY` | Secret Access Key |
   | `CLOUDFRONT_DEV_ID` | ID do CloudFront DEV |
   | `CLOUDFRONT_PROD_ID` | ID do CloudFront PROD |

3. **Encontrar IDs CloudFront**
   ```bash
   # No terminal com AWS CLI configurado
   aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id, DomainName]' --output table
   ```

---

## 4️⃣ Fluxo de Deploy

### 📝 Para Desenvolvedor

#### **Desenvolvimento Local**
```bash
# 1. Criar feature branch
git checkout develop
git pull
git checkout -b feature/minha-feature

# 2. Fazer alterações
# ... editar arquivos ...

# 3. Commit e Push
git add .
git commit -m "feat: Adicionar nova funcionalidade"
git push -u origin feature/minha-feature
```

#### **Submeter para DEV (Homologação)**
```bash
# 1. Criar Pull Request
git push -u origin feature/minha-feature

# 2. GitHub Actions roda automaticamente
#    - Validação
#    - Build
#    - Deploy para DEV
```

**No GitHub:**
- Abrir Pull Request (PR) de `feature/minha-feature` → `develop`
- Aguardar GitHub Actions validar
- Revisar mudanças
- Fazer merge para `develop`
- GitHub Actions faz deploy automático para `/dev/`

#### **Testar em DEV**
```
URL: https://www.granjarecantofeliz.com/dev/
- Testar todas as funcionalidades
- Verificar imagens
- Validar formulários
- Testar em mobile
```

#### **Deploy para PROD**
```bash
# 1. Criar PR de develop → main (quando DEV aprovado)
# 2. Revisar mudanças
# 3. Fazer merge para main
# 4. GitHub Actions faz deploy automático para PROD
```

---

## 5️⃣ Monitorar Deploy

### GitHub Actions

1. **Acessar Actions**
   ```
   GitHub → Actions
   ```

2. **Ver status do workflow**
   - ✅ Verde: Deploy concluído com sucesso
   - ⏳ Amarelo: Deploy em progresso
   - ❌ Vermelho: Deploy falhou

3. **Detalhes do workflow**
   - Clique no workflow para ver logs
   - Identificar onde falhou
   - Corrigir e fazer novo push

### Verificar Deploy

```bash
# Verificar se arquivos estão em S3
aws s3 ls s3://granja-recanto-feliz-dev/ --recursive | head -20

# Testar URL
curl -I https://www.granjarecantofeliz.com/dev/index.html

# Verificar cache
curl -I https://www.granjarecantofeliz.com/dev/ | grep -i "cache-control"
```

---

## 6️⃣ Rollback de Deploy

Se algo der errado em PROD:

### Opção 1: Revert Git (Recomendado)
```bash
# 1. Identificar commit problemático
git log --oneline | head -10

# 2. Reverter commit
git revert <commit-hash>
git push

# 3. GitHub Actions automaticamente faz deploy da versão anterior
```

### Opção 2: Restaurar de Backup
```bash
# 1. Listar backups
ls -la backups/prod-*

# 2. Restaurar backup
aws s3 sync backups/prod-20251029_143022/ s3://granja-recanto-feliz-prod/ --delete

# 3. Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

---

## 7️⃣ Troubleshooting

### Deploy falhou - Como debugar?

**1. Verificar logs do GitHub Actions**
```
GitHub → Actions → Seu workflow → Logs detalhados
```

**2. Erros comuns**

| Erro | Solução |
|------|---------|
| `Access Denied` (S3) | Verificar IAM permissions |
| `JSON inválido` | Validar `dados/produtos.json` |
| `Imagens não carregam` | Verificar permissões S3 |
| `CloudFront timeout` | Aguardar invalidação completar |

**3. Testar localmente**
```bash
# Validar HTML/CSS/JS
npm install -g jshint csso-cli
jshint js/*.js
csso-cli style.css

# Validar JSON
python3 -c "import json; json.load(open('dados/produtos.json'))"
```

---

## 8️⃣ Boas Práticas

✅ **DO (Faça)**
- Sempre testar em DEV antes de PROD
- Usar commits descritivos
- Revisar PRs de colegas
- Manter secrets seguros
- Backup regularmente
- Documentar mudanças

❌ **DON'T (Não faça)**
- Commitar credentials/secrets
- Fazer push direto para `main`
- Deploy em horários de pico
- Ignorar validações de build
- Deletar backups
- Alterar manualmente S3 (sempre via deploy)

---

## 9️⃣ Checklist de Deploy

Antes de fazer deploy:

- [ ] Código testado localmente
- [ ] Sem erros de lint/validação
- [ ] Imagens otimizadas em `.jpg`
- [ ] JSON válido
- [ ] Commit message descritivo
- [ ] PR revisado
- [ ] Build passou no GitHub Actions
- [ ] Testado em DEV
- [ ] Documentação atualizada

---

## 🔟 Contatos & Suporte

- **Erro de Deploy:** Abrir Issue no GitHub
- **Problema AWS:** Verificar console AWS
- **Dúvidas CI/CD:** Consultar documentação GitHub Actions
- **Emergência:** Rollback manual (opção 2)

---

## 📚 Recursos Adicionais

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS S3 CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Git Workflow Guide](https://git-scm.com/book/en/v2)

---

**Último atualizado:** 29 de outubro de 2025
**Mantido por:** Equipe de Desenvolvimento
