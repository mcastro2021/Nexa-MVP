#!/bin/bash

echo "Iniciando Nexa MVP..."
echo

echo "Configurando Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Instalando dependencias del backend..."
pip install -r requirements.txt
echo
echo "Iniciando servidor backend..."
gnome-terminal --title="Backend" -- bash -c "python app.py; exec bash" &

echo
echo "Configurando Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias del frontend..."
    npm install
fi
echo
echo "Iniciando servidor frontend..."
gnome-terminal --title="Frontend" -- bash -c "npm start; exec bash" &

echo
echo "Nexa MVP iniciado correctamente!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Presiona Ctrl+C para detener los servicios"
wait
