# 🚀 Guía de Despliegue - Constructora 360°

## Despliegue Automático en Render

Esta plataforma está configurada para desplegarse automáticamente en Render como un **Blueprint** completo.

### 📋 Prerrequisitos

1. **Cuenta en Render** (gratuita en [render.com](https://render.com))
2. **Repositorio en GitHub** con este código
3. **Datos de contacto** para configuraciones adicionales

### 🎯 Opción 1: Despliegue Automático (Recomendado)

#### Paso 1: Preparar el Repositorio
```bash
# Clonar este repositorio
git clone <tu-repo-url>
cd constructora-e2e

# Subir a GitHub
git add .
git commit -m "Initial commit: Constructora 360° E2E Platform"
git push origin main
```

#### Paso 2: Desplegar en Render
1. Ir a [render.com](https://render.com) y crear cuenta
2. Hacer clic en **"New +"** → **"Blueprint"**
3. Conectar tu repositorio de GitHub
4. Render detectará automáticamente el `render.yaml`
5. Hacer clic en **"Create New Resources"**

#### Paso 3: Configuración Automática
Render creará automáticamente:
- ✅ **PostgreSQL Database** (plan starter)
- ✅ **Redis Instance** (plan starter)
- ✅ **Backend API** (Fastify + Prisma)
- ✅ **Frontend Web** (Next.js 14)
- ✅ **Worker Service** (BullMQ + Redis)
- ✅ **Variables de entorno** configuradas
- ✅ **Health checks** y monitoreo

### 🔧 Opción 2: Despliegue Manual

Si prefieres control total, puedes crear los servicios uno por uno:

#### 1. Crear Base de Datos PostgreSQL
```bash
# En Render Dashboard
New + → PostgreSQL
Nombre: constructora-db
Plan: Starter
Region: Oregon (o tu preferida)
```

#### 2. Crear Instancia Redis
```bash
# En Render Dashboard
New + → Redis
Nombre: constructora-redis
Plan: Starter
Region: Oregon (o tu preferida)
```

#### 3. Crear Backend API
```bash
# En Render Dashboard
New + → Web Service
Nombre: constructora-api
Repository: tu-repo
Root Directory: apps/api
Build Command: npm install && npm run prisma:generate && npm run build
Start Command: npm run start
Environment Variables:
  - DATABASE_URL: [from PostgreSQL]
  - JWT_SECRET: [generate]
  - REDIS_URL: [from Redis]
```

#### 4. Crear Frontend Web
```bash
# En Render Dashboard
New + → Web Service
Nombre: constructora-web
Repository: tu-repo
Root Directory: apps/web
Build Command: npm install && npm run build
Start Command: npm run start
Environment Variables:
  - NEXT_PUBLIC_API_URL: [from API service]
```

#### 5. Crear Worker Service
```bash
# En Render Dashboard
New + → Background Worker
Nombre: constructora-worker
Repository: tu-repo
Root Directory: apps/worker
Build Command: npm install && npm run build
Start Command: npm run start
Environment Variables:
  - DATABASE_URL: [from PostgreSQL]
  - REDIS_URL: [from Redis]
```

### 🗄️ Configuración de Base de Datos

#### Ejecutar Migraciones
```bash
# En el servicio API de Render
# Ir a Shell y ejecutar:
npm run prisma:migrate
```

#### Cargar Datos de Prueba
```bash
# En el servicio API de Render
# Ir a Shell y ejecutar:
npm run seed
```

### 🔑 Credenciales de Acceso Demo

Después del seed, tendrás acceso con:

- **Cliente**: `cliente@demo.com` / `password123`
- **Admin**: `admin@demo.com` / `password123`
- **Logística**: `logistica@demo.com` / `password123`
- **Ejecutivo**: `ejecutivo@demo.com` / `password123`

### 🌐 URLs de Acceso

- **Frontend**: `https://constructora-web.onrender.com`
- **API**: `https://constructora-api.onrender.com`
- **Health Check**: `https://constructora-api.onrender.com/healthz`

### 📊 Monitoreo y Logs

#### Health Checks
- **API**: `/healthz` - Estado del backend
- **Frontend**: `/` - Estado del frontend

#### Logs en Render
- Cada servicio tiene su propia sección de logs
- Los logs se actualizan en tiempo real
- Filtros por nivel (INFO, WARN, ERROR)

### 🔧 Configuraciones Adicionales

#### Variables de Entorno Opcionales
```bash
# Para integración con WhatsApp
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_WHATSAPP_NUMBER=+1234567890

# Para notificaciones por email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Para almacenamiento de archivos
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=constructora-files
```

#### Configuración de Dominio Personalizado
1. En Render Dashboard → Tu Servicio
2. Settings → Custom Domains
3. Agregar tu dominio
4. Configurar DNS según instrucciones

### 🚨 Solución de Problemas Comunes

#### Error de Conexión a Base de Datos
```bash
# Verificar variables de entorno
# Verificar que PostgreSQL esté activo
# Revisar logs del servicio API
```

#### Error de Build
```bash
# Verificar Node.js version (>=18)
# Verificar que todas las dependencias estén en package.json
# Revisar logs de build en Render
```

#### Frontend no carga
```bash
# Verificar NEXT_PUBLIC_API_URL
# Verificar que el API esté funcionando
# Revisar logs del frontend
```

### 📈 Escalabilidad

#### Planes de Pago
- **Starter**: Gratuito (ideal para MVP)
- **Standard**: $7/mes (recomendado para producción)
- **Pro**: $25/mes (para alto tráfico)

#### Auto-scaling
- Configurar en cada servicio
- Basado en CPU/Memory
- Reglas personalizables

### 🔒 Seguridad

#### HTTPS Automático
- Render proporciona SSL automático
- Certificados Let's Encrypt
- Redirección HTTP → HTTPS

#### Variables de Entorno
- Nunca commitear `.env` files
- Usar variables de Render
- Rotar JWT_SECRET regularmente

### 📞 Soporte

#### Render Support
- [Documentación oficial](https://render.com/docs)
- [Community forum](https://community.render.com)
- [Email support](mailto:support@render.com)

#### Proyecto
- Revisar logs en Render Dashboard
- Verificar health checks
- Consultar este README

---

## 🎉 ¡Despliegue Completado!

Tu plataforma Constructora 360° estará funcionando en:
- **Frontend**: https://constructora-web.onrender.com
- **API**: https://constructora-api.onrender.com

**Próximos pasos:**
1. ✅ Verificar health checks
2. ✅ Ejecutar migraciones de base de datos
3. ✅ Cargar datos de prueba
4. ✅ Probar acceso con credenciales demo
5. 🚀 ¡Comenzar a usar la plataforma!
