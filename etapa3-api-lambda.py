#!/usr/bin/env python3
"""
ETAPA 3: Criar API Lambda (100% Gratuita)
- API Gateway + Lambda Functions
- CRUD para produtos no DynamoDB
- Upload de imagens para S3
"""

import boto3
import json
import zipfile
import os
from datetime import datetime

def load_credentials():
    with open('.aws-credentials', 'r') as f:
        lines = f.readlines()
    credentials = {}
    for line in lines:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            credentials[key] = value
    return credentials.get('AWS_ACCESS_KEY_ID'), credentials.get('AWS_SECRET_ACCESS_KEY')

class LambdaAPISetup:
    def __init__(self):
        access_key, secret_key = load_credentials()
        self.region = 'sa-east-1'
        
        self.lambda_client = boto3.client('lambda',
                                        aws_access_key_id=access_key,
                                        aws_secret_access_key=secret_key,
                                        region_name=self.region)
        
        self.iam = boto3.client('iam',
                               aws_access_key_id=access_key,
                               aws_secret_access_key=secret_key,
                               region_name=self.region)
        
        self.apigateway = boto3.client('apigateway',
                                     aws_access_key_id=access_key,
                                     aws_secret_access_key=secret_key,
                                     region_name=self.region)
    
    def create_lambda_role(self):
        """Criar role para Lambda"""
        print("1. Criando role IAM para Lambda...")
        
        role_name = "GranjaLambdaExecutionRole"
        
        trust_policy = {
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }
        
        try:
            self.iam.create_role(
                RoleName=role_name,
                AssumeRolePolicyDocument=json.dumps(trust_policy)
            )
            
            # Anexar políticas
            policies = [
                'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
                'arn:aws:iam::aws:policy/AmazonS3FullAccess'
            ]
            
            for policy in policies:
                self.iam.attach_role_policy(RoleName=role_name, PolicyArn=policy)
            
            print(f"   OK Role criado: {role_name}")
            
        except Exception as e:
            if "EntityAlreadyExists" in str(e):
                print(f"   AVISO: Role já existe: {role_name}")
            else:
                print(f"   ERRO: {e}")
        
        # Aguardar propagação do role (importante!)
        import time
        print("   Aguardando propagação do role (10s)...")
        time.sleep(10)
        
        # Retornar ARN do role
        response = self.iam.get_role(RoleName=role_name)
        return response['Role']['Arn']
    
    def create_lambda_function(self, role_arn):
        """Criar função Lambda para API"""
        print("2. Criando função Lambda...")
        
        # Código da função Lambda
        lambda_code = '''
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='sa-east-1')
s3 = boto3.client('s3', region_name='sa-east-1')
table = dynamodb.Table('GranjaRecantoFelizProdutos')

def lambda_handler(event, context):
    try:
        method = event['httpMethod']
        path = event['path']
        
        # CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
        
        if method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        if path == '/api/produtos':
            if method == 'GET':
                return get_produtos(headers)
            elif method == 'POST':
                return create_produto(event, headers)
        
        elif path.startswith('/api/produtos/'):
            produto_id = int(path.split('/')[-1])
            if method == 'GET':
                return get_produto(produto_id, headers)
            elif method == 'PUT':
                return update_produto(produto_id, event, headers)
            elif method == 'DELETE':
                return delete_produto(produto_id, headers)
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Endpoint não encontrado'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def get_produtos(headers):
    response = table.scan()
    items = response['Items']
    
    # Converter Decimal para float
    for item in items:
        if 'price' in item:
            item['price'] = float(item['price'])
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'products': items})
    }

def get_produto(produto_id, headers):
    response = table.get_item(Key={'id': produto_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Produto não encontrado'})
        }
    
    item = response['Item']
    if 'price' in item:
        item['price'] = float(item['price'])
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(item)
    }

def create_produto(event, headers):
    data = json.loads(event['body'])
    
    # Converter price para Decimal
    if 'price' in data:
        data['price'] = Decimal(str(data['price']))
    
    table.put_item(Item=data)
    
    return {
        'statusCode': 201,
        'headers': headers,
        'body': json.dumps({'message': 'Produto criado com sucesso'})
    }

def update_produto(produto_id, event, headers):
    data = json.loads(event['body'])
    
    # Converter price para Decimal
    if 'price' in data:
        data['price'] = Decimal(str(data['price']))
    
    # Atualizar item
    update_expression = "SET "
    expression_values = {}
    
    for key, value in data.items():
        if key != 'id':
            update_expression += f"{key} = :{key}, "
            expression_values[f":{key}"] = value
    
    update_expression = update_expression.rstrip(', ')
    
    table.update_item(
        Key={'id': produto_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values
    )
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Produto atualizado com sucesso'})
    }

def delete_produto(produto_id, headers):
    table.delete_item(Key={'id': produto_id})
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Produto removido com sucesso'})
    }
'''
        
        # Criar arquivo ZIP
        with zipfile.ZipFile('lambda_function.zip', 'w') as zip_file:
            zip_file.writestr('lambda_function.py', lambda_code)
        
        # Ler arquivo ZIP
        with open('lambda_function.zip', 'rb') as zip_file:
            zip_content = zip_file.read()
        
        try:
            response = self.lambda_client.create_function(
                FunctionName='GranjaRecantoFelizAPI',
                Runtime='python3.9',
                Role=role_arn,
                Handler='lambda_function.lambda_handler',
                Code={'ZipFile': zip_content},
                Description='API para gerenciar produtos da Granja Recanto Feliz',
                Timeout=30,
                MemorySize=128
            )
            
            function_arn = response['FunctionArn']
            print(f"   OK Lambda criado: GranjaRecantoFelizAPI")
            return function_arn
            
        except Exception as e:
            if "ResourceConflictException" in str(e):
                print("   AVISO: Lambda já existe")
                response = self.lambda_client.get_function(FunctionName='GranjaRecantoFelizAPI')
                return response['Configuration']['FunctionArn']
            else:
                print(f"   ERRO: {e}")
                return None
        finally:
            # Limpar arquivo ZIP
            if os.path.exists('lambda_function.zip'):
                os.remove('lambda_function.zip')
    
    def create_api_gateway(self, lambda_arn):
        """Criar API Gateway"""
        print("3. Criando API Gateway...")
        
        try:
            # Criar API
            api_response = self.apigateway.create_rest_api(
                name='GranjaRecantoFelizAPI',
                description='API REST para Granja Recanto Feliz'
            )
            
            api_id = api_response['id']
            print(f"   OK API Gateway criado: {api_id}")
            
            # Obter resource root
            resources = self.apigateway.get_resources(restApiId=api_id)
            root_id = resources['items'][0]['id']
            
            # Criar resource /api
            api_resource = self.apigateway.create_resource(
                restApiId=api_id,
                parentId=root_id,
                pathPart='api'
            )
            
            # Criar resource /produtos
            produtos_resource = self.apigateway.create_resource(
                restApiId=api_id,
                parentId=api_resource['id'],
                pathPart='produtos'
            )
            
            # Criar resource /{id}
            id_resource = self.apigateway.create_resource(
                restApiId=api_id,
                parentId=produtos_resource['id'],
                pathPart='{id}'
            )
            
            # Configurar métodos
            methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            
            for resource_id in [produtos_resource['id'], id_resource['id']]:
                for method in methods:
                    self.apigateway.put_method(
                        restApiId=api_id,
                        resourceId=resource_id,
                        httpMethod=method,
                        authorizationType='NONE'
                    )
                    
                    # Integração com Lambda
                    self.apigateway.put_integration(
                        restApiId=api_id,
                        resourceId=resource_id,
                        httpMethod=method,
                        type='AWS_PROXY',
                        integrationHttpMethod='POST',
                        uri=f'arn:aws:apigateway:{self.region}:lambda:path/2015-03-31/functions/{lambda_arn}/invocations'
                    )
            
            # Deploy da API
            self.apigateway.create_deployment(
                restApiId=api_id,
                stageName='prod'
            )
            
            # Dar permissão para API Gateway invocar Lambda
            try:
                # Obter account ID
                sts = boto3.client('sts', region_name=self.region)
                account_id = sts.get_caller_identity()['Account']
                
                self.lambda_client.add_permission(
                    FunctionName='GranjaRecantoFelizAPI',
                    StatementId='api-gateway-invoke',
                    Action='lambda:InvokeFunction',
                    Principal='apigateway.amazonaws.com',
                    SourceArn=f'arn:aws:execute-api:{self.region}:{account_id}:{api_id}/*/*'
                )
            except Exception as e:
                if "ResourceConflictException" in str(e):
                    print("   AVISO: Permissão já existe")
                else:
                    print(f"   AVISO: Erro na permissão: {e}")
            
            api_url = f'https://{api_id}.execute-api.{self.region}.amazonaws.com/prod'
            print(f"   OK API URL: {api_url}")
            
            return api_url
            
        except Exception as e:
            print(f"   ERRO: {e}")
            return None
    
    def save_config(self, api_url):
        """Salvar configurações da API"""
        config = {
            "api": {
                "base_url": api_url,
                "endpoints": {
                    "list_produtos": f"{api_url}/api/produtos",
                    "get_produto": f"{api_url}/api/produtos/{{id}}",
                    "create_produto": f"{api_url}/api/produtos",
                    "update_produto": f"{api_url}/api/produtos/{{id}}",
                    "delete_produto": f"{api_url}/api/produtos/{{id}}"
                }
            },
            "created_at": datetime.now().isoformat(),
            "status": "api_ready"
        }
        
        with open('aws-api-config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        print("4. Configurações da API salvas em: aws-api-config.json")

def main():
    print("ETAPA 3: API Lambda (100% Gratuita)")
    print("=" * 50)
    print("Lambda: 1M execuções/mês gratuitas")
    print("API Gateway: 1M requests/mês gratuitos")
    print("=" * 50)
    
    setup = LambdaAPISetup()
    
    # 1. Criar role
    role_arn = setup.create_lambda_role()
    if not role_arn:
        print("ERRO: Falha ao criar role")
        return
    
    # 2. Criar Lambda
    lambda_arn = setup.create_lambda_function(role_arn)
    if not lambda_arn:
        print("ERRO: Falha ao criar Lambda")
        return
    
    # 3. Criar API Gateway
    api_url = setup.create_api_gateway(lambda_arn)
    if not api_url:
        print("ERRO: Falha ao criar API Gateway")
        return
    
    # 4. Salvar configurações
    setup.save_config(api_url)
    
    print("\n" + "="*50)
    print("ETAPA 3 CONCLUÍDA - API PRONTA!")
    print("="*50)
    print(f"API URL: {api_url}")
    print("Endpoints disponíveis:")
    print(f"- GET    {api_url}/api/produtos")
    print(f"- POST   {api_url}/api/produtos")
    print(f"- GET    {api_url}/api/produtos/{{id}}")
    print(f"- PUT    {api_url}/api/produtos/{{id}}")
    print(f"- DELETE {api_url}/api/produtos/{{id}}")
    print("\nCusto: $0.00/mês (1M requests gratuitos)")

if __name__ == "__main__":
    main()