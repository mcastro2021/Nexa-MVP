#!/usr/bin/env python3
"""
WSGI Entry Point for Constructora E2E Platform
This file provides the WSGI interface for the FastAPI application
"""

from app import app

# WSGI application object
application = app

if __name__ == "__main__":
    app.run()
