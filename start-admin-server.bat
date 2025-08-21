@echo off
echo ========================================
echo  Servidor Admin - Granja Recanto Feliz
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python 3.8+ em: https://python.org
    pause
    exit /b 1
)

REM Verificar se Flask está instalado
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Instalando Flask...
    pip install flask
    if errorlevel 1 (
        echo ERRO: Falha ao instalar Flask!
        pause
        exit /b 1
    )
)

REM Configurar token de segurança
if not defined ADMIN_TOKEN (
    set /p ADMIN_TOKEN="Digite o token de admin (ou Enter para usar padrao): "
    if "%ADMIN_TOKEN%"=="" set ADMIN_TOKEN=granja2025
)

echo.
echo Token configurado: %ADMIN_TOKEN%
echo.
echo Iniciando servidor em http://localhost:5000
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Use Ctrl+C para parar o servidor
echo - Configure o mesmo token no admin do site
echo.

REM Iniciar servidor
python admin-save.py

pause