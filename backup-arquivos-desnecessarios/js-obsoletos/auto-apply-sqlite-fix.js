// Auto-aplicar correção SQLite quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os scripts carregaram
    setTimeout(() => {
        if (typeof aplicarCorrecaoSQLite === 'function') {
            console.log('🔧 Aplicando correção SQLite automaticamente...');
            aplicarCorrecaoSQLite();
            
            // Executar diagnóstico após aplicar correção
            setTimeout(() => {
                if (typeof diagnosticarSQLite === 'function') {
                    diagnosticarSQLite();
                }
            }, 1000);
        } else {
            console.warn('⚠️ Função aplicarCorrecaoSQLite não encontrada');
        }
    }, 2000);
});