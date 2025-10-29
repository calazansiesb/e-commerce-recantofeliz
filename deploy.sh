#!/bin/bash
# Script de Deploy Manual - Granja Recanto Feliz
# Uso: ./deploy.sh dev|prod

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
ENVIRONMENT=${1:-dev}
AWS_REGION="sa-east-1"
SITE_URL="https://www.granjarecantofeliz.com"

if [ "$ENVIRONMENT" = "dev" ]; then
    S3_BUCKET="granja-recanto-feliz-dev"
    DEPLOY_PATH="$SITE_URL/dev/"
    CLOUDFRONT_ID="${CLOUDFRONT_DEV_ID}"
    CACHE_CONTROL="no-cache"
elif [ "$ENVIRONMENT" = "prod" ]; then
    S3_BUCKET="granja-recanto-feliz-prod"
    DEPLOY_PATH="$SITE_URL/"
    CLOUDFRONT_ID="${CLOUDFRONT_PROD_ID}"
    CACHE_CONTROL="public, max-age=3600"
else
    echo -e "${RED}❌ Ambiente inválido: $ENVIRONMENT${NC}"
    echo "Uso: ./deploy.sh [dev|prod]"
    exit 1
fi

# Funções
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ 🚀 Deploy - $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
}

print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificações pré-deploy
print_header "Verificações Pré-Deploy ($ENVIRONMENT)"

print_step "1. Verificando AWS CLI..."
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI não instalado!"
    exit 1
fi
print_success "AWS CLI encontrado"

print_step "2. Verificando credenciais AWS..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "Credenciais AWS não configuradas!"
    exit 1
fi
print_success "Credenciais AWS válidas"

print_step "3. Verificando estrutura de arquivos..."
if [ ! -f "index.html" ]; then
    print_error "index.html não encontrado!"
    exit 1
fi
print_success "Estrutura de arquivos OK"

print_step "4. Validando JSON..."
if ! python3 -c "import json; json.load(open('dados/produtos.json'))" 2>/dev/null; then
    print_error "produtos.json inválido!"
    exit 1
fi
print_success "JSON válido"

print_step "5. Verificando imagens..."
if [ ! -d "imagens/produtos" ]; then
    print_error "Pasta de imagens não encontrada!"
    exit 1
fi
JPG_COUNT=$(find imagens/produtos -name "*.jpg" | wc -l)
echo "  Total de imagens JPG: $JPG_COUNT"
if [ "$JPG_COUNT" -lt 10 ]; then
    print_error "Menos de 10 imagens encontradas!"
    exit 1
fi
print_success "Imagens OK"

# Build
print_header "Build"

print_step "1. Limpando build anterior..."
rm -rf build/
mkdir -p build/
print_success "Build limpo"

print_step "2. Copiando arquivos..."
cp -r *.html build/ 2>/dev/null || true
cp -r *.css build/ 2>/dev/null || true
cp -r js/ build/ 2>/dev/null || true
cp -r css/ build/ 2>/dev/null || true
cp -r imagens/ build/ 2>/dev/null || true
cp -r dados/ build/ 2>/dev/null || true
cp -r config/ build/ 2>/dev/null || true
print_success "Arquivos copiados"

print_step "3. Criando arquivo de versão..."
cat > build/VERSION.txt << EOF
Build Date: $(date +'%Y-%m-%d %H:%M:%S')
Branch: $(git rev-parse --abbrev-ref HEAD)
Commit: $(git rev-parse --short HEAD)
Author: $(git config user.name)
Environment: $ENVIRONMENT
EOF
print_success "Versão registrada"

print_step "4. Estatísticas de build..."
echo "  Total de arquivos: $(find build/ -type f | wc -l)"
echo "  Tamanho total: $(du -sh build/ | cut -f1)"

# Backup para PROD
if [ "$ENVIRONMENT" = "prod" ]; then
    print_header "Backup (PROD)"
    
    BACKUP_DIR="backups/prod-$(date +%Y%m%d_%H%M%S)"
    print_step "Fazendo backup de PROD..."
    mkdir -p "$BACKUP_DIR"
    aws s3 sync "s3://$S3_BUCKET/" "$BACKUP_DIR/" \
        --exclude "*.map" \
        --quiet || print_error "Falha no backup (continuando...)"
    print_success "Backup criado: $BACKUP_DIR"
fi

# Deploy
print_header "Deploy para $ENVIRONMENT"

print_step "1. Enviando arquivos para S3..."
aws s3 sync build/ "s3://$S3_BUCKET/" \
    --delete \
    --cache-control "$CACHE_CONTROL" \
    --exclude "*.map" \
    --exclude ".git*" \
    --quiet

TOTAL_FILES=$(aws s3 ls "s3://$S3_BUCKET/" --recursive | wc -l)
print_success "Upload concluído ($TOTAL_FILES arquivos)"

print_step "2. Invalidando cache CloudFront..."
if [ -z "$CLOUDFRONT_ID" ]; then
    print_error "CLOUDFRONT_ID não configurado!"
else
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text
    print_success "Cache invalidado"
fi

# Resumo final
print_header "Deploy Concluído!"

echo -e "${GREEN}📊 RESUMO${NC}"
echo "  Ambiente: $ENVIRONMENT"
echo "  URL: $DEPLOY_PATH"
echo "  S3 Bucket: $S3_BUCKET"
echo "  Arquivos: $TOTAL_FILES"
echo "  Tamanho Build: $(du -sh build/ | cut -f1)"
echo "  Data: $(date +'%Y-%m-%d %H:%M:%S')"
echo "  Commit: $(git rev-parse --short HEAD)"
echo ""
echo -e "${GREEN}✨ Deploy realizado com sucesso!${NC}"
echo "  Visite: $DEPLOY_PATH"
echo ""

# Verificação de saúde
print_header "Verificação de Saúde"

print_step "Testando acesso ao site..."
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_PATH")
if [ "$RESPONSE_CODE" = "200" ]; then
    print_success "Site está acessível (HTTP $RESPONSE_CODE)"
else
    print_error "Site retornou HTTP $RESPONSE_CODE"
fi

print_success "✨ Tudo pronto!"
