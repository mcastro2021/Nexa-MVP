#!/usr/bin/env python3
"""
WSGI Entry Point - SOLO para evitar detección automática de Python
Este NO es un proyecto Python - es Node.js/TypeScript

Render debe usar render.yaml, no este archivo.
"""

def application(environ, start_response):
    """WSGI application que falla intencionalmente"""
    status = '500 Internal Server Error'
    response_headers = [('Content-type', 'text/plain; charset=utf-8')]
    
    start_response(status, response_headers)
    
    error_message = """🚫 ERROR: Este NO es un proyecto Python!
✅ Este es un proyecto Node.js/TypeScript
📁 Usar render.yaml para configuración
🔧 Servicios: web, api, worker

Render está configurado incorrectamente si está usando este archivo."""
    
    return [error_message.encode('utf-8')]

# Fallar intencionalmente si se ejecuta directamente
if __name__ == "__main__":
    print("🚫 ERROR: Este NO es un proyecto Python!")
    print("✅ Este es un proyecto Node.js/TypeScript")
    print("📁 Usar render.yaml para configuración")
    exit(1)
