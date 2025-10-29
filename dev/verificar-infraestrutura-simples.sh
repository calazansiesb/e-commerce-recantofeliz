#!/bin/bash
# Verificação Simples da Infraestrutura AWS

echo "🔍 VERIFICAÇÃO RÁPIDA - GRANJA RECANTO FELIZ"
echo "============================================"

# Comandos essenciais para CloudShell
echo "1️⃣ Buckets S3:"
aws s3 ls | grep granja

echo ""
echo "2️⃣ CloudFront Distributions:"
aws cloudfront list-distributions --query 'DistributionList.Items[].{Id:Id,Aliases:Aliases.Items,Status:Status}' --output table

echo ""
echo "3️⃣ Route 53 Hosted Zones:"
aws route53 list-hosted-zones --query 'HostedZones[].{Id:Id,Name:Name}' --output table

echo ""
echo "4️⃣ Certificados ACM (us-east-1):"
aws acm list-certificates --region us-east-1 --output table

echo ""
echo "5️⃣ API Gateway:"
aws apigateway get-rest-apis --output table

echo ""
echo "6️⃣ DynamoDB Tables:"
aws dynamodb list-tables --output table