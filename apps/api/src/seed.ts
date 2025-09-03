import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const faqsPre = [
  {
    etapa: 'pre',
    categoria: 'GENERAL',
    pregunta: '¿Cuántos años de experiencia tienen en steel/wood frame?',
    respuesta: 'Tenemos más de 15 años de experiencia en construcción con steel frame y wood frame, con más de 200 proyectos entregados exitosamente en toda la región.',
    orden: 1
  },
  {
    etapa: 'pre',
    categoria: 'GENERAL',
    pregunta: '¿Tienen catálogo de proyectos anteriores/casas modelo?',
    respuesta: 'Sí, contamos con un amplio catálogo de proyectos realizados que incluye casas de 80m² hasta 300m². Puedes verlos en nuestra galería o solicitar una visita a alguna obra en curso.',
    orden: 2
  },
  {
    etapa: 'pre',
    categoria: 'MATERIALES',
    pregunta: '¿Qué materiales usan y qué certificaciones tienen?',
    respuesta: 'Utilizamos estructuras galvanizadas certificadas ASTM A653 y madera tratada IRAM 9662. Nuestras aislaciones térmicas cumplen con normas IRAM 11605 y contamos con certificación ISO 9001:2015.',
    orden: 3
  },
  {
    etapa: 'pre',
    categoria: 'GARANTIA',
    pregunta: '¿Qué garantía ofrecen en la construcción?',
    respuesta: 'Ofrecemos garantía de 10 años en la estructura principal, 5 años en instalaciones y 2 años en terminaciones. Todos nuestros materiales incluyen garantía de fábrica.',
    orden: 4
  },
  {
    etapa: 'pre',
    categoria: 'PRECIOS',
    pregunta: '¿El precio incluye todo? ¿Hay costos extra?',
    respuesta: 'Nuestro precio incluye: estructura, aislación, instalaciones básicas, terminaciones estándar y mano de obra. Los costos extra pueden ser: personalizaciones especiales, ampliaciones de diseño o materiales premium.',
    orden: 5
  },
  {
    etapa: 'pre',
    categoria: 'TIEMPOS',
    pregunta: '¿Cuánto tiempo tardan en construir una casa de 120m²?',
    respuesta: 'Una casa de 120m² en steel frame se construye en aproximadamente 3-4 meses desde la aprobación de planos hasta la entrega llave en mano. Los tiempos pueden variar según la complejidad del diseño.',
    orden: 6
  },
  {
    etapa: 'pre',
    categoria: 'PROCESO',
    pregunta: '¿Cómo es el proceso de diseño y construcción?',
    respuesta: 'El proceso incluye: 1) Diseño personalizado según tus necesidades, 2) Aprobación de planos municipales, 3) Construcción por etapas con reportes semanales, 4) Entrega llave en mano con certificado de habitabilidad.',
    orden: 7
  },
  {
    etapa: 'pre',
    categoria: 'SERVICIOS',
    pregunta: '¿Ofrecen muebles a medida y financiación?',
    respuesta: 'Sí, ofrecemos muebles a medida para cocina, dormitorios y baños. También tenemos convenios con bancos para financiación a tasas preferenciales, con plazos de hasta 10 años.',
    orden: 8
  }
];

const faqsPost = [
  {
    etapa: 'post',
    categoria: 'OBRAS',
    pregunta: '¿Cuál es el cronograma de la obra?',
    respuesta: 'El cronograma detallado está disponible en tu portal personal. Incluye fechas de cada hito: cimientos, estructura, aislación, instalaciones, terminaciones y entrega final.',
    orden: 1
  },
  {
    etapa: 'post',
    categoria: 'OBRAS',
    pregunta: '¿Cómo se manejan los imprevistos y demoras?',
    respuesta: 'Ante cualquier imprevisto, nuestro equipo te notifica inmediatamente por WhatsApp y actualiza el cronograma. Las demoras se compensan ajustando la programación para mantener la fecha de entrega comprometida.',
    orden: 2
  },
  {
    etapa: 'post',
    categoria: 'CONTACTO',
    pregunta: '¿Quién es mi encargado de obra y cómo lo contacto?',
    respuesta: 'Tu encargado de obra es asignado al inicio del proyecto y te enviamos sus datos de contacto. También puedes comunicarte a través del portal o crear un ticket de soporte.',
    orden: 3
  },
  {
    etapa: 'post',
    categoria: 'MATERIALES',
    pregunta: '¿Puedo elegir terminaciones diferentes a las del contrato?',
    respuesta: 'Sí, puedes personalizar terminaciones hasta 2 semanas antes de cada etapa. Los cambios se cotizan por separado y pueden afectar los plazos de entrega.',
    orden: 4
  },
  {
    etapa: 'post',
    categoria: 'PAGOS',
    pregunta: '¿Cuándo es mi próximo pago y por qué monto?',
    respuesta: 'Tu próximo pago está programado según el cronograma financiero. Puedes ver el detalle completo en tu portal: Mi Proyecto → Pagos, incluyendo monto, concepto y fecha de vencimiento.',
    orden: 5
  },
  {
    etapa: 'post',
    categoria: 'MUEBLES',
    pregunta: '¿Cuándo debo decidir sobre muebles a medida?',
    respuesta: 'Para muebles a medida, debes confirmar el diseño 1 mes antes de la etapa de terminaciones. Nuestro equipo de diseño te contactará para coordinar la visita y presentar opciones.',
    orden: 6
  },
  {
    etapa: 'post',
    categoria: 'FINANCIACION',
    pregunta: '¿Cómo va mi solicitud de préstamo bancario?',
    respuesta: 'El estado de tu solicitud de préstamo se actualiza en tiempo real en tu portal. Nuestro asesor financiero te contactará cuando haya novedades o se requiera documentación adicional.',
    orden: 7
  }
];

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios demo con diferentes roles
  const passwordHash = await bcrypt.hash('password123', 10);

  const usuarios = [
    {
      email: 'cliente@demo.com',
      hash: passwordHash,
      nombre: 'Juan Pérez',
      telefono: '+54 9 11 1234-5678',
      role: 'CLIENTE' as const,
      cliente: {
        create: {
          direccion: 'Av. Libertador 1234, CABA',
          dni: '12345678'
        }
      }
    },
    {
      email: 'admin@demo.com',
      hash: passwordHash,
      nombre: 'María González',
      telefono: '+54 9 11 2345-6789',
      role: 'ADMIN' as const,
      empleado: {
        create: {
          area: 'Administración',
          puesto: 'Gerente Administrativa',
          antiguedad: 24,
          salario: 150000
        }
      }
    },
    {
      email: 'logistica@demo.com',
      hash: passwordHash,
      nombre: 'Carlos Rodríguez',
      telefono: '+54 9 11 3456-7890',
      role: 'LOGISTICA' as const,
      empleado: {
        create: {
          area: 'Logística',
          puesto: 'Jefe de Logística',
          antiguedad: 18,
          salario: 120000
        }
      }
    },
    {
      email: 'ejecutivo@demo.com',
      hash: passwordHash,
      nombre: 'Ana Martínez',
      telefono: '+54 9 11 4567-8901',
      role: 'EJECUTIVO' as const,
      empleado: {
        create: {
          area: 'Dirección',
          puesto: 'Directora Ejecutiva',
          antiguedad: 36,
          salario: 200000
        }
      }
    }
  ];

  console.log('👥 Creando usuarios demo...');
  for (const usuarioData of usuarios) {
    const { cliente, empleado, ...usuario } = usuarioData;
    await prisma.usuario.create({
      data: usuario,
      include: { cliente: true, empleado: true }
    });
  }

  // Crear proveedores demo
  console.log('🏭 Creando proveedores demo...');
  const proveedores = [
    {
      nombre: 'Aceros del Sur S.A.',
      email: 'ventas@acerosdelsur.com',
      telefono: '+54 11 4567-8901',
      direccion: 'Ruta 2 Km 45, La Plata',
      cuit: '30-12345678-9'
    },
    {
      nombre: 'Maderas Premium Ltda.',
      email: 'info@maderaspremium.com',
      telefono: '+54 11 5678-9012',
      direccion: 'Av. Industrial 789, San Martín',
      cuit: '30-23456789-0'
    },
    {
      nombre: 'Aislaciones Térmicas S.R.L.',
      email: 'contacto@aislaciones.com',
      telefono: '+54 11 6789-0123',
      direccion: 'Zona Industrial Norte 456',
      cuit: '30-34567890-1'
    }
  ];

  for (const proveedor of proveedores) {
    await prisma.proveedor.create({ data: proveedor });
  }

  // Crear items de stock demo
  console.log('📦 Creando items de stock demo...');
  const stockItems = [
    {
      sku: 'SF-001',
      nombre: 'Perfil U 100x50x2mm',
      descripcion: 'Perfil estructural galvanizado U 100x50x2mm',
      unidad: 'm',
      stock: 500,
      minimo: 100,
      costoStd: 45.50,
      leadTimeDias: 7,
      categoria: 'Estructura'
    },
    {
      sku: 'SF-002',
      nombre: 'Perfil C 100x50x2mm',
      descripcion: 'Perfil estructural galvanizado C 100x50x2mm',
      unidad: 'm',
      stock: 450,
      minimo: 80,
      costoStd: 42.30,
      leadTimeDias: 7,
      categoria: 'Estructura'
    },
    {
      sku: 'WF-001',
      nombre: 'Viga 2x6 pulgadas',
      descripcion: 'Viga de madera tratada 2x6 pulgadas',
      unidad: 'm',
      stock: 200,
      minimo: 50,
      costoStd: 28.75,
      leadTimeDias: 5,
      categoria: 'Estructura'
    },
    {
      sku: 'AIS-001',
      nombre: 'Lana de vidrio 100mm',
      descripcion: 'Aislación térmica lana de vidrio 100mm',
      unidad: 'm²',
      stock: 150,
      minimo: 30,
      costoStd: 15.20,
      leadTimeDias: 3,
      categoria: 'Aislación'
    },
    {
      sku: 'PLY-001',
      nombre: 'Placa OSB 12mm',
      descripcion: 'Placa OSB estructural 12mm',
      unidad: 'm²',
      stock: 80,
      minimo: 20,
      costoStd: 22.40,
      leadTimeDias: 4,
      categoria: 'Revestimiento'
    }
  ];

  for (const item of stockItems) {
    await prisma.stockItem.create({ data: item });
  }

  // Crear proyecto demo para el cliente
  console.log('🏗️ Creando proyecto demo...');
  const cliente = await prisma.usuario.findUnique({
    where: { email: 'cliente@demo.com' },
    include: { cliente: true }
  });

  if (cliente?.cliente) {
    const proyecto = await prisma.proyecto.create({
      data: {
        clienteId: cliente.cliente.id,
        nombre: 'Casa Familiar Steel Frame',
        tipo: 'STEEL_FRAME',
        m2: 120,
        direccion: 'Calle del Bosque 567, Nordelta',
        fechaInicio: new Date('2024-01-15'),
        fechaEntrega: new Date('2024-05-15'),
        estado: 'EN_OBRA',
        presupuesto: 45000000
      }
    });

    // Crear hitos del proyecto
    const hitos = [
      {
        proyectoId: proyecto.id,
        nombre: 'Cimientos y Base',
        descripcion: 'Excavación, hormigón y base de la estructura',
        estado: 'COMPLETADO',
        fechaPlan: new Date('2024-01-20'),
        fechaReal: new Date('2024-01-18'),
        porcentaje: 100
      },
      {
        proyectoId: proyecto.id,
        nombre: 'Estructura Principal',
        descripcion: 'Montaje de perfiles galvanizados',
        estado: 'EN_PROGRESO',
        fechaPlan: new Date('2024-02-15'),
        porcentaje: 75
      },
      {
        proyectoId: proyecto.id,
        nombre: 'Aislación y Revestimiento',
        descripcion: 'Instalación de aislación térmica y placas',
        estado: 'PENDIENTE',
        fechaPlan: new Date('2024-03-20'),
        porcentaje: 0
      },
      {
        proyectoId: proyecto.id,
        nombre: 'Instalaciones',
        descripcion: 'Electricidad, agua y gas',
        estado: 'PENDIENTE',
        fechaPlan: new Date('2024-04-10'),
        porcentaje: 0
      },
      {
        proyectoId: proyecto.id,
        nombre: 'Terminaciones',
        descripcion: 'Pintura, pisos y detalles finales',
        estado: 'PENDIENTE',
        fechaPlan: new Date('2024-05-05'),
        porcentaje: 0
      }
    ];

    for (const hito of hitos) {
      await prisma.hito.create({ data: hito });
    }

    // Crear pagos del proyecto
    const pagos = [
      {
        clienteId: cliente.cliente.id,
        proyectoId: proyecto.id,
        monto: 9000000,
        concepto: 'Adelanto inicial (20%)',
        tipo: 'ADELANTO',
        estado: 'PAGADO',
        fecha: new Date('2024-01-10')
      },
      {
        clienteId: cliente.cliente.id,
        proyectoId: proyecto.id,
        monto: 13500000,
        concepto: 'Segunda cuota (30%)',
        tipo: 'CUOTA',
        estado: 'PAGADO',
        fecha: new Date('2024-02-01')
      },
      {
        clienteId: cliente.cliente.id,
        proyectoId: proyecto.id,
        monto: 13500000,
        concepto: 'Tercera cuota (30%)',
        tipo: 'CUOTA',
        estado: 'PENDIENTE',
        vencimiento: new Date('2024-03-15')
      },
      {
        clienteId: cliente.cliente.id,
        proyectoId: proyecto.id,
        monto: 9000000,
        concepto: 'Cuota final (20%)',
        tipo: 'FINAL',
        estado: 'PENDIENTE',
        vencimiento: new Date('2024-05-01')
      }
    ];

    for (const pago of pagos) {
      await prisma.pago.create({ data: pago });
    }
  }

  // Crear FAQs
  console.log('❓ Creando FAQs...');
  await prisma.fAQ.createMany({ data: [...faqsPre, ...faqsPost] });

  // Crear eventos de calendario demo
  console.log('📅 Creando eventos de calendario demo...');
  const admin = await prisma.usuario.findUnique({
    where: { email: 'admin@demo.com' }
  });

  if (admin) {
    const eventos = [
      {
        usuarioId: admin.id,
        titulo: 'Auditoría de Stock',
        descripcion: 'Revisión mensual de inventario y alertas',
        fechaInicio: new Date('2024-01-25T09:00:00'),
        fechaFin: new Date('2024-01-25T12:00:00'),
        tipo: 'AUDITORIA',
        color: '#3B82F6'
      },
      {
        usuarioId: admin.id,
        titulo: 'Reunión con Proveedores',
        descripcion: 'Negociación de precios y plazos',
        fechaInicio: new Date('2024-01-26T14:00:00'),
        fechaFin: new Date('2024-01-26T16:00:00'),
        tipo: 'REUNION',
        color: '#10B981'
      }
    ];

    for (const evento of eventos) {
      await prisma.eventoCalendario.create({ data: evento });
    }
  }

  console.log('✅ Seed completado exitosamente!');
  console.log('\n🔑 Credenciales de acceso:');
  console.log('Cliente: cliente@demo.com / password123');
  console.log('Admin: admin@demo.com / password123');
  console.log('Logística: logistica@demo.com / password123');
  console.log('Ejecutivo: ejecutivo@demo.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
