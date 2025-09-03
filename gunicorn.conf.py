# Gunicorn Configuration - SOLO para evitar detección automática
# Este NO es un proyecto Python - es Node.js/TypeScript

import sys
import os

# Configuración que falla intencionalmente
bind = "0.0.0.0:8000"
workers = 1
worker_class = "sync"
timeout = 30

def on_starting(server):
    """Hook que falla al inicio"""
    print("🚫 ERROR: Este NO es un proyecto Python!")
    print("✅ Este es un proyecto Node.js/TypeScript")
    print("📁 Usar render.yaml para configuración")
    print("🔧 Servicios: web, api, worker")
    
    # Fallar intencionalmente
    server.log.error("Render está configurado incorrectamente")
    sys.exit(1)

def when_ready(server):
    """Hook que falla cuando está listo"""
    server.log.error("🚫 NO usar gunicorn - usar render.yaml")
    sys.exit(1)
