# 🚀 Deploy via AWS CloudShell

## 📋 Passo a Passo Completo

### 1. **Abrir CloudShell**
- No console AWS, clique no ícone **terminal** (CloudShell)
- Aguarde inicializar (1-2 minutos)

### 2. **Executar Script de Configuração**
```bash
# Copie e cole este comando:
curl -o deploy-cloudshell.sh https://raw.githubusercontent.com/seu-repo/deploy-cloudshell.sh
chmod +x deploy-cloudshell.sh
./deploy-cloudshell.sh
```

### 3. **Upload dos Arquivos do Projeto**

**Opção A: Upload Manual**
1. Clique em **"Actions" → "Upload file"** no CloudShell
2. Selecione todos os arquivos do projeto (exceto backup-*)
3. Aguarde upload concluir

**Opção B: Via Git (se tiver repositório)**
```bash
git clone https://github.com/seu-usuario/e-commerce-recantofeliz.git
cd e-commerce-recantofeliz
```

### 4. **Fazer Deploy**
```bash
# Execute o script de upload:
./upload-files.sh
```

### 5. **Testar Site**
- Acesse: `http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com`

## 🔧 Comandos Individuais (se preferir)

### Criar Bucket:
```bash
aws s3 mb s3://granjarecantofeliz-site --region sa-east-1
```

### Configurar Site Estático:
```bash
aws s3 website s3://granjarecantofeliz-site --index-document index.html
```

### Remover Bloqueio Público:
```bash
aws s3api delete-public-access-block --bucket granjarecantofeliz-site
```

### Política Pública:
```bash
cat > policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::granjarecantofeliz-site/*"
    }]
}
EOF

aws s3api put-bucket-policy --bucket granjarecantofeliz-site --policy file://policy.json
```

### Upload de Arquivos:
```bash
# HTML
aws s3 cp index.html s3://granjarecantofeliz-site/
aws s3 cp admin.html s3://granjarecantofeliz-site/

# Pastas
aws s3 sync css/ s3://granjarecantofeliz-site/css/
aws s3 sync js/ s3://granjarecantofeliz-site/js/
aws s3 sync imagens/ s3://granjarecantofeliz-site/imagens/
aws s3 sync dados/ s3://granjarecantofeliz-site/dados/
aws s3 sync admin/ s3://granjarecantofeliz-site/admin/
```

## ✅ Verificar Deploy:
```bash
# Listar arquivos no bucket:
aws s3 ls s3://granjarecantofeliz-site --recursive

# Testar endpoint:
curl -I http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com
```

## 🌐 URLs Finais:
- **Site:** http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com
- **Admin:** http://granjarecantofeliz-site.s3-website-sa-east-1.amazonaws.com/admin.html

## 💰 Custos:
- **CloudShell:** Gratuito (1GB storage)
- **S3:** ~$0.01/mês (projeto otimizado)
- **Total:** Praticamente gratuito

## 🆘 Troubleshooting:

**Erro de permissão:**
```bash
aws sts get-caller-identity  # Verificar usuário
```

**Bucket já existe:**
```bash
aws s3 ls  # Listar buckets existentes
```

**Site não carrega:**
```bash
aws s3api get-bucket-website --bucket granjarecantofeliz-site
```