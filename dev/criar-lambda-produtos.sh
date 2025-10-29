#!/bin/bash
# Criar nova Lambda específica para produtos

echo "🆕 CRIANDO NOVA LAMBDA PRODUTOS"
echo "==============================="

# 1. Criar nova função Lambda
aws lambda create-function \
  --function-name GranjaRecantoFeliz-Produtos \
  --runtime python3.9 \
  --role arn:aws:iam::311719320177:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://lambda-produtos-correta.zip \
  --description "API de produtos da Granja Recanto Feliz" \
  --timeout 30

# 2. Atualizar API Gateway para usar nova Lambda
aws apigateway put-integration \
  --rest-api-id frb45jmipc \
  --resource-id lgm5qi \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:sa-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:sa-east-1:311719320177:function:GranjaRecantoFeliz-Produtos/invocations"

# 3. Dar permissão para API Gateway invocar a Lambda
aws lambda add-permission \
  --function-name GranjaRecantoFeliz-Produtos \
  --statement-id api-gateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:sa-east-1:311719320177:frb45jmipc/*/*"

# 4. Deploy da API
aws apigateway create-deployment \
  --rest-api-id frb45jmipc \
  --stage-name prod

echo "✅ Nova Lambda criada e configurada!"