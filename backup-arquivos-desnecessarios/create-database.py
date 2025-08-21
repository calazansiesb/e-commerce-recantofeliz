#!/usr/bin/env python3
"""
Granja Recanto Feliz - Criação do Banco SQLite
Seguindo o roadmap: Fase 1 - Desenvolvimento Local
"""

import sqlite3
import os

def create_database():
    """Cria o banco SQLite seguindo o roadmap"""
    
    # Criar diretorio se nao existir
    os.makedirs('src', exist_ok=True)
    
    # Caminho do banco
    db_path = os.path.join('src', 'granja-recanto-feliz.db')
    
    # Conectar ao banco (cria se não existir)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Criando banco SQLite...")
    
    # Ler e executar script SQL
    with open('src/database/init.sql', 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    cursor.executescript(sql_script)
    
    # Verificar dados
    cursor.execute("SELECT COUNT(*) FROM produtos")
    count = cursor.fetchone()[0]
    
    print(f"Banco criado com {count} produtos")
    print(f"Arquivo: {db_path}")
    
    # Mostrar produtos
    cursor.execute("SELECT id, nome, preco FROM produtos")
    produtos = cursor.fetchall()
    
    print("\nProdutos no banco:")
    for produto in produtos:
        print(f"  {produto[0]}. {produto[1]} - R$ {produto[2]:.2f}")
    
    conn.close()
    
    # Estimativa de capacidade (seguindo roadmap)
    print("\nEstimativa de Capacidade (Roadmap SQLite):")
    print("  - Leituras simultaneas: ~1000+ usuarios")
    print("  - Escritas simultaneas: ~10 usuarios")
    print("  - Ideal para: Sites com ate 100.000 acessos/dia")
    print("  - Limitacao: Escritas concorrentes limitadas")

if __name__ == "__main__":
    create_database()