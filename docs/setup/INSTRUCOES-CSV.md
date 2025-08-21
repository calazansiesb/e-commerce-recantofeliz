# Sistema de Salvamento CSV - Granja Recanto Feliz

## 📋 Funcionalidade Implementada

O sistema agora possui funcionalidade completa para salvar alterações de produtos diretamente no arquivo CSV de forma definitiva.

## 🔧 Como Funciona

### 1. Salvamento Automático
- **Quando alterar um produto**: O sistema automaticamente baixa um CSV atualizado
- **Quando alterar estoque**: O sistema automaticamente baixa um CSV atualizado
- **Quando criar novo produto**: O sistema automaticamente baixa um CSV atualizado

### 2. Botões Disponíveis na Administração

#### 📊 **Exportar CSV**
- Baixa um arquivo CSV completo com todos os produtos
- Inclui: ID, Nome, Categoria, Preço, Estoque, Slogan, Descrição, Imagem, Status
- Formato: `produtos-completo-YYYY-MM-DD.csv`

#### 🔄 **Sincronizar CSV**
- Compara dados atuais com o CSV existente
- Mostra diferenças encontradas
- Permite baixar CSV atualizado com as mudanças

#### 💾 **Backup JSON**
- Backup completo em formato JSON (funcionalidade existente)

## 📝 Processo de Salvamento Definitivo

### Passo a Passo:

1. **Altere um produto** (preço, estoque, dados, etc.)
2. **Sistema baixa automaticamente** o CSV atualizado
3. **Substitua o arquivo** `dados/produtos.csv` pelo arquivo baixado
4. **Mantenha o mesmo nome** do arquivo

### Exemplo Prático:

```
1. Altero preço dos "Ovos caipira" de R$ 12,00 para R$ 15,00
2. Sistema baixa: "produtos-2024-01-15T10-30-45.csv"
3. Substituo "dados/produtos.csv" pelo arquivo baixado
4. Renomeio para "produtos.csv"
5. ✅ Alteração salva definitivamente!
```

## 🎯 Vantagens do Sistema

### ✅ **Automático**
- Não precisa lembrar de exportar
- Salva automaticamente a cada alteração

### ✅ **Seguro**
- Cria backups automáticos
- Histórico de alterações
- Não perde dados

### ✅ **Flexível**
- Funciona sem servidor/PHP
- Compatível com hospedagem estática
- Fácil de usar

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/js/csv-manager.js` - Gerenciador de CSV
- `INSTRUCOES-CSV.md` - Este arquivo de instruções

### Arquivos Modificados:
- `src/js/admin.js` - Integração com CSV Manager
- `src/admin.html` - Novos botões na interface

## 🔍 Formato do CSV

```csv
ID,Nome,Categoria,Preco,Estoque,Slogan,Descricao,Imagem,Ativo,Data_Exportacao
1,"Ovos caipira","ovos",15.00,50,"Ovos frescos da granja","Dúzia de ovos frescos","ovos.png",true,15/01/2024
```

## 🚨 Importante

### ⚠️ **Lembre-se sempre:**
1. Substituir o arquivo `dados/produtos.csv`
2. Manter o nome original do arquivo
3. Verificar se o arquivo foi salvo corretamente

### 🔄 **Para reverter alterações:**
1. Use a função "Restauração Rápida"
2. Ou restaure um backup anterior
3. Ou edite manualmente o CSV

## 🎉 Resultado

Agora você pode:
- ✅ Alterar preços de produtos
- ✅ Salvar definitivamente no CSV
- ✅ Manter dados persistentes
- ✅ Fazer backups automáticos
- ✅ Sincronizar quando necessário

## 📞 Suporte

Se tiver dúvidas sobre o sistema:
1. Verifique os logs no console do navegador
2. Use a função "Sincronizar CSV" para verificar diferenças
3. Sempre mantenha backups dos arquivos importantes