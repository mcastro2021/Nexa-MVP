#!/usr/bin/env python3
"""
Constructora E2E Platform - FastAPI Application
Esta es la aplicación principal que Render ejecutará con gunicorn
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import json
import hashlib
from datetime import datetime, timedelta
import jwt

# Configuración de la aplicación
app = FastAPI(
    title="Constructora E2E Platform",
    description="Plataforma completa para gestión de constructora",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuración de seguridad
security = HTTPBearer()

# Configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "default-secret-key")
JWT_ALGORITHM = "HS256"

# Modelos Pydantic
class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    nombre: str
    role: str

class Project(BaseModel):
    id: str
    nombre: str
    tipo: str
    m2: int
    direccion: str
    fecha_inicio: datetime
    fecha_entrega: datetime

class Milestone(BaseModel):
    id: str
    nombre: str
    estado: str
    fecha_plan: datetime
    fecha_real: Optional[datetime] = None

# Función simple de hash (sin bcrypt)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Datos de prueba (en producción usar base de datos)
DEMO_USERS = {
    "cliente@demo.com": {
        "id": "1",
        "email": "cliente@demo.com",
        "nombre": "Cliente Demo",
        "role": "CLIENTE",
        "password_hash": hash_password("password123")
    },
    "admin@demo.com": {
        "id": "2",
        "email": "admin@demo.com",
        "nombre": "Admin Demo",
        "role": "ADMIN",
        "password_hash": hash_password("password123")
    },
    "logistica@demo.com": {
        "id": "3",
        "email": "logistica@demo.com",
        "nombre": "Logística Demo",
        "role": "LOGISTICA",
        "password_hash": hash_password("password123")
    },
    "ejecutivo@demo.com": {
        "id": "4",
        "email": "ejecutivo@demo.com",
        "nombre": "Ejecutivo Demo",
        "role": "EJECUTIVO",
        "password_hash": hash_password("password123")
    }
}

DEMO_PROJECTS = [
    {
        "id": "1",
        "nombre": "Casa Wood Frame 120m²",
        "tipo": "WOOD_FRAME",
        "m2": 120,
        "direccion": "Av. Principal 123",
        "fecha_inicio": datetime.now() - timedelta(days=30),
        "fecha_entrega": datetime.now() + timedelta(days=60)
    }
]

DEMO_MILESTONES = [
    {
        "id": "1",
        "nombre": "Fundaciones",
        "estado": "COMPLETADO",
        "fecha_plan": datetime.now() - timedelta(days=20),
        "fecha_real": datetime.now() - timedelta(days=18)
    },
    {
        "id": "2",
        "nombre": "Estructura",
        "estado": "EN_PROGRESO",
        "fecha_plan": datetime.now() - timedelta(days=10),
        "fecha_real": None
    },
    {
        "id": "3",
        "nombre": "Techado",
        "estado": "PENDIENTE",
        "fecha_plan": datetime.now() + timedelta(days=10),
        "fecha_real": None
    }
]

# Funciones de utilidad
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = DEMO_USERS.get(email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Endpoints
@app.get("/")
async def root():
    """Servir el frontend HTML"""
    return FileResponse("static/index.html")

@app.get("/api")
async def api_info():
    """Información de la API"""
    return {
        "message": "Constructora E2E Platform",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/auth/login",
            "/me",
            "/kpi/obras",
            "/kpi/finanzas", 
            "/kpi/personal",
            "/proyectos",
            "/proyectos/{id}/hitos",
            "/faqs",
            "/chatbot/query"
        ]
    }

@app.get("/healthz")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/auth/login")
async def login(user_data: UserLogin):
    user = DEMO_USERS.get(user_data.email)
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {
        "token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "nombre": user["nombre"],
            "role": user["role"]
        }
    }

@app.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/kpi/obras")
async def get_kpi_obras(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_obras = len(DEMO_PROJECTS)
    # Cálculo simple de tiempo promedio
    tiempo_promedio = 90  # días
    
    return {
        "total": total_obras,
        "promedioDias": tiempo_promedio,
        "obras": DEMO_PROJECTS
    }

@app.get("/kpi/finanzas")
async def get_kpi_finanzas(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "ingresos": 150000,
        "egresos": 120000,
        "utilidad": 30000,
        "proyectos_activos": len(DEMO_PROJECTS)
    }

@app.get("/kpi/personal")
async def get_kpi_personal(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "total_empleados": 15,
        "activos": 14,
        "licencias": 1,
        "rotacion": "5%"
    }

@app.get("/proyectos")
async def get_proyectos(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "CLIENTE":
        # Cliente ve solo su proyecto
        return DEMO_PROJECTS[:1]
    else:
        # Admin/Logística/Ejecutivo ven todos
        return DEMO_PROJECTS

@app.get("/proyectos/{proyecto_id}/hitos")
async def get_hitos_proyecto(proyecto_id: str, current_user: dict = Depends(get_current_user)):
    return DEMO_MILESTONES

@app.get("/faqs")
async def get_faqs():
    faqs = [
        {
            "id": "1",
            "etapa": "pre",
            "pregunta": "¿Cuántos años de experiencia tienen?",
            "respuesta": "Más de 15 años en wood/steel frame con más de 200 proyectos entregados."
        },
        {
            "id": "2",
            "etapa": "pre",
            "pregunta": "¿Materiales y certificaciones?",
            "respuesta": "Usamos estructuras galvanizadas/wood con aislaciones certificadas IRAM/ASTM."
        },
        {
            "id": "3",
            "etapa": "post",
            "pregunta": "¿Cuál es el cronograma de la obra?",
            "respuesta": "Disponible en tu portal → Proyecto → Cronograma."
        }
    ]
    return faqs

@app.post("/chatbot/query")
async def chatbot_query(query: str, current_user: dict = Depends(get_current_user)):
    # Lógica simple del chatbot
    if "cronograma" in query.lower():
        return {
            "respuesta": "Tu cronograma está disponible en la sección de Proyectos. Próximo hito: Techado en 10 días.",
            "tipo": "cronograma"
        }
    elif "pago" in query.lower():
        return {
            "respuesta": "Próximo pago: $25,000 para la etapa de Estructura. Vence en 5 días.",
            "tipo": "pago"
        }
    else:
        return {
            "respuesta": "Consulta las FAQs para información general o contacta a tu ejecutivo de cuenta.",
            "tipo": "general"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
