@echo off
echo Iniciando Nexa MVP...
echo.

echo Configurando Backend...
cd backend
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)
call venv\Scripts\activate
echo Instalando dependencias del backend...
pip install -r requirements.txt
echo.
echo Iniciando servidor backend...
start "Backend" cmd /k "python app.py"

echo.
echo Configurando Frontend...
cd ..\frontend
if not exist node_modules (
    echo Instalando dependencias del frontend...
    npm install
)
echo.
echo Iniciando servidor frontend...
start "Frontend" cmd /k "npm start"

echo.
echo Nexa MVP iniciado correctamente!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
