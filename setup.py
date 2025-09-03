#!/usr/bin/env python3
"""
Setup script for Constructora E2E Platform
This helps avoid metadata generation issues during installation
"""

from setuptools import setup, find_packages

setup(
    name="constructora-e2e",
    version="1.0.0",
    description="Plataforma E2E para Constructora con gestión completa",
    author="Equipo Nexa-MVP",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "gunicorn>=21.2.0",
        "python-multipart>=0.0.6",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "pydantic>=2.5.0",
        "python-dotenv>=1.0.0",
    ],
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)
