#!/usr/bin/env python3
"""
ETAPA 2: Infraestrutura AWS 100% GRATUITA
- DynamoDB (NoSQL gratuito permanente)
- S3 (5GB gratuitos)
- Lambda (1M execuções gratuitas)
"""

import boto3
import json
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

class FreeInfrastructure:
    def __init__(self):
        access_key, secret_key = load_credentials()
        self.region = 'sa-east-1'
        
        self.dynamodb = boto3.client('dynamodb',
                                   aws_access_key_id=access_key,
                                   aws_secret_access_key=secret_key,
                                   region_name=self.region)
        
        self.s3 = boto3.client('s3',
                              aws_access_key_id=access_key,
                              aws_secret_access_key=secret_key,
                              region_name=self.region)
    
    def create_dynamodb_table(self):
        """Criar tabela DynamoDB para produtos (SEMPRE GRATUITO)"""
        print("1. Criando tabela DynamoDB (gratuito permanente)...")
        
        try:
            response = self.dynamodb.create_table(
                TableName='GranjaRecantoFelizProdutos',
                KeySchema=[
                    {'AttributeName': 'id', 'KeyType': 'HASH'}
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'id', 'AttributeType': 'N'}
                ],
                BillingMode='PAY_PER_REQUEST',  # Sem custo fixo
                Tags=[
                    {'Key': 'Project', 'Value': 'GranjaRecantoFeliz'},
                    {'Key': 'Environment', 'Value': 'Production'}
                ]
            )
            
            print("   OK DynamoDB criado: GranjaRecantoFelizProdutos")
            print("   Aguardando ativação...")
            
            # Aguardar tabela ficar ativa
            waiter = self.dynamodb.get_waiter('table_exists')
            waiter.wait(TableName='GranjaRecantoFelizProdutos')
            
            print("   OK Tabela ativa e pronta!")
            return True
            
        except Exception as e:
            if "ResourceInUseException" in str(e):
                print("   AVISO: Tabela já existe")
                return True
            else:
                print(f"   ERRO: {e}")
                return False
    
    def create_s3_bucket_images(self):
        """Criar bucket S3 para imagens (5GB gratuitos)"""
        print("2. Criando bucket S3 para imagens (5GB gratuitos)...")
        
        bucket_name = "granja-recanto-feliz-images"
        
        try:
            if self.region == 'us-east-1':
                self.s3.create_bucket(Bucket=bucket_name)
            else:
                self.s3.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            
            # Política pública
            bucket_policy = {
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{bucket_name}/*"
                }]
            }
            
            # Remover bloqueio público primeiro
            try:
                self.s3.delete_public_access_block(Bucket=bucket_name)
            except:
                pass  # Pode não existir
            
            self.s3.put_bucket_policy(Bucket=bucket_name, Policy=json.dumps(bucket_policy))
            
            # CORS para upload
            cors_config = {
                'CORSRules': [{
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET', 'PUT', 'POST'],
                    'AllowedOrigins': ['*'],
                    'MaxAgeSeconds': 3000
                }]
            }
            
            self.s3.put_bucket_cors(Bucket=bucket_name, CORSConfiguration=cors_config)
            
            print(f"   OK Bucket criado: {bucket_name}")
            return bucket_name
            
        except Exception as e:
            if "BucketAlreadyOwnedByYou" in str(e):
                print(f"   AVISO: Bucket já existe: {bucket_name}")
                return bucket_name
            else:
                print(f"   ERRO: {e}")
                return None
    
    def save_config(self, s3_bucket):
        """Salvar configurações gratuitas"""
        config = {
            "infrastructure": {
                "database_type": "dynamodb",
                "table_name": "GranjaRecantoFelizProdutos",
                "s3_bucket_images": s3_bucket,
                "region": self.region,
                "costs": {
                    "dynamodb": "Gratuito permanente (25GB + 200M requests/mês)",
                    "s3": "5GB gratuitos por 12 meses",
                    "lambda": "1M execuções gratuitas/mês",
                    "total_monthly": "$0.00"
                }
            },
            "created_at": datetime.now().isoformat(),
            "status": "free_infrastructure_ready"
        }
        
        with open('aws-free-config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        print("3. Configurações salvas em: aws-free-config.json")

def main():
    print("ETAPA 2: Infraestrutura AWS 100% GRATUITA")
    print("=" * 50)
    print("DynamoDB: Gratuito permanente (25GB)")
    print("S3: 5GB gratuitos por 12 meses")
    print("Lambda: 1M execuções/mês gratuitas")
    print("=" * 50)
    
    setup = FreeInfrastructure()
    
    # 1. Criar DynamoDB
    if not setup.create_dynamodb_table():
        print("ERRO: Falha ao criar DynamoDB")
        return
    
    # 2. Criar S3
    s3_bucket = setup.create_s3_bucket_images()
    if not s3_bucket:
        print("ERRO: Falha ao criar bucket S3")
        return
    
    # 3. Salvar configurações
    setup.save_config(s3_bucket)
    
    print("\n" + "="*50)
    print("ETAPA 2 CONCLUÍDA - 100% GRATUITO!")
    print("="*50)
    print("DynamoDB: GranjaRecantoFelizProdutos")
    print(f"S3 Bucket: {s3_bucket}")
    print("Custo mensal: $0.00")
    print("\nPróxima etapa: API Lambda (também gratuita)")

if __name__ == "__main__":
    main()