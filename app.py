#!/usr/bin/env python3
"""
Main Flask application for Nexa-MVP deployment on Render.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, origins=os.getenv('CORS_ORIGIN', '*').split(','))

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///nexa_mvp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize database
db = SQLAlchemy(app)

# Basic routes for health check and status
@app.route('/')
def home():
    return jsonify({
        'message': 'Nexa-MVP Backend is running!',
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'database': 'connected' if db.engine.pool.checkedin() > 0 else 'disconnected',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/status')
def api_status():
    return jsonify({
        'api': 'running',
        'database': 'connected' if db.engine.pool.checkedin() > 0 else 'disconnected',
        'cors_origin': os.getenv('CORS_ORIGIN', 'all_origins'),
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
