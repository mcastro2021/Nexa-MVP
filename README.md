# Plataforma E2E para Constructora (Wood/Steel Frame)

> **Objetivo:** Proveer una app web responsiva, multi‑perfil y lista para desplegar en **Render** que cubra punta a punta el negocio: Clientes, Administración, Logística, Ejecutivos; con chatbot, calendario y FAQs.

## 🚀 Características Principales

- **Multi-perfil**: Cliente Final, Administración, Logística, Ejecutivo
- **Gestión completa**: Proyectos, Stock, RRHH, Proveedores, Finanzas
- **Chatbot inteligente** con derivación a WhatsApp
- **Calendario integrado** para todos los perfiles
- **KPIs ejecutivos** en tiempo real
- **Sistema de tickets** con SLA
- **Gestión documental** completa

## 🏗️ Arquitectura

- **Frontend**: Next.js 14 + Tailwind + shadcn/ui
- **Backend**: Fastify + Prisma ORM
- **Base de datos**: PostgreSQL
- **Colas**: BullMQ + Redis
- **Despliegue**: Render (Blueprint)

## 📁 Estructura del Proyecto

```
/constructora-e2e
  /apps
    /web            # Next.js 14 (frontend)
    /api            # Fastify + Prisma (backend REST)
    /worker         # BullMQ workers (alertas)
  /packages
    /ui             # componentes compartidos
    /config         # eslint, tsconfig, etc.
  prisma/           # esquema Prisma y seeds
  render.yaml       # Infra en Render
```

## 🚀 Despliegue Rápido

1. **Fork/Clone** este repositorio
2. **Conectar** a Render como Blueprint
3. **Configurar** variables de entorno
4. **¡Listo!** Se despliega automáticamente

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev:web      # Frontend
npm run dev:api      # Backend
npm run dev:worker   # Worker

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Cargar datos de prueba
```

## 📊 Módulos por Perfil

### 👤 Cliente Final
- Seguimiento de obra por etapas
- Gestión de pagos y cronograma
- Consultas y tickets
- Carrusel de fidelización

### 🏢 Administración
- Stock y proveedores
- Capital humano y legajos
- Contratos y finanzas

### 📦 Logística
- Gestión operativa de stock
- Hoja de ruta y planificación
- Alertas de materiales

### 👔 Ejecutivo
- KPIs y métricas de negocio
- Panel 360° de operaciones
- Proyecciones económicas

## 🤖 Chatbot & WhatsApp

- **RAG inteligente** con FAQs del negocio
- **Derivación automática** a WhatsApp para escalamiento
- **Integración** con Twilio WhatsApp Business API

## 📈 Roadmap

- **V1**: MVP funcional (2-4 semanas)
- **V2**: MRP y workflow avanzados
- **V3**: RAG avanzado e integraciones bancarias

## 🔒 Seguridad

- Autenticación JWT por rol
- Autorización granular por perfil
- Cumplimiento de privacidad (GDPR/LOPD)
- Logs de auditoría completos

## 📞 Soporte

Para consultas técnicas o soporte del negocio, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para optimizar la gestión constructora**
