import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Business,
  Payment,
  Inventory,
  People,
  TrendingUp,
  Schedule,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  estimated_end_date: string;
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  payment_date: string;
}

interface StockItem {
  id: number;
  name: string;
  current_stock: number;
  min_stock: number;
  low_stock_alert: boolean;
}

// Mock data como fallback
const mockProjects: Project[] = [
  { id: 1, name: 'Casa Familiar Los Pinos', status: 'in_progress', progress: 75, estimated_end_date: '2024-06-15' },
  { id: 2, name: 'Edificio Comercial Centro', status: 'in_progress', progress: 45, estimated_end_date: '2024-08-20' },
  { id: 3, name: 'Remodelación Oficinas', status: 'completed', progress: 100, estimated_end_date: '2024-03-10' },
  { id: 4, name: 'Complejo Residencial Norte', status: 'pending', progress: 15, estimated_end_date: '2024-12-30' }
];

const mockPayments: Payment[] = [
  { id: 1, amount: 150000, status: 'completed', payment_date: '2024-02-15' },
  { id: 2, amount: 75000, status: 'pending', payment_date: '2024-03-01' },
  { id: 3, amount: 200000, status: 'in_progress', payment_date: '2024-02-28' },
  { id: 4, amount: 120000, status: 'completed', payment_date: '2024-01-20' },
  { id: 5, amount: 90000, status: 'pending', payment_date: '2024-03-15' }
];

const mockStockItems: StockItem[] = [
  { id: 1, name: 'Cemento Portland', current_stock: 50, min_stock: 100, low_stock_alert: true },
  { id: 2, name: 'Varillas de Hierro 12mm', current_stock: 200, min_stock: 150, low_stock_alert: false },
  { id: 3, name: 'Arena Fina', current_stock: 15, min_stock: 30, low_stock_alert: true },
  { id: 4, name: 'Ladrillos Comunes', current_stock: 5000, min_stock: 2000, low_stock_alert: false },
  { id: 5, name: 'Pintura Exterior', current_stock: 8, min_stock: 20, low_stock_alert: true }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'cliente') {
        try {
          const [projectsRes, paymentsRes] = await Promise.all([
            axios.get('/api/client/projects'),
            axios.get('/api/client/payments')
          ]);
          setProjects(projectsRes.data);
          setPayments(paymentsRes.data);
        } catch (error) {
          // Fallback a datos mock si falla el backend
          console.log('Backend no disponible, usando datos mock');
          setProjects(mockProjects.filter(p => p.id <= 2));
          setPayments(mockPayments.filter(p => p.id <= 3));
        }
      } else if (user?.role === 'admin') {
        try {
          const [stockRes, paymentsRes] = await Promise.all([
            axios.get('/api/admin/stock'),
            axios.get('/api/admin/payments')
          ]);
          setStockItems(stockRes.data);
          setPayments(paymentsRes.data || []);
        } catch (error) {
          // Fallback a datos mock si falla el backend
          console.log('Backend no disponible, usando datos mock');
          setStockItems(mockStockItems);
          setPayments(mockPayments);
        }
      } else if (user?.role === 'logistica') {
        try {
          const [stockRes, routeRes] = await Promise.all([
            axios.get('/api/admin/stock'),
            axios.get('/api/logistics/route')
          ]);
          setStockItems(stockRes.data);
          setProjects(routeRes.data);
        } catch (error) {
          // Fallback a datos mock si falla el backend
          console.log('Backend no disponible, usando datos mock');
          setStockItems(mockStockItems);
          setProjects(mockProjects.filter(p => p.status === 'in_progress'));
        }
      } else if (user?.role === 'ejecutivo') {
        try {
          const [metricsRes, stockRes] = await Promise.all([
            axios.get('/api/executive/metrics'),
            axios.get('/api/admin/stock')
          ]);
          setStockItems(stockRes.data);
          // Los ejecutivos ven métricas generales
        } catch (error) {
          // Fallback a datos mock si falla el backend
          console.log('Backend no disponible, usando datos mock');
          setProjects(mockProjects);
          setPayments(mockPayments);
          setStockItems(mockStockItems);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback general a datos mock
      setProjects(mockProjects);
      setPayments(mockPayments);
      setStockItems(mockStockItems);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const renderClientDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mis Proyectos
            </Typography>
            {projects.length > 0 ? (
              projects.map((project) => (
                <Box key={project.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{project.name}</Typography>
                    <Chip
                      label={getStatusText(project.status)}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Progreso: {project.progress}%
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No hay proyectos activos</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mis Pagos
            </Typography>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <Box key={payment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">
                      ${payment.amount.toLocaleString()}
                    </Typography>
                    <Chip
                      label={getStatusText(payment.status)}
                      color={getStatusColor(payment.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {new Date(payment.payment_date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No hay pagos registrados</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Control de Stock
            </Typography>
            {stockItems.filter(item => item.low_stock_alert).length > 0 ? (
              stockItems.filter(item => item.low_stock_alert).map((item) => (
                <Box key={item.id} sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="warning.dark">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Stock actual: {item.current_stock} (Mínimo: {item.min_stock})
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="success.main">Stock en niveles normales</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pagos Recientes
            </Typography>
            {payments.slice(0, 5).map((payment) => (
              <Box key={payment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">
                    ${payment.amount.toLocaleString()}
                  </Typography>
                  <Chip
                    label={getStatusText(payment.status)}
                    color={getStatusColor(payment.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(payment.payment_date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLogisticsDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hoja de Ruta
            </Typography>
            {projects.length > 0 ? (
              projects.map((project) => (
                <Box key={project.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2">{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {getStatusText(project.status)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 6, borderRadius: 3, mt: 1 }}
                  />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No hay proyectos en curso</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Crítico
            </Typography>
            {stockItems.filter(item => item.low_stock_alert).length > 0 ? (
              stockItems.filter(item => item.low_stock_alert).map((item) => (
                <Box key={item.id} sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="error.dark">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="error.dark">
                    Stock: {item.current_stock} / {item.min_stock}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="success.main">Sin alertas de stock</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderExecutiveDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Métricas del Negocio
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="primary.dark">
                    {projects.length}
                  </Typography>
                  <Typography variant="body2" color="primary.dark">
                    Proyectos Totales
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="success.dark">
                    {projects.filter(p => p.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    Completados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="warning.dark">
                    {stockItems.filter(item => item.low_stock_alert).length}
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Alertas Stock
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="info.dark">
                    {payments.length}
                  </Typography>
                  <Typography variant="body2" color="info.dark">
                    Pagos
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard - {user?.role === 'cliente' ? 'Cliente' : 
                     user?.role === 'admin' ? 'Administración' :
                     user?.role === 'logistica' ? 'Logística' : 'Ejecutivo'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bienvenido, {user?.username}. Aquí tienes un resumen de tu información.
      </Typography>

      {user?.role === 'cliente' && renderClientDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'logistica' && renderLogisticsDashboard()}
      {user?.role === 'ejecutivo' && renderExecutiveDashboard()}
    </Box>
  );
};

export default Dashboard;
