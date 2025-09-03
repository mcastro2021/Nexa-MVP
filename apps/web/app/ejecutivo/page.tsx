'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Building2, DollarSign, Users, TrendingUp, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface KPIObras {
  total: number;
  enObra: number;
  completadas: number;
  promedioDias: number;
  totalPresupuesto: number;
  totalCostos: number;
  margen: number;
}

interface KPIFinanzas {
  ingresos: number;
  egresos: number;
  balance: number;
  fecha: string;
}

interface KPIPersonal {
  total: number;
  activos: number;
  ausenciasHoy: number;
  tasaAsistencia: string;
}

export default function Ejecutivo() {
  const [obras, setObras] = useState<KPIObras | null>(null);
  const [finanzas, setFinanzas] = useState<KPIFinanzas | null>(null);
  const [personal, setPersonal] = useState<KPIPersonal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [obrasRes, finanzasRes, personalRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kpi/obras`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kpi/finanzas`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kpi/personal`)
        ]);

        if (obrasRes.ok) setObras(await obrasRes.json());
        if (finanzasRes.ok) setFinanzas(await finanzasRes.json());
        if (personalRes.ok) setPersonal(await personalRes.json());
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Ejecutivo</h1>
        <p className="text-gray-600">Vista 360° de la operación constructora</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Obras</p>
              <p className="text-3xl font-bold text-gray-900">{obras?.total || 0}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {obras?.enObra || 0} en obra • {obras?.completadas || 0} completadas
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                {finanzas ? formatCurrency(finanzas.ingresos) : '$0'}
              </p>
            </div>
            <div className="bg-success-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Balance: {finanzas ? formatCurrency(finanzas.balance) : '$0'}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personal Activo</p>
              <p className="text-3xl font-bold text-gray-900">{personal?.activos || 0}</p>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Tasa asistencia: {personal?.tasaAsistencia || '0%'}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-gray-900">
                {obras?.promedioDias || 0} días
              </p>
            </div>
            <div className="bg-danger-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-danger-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Por obra completada
            </span>
          </div>
        </div>
      </div>

      {/* Métricas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Obras y Proyectos */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary-600" />
            Estado de Obras
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Obras en Curso</span>
              <span className="text-2xl font-bold text-primary-600">{obras?.enObra || 0}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Obras Completadas</span>
              <span className="text-2xl font-bold text-success-600">{obras?.completadas || 0}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Tiempo Promedio</span>
              <span className="text-2xl font-bold text-warning-600">
                {obras?.promedioDias || 0} días
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h4 className="font-semibold text-primary-800 mb-2">Presupuesto vs Costos</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Presupuesto Total:</span>
                <span className="font-semibold">{obras ? formatCurrency(obras.totalPresupuesto) : '$0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Costos Reales:</span>
                <span className="font-semibold">{obras ? formatCurrency(obras.totalCostos) : '$0'}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Margen:</span>
                <span className={`font-bold ${obras && obras.margen >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {obras ? formatCurrency(obras.margen) : '$0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Finanzas */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-success-600" />
            Resumen Financiero
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-success-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-success-800">Ingresos</span>
                <span className="text-2xl font-bold text-success-600">
                  {finanzas ? formatCurrency(finanzas.ingresos) : '$0'}
                </span>
              </div>
              <div className="w-full bg-success-200 rounded-full h-2">
                <div className="bg-success-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-danger-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-danger-800">Egresos</span>
                <span className="text-2xl font-bold text-danger-600">
                  {finanzas ? formatCurrency(finanzas.egresos) : '$0'}
                </span>
              </div>
              <div className="w-full bg-danger-200 rounded-full h-2">
                <div className="bg-danger-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary-800">Balance Neto</span>
                <span className={`text-2xl font-bold ${finanzas && finanzas.balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {finanzas ? formatCurrency(finanzas.balance) : '$0'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Última Actualización</h4>
            <p className="text-sm text-gray-600">
              {finanzas?.fecha ? new Date(finanzas.fecha).toLocaleString('es-AR') : 'No disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Personal y RRHH */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-warning-600" />
          Capital Humano
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">{personal?.total || 0}</div>
            <div className="text-sm text-gray-600">Total Empleados</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-success-600 mb-2">{personal?.activos || 0}</div>
            <div className="text-sm text-gray-600">Empleados Activos</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-warning-600 mb-2">{personal?.ausenciasHoy || 0}</div>
            <div className="text-sm text-gray-600">Ausencias Hoy</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-warning-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-warning-800">Tasa de Asistencia</span>
            <span className="text-2xl font-bold text-warning-600">
              {personal?.tasaAsistencia || '0%'}
            </span>
          </div>
          <div className="w-full bg-warning-200 rounded-full h-2 mt-2">
            <div 
              className="bg-warning-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: personal?.tasaAsistencia || '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-danger-600" />
          Alertas y Notificaciones
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-danger-50 rounded-lg border border-danger-200">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-danger-600 mr-2" />
              <span className="font-semibold text-danger-800">Stock Bajo</span>
            </div>
            <p className="text-sm text-danger-700">
              Revisar alertas de materiales con stock mínimo
            </p>
          </div>
          
          <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-warning-600 mr-2" />
              <span className="font-semibold text-warning-800">Demoras</span>
            </div>
            <p className="text-sm text-warning-700">
              Proyectos con hitos atrasados requieren atención
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary-800">Próximas Reuniones</span>
            <span className="text-sm text-primary-600">Ver calendario</span>
          </div>
        </div>
      </div>
    </div>
  );
}
