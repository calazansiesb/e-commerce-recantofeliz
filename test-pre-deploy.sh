#!/bin/bash
# Script de Teste Pré-Deploy - Granja Recanto Feliz
# Executa validações antes de fazer commit/push

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ 🧪 Testes Pré-Deploy${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
}

test_section() {
    echo -e "\n${YELLOW}▶ $1${NC}"
}

test_pass() {
    echo -e "${GREEN}  ✅ $1${NC}"
    ((TESTS_PASSED++))
}

test_fail() {
    echo -e "${RED}  ❌ $1${NC}"
    ((TESTS_FAILED++))
}

# ========== TESTES ==========
print_header

# 1. Verificar estrutura de arquivos
test_section "1. Estrutura de Arquivos"

[ -f "index.html" ] && test_pass "index.html encontrado" || test_fail "index.html não encontrado"
[ -d "js" ] && test_pass "Pasta js/ encontrada" || test_fail "Pasta js/ não encontrada"
[ -d "css" ] && test_pass "Pasta css/ encontrada" || test_fail "Pasta css/ não encontrada"
[ -d "imagens" ] && test_pass "Pasta imagens/ encontrada" || test_fail "Pasta imagens/ não encontrada"
[ -d "dados" ] && test_pass "Pasta dados/ encontrada" || test_fail "Pasta dados/ não encontrada"

# 2. Validar JSON
test_section "2. Validação JSON"

if python3 -c "import json; json.load(open('dados/produtos.json'))" 2>/dev/null; then
    test_pass "produtos.json é válido"
else
    test_fail "produtos.json tem erro de sintaxe"
fi

# 3. Verificar imagens
test_section "3. Imagens de Produtos"

JPG_COUNT=$(find imagens/produtos -name "*.jpg" 2>/dev/null | wc -l)
if [ "$JPG_COUNT" -gt 0 ]; then
    test_pass "$JPG_COUNT imagens JPG encontradas"
else
    test_fail "Nenhuma imagem JPG encontrada"
fi

# Verificar se existem não-JPG (que não deveriam estar lá)
NON_JPG=$(find imagens/produtos -type f ! -name "*.jpg" ! -name "backup" ! -type d 2>/dev/null | wc -l)
if [ "$NON_JPG" -eq 0 ]; then
    test_pass "Nenhuma imagem em formato não-padrão"
else
    test_fail "$NON_JPG arquivos em formato não-JPG encontrados"
    find imagens/produtos -type f ! -name "*.jpg" ! -type d 2>/dev/null | while read file; do
        echo "    - $file"
    done
fi

# 4. Validar HTML
test_section "4. Validação HTML"

if grep -q "<!DOCTYPE html>" index.html; then
    test_pass "DOCTYPE HTML5 encontrado"
else
    test_fail "DOCTYPE HTML5 não encontrado"
fi

if grep -q "<meta charset=" index.html; then
    test_pass "Meta charset definido"
else
    test_fail "Meta charset não definido"
fi

if grep -q "<meta name=\"viewport\"" index.html; then
    test_pass "Meta viewport definido"
else
    test_fail "Meta viewport não definido"
fi

# 5. Validar JavaScript
test_section "5. Verificação JavaScript"

JS_FILES=$(find js -name "*.js" 2>/dev/null | wc -l)
if [ "$JS_FILES" -gt 0 ]; then
    test_pass "$JS_FILES arquivos JavaScript encontrados"
else
    test_fail "Nenhum arquivo JavaScript encontrado"
fi

# Verificar erros de sintaxe óbvios
if grep -r "console.log\|alert(" js/*.js 2>/dev/null | grep -q .; then
    test_pass "Logs de debug encontrados (lembrete: remover em PROD)"
fi

# 6. Validar CSS
test_section "6. Verificação CSS"

CSS_FILES=$(find css -name "*.css" 2>/dev/null | wc -l)
if [ "$CSS_FILES" -gt 0 ]; then
    test_pass "$CSS_FILES arquivos CSS encontrados"
else
    test_fail "Nenhum arquivo CSS encontrado"
fi

# 7. Verificar performance
test_section "7. Performance"

INDEX_SIZE=$(stat -f%z index.html 2>/dev/null || stat -c%s index.html 2>/dev/null)
INDEX_SIZE_KB=$((INDEX_SIZE / 1024))
if [ "$INDEX_SIZE_KB" -lt 500 ]; then
    test_pass "index.html tem tamanho bom ($INDEX_SIZE_KB KB)"
else
    test_fail "index.html é muito grande ($INDEX_SIZE_KB KB) - considerar otimizar"
fi

# 8. Verificar Git
test_section "8. Git Status"

if [ -d ".git" ]; then
    test_pass "Repositório Git encontrado"
    
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    test_pass "Branch atual: $BRANCH"
    
    UNCOMMITTED=$(git status --short 2>/dev/null | wc -l)
    if [ "$UNCOMMITTED" -gt 0 ]; then
        echo "    ⚠️  $UNCOMMITTED arquivos não commitados"
    else
        test_pass "Todos os arquivos foram commitados"
    fi
else
    test_fail "Repositório Git não encontrado"
fi

# 9. Verificar dependências
test_section "9. Dependências Externas"

# AWS CLI
if command -v aws &> /dev/null; then
    test_pass "AWS CLI instalado"
else
    echo "    ⚠️  AWS CLI não instalado (necessário para deploy)"
fi

# Python
if command -v python3 &> /dev/null; then
    test_pass "Python 3 instalado"
else
    echo "    ⚠️  Python 3 não instalado (necessário para validações)"
fi

# Git
if command -v git &> /dev/null; then
    test_pass "Git instalado"
else
    test_fail "Git não instalado"
fi

# 10. Verificar links e referências
test_section "10. Integridade de Links"

# Verificar se scripts estão referenciados corretamente
if grep -q "scripts-simples.js" index.html; then
    test_pass "scripts-simples.js está referenciado"
else
    test_fail "scripts-simples.js não está referenciado"
fi

if grep -q "style.css" index.html; then
    test_pass "style.css está referenciado"
else
    test_fail "style.css não está referenciado"
fi

# ========== RESUMO ==========
echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ 📊 RESULTADO DOS TESTES${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

echo -e "${GREEN}✅ Passou: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Falhou: $TESTS_FAILED${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "\n${GREEN}✨ Todos os testes passaram! Você pode fazer deploy.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Alguns testes falharam. Corrija os problemas antes de fazer push.${NC}"
    exit 1
fi
