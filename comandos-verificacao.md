# 🔍 Comandos para Verificar Infraestrutura AWS

## 📋 Comandos Individuais para CloudShell

### 1. Verificar Buckets S3
```bash
# Listar buckets relacionados à granja
aws s3 ls | grep granja

# Verificar bucket principal
aws s3api head-bucket --bucket granjarecantofeliz-site
aws s3api get-bucket-location --bucket granjarecantofeliz-site

# Verificar bucket do sistema
aws s3api head-bucket --bucket granja-relatorios-app
aws s3api get-bucket-location --bucket granja-relatorios-app

# Verificar configuração de website
aws s3api get-bucket-website --bucket granjarecantofeliz-site
```

### 2. Verificar CloudFront
```bash
# Listar todas as distribuições
aws cloudfront list-distributions --output table

# Verificar distribuição específica (ID: E10QPOHV1RNFOA)
aws cloudfront get-distribution --id E10QPOHV1RNFOA

# Verificar distribuição do sistema (ID: E1XTMQ6QPLF7PD)
aws cloudfront get-distribution --id E1XTMQ6QPLF7PD

# Buscar por domínio
aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, `granjarecantofeliz.com`)].{Id:Id,DomainName:DomainName,Aliases:Aliases.Items,Status:Status}'
```

### 3. Verificar Route 53
```bash
# Listar zonas hospedadas
aws route53 list-hosted-zones --output table

# Verificar zona específica (ID: Z04264973SYHQQ0HCEEYM)
aws route53 get-hosted-zone --id Z04264973SYHQQ0HCEEYM

# Listar registros DNS
aws route53 list-resource-record-sets --hosted-zone-id Z04264973SYHQQ0HCEEYM --output table
```

### 4. Verificar Certificados ACM
```bash
# Certificados em us-east-1 (para CloudFront)
aws acm list-certificates --region us-east-1 --output table

# Verificar certificado específico
aws acm describe-certificate --region us-east-1 --certificate-arn arn:aws:acm:us-east-1:311719320177:certificate/ada4aebf-f623-440c-8005-f83c43b37529

# Certificado do sistema
aws acm describe-certificate --region us-east-1 --certificate-arn arn:aws:acm:us-east-1:311719320177:certificate/3f7a2a99-62da-4018-9c46-ef37a7843229
```

### 5. Verificar API Gateway (para DynamoDB)
```bash
# Listar APIs
aws apigateway get-rest-apis --output table

# Buscar por nome
aws apigatgateway get-rest-apis --query 'items[?contains(name, `granja`)]'

# Verificar API específica (se existir)
# aws apigateway get-rest-api --rest-api-id SEU_API_ID
```

### 6. Verificar DynamoDB
```bash
# Listar tabelas
aws dynamodb list-tables --output table

# Buscar tabelas relacionadas
aws dynamodb list-tables --query 'TableNames[?contains(@, `Granja`) || contains(@, `produto`)]'

# Verificar tabela específica (se existir)
# aws dynamodb describe-table --table-name GranjaRecantoFeliz-Produtos
```

### 7. Verificar Status Geral
```bash
# Verificar região atual
aws configure get region

# Verificar conta AWS
aws sts get-caller-identity

# Verificar serviços disponíveis na região
aws ec2 describe-regions --query 'Regions[?RegionName==`sa-east-1`]'
```

## 🚀 Comando Único para Verificação Completa

```bash
# Executar script completo
chmod +x verificar-infraestrutura-simples.sh
./verificar-infraestrutura-simples.sh
```

## 📊 Verificações Específicas da Documentação

### Confirmar IDs Específicos:
```bash
# CloudFront Distribution E10QPOHV1RNFOA
aws cloudfront get-distribution --id E10QPOHV1RNFOA --query 'Distribution.{Id:Id,DomainName:DomainName,Aliases:Aliases.Items,Status:Status}'

# CloudFront Distribution E1XTMQ6QPLF7PD
aws cloudfront get-distribution --id E1XTMQ6QPLF7PD --query 'Distribution.{Id:Id,DomainName:DomainName,Aliases:Aliases.Items,Status:Status}'

# Route 53 Zone Z04264973SYHQQ0HCEEYM
aws route53 get-hosted-zone --id Z04264973SYHQQ0HCEEYM --query 'HostedZone.{Id:Id,Name:Name,ResourceRecordSetCount:ResourceRecordSetCount}'
```

### Verificar Domínios Específicos:
```bash
# Testar resolução DNS
nslookup www.granjarecantofeliz.com
nslookup granjarecantofeliz.com
nslookup sistema.granjarecantofeliz.com

# Verificar certificados SSL
curl -I https://www.granjarecantofeliz.com
curl -I https://sistema.granjarecantofeliz.com
```

## 🔧 Troubleshooting

### Se comandos falharem:
```bash
# Verificar permissões
aws iam get-user

# Verificar região
aws configure list

# Definir região se necessário
aws configure set region sa-east-1
```

### Para verificar custos:
```bash
# Custos por serviço (últimos 30 dias)
aws ce get-cost-and-usage \
  --time-period Start=2024-12-01,End=2025-01-01 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## ✅ Resultado Esperado

Se a documentação estiver correta, você deve ver:

- ✅ 2 buckets S3: `granjarecantofeliz-site` e `granja-relatorios-app`
- ✅ 2 distribuições CloudFront com IDs `E10QPOHV1RNFOA` e `E1XTMQ6QPLF7PD`
- ✅ 1 zona Route 53 com ID `Z04264973SYHQQ0HCEEYM`
- ✅ 2 certificados ACM em `us-east-1`
- ✅ Possível API Gateway para DynamoDB
- ✅ Possível tabela DynamoDB para produtos