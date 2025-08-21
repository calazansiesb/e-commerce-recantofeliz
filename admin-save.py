#!/usr/bin/env python3
"""
Exemplo simples de endpoint para salvar src/data/produtos.json
Uso (local):
  pip install flask
  ADMIN_TOKEN=secrettoken python admin-save.py

O endpoint POST /admin/save-products espera JSON com a estrutura completa
do DataManager. Cabe ao servidor validar/autenticar e escrever o arquivo com
backup de segurança.
"""
import os
import json
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

DATA_PATH = os.path.join('src', 'data', 'produtos.json')
BACKUP_DIR = 'backups'

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN')

os.makedirs(BACKUP_DIR, exist_ok=True)


def write_backup(content: str):
    ts = datetime.utcnow().strftime('%Y%m%d-%H%M%S')
    filename = f'produtos-backup-{ts}.json'
    path = os.path.join(BACKUP_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return path


@app.route('/admin/save-products', methods=['POST'])
def save_products():
    global ADMIN_TOKEN
    # Simple token check
    token = request.headers.get('X-Admin-Token', '')
    if not ADMIN_TOKEN:
        return jsonify({'ok': False, 'error': 'Server not configured with ADMIN_TOKEN'}), 403
    if token != ADMIN_TOKEN:
        return jsonify({'ok': False, 'error': 'Invalid token'}), 401

    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({'ok': False, 'error': 'Invalid JSON', 'detail': str(e)}), 400

    # Create backup of existing file if exists
    backup_path = None
    if os.path.exists(DATA_PATH):
        try:
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                existing = f.read()
            backup_path = write_backup(existing)
        except Exception as e:
            return jsonify({'ok': False, 'error': 'Backup failed', 'detail': str(e)}), 500

    # Write new data
    try:
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        with open(DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        return jsonify({'ok': False, 'error': 'Write failed', 'detail': str(e)}), 500

    return jsonify({'ok': True, 'backup': os.path.basename(backup_path) if backup_path else None})


if __name__ == '__main__':
    if not ADMIN_TOKEN:
        print('WARNING: ADMIN_TOKEN not set in environment. Set ADMIN_TOKEN env var before running in production.')
    print('Starting admin-save server on http://127.0.0.1:5000')
    app.run(host='127.0.0.1', port=5000)
