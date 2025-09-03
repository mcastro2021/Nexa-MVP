#!/usr/bin/env python3
"""
Constructora E2E Platform - FastAPI Application
Esta es la aplicación principal que Render ejecutará con gunicorn
"""

from fastapi import FastAPI, HTTPException, Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import json
import hashlib
import random
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
    estado: str
    presupuesto: float
    cliente: str

class Milestone(BaseModel):
    id: str
    nombre: str
    estado: str
    fecha_plan: datetime
    fecha_real: Optional[datetime] = None
    progreso: int
    responsable: str

class StockItem(BaseModel):
    id: str
    sku: str
    nombre: str
    stock: float
    minimo: float
    unidad: str
    costo: float
    proveedor: str

class Supplier(BaseModel):
    id: str
    nombre: str
    email: str
    telefono: str
    especialidad: str
    rating: float

class Employee(BaseModel):
    id: str
    nombre: str
    puesto: str
    area: str
    antiguedad: int
    salario: float
    estado: str

class ChatbotQuery(BaseModel):
    query: str

# Función simple de hash (sin bcrypt)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Datos de prueba expandidos
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
        "fecha_entrega": datetime.now() + timedelta(days=60),
        "estado": "EN_PROGRESO",
        "presupuesto": 150000,
        "cliente": "Familia González"
    },
    {
        "id": "2",
        "nombre": "Edificio Steel Frame 500m²",
        "tipo": "STEEL_FRAME",
        "m2": 500,
        "direccion": "Calle Comercial 456",
        "fecha_inicio": datetime.now() - timedelta(days=15),
        "fecha_entrega": datetime.now() + timedelta(days=90),
        "estado": "PLANIFICACION",
        "presupuesto": 450000,
        "cliente": "Empresa Constructora S.A."
    },
    {
        "id": "3",
        "nombre": "Casa Modular 80m²",
        "tipo": "WOOD_FRAME",
        "m2": 80,
        "direccion": "Ruta Provincial 789",
        "fecha_inicio": datetime.now() - timedelta(days=45),
        "fecha_entrega": datetime.now() + timedelta(days=30),
        "estado": "FINALIZADO",
        "presupuesto": 120000,
        "cliente": "Juan Pérez"
    }
]

DEMO_MILESTONES = [
    {
        "id": "1",
        "nombre": "Fundaciones",
        "estado": "COMPLETADO",
        "fecha_plan": datetime.now() - timedelta(days=20),
        "fecha_real": datetime.now() - timedelta(days=18),
        "progreso": 100,
        "responsable": "Equipo Fundaciones"
    },
    {
        "id": "2",
        "nombre": "Estructura",
        "estado": "EN_PROGRESO",
        "fecha_plan": datetime.now() - timedelta(days=10),
        "fecha_real": None,
        "progreso": 65,
        "responsable": "Equipo Estructura"
    },
    {
        "id": "3",
        "nombre": "Techado",
        "estado": "PENDIENTE",
        "fecha_plan": datetime.now() + timedelta(days=10),
        "fecha_real": None,
        "progreso": 0,
        "responsable": "Equipo Techado"
    }
]

DEMO_STOCK = [
    {
        "id": "1",
        "sku": "WF-001",
        "nombre": "Vigas Wood Frame 2x4",
        "stock": 150,
        "minimo": 50,
        "unidad": "unidad",
        "costo": 25.50,
        "proveedor": "Maderera Norte"
    },
    {
        "id": "2",
        "sku": "SF-001",
        "nombre": "Perfiles Steel Frame",
        "stock": 80,
        "minimo": 30,
        "unidad": "m",
        "costo": 45.00,
        "proveedor": "Metalúrgica Sur"
    },
    {
        "id": "3",
        "sku": "AI-001",
        "nombre": "Aislación Térmica",
        "stock": 200,
        "minimo": 100,
        "unidad": "m²",
        "costo": 12.75,
        "proveedor": "Aislaciones Pro"
    }
]

DEMO_SUPPLIERS = [
    {
        "id": "1",
        "nombre": "Maderera Norte",
        "email": "contacto@madereranorte.com",
        "telefono": "+54 11 1234-5678",
        "especialidad": "Maderas certificadas",
        "rating": 4.8
    },
    {
        "id": "2",
        "nombre": "Metalúrgica Sur",
        "email": "ventas@metalurgicasur.com",
        "telefono": "+54 11 2345-6789",
        "especialidad": "Acero galvanizado",
        "rating": 4.6
    }
]

DEMO_EMPLOYEES = [
    {
        "id": "1",
        "nombre": "Carlos Rodríguez",
        "puesto": "Capataz",
        "area": "Obra",
        "antiguedad": 5,
        "salario": 85000,
        "estado": "ACTIVO"
    },
    {
        "id": "2",
        "nombre": "María González",
        "puesto": "Arquitecta",
        "area": "Diseño",
        "antiguedad": 3,
        "salario": 95000,
        "estado": "ACTIVO"
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

# Sistema de IA simple para el chatbot
class ConstructionAI:
    def __init__(self):
        self.knowledge_base = {
            "cronograma": [
                "Tu cronograma está disponible en la sección de Proyectos. Próximo hito: Techado en 10 días.",
                "Según el plan, la estructura estará lista en 5 días y el techado comenzará la semana siguiente.",
                "El proyecto está al 65% de avance. Fundaciones completadas, estructura en progreso."
            ],
            "pago": [
                "Próximo pago: $25,000 para la etapa de Estructura. Vence en 5 días.",
                "El pago de fundaciones ya fue procesado. El siguiente es para estructura.",
                "Tienes un saldo pendiente de $45,000 para completar la obra."
            ],
            "materiales": [
                "Los materiales están siendo entregados según cronograma. Vigas wood frame llegaron ayer.",
                "Stock disponible: 150 vigas, 80m de perfiles steel, 200m² de aislación.",
                "El proveedor confirmó entrega de aislación térmica para mañana."
            ],
            "personal": [
                "Equipo asignado: Carlos Rodríguez (Capataz), María González (Arquitecta).",
                "El personal está trabajando en turnos de 8 horas, 6 días por semana.",
                "Tenemos 15 empleados activos, 2 en licencia."
            ],
            "calidad": [
                "Todos los materiales cumplen certificaciones IRAM/ASTM.",
                "Inspecciones de calidad se realizan semanalmente.",
                "La obra cumple con todos los estándares de seguridad vigentes."
            ]
        }
    
    def analyze_query(self, query: str, user_role: str) -> dict:
        query_lower = query.lower()
        
        # Análisis de intención
        if any(word in query_lower for word in ["cronograma", "fecha", "tiempo", "avance"]):
            intent = "cronograma"
        elif any(word in query_lower for word in ["pago", "costo", "precio", "factura"]):
            intent = "pago"
        elif any(word in query_lower for word in ["material", "stock", "proveedor", "entrega"]):
            intent = "materiales"
        elif any(word in query_lower for word in ["personal", "empleado", "equipo", "trabajador"]):
            intent = "personal"
        elif any(word in query_lower for word in ["calidad", "certificación", "estándar", "inspección"]):
            intent = "calidad"
        else:
            intent = "general"
        
        # Respuesta contextual
        if intent in self.knowledge_base:
            responses = self.knowledge_base[intent]
            response = random.choice(responses)
        else:
            response = "Consulta las FAQs para información general o contacta a tu ejecutivo de cuenta."
        
        # Análisis de sentimiento (simulado)
        sentiment = "neutral"
        if any(word in query_lower for word in ["problema", "error", "mal", "malo"]):
            sentiment = "negative"
        elif any(word in query_lower for word in ["excelente", "bien", "perfecto", "genial"]):
            sentiment = "positive"
        
        # Recomendaciones basadas en rol
        recommendations = []
        if user_role == "CLIENTE":
            recommendations = ["Revisa tu cronograma personal", "Consulta el estado de pagos", "Usa el chatbot para dudas"]
        elif user_role == "ADMIN":
            recommendations = ["Revisa KPIs de finanzas", "Monitorea stock de materiales", "Gestiona personal"]
        elif user_role == "LOGISTICA":
            recommendations = ["Verifica entregas de proveedores", "Controla stock mínimo", "Planifica logística"]
        elif user_role == "EJECUTIVO":
            recommendations = ["Analiza KPIs generales", "Revisa proyecciones financieras", "Monitorea satisfacción"]
        
        return {
            "respuesta": response,
            "tipo": intent,
            "sentimiento": sentiment,
            "confianza": random.uniform(0.8, 0.95),
            "recomendaciones": recommendations,
            "timestamp": datetime.now().isoformat()
        }

# Instancia del chatbot IA
ai_chatbot = ConstructionAI()

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
            "/stock",
            "/proveedores",
            "/empleados",
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
    obras_en_progreso = len([p for p in DEMO_PROJECTS if p["estado"] == "EN_PROGRESO"])
    obras_finalizadas = len([p for p in DEMO_PROJECTS if p["estado"] == "FINALIZADO"])
    
    # Cálculo de tiempo promedio
    tiempo_promedio = 90  # días
    
    return {
        "total": total_obras,
        "en_progreso": obras_en_progreso,
        "finalizadas": obras_finalizadas,
        "promedioDias": tiempo_promedio,
        "obras": DEMO_PROJECTS
    }

@app.get("/kpi/finanzas")
async def get_kpi_finanzas(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_presupuesto = sum(p["presupuesto"] for p in DEMO_PROJECTS)
    ingresos = 150000
    egresos = 120000
    utilidad = ingresos - egresos
    
    return {
        "ingresos": ingresos,
        "egresos": egresos,
        "utilidad": utilidad,
        "presupuesto_total": total_presupuesto,
        "proyectos_activos": len([p for p in DEMO_PROJECTS if p["estado"] != "FINALIZADO"]),
        "roi": round((utilidad / total_presupuesto) * 100, 2)
    }

@app.get("/kpi/personal")
async def get_kpi_personal(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_empleados = len(DEMO_EMPLOYEES)
    empleados_activos = len([e for e in DEMO_EMPLOYEES if e["estado"] == "ACTIVO"])
    salario_promedio = sum(e["salario"] for e in DEMO_EMPLOYEES) / total_empleados if total_empleados > 0 else 0
    
    return {
        "total_empleados": total_empleados,
        "activos": empleados_activos,
        "licencias": total_empleados - empleados_activos,
        "rotacion": "5%",
        "salario_promedio": round(salario_promedio, 2),
        "antiguedad_promedio": round(sum(e["antiguedad"] for e in DEMO_EMPLOYEES) / total_empleados, 1)
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

@app.get("/stock")
async def get_stock(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "LOGISTICA"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Agregar alertas de stock bajo
    stock_with_alerts = []
    for item in DEMO_STOCK:
        alerta = "CRITICO" if item["stock"] < item["minimo"] else "BAJO" if item["stock"] < item["minimo"] * 1.5 else "NORMAL"
        stock_with_alerts.append({**item, "alerta": alerta})
    
    return stock_with_alerts

@app.get("/proveedores")
async def get_proveedores(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "LOGISTICA"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return DEMO_SUPPLIERS

@app.get("/empleados")
async def get_empleados(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["ADMIN", "EJECUTIVO"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return DEMO_EMPLOYEES

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
        },
        {
            "id": "4",
            "etapa": "pre",
            "pregunta": "¿Qué garantía ofrecen?",
            "respuesta": "Garantía de 10 años en estructura y 5 años en terminaciones."
        },
        {
            "id": "5",
            "etapa": "post",
            "pregunta": "¿Cómo reportar problemas?",
            "respuesta": "Usa el chatbot integrado o contacta a tu ejecutivo de cuenta."
        }
    ]
    return faqs

@app.post("/chatbot/query")
async def chatbot_query(query_data: ChatbotQuery, current_user: dict = Depends(get_current_user)):
    """Endpoint del chatbot con IA"""
    if not query_data.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Usar el sistema de IA para analizar la consulta
    ai_response = ai_chatbot.analyze_query(query_data.query, current_user["role"])
    
    return ai_response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
