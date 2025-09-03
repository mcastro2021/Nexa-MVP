import { Queue, Worker, QueueScheduler } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import pino from 'pino';

// Configuración de logging
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Configuración de Redis
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new Redis(redisUrl);

// Inicializar Prisma
const prisma = new PrismaClient();

// Colas de trabajo
export const alertsQueue = new Queue('alerts', { connection });
export const notificationsQueue = new Queue('notifications', { connection });
export const reportsQueue = new Queue('reports', { connection });

// Scheduler para tareas programadas
const scheduler = new QueueScheduler('alerts', { connection });

// Worker para alertas
new Worker('alerts', async (job) => {
  logger.info(`🔄 Procesando trabajo: ${job.name}`, { jobId: job.id, data: job.data });

  try {
    switch (job.name) {
      case 'stock-low':
        await processStockAlert(job.data);
        break;
      
      case 'project-delay':
        await processProjectDelay(job.data);
        break;
      
      case 'payment-reminder':
        await processPaymentReminder(job.data);
        break;
      
      case 'maintenance-check':
        await processMaintenanceCheck(job.data);
        break;
      
      default:
        logger.warn(`⚠️ Trabajo desconocido: ${job.name}`);
    }
    
    logger.info(`✅ Trabajo completado: ${job.name}`, { jobId: job.id });
  } catch (error) {
    logger.error(`❌ Error procesando trabajo ${job.name}:`, error);
    throw error;
  }
}, { 
  connection,
  concurrency: 5,
  removeOnComplete: 100,
  removeOnFail: 50
});

// Worker para notificaciones
new Worker('notifications', async (job) => {
  logger.info(`📧 Procesando notificación: ${job.name}`, { jobId: job.id });

  try {
    switch (job.name) {
      case 'email':
        await sendEmailNotification(job.data);
        break;
      
      case 'whatsapp':
        await sendWhatsAppNotification(job.data);
        break;
      
      case 'sms':
        await sendSMSNotification(job.data);
        break;
      
      default:
        logger.warn(`⚠️ Tipo de notificación desconocido: ${job.name}`);
    }
    
    logger.info(`✅ Notificación enviada: ${job.name}`, { jobId: job.id });
  } catch (error) {
    logger.error(`❌ Error enviando notificación ${job.name}:`, error);
    throw error;
  }
}, { 
  connection,
  concurrency: 3,
  removeOnComplete: 100,
  removeOnFail: 50
});

// Worker para reportes
new Worker('reports', async (job) => {
  logger.info(`📊 Generando reporte: ${job.name}`, { jobId: job.id });

  try {
    switch (job.name) {
      case 'daily-summary':
        await generateDailySummary(job.data);
        break;
      
      case 'weekly-kpis':
        await generateWeeklyKPIs(job.data);
        break;
      
      case 'monthly-financial':
        await generateMonthlyFinancial(job.data);
        break;
      
      default:
        logger.warn(`⚠️ Tipo de reporte desconocido: ${job.name}`);
    }
    
    logger.info(`✅ Reporte generado: ${job.name}`, { jobId: job.id });
  } catch (error) {
    logger.error(`❌ Error generando reporte ${job.name}:`, error);
    throw error;
  }
}, { 
  connection,
  concurrency: 2,
  removeOnComplete: 50,
  removeOnFail: 25
});

// Funciones de procesamiento de alertas
async function processStockAlert(data: any) {
  const { stockItemId } = data;
  
  try {
    const stockItem = await prisma.stockItem.findUnique({
      where: { id: stockItemId },
      include: { proveedores: true }
    });

    if (!stockItem) {
      logger.warn(`⚠️ Item de stock no encontrado: ${stockItemId}`);
      return;
    }

    if (stockItem.stock < stockItem.minimo) {
      logger.warn(`🚨 ALERTA: Stock bajo en ${stockItem.nombre} (SKU: ${stockItem.sku})`);
      logger.warn(`   Stock actual: ${stockItem.stock} ${stockItem.unidad}`);
      logger.warn(`   Stock mínimo: ${stockItem.minimo} ${stockItem.unidad}`);
      
      // Encolar notificación para administradores
      await notificationsQueue.add('email', {
        type: 'stock_alert',
        subject: `🚨 Alerta de Stock: ${stockItem.nombre}`,
        recipients: ['admin@constructora.com', 'logistica@constructora.com'],
        data: {
          item: stockItem.nombre,
          sku: stockItem.sku,
          stockActual: stockItem.stock,
          stockMinimo: stockItem.minimo,
          unidad: stockItem.unidad,
          leadTime: stockItem.leadTimeDias
        }
      });

      // Encolar notificación WhatsApp para logística
      await notificationsQueue.add('whatsapp', {
        type: 'stock_alert',
        phone: '+54 9 11 3456-7890', // Logística
        message: `🚨 ALERTA DE STOCK\n\n${stockItem.nombre}\nSKU: ${stockItem.sku}\nStock: ${stockItem.stock} ${stockItem.unidad}\nMínimo: ${stockItem.minimo} ${stockItem.unidad}\n\nRevisar urgente!`
      });
    }
  } catch (error) {
    logger.error('❌ Error procesando alerta de stock:', error);
    throw error;
  }
}

async function processProjectDelay(data: any) {
  const { proyectoId } = data;
  
  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId },
      include: {
        cliente: { include: { usuario: true } },
        hitos: { where: { estado: 'PENDIENTE' } }
      }
    });

    if (!proyecto) {
      logger.warn(`⚠️ Proyecto no encontrado: ${proyectoId}`);
      return;
    }

    const hitosAtrasados = proyecto.hitos.filter(hito => 
      new Date() > hito.fechaPlan
    );

    if (hitosAtrasados.length > 0) {
      logger.warn(`⏰ ALERTA: Proyecto con demoras - ${proyecto.nombre}`);
      
      // Notificar al cliente
      if (proyecto.cliente?.usuario?.telefono) {
        await notificationsQueue.add('whatsapp', {
          type: 'project_delay',
          phone: proyecto.cliente.usuario.telefono,
          message: `⏰ Actualización de Proyecto\n\n${proyecto.nombre}\n\nTenemos algunos ajustes en el cronograma. Te contactaremos pronto para coordinar las nuevas fechas.\n\nGracias por tu paciencia.`
        });
      }

      // Notificar al equipo interno
      await notificationsQueue.add('email', {
        type: 'project_delay',
        subject: `⏰ Alerta de Demora: ${proyecto.nombre}`,
        recipients: ['admin@constructora.com', 'logistica@constructora.com'],
        data: {
          proyecto: proyecto.nombre,
          cliente: proyecto.cliente?.usuario?.nombre,
          hitosAtrasados: hitosAtrasados.length,
          fechaEntrega: proyecto.fechaEntrega
        }
      });
    }
  } catch (error) {
    logger.error('❌ Error procesando alerta de demora:', error);
    throw error;
  }
}

async function processPaymentReminder(data: any) {
  const { pagoId } = data;
  
  try {
    const pago = await prisma.pago.findUnique({
      where: { id: pagoId },
      include: {
        cliente: { include: { usuario: true } },
        proyecto: true
      }
    });

    if (!pago) {
      logger.warn(`⚠️ Pago no encontrado: ${pagoId}`);
      return;
    }

    if (pago.estado === 'PENDIENTE' && pago.vencimiento) {
      const diasVencimiento = Math.ceil(
        (pago.vencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diasVencimiento <= 3) {
        logger.warn(`💰 ALERTA: Pago próximo a vencer - ${pago.concepto}`);
        
        // Notificar al cliente
        if (pago.cliente?.usuario?.telefono) {
          await notificationsQueue.add('whatsapp', {
            type: 'payment_reminder',
            phone: pago.cliente.usuario.telefono,
            message: `💰 Recordatorio de Pago\n\nProyecto: ${pago.proyecto.nombre}\nConcepto: ${pago.concepto}\nMonto: $${pago.monto.toLocaleString()}\nVence: ${pago.vencimiento.toLocaleDateString()}\n\nPor favor, coordina el pago para evitar demoras en la obra.`
          });
        }
      }
    }
  } catch (error) {
    logger.error('❌ Error procesando recordatorio de pago:', error);
    throw error;
  }
}

async function processMaintenanceCheck(data: any) {
  try {
    // Verificar stock bajo
    const itemsStockBajo = await prisma.stockItem.findMany({
      where: {
        activo: true,
        stock: { lt: { minimo: true } }
      }
    });

    if (itemsStockBajo.length > 0) {
      logger.info(`🔍 Encolando ${itemsStockBajo.length} alertas de stock bajo`);
      
      for (const item of itemsStockBajo) {
        await alertsQueue.add('stock-low', { stockItemId: item.id }, {
          delay: 1000, // 1 segundo de delay
          attempts: 3,
          backoff: 'exponential'
        });
      }
    }

    // Verificar proyectos con demoras
    const proyectosConDemoras = await prisma.proyecto.findMany({
      where: {
        estado: 'EN_OBRA',
        hitos: {
          some: {
            estado: 'PENDIENTE',
            fechaPlan: { lt: new Date() }
          }
        }
      }
    });

    if (proyectosConDemoras.length > 0) {
      logger.info(`🔍 Encolando ${proyectosConDemoras.length} alertas de demoras`);
      
      for (const proyecto of proyectosConDemoras) {
        await alertsQueue.add('project-delay', { proyectoId: proyecto.id }, {
          delay: 2000, // 2 segundos de delay
          attempts: 3,
          backoff: 'exponential'
        });
      }
    }

    // Verificar pagos próximos a vencer
    const pagosProximosVencer = await prisma.pago.findMany({
      where: {
        estado: 'PENDIENTE',
        vencimiento: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        }
      }
    });

    if (pagosProximosVencer.length > 0) {
      logger.info(`🔍 Encolando ${pagosProximosVencer.length} recordatorios de pago`);
      
      for (const pago of pagosProximosVencer) {
        await alertsQueue.add('payment-reminder', { pagoId: pago.id }, {
          delay: 3000, // 3 segundos de delay
          attempts: 3,
          backoff: 'exponential'
        });
      }
    }
  } catch (error) {
    logger.error('❌ Error en verificación de mantenimiento:', error);
    throw error;
  }
}

// Funciones de notificación (simuladas para MVP)
async function sendEmailNotification(data: any) {
  logger.info(`📧 Simulando envío de email: ${data.subject}`);
  // Aquí se integraría con un servicio de email real (SendGrid, Mailgun, etc.)
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function sendWhatsAppNotification(data: any) {
  logger.info(`📱 Simulando envío de WhatsApp a: ${data.phone}`);
  // Aquí se integraría con Twilio WhatsApp Business API
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function sendSMSNotification(data: any) {
  logger.info(`📱 Simulando envío de SMS a: ${data.phone}`);
  // Aquí se integraría con un servicio de SMS real
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Funciones de reportes (simuladas para MVP)
async function generateDailySummary(data: any) {
  logger.info('📊 Generando resumen diario...');
  // Aquí se generarían reportes diarios de KPIs
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function generateWeeklyKPIs(data: any) {
  logger.info('📊 Generando KPIs semanales...');
  // Aquí se generarían reportes semanales de métricas
  await new Promise(resolve => setTimeout(resolve, 3000));
}

async function generateMonthlyFinancial(data: any) {
  logger.info('📊 Generando reporte financiero mensual...');
  // Aquí se generarían reportes financieros mensuales
  await new Promise(resolve => setTimeout(resolve, 5000));
}

// Programar tareas recurrentes
async function scheduleRecurringTasks() {
  // Verificación de mantenimiento cada hora
  await alertsQueue.add('maintenance-check', {}, {
    repeat: {
      pattern: '0 * * * *' // Cada hora
    }
  });

  // Reporte diario a las 8:00 AM
  await reportsQueue.add('daily-summary', {}, {
    repeat: {
      pattern: '0 8 * * *' // 8:00 AM todos los días
    }
  });

  // KPIs semanales los lunes a las 9:00 AM
  await reportsQueue.add('weekly-kpis', {}, {
    repeat: {
      pattern: '0 9 * * 1' // 9:00 AM los lunes
    }
  });

  // Reporte financiero mensual el primer día del mes a las 10:00 AM
  await reportsQueue.add('monthly-financial', {}, {
    repeat: {
      pattern: '0 10 1 * *' // 10:00 AM el primer día del mes
    }
  });

  logger.info('📅 Tareas recurrentes programadas');
}

// Inicialización
async function start() {
  try {
    logger.info('🚀 Iniciando worker de constructora...');
    
    // Verificar conexión a Redis
    await connection.ping();
    logger.info('✅ Conexión a Redis establecida');
    
    // Verificar conexión a base de datos
    await prisma.$connect();
    logger.info('✅ Conexión a base de datos establecida');
    
    // Programar tareas recurrentes
    await scheduleRecurringTasks();
    
    // Ejecutar verificación inicial
    await alertsQueue.add('maintenance-check', {});
    
    logger.info('🎯 Worker iniciado y listo para procesar trabajos');
    
  } catch (error) {
    logger.error('❌ Error iniciando worker:', error);
    process.exit(1);
  }
}

// Manejo de señales para shutdown graceful
process.on('SIGTERM', async () => {
  logger.info('🛑 Recibida señal SIGTERM, cerrando worker...');
  
  try {
    await connection.quit();
    await prisma.$disconnect();
    logger.info('✅ Worker cerrado correctamente');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error cerrando worker:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('🛑 Recibida señal SIGINT, cerrando worker...');
  
  try {
    await connection.quit();
    await prisma.$disconnect();
    logger.info('✅ Worker cerrado correctamente');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error cerrando worker:', error);
    process.exit(1);
  }
});

// Iniciar worker
start().catch((error) => {
  logger.error('❌ Error fatal en worker:', error);
  process.exit(1);
});
