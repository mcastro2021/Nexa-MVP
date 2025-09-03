# Main app entry point for Render deployment
# This file imports the Flask app from the backend directory

import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the Flask app from backend
from app import app

if __name__ == "__main__":
    app.run(debug=False)
