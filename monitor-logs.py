#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor de Logs em Tempo Real para Monitoramento do E-commerce
Este servidor captura logs do navegador e exibe no terminal do VS Code
"""

import json
import http.server
import socketserver
import urllib.parse
from datetime import datetime
import threading
import os

class LogHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/log':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                log_data = json.loads(post_data.decode('utf-8'))
                
                # Formatar e exibir o log
                self.display_log(log_data)
                
                # Responder com sucesso
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"status": "ok"}')
                
            except Exception as e:
                print(f"❌ Erro ao processar log: {e}")
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
    
    def display_log(self, log_data):
        timestamp = datetime.now().strftime('%H:%M:%S')
        log_type = log_data.get('type', 'INFO')
        message = log_data.get('message', '')
        url = log_data.get('url', '').split('/')[-1]  # Apenas o arquivo
        
        # Cores para diferentes tipos de log
        colors = {
            'ERROR': '\033[91m',      # Vermelho
            'WARN': '\033[93m',       # Amarelo
            'WARNING': '\033[93m',    # Amarelo
            'STORAGE': '\033[94m',    # Azul
            'FORM': '\033[92m',       # Verde
            'CLICK': '\033[95m',      # Magenta
            'SYSTEM': '\033[96m',     # Ciano
            'HEARTBEAT': '\033[90m',  # Cinza
            'CUSTOM_EVENT': '\033[97m', # Branco
            'MANUAL': '\033[93m',     # Amarelo
        }
        
        reset_color = '\033[0m'
        color = colors.get(log_type, '\033[0m')
        
        # Formatação especial para diferentes tipos
        if log_type == 'HEARTBEAT':
            if '0 produtos' in message or 'vazio' in message:
                color = '\033[91m'  # Vermelho para problemas
            
        elif log_type == 'STORAGE' and 'clear()' in message:
            color = '\033[91m'  # Vermelho para limpeza de cache
            
        elif log_type == 'FORM':
            color = '\033[92m'  # Verde para formulários
            
        # Exibir log formatado
        print(f"{color}[{timestamp}] {log_type:12} | {url:15} | {message}{reset_color}")
        
        # Log especial para eventos importantes
        if any(keyword in message.lower() for keyword in ['erro', 'error', 'falhou', 'failed']):
            print(f"\033[91m{'='*80}\033[0m")
            print(f"\033[91m🚨 ATENÇÃO: {message}\033[0m")
            print(f"\033[91m{'='*80}\033[0m")
    
    def log_message(self, format, *args):
        # Suprimir logs padrão do servidor HTTP
        pass

def start_log_server():
    PORT = 8080
    
    print("🔍 " + "="*60)
    print("🔍 MONITOR DE LOGS EM TEMPO REAL - E-COMMERCE RECANTO FELIZ")
    print("🔍 " + "="*60)
    print(f"🔍 Servidor iniciado na porta {PORT}")
    print("🔍 Aguardando logs do navegador...")
    print("🔍 " + "="*60)
    print()
    print("📋 LEGENDA:")
    print("   🟢 FORM       - Submissão de formulários")
    print("   🔵 STORAGE    - Operações no localStorage")
    print("   🟣 CLICK      - Cliques em botões importantes") 
    print("   🟡 MANUAL     - Logs manuais")
    print("   ⚪ HEARTBEAT  - Status periódico dos dados")
    print("   🔴 ERROR      - Erros e problemas")
    print("   🟠 SYSTEM     - Eventos do sistema")
    print()
    print("🔍 Para testar, faça alterações no admin em: http://localhost:8080/admin.html")
    print()
    
    try:
        with socketserver.TCPServer(("", PORT), LogHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor de logs interrompido")
    except Exception as e:
        print(f"❌ Erro no servidor: {e}")

if __name__ == "__main__":
    # Mudar para o diretório src
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(script_dir, '..', 'src')
    if os.path.exists(src_dir):
        os.chdir(src_dir)
    
    start_log_server()
