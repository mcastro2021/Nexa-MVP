#!/bin/bash

echo "🚀 Building Nexa MVP..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar que Python esté instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python no está instalado. Por favor instala Python primero."
    exit 1
fi

echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

echo "🔨 Compilando frontend..."
npm run build

echo "📦 Instalando dependencias de Python..."
cd ..
pip install -r requirements.txt

echo "✅ Build completado exitosamente!"
echo "🚀 Para ejecutar la aplicación: python app.py"
echo "🌐 La aplicación estará disponible en: http://localhost:5000"
