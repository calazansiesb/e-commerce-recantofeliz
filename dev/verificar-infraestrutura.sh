#!/bin/bash
# Verificação da Infraestrutura AWS - Granja Recanto Feliz

echo "🔍 VERIFICANDO INFRAESTRUTURA AWS - GRANJA RECANTO FELIZ"
echo "======================================================="

# 1. Verificar buckets S3
echo ""
echo "📦 1. BUCKETS S3:"
echo "----------------"
aws s3 ls | grep granja

echo ""
echo "📦 Detalhes do bucket principal:"
aws s3api get-bucket-location --bucket granjarecantofeliz-site 2>/dev/null || echo "❌ Bucket granjarecantofeliz-site não encontrado"

echo ""
echo "📦 Detalhes do bucket sistema:"
aws s3api get-bucket-location --bucket granja-relatorios-app 2>/dev/null || echo "❌ Bucket granja-relatorios-app não encontrado"

echo ""
echo "📦 Website configuration do bucket principal:"
aws s3api get-bucket-website --bucket granjarecantofeliz-site 2>/dev/null || echo "❌ Website não configurado"

# 2. Verificar distribuições CloudFront
echo ""
echo "🌐 2. DISTRIBUIÇÕES CLOUDFRONT:"
echo "------------------------------"
aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, `granjarecantofeliz.com`) || contains(Aliases.Items, `www.granjarecantofeliz.com`) || contains(Aliases.Items, `sistema.granjarecantofeliz.com`)].{Id:Id,DomainName:DomainName,Aliases:Aliases.Items,Status:Status,Origins:Origins.Items[0].DomainName}' --output table

# 3. Verificar Route 53
echo ""
echo "🌍 3. ROUTE 53 - ZONAS HOSPEDADAS:"
echo "----------------------------------"
aws route53 list-hosted-zones --query 'HostedZones[?contains(Name, `granjarecantofeliz.com`)].{Id:Id,Name:Name,RecordCount:ResourceRecordSetCount}' --output table

echo ""
echo "🌍 Registros DNS da zona:"
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query 'HostedZones[?contains(Name, `granjarecantofeliz.com`)].Id' --output text | cut -d'/' -f3)
if [ ! -z "$HOSTED_ZONE_ID" ]; then
    aws route53 list-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --query 'ResourceRecordSets[?Type==`A` || Type==`CNAME`].{Name:Name,Type:Type,Value:ResourceRecords[0].Value}' --output table
else
    echo "❌ Zona hospedada não encontrada"
fi

# 4. Verificar certificados ACM
echo ""
echo "🔒 4. CERTIFICADOS SSL (ACM):"
echo "----------------------------"
echo "Região us-east-1 (CloudFront):"
aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[?contains(DomainName, `granjarecantofeliz.com`)].{DomainName:DomainName,Status:Status,Arn:CertificateArn}' --output table

echo ""
echo "Região sa-east-1 (São Paulo):"
aws acm list-certificates --region sa-east-1 --query 'CertificateSummaryList[?contains(DomainName, `granjarecantofeliz.com`)].{DomainName:DomainName,Status:Status,Arn:CertificateArn}' --output table

# 5. Verificar API Gateway (se existir)
echo ""
echo "🔌 5. API GATEWAY:"
echo "-----------------"
aws apigateway get-rest-apis --query 'items[?contains(name, `granja`) || contains(name, `Granja`)].{Id:id,Name:name,CreatedDate:createdDate}' --output table 2>/dev/null || echo "❌ Nenhuma API encontrada ou serviço não disponível"

# 6. Verificar DynamoDB
echo ""
echo "🗄️ 6. TABELAS DYNAMODB:"
echo "----------------------"
aws dynamodb list-tables --query 'TableNames[?contains(@, `granja`) || contains(@, `Granja`) || contains(@, `produto`) || contains(@, `Produto`)]' --output table

# 7. Verificar Lambda Functions
echo ""
echo "⚡ 7. FUNÇÕES LAMBDA:"
echo "-------------------"
aws lambda list-functions --query 'Functions[?contains(FunctionName, `granja`) || contains(FunctionName, `Granja`)].{Name:FunctionName,Runtime:Runtime,LastModified:LastModified}' --output table

# 8. Verificar IAM Roles relacionadas
echo ""
echo "🔐 8. ROLES IAM:"
echo "---------------"
aws iam list-roles --query 'Roles[?contains(RoleName, `granja`) || contains(RoleName, `Granja`) || contains(RoleName, `CloudFront`) || contains(RoleName, `S3`)].{RoleName:RoleName,CreateDate:CreateDate}' --output table

# 9. Verificar custos (últimos 30 dias)
echo ""
echo "💰 9. CUSTOS (ÚLTIMOS 30 DIAS):"
echo "------------------------------"
START_DATE=$(date -d "30 days ago" +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)
aws ce get-cost-and-usage --time-period Start=$START_DATE,End=$END_DATE --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE --query 'ResultsByTime[0].Groups[?MetricValue.Amount>`0`].{Service:Keys[0],Cost:MetricValue.Amount}' --output table 2>/dev/null || echo "❌ Dados de custo não disponíveis"

echo ""
echo "✅ VERIFICAÇÃO CONCLUÍDA!"
echo "========================"
echo ""
echo "📋 RESUMO ESPERADO (baseado na documentação):"
echo "- Bucket S3: granjarecantofeliz-site (sa-east-1)"
echo "- Bucket S3: granja-relatorios-app (sa-east-1)"
echo "- CloudFront: E10QPOHV1RNFOA (www.granjarecantofeliz.com)"
echo "- CloudFront: E1XTMQ6QPLF7PD (sistema.granjarecantofeliz.com)"
echo "- Route 53: Z04264973SYHQQ0HCEEYM (granjarecantofeliz.com)"
echo "- ACM: Certificados em us-east-1"