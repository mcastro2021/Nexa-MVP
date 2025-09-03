#!/usr/bin/env python3
"""
Este archivo existe SOLO para evitar que Render detecte Python automáticamente.
NO es una aplicación Python - es un proyecto Node.js/TypeScript.

Render está configurado para usar render.yaml, no este archivo.
"""

import sys
import os

def main():
    print("🚫 ERROR: Este NO es un proyecto Python!")
    print("✅ Este es un proyecto Node.js/TypeScript")
    print("📁 Usar render.yaml para configuración")
    print("🔧 Servicios: web, api, worker")
    
    # Salir con error para evitar que Render use este archivo
    sys.exit(1)

if __name__ == "__main__":
    main()
