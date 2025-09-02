# Nexa MVP - Sistema de Gestión Constructora

Sistema integral de gestión para constructora de viviendas wood frame y steel frame, diseñado para administrar de manera transparente y eficiente todos los aspectos del negocio.

## 🏗️ Características Principales

### 👥 Perfiles de Usuario

#### **Cliente Final**
- Acceso a su legajo personal
- Visualización de proyectos y avances
- Historial de pagos y facturación
- Sistema de consultas y soporte
- Carrousel de información para fidelización

#### **Colaborador Interno - Administración**
- **Control de Stock**: Gestión de inventario, alertas de stock bajo, reportes de costos
- **Proveedores**: Contratos, adendas, pedidos, fechas de pago y facturación
- **Capital Humano**: Legajos individuales, datos biométricos, seguros, ausencias y licencias
- **Legajo Cliente**: Información completa del cliente, contratos, pagos y etapas del proyecto

#### **Colaborador Interno - Logística**
- **Control de Stock**: Gestión de materiales por proyecto, alertas de stock bajo
- **Capital Humano**: Acceso a legajos, recibos de sueldo, gestión de licencias
- **Hoja de Ruta**: Planificación temporal de proyectos, visibilidad de cronogramas

#### **Ejecutivo**
- **Métricas del Negocio**: KPIs, tiempo de ejecución, ingresos/egresos
- **Alertas**: Demoras de entrega, satisfacción de clientes
- **Proyecciones**: Económicas y de recursos
- **Reportes**: Personal, estados, ausencias y licencias

### 🤖 Chatbot Integrado
- Resolución automática de consultas frecuentes
- Derivación a WhatsApp para consultas complejas
- Preguntas sugeridas para facilitar la interacción

### 📅 Calendario Integrado
- Gestión de eventos, reuniones y recordatorios
- Disponible para todos los perfiles de usuario
- Notificaciones y alertas

### 📱 Diseño Responsive
- Optimizado para dispositivos móviles y desktop
- Interfaz adaptativa según el rol del usuario
- Navegación intuitiva y accesible

## 🚀 Tecnologías Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para base de datos
- **JWT**: Autenticación y autorización
- **PostgreSQL**: Base de datos principal
- **Gunicorn**: Servidor WSGI para producción

### Frontend
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **Material-UI**: Componentes de interfaz
- **React Router**: Navegación entre páginas
- **Axios**: Cliente HTTP para API

## 📋 Requisitos del Sistema

### Backend
- Python 3.9+
- PostgreSQL 12+
- Dependencias listadas en `backend/requirements.txt`

### Frontend
- Node.js 16+
- npm o yarn
- Dependencias listadas en `frontend/package.json`

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Nexa-MVP
```

### 2. Configurar Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno
```bash
cp env_example .env
# Editar .env con tus configuraciones
```

### 4. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
# Ejecutar migraciones si es necesario
```

### 5. Configurar Frontend
```bash
cd frontend
npm install
```

### 6. Ejecutar Aplicación

#### Desarrollo
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Producción
```bash
# Backend
cd backend
gunicorn wsgi:app

# Frontend
cd frontend
npm run build
```

## 🌐 Despliegue en Render.com

El proyecto incluye configuración automática para Render.com:

1. **Conectar Repositorio**: Vincular el repositorio Git con Render
2. **Despliegue Automático**: Render detectará el `render.yaml` y configurará los servicios
3. **Base de Datos**: Se creará automáticamente una instancia PostgreSQL
4. **Variables de Entorno**: Se configurarán automáticamente las claves secretas

### Servicios en Render
- **Backend**: API Flask con Gunicorn
- **Frontend**: Aplicación React estática
- **Base de Datos**: PostgreSQL con respaldos automáticos

## 👤 Usuarios de Prueba

Para facilitar las pruebas, se incluyen usuarios predefinidos:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `cliente` | `cliente123` | Cliente Final |
| `admin` | `admin123` | Administración |
| `logistica` | `logistica123` | Logística |
| `ejecutivo` | `ejecutivo123` | Ejecutivo |

## 📊 Estructura de la Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema con roles
- **ClientProfile**: Perfiles de clientes
- **EmployeeProfile**: Perfiles de empleados
- **Project**: Proyectos de construcción
- **ProjectStage**: Etapas de los proyectos
- **Material**: Materiales e inventario
- **Supplier**: Proveedores y contratos
- **Payment**: Pagos y transacciones
- **Calendar**: Eventos y recordatorios

## 🔒 Seguridad

- **JWT**: Tokens de autenticación seguros
- **Roles**: Sistema de permisos basado en roles
- **Validación**: Validación de entrada en frontend y backend
- **HTTPS**: Comunicación encriptada en producción

## 📱 Funcionalidades por Rol

### Cliente
- Dashboard personalizado
- Visualización de proyectos
- Historial de pagos
- Sistema de consultas
- Calendario personal

### Administración
- Gestión completa de stock
- Administración de empleados
- Control de pagos
- Gestión de proveedores
- Reportes administrativos

### Logística
- Control de stock por proyecto
- Hoja de ruta de proyectos
- Gestión de materiales
- Planificación temporal

### Ejecutivo
- Métricas del negocio
- KPIs de rendimiento
- Reportes ejecutivos
- Proyecciones financieras
- Gestión de alertas

## 🚧 Estado del Proyecto

- ✅ **Backend**: API completa con todos los endpoints
- ✅ **Frontend**: Interfaz de usuario responsive
- ✅ **Base de Datos**: Modelos y relaciones definidos
- ✅ **Autenticación**: Sistema JWT implementado
- ✅ **Chatbot**: Integración básica con WhatsApp
- ✅ **Calendario**: Gestión de eventos
- ✅ **Render.com**: Configuración de despliegue

## 🔮 Próximas Funcionalidades

- [ ] Integración con sistemas de biometría
- [ ] Módulo de facturación avanzado
- [ ] Sistema de notificaciones push
- [ ] Reportes en tiempo real
- [ ] Integración con sistemas externos
- [ ] Módulo de planificación financiera

## 📞 Soporte

Para consultas técnicas o soporte:
- **Email**: soporte@nexamvp.com
- **WhatsApp**: +54 9 11 1234-5678
- **Documentación**: [docs.nexamvp.com](https://docs.nexamvp.com)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Nexa MVP** - Transformando la gestión constructora con tecnología moderna y eficiente.
