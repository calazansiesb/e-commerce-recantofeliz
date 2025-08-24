# Deploy Manual AWS - Granja Recanto Feliz

Guia passo a passo para migração manual (sem scripts).

## 📋 Pré-requisitos

- Conta AWS ativa
- Arquivos do projeto otimizados (✅ já feito)
- Acesso ao console AWS

## 🚀 Passo 1: Criar Bucket S3

### 1.1 Acessar S3
1. Entre no [Console AWS](https://console.aws.amazon.com)
2. Procure por "S3" e clique no serviço

### 1.2 Criar Bucket
1. Clique em **"Create bucket"**
2. **Bucket name**: `granjarecantofeliz-site` (ou outro nome único)
3. **Region**: `sa-east-1` (São Paulo) - mais próximo do Brasil
4. **Object Ownership**: Selecione "ACLs enabled"
5. **Block Public Access**: ⚠️ **DESMARQUE todas as opções**
6. Marque "I acknowledge..." 
7. Clique **"Create bucket"**

### 1.3 Configurar Site Estático
1. Entre no bucket criado
2. Vá na aba **"Properties"**
3. Role até **"Static website hosting"**
4. Clique **"Edit"**
5. Selecione **"Enable"**
6. **Index document**: `index.html`
7. **Error document**: `index.html`
8. Clique **"Save changes"**
9. **📝 Anote o endpoint** (ex: http://bucket.s3-website-sa-east-1.amazonaws.com)

## 📤 Passo 2: Upload dos Arquivos

### 2.1 Preparar Arquivos
Arquivos para upload (pasta do projeto):
```
✅ index.html
✅ admin.html
✅ css/
✅ js/
✅ imagens/
✅ dados/
✅ admin/
❌ backup-otimizacao-2025/ (não enviar)
❌ .git/ (não enviar)
❌ deploy-aws.py (não enviar)
```

### 2.2 Fazer Upload
1. Na aba **"Objects"** do bucket
2. Clique **"Upload"**
3. **Arraste todas as pastas e arquivos** (exceto os marcados com ❌)
4. Clique **"Upload"**
5. Aguarde conclusão (pode demorar alguns minutos)

### 2.3 Configurar Permissões
1. Selecione todos os arquivos enviados
2. Clique **"Actions" → "Make public"**
3. Confirme a ação

## 🌐 Passo 3: CloudFront (CDN) - Opcional mas Recomendado

### 3.1 Criar Distribuição
1. Procure por **"CloudFront"** no console AWS
2. Clique **"Create distribution"**
3. **Origin domain**: Cole o endpoint do S3 (sem http://)
4. **Origin path**: deixe vazio
5. **Viewer protocol policy**: "Redirect HTTP to HTTPS"
6. **Cache policy**: "Managed-CachingOptimized"
7. **Price class**: "Use only North America and Europe" (mais barato)
8. Clique **"Create distribution"**

### 3.2 Aguardar Ativação
- ⏳ Demora 15-20 minutos para ativar
- Status mudará de "Deploying" para "Enabled"
- **📝 Anote o domain name** (ex: d123456789.cloudfront.net)

## 🔗 Passo 4: Route 53 (DNS) - Apenas se quiser usar domínio próprio

⚠️ **Custa ~$0.50/mês** - Pule se quiser usar apenas o endpoint gratuito

### 4.1 Criar Hosted Zone
1. Procure por **"Route 53"**
2. Clique **"Hosted zones" → "Create hosted zone"**
3. **Domain name**: `granjarecantofeliz.com`
4. Clique **"Create hosted zone"**

### 4.2 Criar Record
1. Clique **"Create record"**
2. Deixe **Name** vazio (para domínio raiz)
3. **Record type**: A
4. **Alias**: ✅ Ative
5. **Route traffic to**: "Alias to S3 website endpoint"
6. **Region**: sa-east-1
7. **S3 bucket**: Selecione seu bucket
8. Clique **"Create records"**

### 4.3 Atualizar DNS do Domínio
1. Copie os 4 **Name servers** da Hosted Zone
2. Vá no registrador do seu domínio (onde comprou)
3. Substitua os DNS pelos da AWS
4. Aguarde propagação (até 48h)

## ✅ Passo 5: Validação e Testes

### 5.1 Testar Endpoints
1. **S3 direto**: http://bucket.s3-website-sa-east-1.amazonaws.com
2. **CloudFront**: https://d123456789.cloudfront.net
3. **Domínio próprio**: https://granjarecantofeliz.com (se configurado)

### 5.2 Checklist de Funcionalidades
- [ ] Site carrega corretamente
- [ ] Imagens aparecem (verificar se JPG funcionou)
- [ ] Carrossel funciona
- [ ] Produtos carregam
- [ ] Carrinho funciona
- [ ] Modal de produtos abre
- [ ] Formulário de pedido funciona
- [ ] WhatsApp abre corretamente

### 5.3 Teste de Performance
- Use [GTmetrix](https://gtmetrix.com) ou [PageSpeed Insights](https://pagespeed.web.dev)
- Site deve carregar em menos de 3 segundos
- Score deve ser A ou B

## 💰 Custos Estimados

### Gratuito (12 meses):
- **S3**: 5GB storage + 20k requests
- **CloudFront**: 1TB transferência
- **Route 53 queries**: 1 bilhão

### Custos após período gratuito:
- **S3**: ~$0.01-0.05/mês (site pequeno)
- **CloudFront**: ~$0.01-0.10/mês
- **Route 53 Hosted Zone**: $0.50/mês (se usar domínio próprio)

**Total estimado**: $0.50-0.65/mês

## 🆘 Solução de Problemas

### Site não carrega:
1. Verificar se bucket é público
2. Verificar se Static Website Hosting está ativo
3. Verificar se index.html existe

### Imagens não aparecem:
1. Verificar se arquivos JPG foram enviados
2. Verificar permissões dos arquivos
3. Verificar se caminhos estão corretos

### CloudFront não funciona:
1. Aguardar ativação completa (até 20 min)
2. Verificar se origin está correto
3. Fazer invalidação do cache se necessário

## 🎉 Próximos Passos

Após deploy bem-sucedido:
1. **Monitorar custos** no AWS Billing
2. **Configurar alertas** de custo
3. **Fazer backup** das configurações
4. **Documentar** URLs e configurações
5. **Testar regularmente** as funcionalidades

---

**🌱 Granja Recanto Feliz agora na nuvem AWS!** 🚀