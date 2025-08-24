#!/bin/bash
# Deploy AWS via CloudShell - Granja Recanto Feliz
# Execute no AWS CloudShell (console AWS > ícone terminal)

echo "🚀 Deploy AWS - Granja Recanto Feliz"
echo "===================================="

# Configurações
BUCKET_NAME="granjarecantofeliz-site"
REGION="sa-east-1"

# 1. Criar usuário IAM (se necessário)
echo "1. Criando usuário IAM..."
aws iam create-user --user-name granja-deploy-user 2>/dev/null || echo "Usuário já existe"

# 2. Anexar política S3
echo "2. Configurando permissões..."
aws iam attach-user-policy --user-name granja-deploy-user --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# 3. Criar Access Keys
echo "3. Criando access keys..."
aws iam create-access-key --user-name granja-deploy-user > access-keys.json 2>/dev/null || echo "Keys já existem"

# 4. Criar bucket S3
echo "4. Criando bucket S3..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 5. Configurar site estático
echo "5. Configurando site estático..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 6. Configurar política pública
echo "6. Configurando acesso público..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# 7. Remover block public access
echo "7. Removendo bloqueio de acesso público..."
aws s3api delete-public-access-block --bucket $BUCKET_NAME

# 8. Criar arquivo de upload
echo "8. Preparando arquivos para upload..."
cat > upload-files.sh << 'EOF'
#!/bin/bash
# Este script deve ser executado na pasta do projeto

BUCKET_NAME="granjarecantofeliz-site"

echo "Fazendo upload dos arquivos..."

# Upload de arquivos individuais
aws s3 cp index.html s3://$BUCKET_NAME/ --content-type "text/html"
aws s3 cp admin.html s3://$BUCKET_NAME/ --content-type "text/html"

# Upload de pastas
aws s3 sync css/ s3://$BUCKET_NAME/css/ --exclude "*.py" --exclude "backup-*"
aws s3 sync js/ s3://$BUCKET_NAME/js/ --exclude "*.py" --exclude "backup-*"
aws s3 sync imagens/ s3://$BUCKET_NAME/imagens/ --exclude "*.py" --exclude "backup-*"
aws s3 sync dados/ s3://$BUCKET_NAME/dados/ --exclude "*.py" --exclude "backup-*"
aws s3 sync admin/ s3://$BUCKET_NAME/admin/ --exclude "*.py" --exclude "backup-*"

echo "Upload concluído!"
echo "Site disponível em: http://$BUCKET_NAME.s3-website-sa-east-1.amazonaws.com"
EOF

chmod +x upload-files.sh

# URL do site
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo "=========================="
echo "Bucket: $BUCKET_NAME"
echo "Região: $REGION"
echo "Site: $WEBSITE_URL"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Faça upload dos arquivos do projeto para o CloudShell"
echo "2. Execute: ./upload-files.sh"
echo "3. Teste o site no link acima"
echo ""
echo "💡 Para fazer upload dos arquivos:"
echo "   - Use o botão 'Upload' no CloudShell"
echo "   - Ou use: wget/curl para baixar do GitHub"