#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Monitor SQL de Persistência - Terminal
Sistema especializado para rastrear operações SQL e identificar problemas de persistência
"""

import json
import http.server
import socketserver
import urllib.parse
from datetime import datetime
import threading
import os

class SQLLogHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/sql-log':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                log_data = json.loads(post_data.decode('utf-8'))
                
                # Exibir log SQL formatado
                self.display_sql_log(log_data)
                
                # Responder com sucesso
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"status": "ok"}')
                
            except Exception as e:
                print(f"❌ Erro ao processar log SQL: {e}")
                self.send_response(500)
                self.end_headers()
        else:
            # Para outros caminhos, servir arquivos normalmente
            super().do_GET()
    
    def do_OPTIONS(self):
        # Para CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def display_sql_log(self, log_data):
        timestamp = datetime.now().strftime('%H:%M:%S.%f')[:-3]  # Com milissegundos
        log_type = log_data.get('type', 'INFO')
        message = log_data.get('message', '')
        
        # Cores específicas para operações SQL
        colors = {
            'SQL_START': '\033[94m',        # Azul - Início de operação
            'SQL_SUCCESS': '\033[92m',      # Verde - Sucesso
            'SQL_ERROR': '\033[91m',        # Vermelho - Erro
            'SQL_WARNING': '\033[93m',      # Amarelo - Aviso
            'SQL_DETAIL': '\033[96m',       # Ciano - Detalhes
            'SQL_BEFORE': '\033[95m',       # Magenta - Estado antes
            'SQL_AFTER': '\033[97m',        # Branco - Estado depois
            'DATAMANAGER_START': '\033[94m', # Azul
            'DATAMANAGER_SUCCESS': '\033[92m', # Verde
            'DATAMANAGER_ERROR': '\033[91m',   # Vermelho
            'DATAMANAGER_SAVE': '\033[96m',    # Ciano
            'STORAGE_SAVE': '\033[93m',     # Amarelo
            'STORAGE_CLEAR': '\033[91m',    # Vermelho
            'HEARTBEAT': '\033[90m',        # Cinza
            'SYNC_WARNING': '\033[93m',     # Amarelo
            'TEST': '\033[95m',             # Magenta
            'TEST_ERROR': '\033[91m',       # Vermelho
            'INIT': '\033[96m',             # Ciano
            'SETUP': '\033[92m',            # Verde
            'WARNING': '\033[93m',          # Amarelo
        }
        
        reset_color = '\033[0m'
        color = colors.get(log_type, '\033[0m')
        
        # Formatação especial para diferentes tipos de operação
        icon_map = {
            'SQL_START': '🚀',
            'SQL_SUCCESS': '✅',
            'SQL_ERROR': '❌',
            'SQL_WARNING': '⚠️',
            'SQL_DETAIL': '📋',
            'SQL_BEFORE': '📊',
            'SQL_AFTER': '📈',
            'DATAMANAGER_START': '🔄',
            'DATAMANAGER_SUCCESS': '✅',
            'DATAMANAGER_ERROR': '❌',
            'STORAGE_SAVE': '💾',
            'STORAGE_CLEAR': '💥',
            'HEARTBEAT': '💓',
            'SYNC_WARNING': '⚠️',
            'TEST': '🧪',
            'INIT': '🔍',
            'SETUP': '🔧',
        }
        
        icon = icon_map.get(log_type, 'ℹ️')
        
        # Formatação da linha de log
        print(f"{color}[{timestamp}] {icon} {log_type:18} | {message}{reset_color}")
        
        # Destaque especial para operações críticas
        if log_type == 'SQL_ERROR':
            print(f"\033[91m{'='*80}\033[0m")
            print(f"\033[91m🚨 ERRO SQL CRÍTICO: {message}\033[0m")
            print(f"\033[91m{'='*80}\033[0m")
            
        elif log_type == 'SYNC_WARNING':
            print(f"\033[93m{'─'*60}\033[0m")
            print(f"\033[93m⚠️  PROBLEMA DE SINCRONIZAÇÃO DETECTADO\033[0m")
            print(f"\033[93m{'─'*60}\033[0m")
            
        elif log_type == 'STORAGE_CLEAR':
            print(f"\033[91m{'='*80}\033[0m")
            print(f"\033[91m💥 CACHE LIMPO - VERIFICANDO PERSISTÊNCIA...\033[0m")
            print(f"\033[91m{'='*80}\033[0m")
            
        elif 'updateProduct' in message and 'SUCESSO' in message:
            print(f"\033[92m{'─'*40}\033[0m")
            print(f"\033[92m✨ UPDATE EXECUTADO COM SUCESSO\033[0m")
            print(f"\033[92m{'─'*40}\033[0m")
    
    def log_message(self, format, *args):
        # Suprimir logs padrão do servidor HTTP
        pass

def start_sql_monitor():
    PORT = 8080
    
    print("\033[96m" + "="*80 + "\033[0m")
    print("\033[96m🔍 MONITOR SQL DE PERSISTÊNCIA - E-COMMERCE RECANTO FELIZ\033[0m")
    print("\033[96m" + "="*80 + "\033[0m")
    print(f"\033[96m🔍 Servidor SQL Monitor iniciado na porta {PORT}\033[0m")
    print("\033[96m🔍 Rastreando operações de banco de dados em tempo real...\033[0m")
    print("\033[96m" + "="*80 + "\033[0m")
    print()
    print("\033[93m📋 OPERAÇÕES MONITORADAS:\033[0m")
    print("   🚀 SQL_START      - Início de operações SQL")
    print("   ✅ SQL_SUCCESS    - Operações SQL bem-sucedidas")
    print("   ❌ SQL_ERROR      - Erros em operações SQL")
    print("   📋 SQL_DETAIL     - Detalhes de dados sendo processados")
    print("   📊 SQL_BEFORE     - Estado ANTES do UPDATE")
    print("   📈 SQL_AFTER      - Estado DEPOIS do UPDATE")
    print("   🔄 DATAMANAGER_*  - Operações do DataManager")
    print("   💾 STORAGE_SAVE   - Salvamentos no localStorage")
    print("   💥 STORAGE_CLEAR  - Limpeza do cache")
    print("   💓 HEARTBEAT      - Status periódico dos dados")
    print("   ⚠️  SYNC_WARNING  - Problemas de sincronização")
    print()
    print("\033[92m🎯 OBJETIVO: Identificar onde o UPDATE não está persistindo\033[0m")
    print()
    print("\033[93m📝 INSTRUÇÕES PARA TESTE:\033[0m")
    print("   1. Abra: http://localhost:8080/admin.html")
    print("   2. Edite um produto (mude o preço)")
    print("   3. Salve as alterações")
    print("   4. Observe os logs SQL aqui")
    print("   5. Limpe o cache do navegador")
    print("   6. Recarregue e veja se o UPDATE persistiu")
    print()
    print("\033[91m🔍 AGUARDANDO OPERAÇÕES SQL...\033[0m")
    print()
    
    try:
        with socketserver.TCPServer(("", PORT), SQLLogHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\033[91m🛑 Monitor SQL interrompido\033[0m")
    except Exception as e:
        print(f"\033[91m❌ Erro no servidor SQL: {e}\033[0m")

if __name__ == "__main__":
    # Mudar para o diretório src
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(script_dir, 'src')
    if os.path.exists(src_dir):
        os.chdir(src_dir)
    
    start_sql_monitor()
