'use client';

import Link from 'next/link';
import { Building2, Users, Truck, BarChart3, MessageCircle, Calendar, FileText, Shield } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      href: '/cliente',
      title: 'Cliente Final',
      desc: 'Seguimiento de obra, pagos, consultas y fidelización.',
      icon: Building2,
      color: 'bg-primary-500',
      features: ['Mi Proyecto', 'Pagos', 'Consultas', 'Fidelización']
    },
    {
      href: '/admin',
      title: 'Administración',
      desc: 'Stock, proveedores, RRHH y legajos de clientes.',
      icon: Users,
      color: 'bg-success-500',
      features: ['Stock', 'Proveedores', 'RRHH', 'Legajos']
    },
    {
      href: '/logistica',
      title: 'Logística',
      desc: 'Hoja de ruta, materiales y alertas de stock.',
      icon: Truck,
      color: 'bg-warning-500',
      features: ['Hoja de Ruta', 'Materiales', 'Alertas', 'Operaciones']
    },
    {
      href: '/ejecutivo',
      title: 'Ejecutivo',
      desc: 'KPIs: obras, finanzas, NPS y personal.',
      icon: BarChart3,
      color: 'bg-danger-500',
      features: ['KPIs', 'Finanzas', 'NPS', 'Personal']
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: 'Chatbot Inteligente',
      description: 'Responde consultas y deriva a WhatsApp para escalamiento'
    },
    {
      icon: Calendar,
      title: 'Calendario Integrado',
      description: 'Gestión de eventos y cronogramas para todos los perfiles'
    },
    {
      icon: FileText,
      title: 'Gestión Documental',
      description: 'Contratos, planos, facturas y recibos centralizados'
    },
    {
      icon: Shield,
      title: 'Seguridad Multi-nivel',
      description: 'Autenticación JWT y autorización granular por perfil'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Constructora 360°
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Plataforma E2E para gestión completa de proyectos wood/steel frame
          </p>
          <p className="text-lg text-primary-200 mb-12 max-w-2xl mx-auto">
            Cubre punta a punta el negocio: desde clientes hasta ejecutivos, 
            con chatbot inteligente, calendario integrado y KPIs en tiempo real.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cliente" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Acceder como Cliente
            </Link>
            <Link href="/admin" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Perfiles Section */}
      <section className="py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Acceso Multi-Perfil
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada perfil tiene acceso a módulos específicos diseñados para optimizar 
            su flujo de trabajo y responsabilidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group">
              <div className="card-hover h-full transform group-hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`${card.color} p-3 rounded-xl text-white`}>
                    <card.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{card.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.features.map((feature) => (
                        <span key={feature} className="badge badge-info">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Tecnología de vanguardia para optimizar la gestión constructora
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-4 inline-block">
                  <feature.icon className="w-12 h-12 text-primary-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para optimizar tu constructora?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Nuestra plataforma está diseñada para escalar con tu negocio, 
            desde startups hasta empresas consolidadas.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cliente" className="btn-primary text-lg px-8 py-3">
              Comenzar Ahora
            </Link>
            <Link href="/admin" className="btn-secondary text-lg px-8 py-3">
              Solicitar Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Constructora 360°</h3>
          <p className="text-gray-400 mb-6">
            Plataforma E2E para optimizar la gestión constructora
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Nexa-MVP</span>
            <span>•</span>
            <span>Desarrollado con ❤️</span>
            <span>•</span>
            <span>Render Ready</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
