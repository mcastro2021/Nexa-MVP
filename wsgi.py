# WSGI entry point for Render deployment
# This file imports the Flask app from the backend directory

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the Flask app
from app import app

if __name__ == "__main__":
    app.run()
