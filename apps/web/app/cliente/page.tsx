'use client';

import { useEffect, useState } from 'react';
import { Building2, DollarSign, Calendar, MessageCircle, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Proyecto {
  id: string;
  nombre: string;
  tipo: string;
  m2: number;
  direccion: string;
  estado: string;
  fechaInicio: string;
  fechaEntrega: string;
  hitos: Hito[];
}

interface Hito {
  id: string;
  nombre: string;
  estado: string;
  fechaPlan: string;
  fechaReal?: string;
  porcentaje: number;
  descripcion?: string;
}

interface Pago {
  id: string;
  monto: number;
  concepto: string;
  tipo: string;
  estado: string;
  fecha: string;
  vencimiento?: string;
}

export default function Cliente() {
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular datos del cliente (en producción esto vendría de la API)
        const mockProyecto: Proyecto = {
          id: '1',
          nombre: 'Casa Familiar Steel Frame',
          tipo: 'STEEL_FRAME',
          m2: 120,
          direccion: 'Calle del Bosque 567, Nordelta',
          estado: 'EN_OBRA',
          fechaInicio: '2024-01-15',
          fechaEntrega: '2024-05-15',
          hitos: [
            {
              id: '1',
              nombre: 'Cimientos y Base',
              estado: 'COMPLETADO',
              fechaPlan: '2024-01-20',
              fechaReal: '2024-01-18',
              porcentaje: 100,
              descripcion: 'Excavación, hormigón y base de la estructura'
            },
            {
              id: '2',
              nombre: 'Estructura Principal',
              estado: 'EN_PROGRESO',
              fechaPlan: '2024-02-15',
              porcentaje: 75,
              descripcion: 'Montaje de perfiles galvanizados'
            },
            {
              id: '3',
              nombre: 'Aislación y Revestimiento',
              estado: 'PENDIENTE',
              fechaPlan: '2024-03-20',
              porcentaje: 0,
              descripcion: 'Instalación de aislación térmica y placas'
            },
            {
              id: '4',
              nombre: 'Instalaciones',
              estado: 'PENDIENTE',
              fechaPlan: '2024-04-10',
              porcentaje: 0,
              descripcion: 'Electricidad, agua y gas'
            },
            {
              id: '5',
              nombre: 'Terminaciones',
              estado: 'PENDIENTE',
              fechaPlan: '2024-05-05',
              porcentaje: 0,
              descripcion: 'Pintura, pisos y detalles finales'
            }
          ]
        };

        const mockPagos: Pago[] = [
          {
            id: '1',
            monto: 9000000,
            concepto: 'Adelanto inicial (20%)',
            tipo: 'ADELANTO',
            estado: 'PAGADO',
            fecha: '2024-01-10'
          },
          {
            id: '2',
            monto: 13500000,
            concepto: 'Segunda cuota (30%)',
            tipo: 'CUOTA',
            estado: 'PAGADO',
            fecha: '2024-02-01'
          },
          {
            id: '3',
            monto: 13500000,
            concepto: 'Tercera cuota (30%)',
            tipo: 'CUOTA',
            estado: 'PENDIENTE',
            vencimiento: '2024-03-15'
          },
          {
            id: '4',
            monto: 9000000,
            concepto: 'Cuota final (20%)',
            tipo: 'FINAL',
            estado: 'PENDIENTE',
            vencimiento: '2024-05-01'
          }
        ];

        setProyecto(mockProyecto);
        setPagos(mockPagos);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'bg-success-100 text-success-800';
      case 'EN_PROGRESO':
        return 'bg-primary-100 text-primary-800';
      case 'PENDIENTE':
        return 'bg-warning-100 text-warning-800';
      case 'ATRASADO':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'EN_PROGRESO':
        return <Clock className="w-4 h-4" />;
      case 'PENDIENTE':
        return <Clock className="w-4 h-4" />;
      case 'ATRASADO':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Proyecto</h1>
        <p className="text-gray-600">Seguimiento completo de tu obra en construcción</p>
      </div>

      {/* Resumen del Proyecto */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{proyecto?.nombre}</h2>
            <p className="text-gray-600">{proyecto?.direccion}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{proyecto?.m2}m²</div>
            <div className="text-sm text-gray-500">{proyecto?.tipo}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {formatDate(proyecto?.fechaInicio || '')}
            </div>
            <div className="text-sm text-gray-600">Fecha de Inicio</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-success-600 mb-2">
              {formatDate(proyecto?.fechaEntrega || '')}
            </div>
            <div className="text-sm text-gray-600">Fecha de Entrega</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-warning-600 mb-2">
              {proyecto?.estado}
            </div>
            <div className="text-sm text-gray-600">Estado Actual</div>
          </div>
        </div>
      </div>

      {/* Avance y Cronograma */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          Avance y Cronograma
        </h3>
        
        <div className="space-y-4">
          {proyecto?.hitos.map((hito) => (
            <div key={hito.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getEstadoColor(hito.estado)}`}>
                    {getEstadoIcon(hito.estado)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{hito.nombre}</h4>
                    {hito.descripcion && (
                      <p className="text-sm text-gray-600">{hito.descripcion}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">{hito.porcentaje}%</div>
                  <div className="text-sm text-gray-500">
                    {hito.fechaReal ? formatDate(hito.fechaReal) : formatDate(hito.fechaPlan)}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${hito.porcentaje}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagos */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-success-600" />
          Estado de Pagos
        </h3>
        
        <div className="space-y-4">
          {pagos.map((pago) => (
            <div key={pago.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{pago.concepto}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(pago.fecha)} • {pago.tipo}
                </div>
                {pago.vencimiento && (
                  <div className="text-sm text-warning-600">
                    Vence: {formatDate(pago.vencimiento)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(pago.monto)}
                </div>
                <span className={`badge ${pago.estado === 'PAGADO' ? 'badge-success' : 'badge-warning'}`}>
                  {pago.estado}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary-800">Total Pagado:</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(pagos.filter(p => p.estado === 'PAGADO').reduce((sum, p) => sum + p.monto, 0))}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-primary-800">Pendiente:</span>
            <span className="text-xl font-bold text-warning-600">
              {formatCurrency(pagos.filter(p => p.estado === 'PENDIENTE').reduce((sum, p) => sum + p.monto, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Carrusel de Fidelización */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-warning-600" />
          Productos y Servicios Recomendados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { nombre: 'Muebles a Medida', desc: 'Cocina, dormitorios y baños', precio: 'Desde $2.5M' },
            { nombre: 'Ampliaciones', desc: 'Extender tu casa existente', precio: 'Desde $1.8M' },
            { nombre: 'Financiación', desc: 'Préstamos a tasas preferenciales', precio: 'Hasta 10 años' },
            { nombre: 'Mantenimiento', desc: 'Servicio post-entrega', precio: 'Consultar' }
          ].map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.nombre}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
              <div className="text-sm font-semibold text-primary-600">{item.precio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot y Soporte */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
