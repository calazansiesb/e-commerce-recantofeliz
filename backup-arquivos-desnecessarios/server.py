#!/usr/bin/env python3
"""
Servidor Backend para Granja Recanto Feliz
SQLite + API REST para persistência real
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = 'src/granja-recanto-feliz.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('src', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('src', filename)

@app.route('/api/produtos', methods=['GET'])
def get_produtos():
    conn = get_db()
    produtos = conn.execute('SELECT * FROM produtos WHERE ativo = 1').fetchall()
    conn.close()
    
    return jsonify([{
        'id': p['id'],
        'name': p['nome'],
        'category': p['categoria'],
        'price': p['preco'],
        'stock': p['estoque'],
        'slogan': p['slogan'],
        'description': p['descricao'],
        'image': p['imagem'],
        'active': bool(p['ativo'])
    } for p in produtos])

@app.route('/api/produtos/<int:produto_id>', methods=['PUT'])
def update_produto(produto_id):
    data = request.json
    conn = get_db()
    
    conn.execute('''
        UPDATE produtos 
        SET nome = ?, preco = ?, estoque = ?, categoria = ?, 
            slogan = ?, descricao = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (
        data['name'], data['price'], data['stock'], data['category'],
        data['slogan'], data['description'], produto_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/produtos', methods=['POST'])
def add_produto():
    data = request.json
    conn = get_db()
    
    cursor = conn.execute('''
        INSERT INTO produtos (nome, categoria, slogan, descricao, preco, estoque, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data['category'], data['slogan'], 
        data['description'], data['price'], data['stock'], data['image']
    ))
    
    conn.commit()
    produto_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'success': True, 'id': produto_id})

if __name__ == '__main__':
    print("Servidor iniciando...")
    print("Banco SQLite:", DB_PATH)
    print("Acesse: http://localhost:5000")
    app.run(debug=True, port=5000)