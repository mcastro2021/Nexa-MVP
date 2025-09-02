#!/usr/bin/env python3
"""
Simple Flask app entry point for Render deployment.
"""

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return {'message': 'Nexa-MVP Backend is running!'}

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run()
