# Nexa MVP - Sistema de Gestión para Constructora

## Descripción
Nexa MVP es un sistema de gestión integral para constructoras que permite a clientes, administradores, personal de logística y ejecutivos gestionar proyectos, pagos, stock y métricas de manera eficiente.

## Características Principales

### 🏗️ Gestión de Proyectos
- Seguimiento del progreso de obras
- Estados de proyectos (Pendiente, En Progreso, Completado)
- Visualización de avances con barras de progreso

### 💰 Control de Pagos
- Gestión de pagos por proyecto
- Estados de pago (Pendiente, En Progreso, Completado)
- Historial de transacciones

### 📦 Control de Stock
- Inventario de materiales de construcción
- Alertas de stock bajo
- Gestión de niveles mínimos

### 👥 Gestión de Usuarios
- Sistema de roles (Cliente, Admin, Logística, Ejecutivo)
- Dashboards personalizados por rol
- Autenticación segura con JWT

### 🤖 Asistente Virtual
- Chatbot integrado con respuestas inteligentes
- Integración con WhatsApp
- Preguntas frecuentes automatizadas

## Tecnologías Utilizadas

### Backend
- **Flask** con Python 3.11
- **SQLAlchemy** para ORM
- **Flask-JWT-Extended** para autenticación
- **PostgreSQL** en producción / SQLite en desarrollo
- **Flask-CORS** para comunicación con frontend

### Frontend
- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes de interfaz
- **React Router** para navegación
- **React Query** para gestión de estado
- **Recharts** para gráficos y métricas
- **Axios** para peticiones HTTP

### Características Técnicas
- Diseño responsive para móviles y desktop
- Fallback a datos mock si el backend no está disponible
- Optimizado para despliegue en Render

## Instalación y Configuración

### Prerrequisitos
- Python 3.11 o superior
- Node.js 18 o superior
- npm o yarn

### Instalación Local

#### Backend
1. Navega al directorio del backend:
```bash
cd backend
```

2. Crea un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

4. Configura las variables de entorno (crea un archivo `.env`):
```env
SECRET_KEY=tu-clave-secreta-aqui
JWT_SECRET_KEY=tu-jwt-secret-aqui
DATABASE_URL=sqlite:///nexa_mvp.db
FLASK_ENV=development
```

5. Inicializa la base de datos:
```bash
python app.py
```

#### Frontend
1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:3000`

### Despliegue en Render

El proyecto está configurado para desplegarse automáticamente en Render:

1. **Backend**: Se despliega como servicio web Python
2. **Frontend**: Se despliega como sitio estático
3. **Base de datos**: PostgreSQL automática

La configuración en `render.yaml` incluye:
- Variables de entorno automáticas
- Conexión entre frontend y backend
- Base de datos PostgreSQL

## Usuarios de Prueba

El sistema incluye usuarios de demostración:

| Usuario | Contraseña | Rol | Acceso |
|---------|------------|-----|--------|
| `cliente` | `cliente123` | Cliente | Proyectos propios, pagos |
| `admin` | `admin123` | Administrador | Stock, pagos, empleados |
| `logistica` | `logistica123` | Logística | Stock, rutas de trabajo |
| `ejecutivo` | `ejecutivo123` | Ejecutivo | Métricas generales, reportes |

## Estructura del Proyecto

```
Nexa-MVP/
├── backend/
│   ├── app.py              # Aplicación principal Flask
│   ├── config.py           # Configuración
│   ├── requirements.txt    # Dependencias Python
│   ├── wsgi.py            # WSGI para producción
│   └── gunicorn.conf.py   # Configuración Gunicorn
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── config.js       # Configuración del frontend
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.tsx    # Asistente virtual
│   │   │   └── Layout.tsx     # Layout principal
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # Contexto de autenticación
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Dashboard principal
│   │   │   ├── Login.tsx      # Página de login
│   │   │   ├── Projects.tsx   # Gestión de proyectos
│   │   │   ├── Payments.tsx   # Gestión de pagos
│   │   │   ├── Stock.tsx      # Control de inventario
│   │   │   ├── Employees.tsx  # Gestión de empleados
│   │   │   ├── WorkRoute.tsx  # Rutas de trabajo
│   │   │   ├── ExecutiveMetrics.tsx # Métricas ejecutivas
│   │   │   └── Calendar.tsx   # Calendario
│   │   ├── App.tsx           # Componente principal
│   │   └── index.tsx         # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
├── render.yaml              # Configuración de Render
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/profile` - Obtener perfil del usuario

### Clientes
- `GET /api/client/projects` - Proyectos del cliente
- `GET /api/client/payments` - Pagos del cliente

### Administración
- `GET /api/admin/stock` - Control de inventario
- `GET /api/admin/employees` - Gestión de empleados

### Logística
- `GET /api/logistics/route` - Rutas de trabajo

### Ejecutivos
- `GET /api/executive/metrics` - Métricas del negocio

### Chatbot
- `POST /api/chatbot` - Interacción con asistente virtual

### Calendario
- `GET /api/calendar` - Obtener eventos
- `POST /api/calendar` - Crear evento

## Funcionalidades por Rol

### Cliente
- Ver progreso de sus proyectos
- Consultar estado de pagos
- Acceder al asistente virtual
- Calendario de eventos

### Administrador
- Control completo de stock
- Gestión de todos los pagos
- Administración de empleados
- Alertas de inventario

### Logística
- Gestión de rutas de trabajo
- Control de stock crítico
- Seguimiento de proyectos en curso

### Ejecutivo
- Métricas generales del negocio
- Reportes de rendimiento
- Vista consolidada de todos los datos

## Modo Fallback

El frontend incluye un sistema de fallback que:

- **Conecta al backend** cuando está disponible
- **Usa datos mock** si el backend no responde
- **Mantiene funcionalidad** en ambos casos
- **Notifica en consola** el estado de la conexión

## Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema
- **ClientProfile**: Perfiles de clientes
- **EmployeeProfile**: Perfiles de empleados
- **Project**: Proyectos de construcción
- **Material**: Inventario de materiales
- **Payment**: Pagos y transacciones
- **Calendar**: Eventos y recordatorios

### Relaciones
- Un cliente puede tener múltiples proyectos
- Un proyecto puede tener múltiples etapas y materiales
- Los empleados pueden estar asignados a múltiples proyectos
- Los pagos están vinculados a proyectos específicos

## Configuración de Producción

### Variables de Entorno
```env
SECRET_KEY=clave-secreta-produccion
JWT_SECRET_KEY=jwt-secret-produccion
DATABASE_URL=postgresql://usuario:password@host:puerto/database
FLASK_ENV=production
CORS_ORIGIN=https://tu-frontend-url.com
```

### Render Configuration
El archivo `render.yaml` configura automáticamente:
- Servicios web para backend y frontend
- Base de datos PostgreSQL
- Variables de entorno seguras
- Conexión entre servicios

## Contacto y Soporte

Para consultas sobre el proyecto:
- WhatsApp: +54 9 11 1234-5678
- Email: info@nexamvp.com

## Licencia

Este proyecto es un MVP (Producto Mínimo Viable) desarrollado para demostración de capacidades de gestión en el sector de la construcción.
