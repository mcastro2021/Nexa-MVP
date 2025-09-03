# Nexa MVP - Sistema de Gestión con Servicios Separados

## Descripción
Sistema completo de gestión para empresas constructoras que incluye gestión de proyectos, clientes, empleados, inventario y métricas ejecutivas. El proyecto está estructurado con dos servicios web separados: backend Flask y frontend React.

## Estructura del Proyecto
```
Nexa-MVP/
├── app.py                 # ✅ Aplicación Flask (solo backend API)
├── wsgi.py               # ✅ Punto de entrada WSGI para Render
├── requirements.txt      # ✅ Dependencias de Python
├── render.yaml          # ✅ Configuración de Render (2 servicios web)
├── build.sh             # ✅ Script de build local
├── frontend/            # ✅ Código React
│   ├── src/             # Código fuente React
│   ├── public/          # Archivos públicos
│   ├── package.json     # Dependencias Node.js
│   └── build/           # Archivos compilados (generados automáticamente)
└── .gitignore           # Archivos ignorados por Git
```

## Arquitectura de Servicios

### Backend (Flask) - Servicio Web Python
- **Nombre**: `nexa-mvp-backend`
- **Tipo**: Servicio web Python
- **Función**: API RESTful para toda la lógica de negocio
- **Puerto**: Variable `$PORT` de Render

### Frontend (React) - Servicio Web Node.js
- **Nombre**: `nexa-mvp-frontend`
- **Tipo**: Servicio web Node.js
- **Función**: Interfaz de usuario React
- **Puerto**: Variable `$PORT` de Render (diferente al backend)

## Características Principales

### Backend (Flask)
- **API RESTful** con endpoints para autenticación, clientes, administración, etc.
- **Base de datos SQLAlchemy** con modelos para usuarios, proyectos, materiales, etc.
- **Autenticación JWT** para proteger las rutas
- **CORS configurado** para permitir peticiones del frontend

### Frontend (React)
- **Aplicación SPA** con React Router
- **Material-UI** para componentes de interfaz
- **Autenticación** integrada con el backend
- **Dashboard responsivo** para diferentes roles de usuario

## Configuración de Render

### Backend Service
```yaml
buildCommand: |
  pip install --upgrade pip setuptools wheel
  pip install -r requirements.txt
startCommand: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

### Frontend Service
```yaml
buildCommand: |
  cd frontend
  npm install
  npm run build
startCommand: cd frontend && npm start
```

## Endpoints de la API

### Rutas Públicas
- `GET /` - Información de la API y endpoints disponibles
- `GET /health` - Estado de salud del backend

### Rutas de Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Rutas Protegidas (requieren JWT)
- `GET /api/profile` - Perfil del usuario
- `GET /api/client/projects` - Proyectos del cliente
- `GET /api/admin/stock` - Inventario de materiales
- `GET /api/executive/metrics` - Métricas ejecutivas
- `POST /api/chatbot` - Chatbot inteligente

## Desarrollo Local

### Backend
```bash
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Build Completo
```bash
chmod +x build.sh
./build.sh
```

## Despliegue

1. **Push al repositorio** - Render detecta cambios automáticamente
2. **Build automático** - Se compilan ambos servicios simultáneamente
3. **Servicios separados** - Backend y frontend corren en puertos diferentes
4. **Comunicación** - Frontend se comunica con backend a través de la URL del servicio backend

## Ventajas de la Arquitectura Separada

- **Separación de responsabilidades** clara entre backend y frontend
- **Escalabilidad independiente** de cada servicio
- **Despliegue independiente** de cada componente
- **Mejor mantenimiento** y debugging
- **Flexibilidad** para usar diferentes tecnologías en cada servicio

## Comunicación entre Servicios

- El frontend obtiene la URL del backend desde `REACT_APP_API_URL`
- Todas las llamadas API van del frontend al backend
- CORS está configurado para permitir la comunicación
- El backend maneja toda la lógica de negocio y base de datos

## Notas Importantes

- Cada servicio tiene su propio puerto y URL en Render
- El frontend se ejecuta con `npm start` en producción
- El backend se ejecuta con `gunicorn` para mejor rendimiento
- La base de datos se inicializa automáticamente en el backend
- Las variables de entorno se configuran automáticamente en Render

## Tecnologías Utilizadas

- **Backend**: Flask, SQLAlchemy, JWT, CORS
- **Frontend**: React, TypeScript, Material-UI, React Router
- **Base de Datos**: PostgreSQL (Render), SQLite (desarrollo local)
- **Despliegue**: Render, Gunicorn (backend), npm (frontend)
- **Build**: pip (backend), npm (frontend)
