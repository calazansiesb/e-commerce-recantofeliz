@echo off
cd /d "e:\RECANTO FELIZ\SITE GEMINI\e-commerce-recantofeliz\src"
echo Iniciando servidor HTTP na porta 8080...
start /min python -m http.server 8080
timeout /t 3 /nobreak >nul
echo Abrindo no Firefox...
start firefox http://localhost:8080/index.html
timeout /t 2 /nobreak >nul
start firefox http://localhost:8080/admin.html
echo Servidor rodando em http://localhost:8080
pause