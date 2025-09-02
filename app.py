#!/usr/bin/env python3
"""
Main application entry point for Render deployment.
This file allows Render to find the Flask app directly.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the Flask app from the backend
from app import app

if __name__ == "__main__":
    app.run()
