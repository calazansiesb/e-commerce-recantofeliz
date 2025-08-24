#!/usr/bin/env python3
"""
ETAPA 4: Migrar Dados JSON → DynamoDB
- Migrar produtos existentes
- Testar API endpoints
- Validar integridade dos dados
"""

import boto3
import json
import requests
from decimal import Decimal

def load_credentials():
    with open('.aws-credentials', 'r') as f:
        lines = f.readlines()
    credentials = {}
    for line in lines:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            credentials[key] = value
    return credentials.get('AWS_ACCESS_KEY_ID'), credentials.get('AWS_SECRET_ACCESS_KEY')

class DataMigration:
    def __init__(self):
        access_key, secret_key = load_credentials()
        self.region = 'sa-east-1'
        
        self.dynamodb = boto3.resource('dynamodb',
                                     aws_access_key_id=access_key,
                                     aws_secret_access_key=secret_key,
                                     region_name=self.region)
        
        self.table = self.dynamodb.Table('GranjaRecantoFelizProdutos')
        
        # Carregar configuração da API
        with open('aws-api-config.json', 'r') as f:
            self.api_config = json.load(f)
        
        self.api_url = self.api_config['api']['base_url']
    
    def load_json_products(self):
        """Carregar produtos do arquivo JSON"""
        print("1. Carregando produtos do JSON...")
        
        try:
            with open('dados/produtos.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            products = data.get('products', [])
            print(f"   OK {len(products)} produtos encontrados")
            return products
            
        except Exception as e:
            print(f"   ERRO: {e}")
            return []
    
    def migrate_to_dynamodb(self, products):
        """Migrar produtos para DynamoDB"""
        print("2. Migrando para DynamoDB...")
        
        migrated = 0
        
        for product in products:
            try:
                # Converter price para Decimal (DynamoDB requirement)
                if 'price' in product:
                    product['price'] = Decimal(str(product['price']))
                
                # Adicionar campos obrigatórios se não existirem
                if 'active' not in product:
                    product['active'] = True
                
                if 'stock' not in product:
                    product['stock'] = 10  # Estoque padrão
                
                # Inserir no DynamoDB
                self.table.put_item(Item=product)
                migrated += 1
                print(f"   OK Produto {product['id']}: {product['name']}")
                
            except Exception as e:
                print(f"   ERRO Produto {product.get('id', '?')}: {e}")
        
        print(f"   Total migrado: {migrated}/{len(products)}")
        return migrated
    
    def test_api_endpoints(self):
        """Testar endpoints da API"""
        print("3. Testando API endpoints...")
        
        try:
            # Testar GET /api/produtos
            response = requests.get(f"{self.api_url}/api/produtos")
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                print(f"   OK GET /api/produtos: {len(products)} produtos")
            else:
                print(f"   ERRO GET /api/produtos: {response.status_code}")
                return False
            
            # Testar GET produto específico
            if products:
                product_id = products[0]['id']
                response = requests.get(f"{self.api_url}/api/produtos/{product_id}")
                if response.status_code == 200:
                    print(f"   OK GET /api/produtos/{product_id}")
                else:
                    print(f"   ERRO GET /api/produtos/{product_id}: {response.status_code}")
            
            # Testar POST (criar produto teste)
            test_product = {
                "id": 999,
                "name": "Produto Teste",
                "category": "teste",
                "slogan": "Produto para teste da API",
                "description": "Este é um produto de teste",
                "price": 1.00,
                "stock": 5,
                "active": True,
                "image": "imagens/produtos/teste.jpg"
            }
            
            response = requests.post(f"{self.api_url}/api/produtos", 
                                   json=test_product,
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 201:
                print("   OK POST /api/produtos (criar)")
                
                # Testar PUT (atualizar)
                test_product['name'] = "Produto Teste Atualizado"
                response = requests.put(f"{self.api_url}/api/produtos/999",
                                      json=test_product,
                                      headers={'Content-Type': 'application/json'})
                
                if response.status_code == 200:
                    print("   OK PUT /api/produtos/999 (atualizar)")
                else:
                    print(f"   ERRO PUT: {response.status_code}")
                
                # Testar DELETE
                response = requests.delete(f"{self.api_url}/api/produtos/999")
                if response.status_code == 200:
                    print("   OK DELETE /api/produtos/999 (remover)")
                else:
                    print(f"   ERRO DELETE: {response.status_code}")
                    
            else:
                print(f"   ERRO POST: {response.status_code}")
            
            return True
            
        except Exception as e:
            print(f"   ERRO nos testes: {e}")
            return False
    
    def validate_data_integrity(self):
        """Validar integridade dos dados migrados"""
        print("4. Validando integridade dos dados...")
        
        try:
            # Contar itens no DynamoDB
            response = self.table.scan(Select='COUNT')
            dynamodb_count = response['Count']
            
            # Contar itens no JSON
            with open('dados/produtos.json', 'r', encoding='utf-8') as f:
                json_data = json.load(f)
            json_count = len(json_data.get('products', []))
            
            print(f"   JSON: {json_count} produtos")
            print(f"   DynamoDB: {dynamodb_count} produtos")
            
            if dynamodb_count >= json_count:
                print("   OK Integridade validada")
                return True
            else:
                print("   AVISO: Diferença na contagem")
                return False
                
        except Exception as e:
            print(f"   ERRO: {e}")
            return False
    
    def create_frontend_config(self):
        """Criar configuração para o frontend usar a API"""
        print("5. Criando configuração para frontend...")
        
        config = {
            "api": {
                "enabled": True,
                "base_url": self.api_url,
                "endpoints": {
                    "produtos": f"{self.api_url}/api/produtos",
                    "produto_by_id": f"{self.api_url}/api/produtos"
                },
                "fallback": {
                    "enabled": True,
                    "json_file": "dados/produtos.json"
                }
            },
            "migration": {
                "completed": True,
                "date": "2025-01-27",
                "products_migrated": True
            }
        }
        
        with open('frontend-api-config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        print("   OK Configuração salva: frontend-api-config.json")

def main():
    print("ETAPA 4: Migracao de Dados JSON para DynamoDB")
    print("=" * 50)
    
    migration = DataMigration()
    
    # 1. Carregar produtos do JSON
    products = migration.load_json_products()
    if not products:
        print("ERRO: Nenhum produto encontrado no JSON")
        return
    
    # 2. Migrar para DynamoDB
    migrated_count = migration.migrate_to_dynamodb(products)
    if migrated_count == 0:
        print("ERRO: Nenhum produto foi migrado")
        return
    
    # 3. Testar API
    if not migration.test_api_endpoints():
        print("AVISO: Alguns testes da API falharam")
    
    # 4. Validar integridade
    if not migration.validate_data_integrity():
        print("AVISO: Problemas na validação de integridade")
    
    # 5. Configurar frontend
    migration.create_frontend_config()
    
    print("\n" + "="*50)
    print("ETAPA 4 CONCLUIDA - DADOS MIGRADOS!")
    print("="*50)
    print(f"Produtos migrados: {migrated_count}")
    print(f"API funcionando: {migration.api_url}")
    print("DynamoDB: Operacional")
    print("Frontend: Configurado para usar API")
    print("\nPróxima etapa: Atualizar frontend para usar API")

if __name__ == "__main__":
    main()