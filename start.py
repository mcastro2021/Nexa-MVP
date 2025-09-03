#!/usr/bin/env python3
"""
Startup script for Constructora E2E Platform
This file can be used as an alternative to gunicorn
"""

import uvicorn
from app import app

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
