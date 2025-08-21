// sqlite-manager.js DESATIVADO (stub)
// O suporte a SQL.js/SQLite no cliente foi desativado. Mantemos este arquivo como stub
// para evitar erros em páginas que ainda referenciam a API antiga.

console.warn('⚠️ sqlite-manager.js carregado como STUB — SQL.js/SQLite no cliente está desativado.');
window.sqliteManager = null;

window.initSQLiteManager = async function() {
    console.warn('initSQLiteManager: stub (SQLite desativado no cliente).');
    return false;
};

// Compatibilidade: funções que podem ser chamadas retornam valores neutros
window.SQLiteManager = undefined;

window.sqliteManagerGetProducts = function() {
    return [];
};
