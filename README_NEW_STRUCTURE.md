# Nexa MVP - Nueva Estructura Unificada

## Descripción
Este proyecto ha sido reestructurado para tener tanto el frontend como el backend en la raíz, con Flask sirviendo tanto la API como la aplicación React.

## Estructura del Proyecto
```
Nexa-MVP/
├── app.py                 # Aplicación Flask principal (backend + frontend)
├── wsgi.py               # Punto de entrada WSGI para Render
├── requirements.txt      # Dependencias de Python
├── render.yaml          # Configuración de Render
├── frontend/            # Código React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/           # Archivos compilados (generados automáticamente)
└── venv/                # Entorno virtual de Python
```

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

### Build Command
```bash
cd frontend && npm install && npm run build
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Start Command
```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

## Endpoints de la API

### Rutas Públicas
- `GET /` - Aplicación React
- `GET /health` - Estado de salud de la API

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

## Despliegue

1. **Push al repositorio** - Render detecta cambios automáticamente
2. **Build automático** - Se compila el frontend y se instalan dependencias Python
3. **Servidor único** - Flask sirve tanto la API como los archivos estáticos del frontend

## Ventajas de la Nueva Estructura

- **Un solo servicio** en Render (más económico)
- **Sin problemas de CORS** entre frontend y backend
- **Despliegue simplificado** con un solo comando
- **Mejor rendimiento** al servir archivos estáticos desde Flask
- **Manejo de rutas SPA** con fallback a index.html

## Notas Importantes

- El frontend se compila durante el build y se sirve desde `frontend/build/`
- Todas las rutas no encontradas redirigen al frontend (SPA routing)
- La base de datos se inicializa automáticamente al importar la aplicación
- Las variables de entorno se configuran automáticamente en Render
