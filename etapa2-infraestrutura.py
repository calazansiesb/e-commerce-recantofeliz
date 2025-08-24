#!/usr/bin/env python3
"""
ETAPA 2: Configuração de Infraestrutura AWS
- RDS MySQL (Free Tier)
- S3 Bucket para imagens
- IAM Roles e Políticas
"""

import boto3
import json
import time
from datetime import datetime

def load_credentials():
    """Carrega credenciais do arquivo .aws-credentials"""
    try:
        with open('.aws-credentials', 'r') as f:
            lines = f.readlines()
            
        credentials = {}
        for line in lines:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                credentials[key] = value
                
        return credentials.get('AWS_ACCESS_KEY_ID'), credentials.get('AWS_SECRET_ACCESS_KEY')
    except:
        return None, None

class InfrastructureSetup:
    def __init__(self):
        access_key, secret_key = load_credentials()
        self.region = 'sa-east-1'
        
        # Clientes AWS
        self.rds = boto3.client('rds', 
                               aws_access_key_id=access_key,
                               aws_secret_access_key=secret_key,
                               region_name=self.region)
        
        self.s3 = boto3.client('s3',
                              aws_access_key_id=access_key,
                              aws_secret_access_key=secret_key,
                              region_name=self.region)
        
        self.iam = boto3.client('iam',
                               aws_access_key_id=access_key,
                               aws_secret_access_key=secret_key,
                               region_name=self.region)
    
    def create_rds_instance(self):
        """Criar instância RDS PostgreSQL (Free Tier)"""
        print("1. Criando instância RDS PostgreSQL...")
        
        try:
            response = self.rds.create_db_instance(
                DBInstanceIdentifier='granja-recanto-feliz-db',
                DBInstanceClass='db.t2.micro',  # Free tier
                Engine='postgres',
                EngineVersion='13.13',
                MasterUsername='admin',
                MasterUserPassword='GranjaRecantoFeliz2024!',
                AllocatedStorage=20,  # Mínimo para free tier
                StorageType='gp2',
                VpcSecurityGroupIds=[],  # Usar default
                BackupRetentionPeriod=7,
                MultiAZ=False,  # Free tier não suporta Multi-AZ
                PubliclyAccessible=True,  # Para acesso externo
                StorageEncrypted=False,  # Free tier
                DeletionProtection=False,
                Tags=[
                    {'Key': 'Project', 'Value': 'GranjaRecantoFeliz'},
                    {'Key': 'Environment', 'Value': 'Production'}
                ]
            )
            
            db_instance_id = response['DBInstance']['DBInstanceIdentifier']
            print(f"   OK RDS criado: {db_instance_id}")
            print("   Aguardando disponibilidade (5-10 min)...")
            
            # Aguardar até ficar disponível
            waiter = self.rds.get_waiter('db_instance_available')
            waiter.wait(DBInstanceIdentifier=db_instance_id)
            
            # Obter endpoint
            response = self.rds.describe_db_instances(DBInstanceIdentifier=db_instance_id)
            endpoint = response['DBInstances'][0]['Endpoint']['Address']
            
            print(f"   OK RDS disponível: {endpoint}")
            return endpoint
            
        except Exception as e:
            if "DBInstanceAlreadyExists" in str(e):
                print("   AVISO: RDS já existe, obtendo endpoint...")
                response = self.rds.describe_db_instances(DBInstanceIdentifier='granja-recanto-feliz-db')
                endpoint = response['DBInstances'][0]['Endpoint']['Address']
                print(f"   OK Endpoint existente: {endpoint}")
                return endpoint
            else:
                print(f"   ERRO: {e}")
                return None
    
    def create_s3_bucket_images(self):
        """Criar bucket S3 para imagens dos produtos"""
        print("2. Criando bucket S3 para imagens...")
        
        bucket_name = "granja-recanto-feliz-images"
        
        try:
            # Criar bucket
            if self.region == 'us-east-1':
                self.s3.create_bucket(Bucket=bucket_name)
            else:
                self.s3.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            
            # Configurar política pública para imagens
            bucket_policy = {
                "Version": "2012-10-17",
                "Statement": [{
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{bucket_name}/*"
                }]
            }
            
            self.s3.put_bucket_policy(Bucket=bucket_name, Policy=json.dumps(bucket_policy))
            
            # Configurar CORS para upload via web
            cors_config = {
                'CORSRules': [{
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE'],
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
    
    def create_iam_role(self):
        """Criar role IAM para o backend"""
        print("3. Criando role IAM...")
        
        role_name = "GranjaRecantoFelizBackendRole"
        
        try:
            # Política de confiança
            trust_policy = {
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Principal": {"Service": "ec2.amazonaws.com"},
                    "Action": "sts:AssumeRole"
                }]
            }
            
            # Criar role
            self.iam.create_role(
                RoleName=role_name,
                AssumeRolePolicyDocument=json.dumps(trust_policy),
                Description="Role para backend da Granja Recanto Feliz"
            )
            
            # Anexar políticas necessárias
            policies = [
                'arn:aws:iam::aws:policy/AmazonS3FullAccess',
                'arn:aws:iam::aws:policy/AmazonRDSDataFullAccess'
            ]
            
            for policy in policies:
                self.iam.attach_role_policy(RoleName=role_name, PolicyArn=policy)
            
            print(f"   OK Role criado: {role_name}")
            return role_name
            
        except Exception as e:
            if "EntityAlreadyExists" in str(e):
                print(f"   AVISO: Role já existe: {role_name}")
                return role_name
            else:
                print(f"   ERRO: {e}")
                return None
    
    def save_config(self, rds_endpoint, s3_bucket, iam_role):
        """Salvar configurações para próximas etapas"""
        config = {
            "infrastructure": {
                "rds_endpoint": rds_endpoint,
                "rds_username": "admin",
                "rds_password": "GranjaRecantoFeliz2024!",
                "rds_database": "granja_recanto_feliz",
                "s3_bucket_images": s3_bucket,
                "iam_role": iam_role,
                "region": self.region
            },
            "created_at": datetime.now().isoformat(),
            "status": "infrastructure_ready"
        }
        
        with open('aws-infrastructure-config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        print("4. Configurações salvas em: aws-infrastructure-config.json")

def main():
    print("ETAPA 2: Configuração de Infraestrutura AWS")
    print("=" * 50)
    
    setup = InfrastructureSetup()
    
    # 1. Criar RDS
    rds_endpoint = setup.create_rds_instance()
    if not rds_endpoint:
        print("ERRO: Falha ao criar RDS")
        return
    
    # 2. Criar S3
    s3_bucket = setup.create_s3_bucket_images()
    if not s3_bucket:
        print("ERRO: Falha ao criar bucket S3")
        return
    
    # 3. Criar IAM Role
    iam_role = setup.create_iam_role()
    if not iam_role:
        print("ERRO: Falha ao criar role IAM")
        return
    
    # 4. Salvar configurações
    setup.save_config(rds_endpoint, s3_bucket, iam_role)
    
    print("\n" + "="*50)
    print("ETAPA 2 CONCLUÍDA!")
    print("="*50)
    print(f"RDS Endpoint: {rds_endpoint}")
    print(f"S3 Bucket: {s3_bucket}")
    print(f"IAM Role: {iam_role}")
    print("\nPróxima etapa: Criar backend API")

if __name__ == "__main__":
    main()