import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializar Prisma
const prisma = new PrismaClient();

// Configurar Fastify
const app = Fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Registrar plugins
app.register(cors, { 
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://constructora-web.onrender.com']
    : true 
});

app.register(jwt, { 
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production' 
});

app.register(multipart);
app.register(staticPlugin, {
  root: join(__dirname, '../uploads'),
  prefix: '/uploads/'
});

// Middleware de autenticación
async function auth(request: any, reply: any) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ error: 'Token requerido' });
    }
    const decoded = await request.jwtVerify(token);
    request.user = decoded;
  } catch (err) {
    return reply.code(401).send({ error: 'Token inválido' });
  }
}

// Middleware de autorización por rol
function requireRole(roles: string[]) {
  return async (request: any, reply: any) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.code(403).send({ error: 'Acceso denegado' });
    }
  };
}

// Health check
app.get('/healthz', async () => ({ 
  ok: true, 
  timestamp: new Date().toISOString(),
  service: 'constructora-api'
}));

// Autenticación
app.post('/auth/login', async (request, reply) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  try {
    const { email, password } = loginSchema.parse(request.body);
    
    const usuario = await prisma.usuario.findUnique({ 
      where: { email, activo: true },
      include: { cliente: true, empleado: true }
    });

    if (!usuario) {
      return reply.code(401).send({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, usuario.hash);
    if (!isValidPassword) {
      return reply.code(401).send({ error: 'Credenciales inválidas' });
    }

    const token = app.jwt.sign({ 
      sub: usuario.id, 
      role: usuario.role,
      email: usuario.email 
    });

    return { 
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        role: usuario.role,
        cliente: usuario.cliente,
        empleado: usuario.empleado
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ error: 'Datos inválidos', details: error.errors });
    }
    app.log.error(error);
    return reply.code(500).send({ error: 'Error interno del servidor' });
  }
});

// Perfil del usuario
app.get('/me', { preHandler: [auth] }, async (request: any) => {
  const userId = request.user.sub;
  return prisma.usuario.findUnique({ 
    where: { id: userId }, 
    include: { cliente: true, empleado: true } 
  });
});

// KPIs Ejecutivo
app.get('/kpi/obras', { preHandler: [auth, requireRole(['ADMIN', 'EJECUTIVO'])] }, async () => {
  try {
    const obras = await prisma.proyecto.findMany({
      include: {
        hitos: true,
        costos: true
      }
    });

    const total = obras.length;
    const enObra = obras.filter(o => o.estado === 'EN_OBRA').length;
    const completadas = obras.filter(o => o.estado === 'COMPLETADO').length;
    
    const duraciones = obras
      .filter(o => o.estado === 'COMPLETADO')
      .map(o => Math.ceil((o.fechaEntrega.getTime() - o.fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));
    
    const promedioDias = duraciones.length > 0 
      ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length)
      : 0;

    const totalPresupuesto = obras.reduce((sum, o) => sum + (o.presupuesto || 0), 0);
    const totalCostos = obras.reduce((sum, o) => 
      sum + o.costos.reduce((cSum, c) => cSum + (c.montoReal || c.montoPlan), 0), 0
    );

    return {
      total,
      enObra,
      completadas,
      promedioDias,
      totalPresupuesto,
      totalCostos,
      margen: totalPresupuesto - totalCostos
    };
  } catch (error) {
    app.log.error(error);
    throw error;
  }
});

// KPIs Finanzas
app.get('/kpi/finanzas', { preHandler: [auth, requireRole(['ADMIN', 'EJECUTIVO'])] }, async () => {
  try {
    const [ingresos, egresos] = await Promise.all([
      prisma.pago.aggregate({
        where: { estado: 'PAGADO' },
        _sum: { monto: true }
      }),
      prisma.factura.aggregate({
        where: { estado: 'PAGADA' },
        _sum: { total: true }
      })
    ]);

    const totalIngresos = ingresos._sum.monto || 0;
    const totalEgresos = egresos._sum.total || 0;

    return {
      ingresos: totalIngresos,
      egresos: totalEgresos,
      balance: totalIngresos - totalEgresos,
      fecha: new Date().toISOString()
    };
  } catch (error) {
    app.log.error(error);
    throw error;
  }
});

// KPIs Personal
app.get('/kpi/personal', { preHandler: [auth, requireRole(['ADMIN', 'EJECUTIVO'])] }, async () => {
  try {
    const [totalEmpleados, empleadosActivos, ausenciasHoy] = await Promise.all([
      prisma.empleado.count(),
      prisma.empleado.count({ where: { activo: true } }),
      prisma.ausencia.count({
        where: {
          fecha: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      })
    ]);

    return {
      total: totalEmpleados,
      activos: empleadosActivos,
      ausenciasHoy,
      tasaAsistencia: totalEmpleados > 0 ? ((totalEmpleados - ausenciasHoy) / totalEmpleados * 100).toFixed(1) : 0
    };
  } catch (error) {
    app.log.error(error);
    throw error;
  }
});

// Proyectos del cliente
app.get('/clientes/:id/proyectos', { preHandler: [auth] }, async (request: any, reply: any) => {
  try {
    const { id } = request.params;
    const userId = request.user.sub;

    // Verificar que el usuario puede ver estos proyectos
    if (request.user.role === 'CLIENTE' && userId !== id) {
      return reply.code(403).send({ error: 'Acceso denegado' });
    }

    const proyectos = await prisma.proyecto.findMany({
      where: { clienteId: id },
      include: {
        hitos: {
          orderBy: { fechaPlan: 'asc' }
        },
        costos: true
      }
    });

    return proyectos;
  } catch (error) {
    app.log.error(error);
    throw error;
  }
});

// Hitos de un proyecto
app.get('/proyectos/:id/hitos', { preHandler: [auth] }, async (request: any) => {
  const { id } = request.params;
  
  return prisma.hito.findMany({
    where: { proyectoId: id },
    orderBy: { fechaPlan: 'asc' }
  });
});

// Actualizar estado de hito
app.patch('/hitos/:id', { preHandler: [auth, requireRole(['ADMIN', 'LOGISTICA'])] }, async (request: any) => {
  const { id } = request.params;
  const { estado, fechaReal, porcentaje, notas } = request.body as any;

  return prisma.hito.update({
    where: { id },
    data: { estado, fechaReal, porcentaje, notas }
  });
});

// Stock con filtros
app.get('/stock', { preHandler: [auth, requireRole(['ADMIN', 'LOGISTICA'])] }, async (request: any) => {
  const { categoria, stockBajo } = request.query as any;
  
  const where: any = { activo: true };
  if (categoria) where.categoria = categoria;
  if (stockBajo === 'true') where.stock = { lt: { stock: { minimo: true } } };

  const items = await prisma.stockItem.findMany({
    where,
    orderBy: { nombre: 'asc' }
  });

  const kpis = {
    totalItems: items.length,
    stockBajo: items.filter(i => i.stock < i.minimo).length,
    valorTotal: items.reduce((sum, i) => sum + (i.stock * i.costoStd), 0)
  };

  return { items, kpis };
});

// Alertas de stock
app.post('/alerts/stock', { preHandler: [auth, requireRole(['ADMIN', 'LOGISTICA'])] }, async (request: any) => {
  const items = await prisma.stockItem.findMany({
    where: {
      activo: true,
      stock: { lt: { minimo: true } }
    }
  });

  // Aquí se encolarían las alertas en BullMQ
  app.log.info(`Alertas de stock: ${items.length} items con stock bajo`);

  return { 
    alertas: items.length,
    items: items.map(i => ({ 
      id: i.id, 
      nombre: i.nombre, 
      stock: i.stock, 
      minimo: i.minimo 
    }))
  };
});

// FAQs para chatbot
app.get('/faqs', async (request: any) => {
  const { etapa, categoria } = request.query as any;
  
  const where: any = { activa: true };
  if (etapa) where.etapa = etapa;
  if (categoria) where.categoria = categoria;

  return prisma.fAQ.findMany({
    where,
    orderBy: { orden: 'asc' }
  });
});

// Chatbot query
app.post('/chatbot/query', async (request: any) => {
  const { query, clienteId } = request.body as any;
  
  try {
    // Búsqueda simple en FAQs (MVP)
    const faqs = await prisma.fAQ.findMany({
      where: { 
        activa: true,
        OR: [
          { pregunta: { contains: query, mode: 'insensitive' } },
          { respuesta: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 3
    });

    let respuesta = 'No encontré información específica sobre tu consulta.';
    let intencion = 'consulta_general';

    if (faqs.length > 0) {
      respuesta = faqs[0].respuesta;
      intencion = 'faq_encontrada';
    }

    // Si hay clienteId, buscar información específica
    if (clienteId) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
        include: {
          proyectos: {
            include: { hitos: true }
          },
          pagos: {
            where: { estado: 'PENDIENTE' },
            orderBy: { vencimiento: 'asc' }
          }
        }
      });

      if (cliente) {
        const proximoPago = cliente.pagos[0];
        const proximoHito = cliente.proyectos
          .flatMap(p => p.hitos)
          .filter(h => h.estado === 'PENDIENTE')
          .sort((a, b) => a.fechaPlan.getTime() - b.fechaPlan.getTime())[0];

        if (proximoPago) {
          respuesta += `\n\nPróximo pago: $${proximoPago.monto} vence el ${proximoPago.vencimiento?.toLocaleDateString()}`;
        }

        if (proximoHito) {
          respuesta += `\n\nPróximo hito: ${proximoHito.nombre} planificado para el ${proximoHito.fechaPlan.toLocaleDateString()}`;
        }
      }
    }

    return {
      respuesta,
      intencion,
      faqs: faqs.slice(0, 2),
      derivarWhatsApp: intencion === 'escalamiento'
    };
  } catch (error) {
    app.log.error(error);
    return { 
      respuesta: 'Disculpa, tuve un problema procesando tu consulta. Por favor, contacta al equipo de soporte.',
      intencion: 'error'
    };
  }
});

// Calendario
app.get('/calendar/events', { preHandler: [auth] }, async (request: any) => {
  const userId = request.user.sub;
  const { desde, hasta } = request.query as any;

  const where: any = { usuarioId: userId };
  if (desde && hasta) {
    where.OR = [
      { fechaInicio: { gte: new Date(desde), lte: new Date(hasta) } },
      { fechaFin: { gte: new Date(desde), lte: new Date(hasta) } }
    ];
  }

  return prisma.eventoCalendario.findMany({
    where,
    orderBy: { fechaInicio: 'asc' }
  });
});

app.post('/calendar/events', { preHandler: [auth] }, async (request: any) => {
  const userId = request.user.sub;
  const { titulo, descripcion, fechaInicio, fechaFin, tipo, color } = request.body as any;

  return prisma.eventoCalendario.create({
    data: {
      usuarioId: userId,
      titulo,
      descripcion,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      tipo,
      color
    }
  });
});

// Manejo de errores global
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  if (error instanceof z.ZodError) {
    return reply.code(400).send({ 
      error: 'Datos inválidos', 
      details: error.errors 
    });
  }

  reply.code(500).send({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({ 
      port: Number(process.env.PORT) || 4000, 
      host: '0.0.0.0' 
    });
    
    app.log.info(`🚀 Servidor API iniciado en puerto ${process.env.PORT || 4000}`);
    
    // Verificar conexión a base de datos
    await prisma.$connect();
    app.log.info('✅ Conexión a base de datos establecida');
    
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  app.log.info('🛑 Cerrando servidor...');
  await prisma.$disconnect();
  await app.close();
  process.exit(0);
});
