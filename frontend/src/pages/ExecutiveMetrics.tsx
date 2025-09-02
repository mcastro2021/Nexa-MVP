import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  People,
  AttachMoney,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface BusinessMetrics {
  total_projects: number;
  completed_projects: number;
  active_projects: number;
  total_employees: number;
  total_income: number;
  total_costs: number;
  profit: number;
}

interface Project {
  id: number;
  name: string;
  status: string;
  budget: number;
  actual_cost: number;
  start_date: string;
  estimated_end_date: string;
  client_name: string;
}

const ExecutiveMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [metricsRes, projectsRes] = await Promise.all([
        axios.get('/api/executive/metrics'),
        axios.get('/api/admin/projects')
      ]);
      setMetrics(metricsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? 'success.main' : 'error.main';
  };

  const getProfitIcon = (profit: number) => {
    return profit >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando métricas...</Typography>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No se pudieron cargar las métricas
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Métricas Ejecutivas
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Visión general del rendimiento del negocio y KPIs principales
      </Typography>

      {/* KPIs principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" color="primary.main" gutterBottom>
                {metrics.total_projects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Proyectos Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" color="success.main" gutterBottom>
                {metrics.completed_projects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Proyectos Completados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h3" color="info.main" gutterBottom>
                {metrics.total_employees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Empleados Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 48, color: getProfitColor(metrics.profit), mb: 2 }} />
              <Typography variant="h3" color={getProfitColor(metrics.profit)} gutterBottom>
                {formatCurrency(metrics.profit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Beneficio Neto
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas financieras */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen Financiero
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Ingresos Totales:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatCurrency(metrics.total_income)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Costos Totales:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {formatCurrency(metrics.total_costs)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Beneficio Neto:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: getProfitColor(metrics.profit) }}>
                  {formatCurrency(metrics.profit)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Margen de Beneficio:</Typography>
                <Chip
                  icon={getProfitIcon(metrics.profit)}
                  label={`${((metrics.profit / metrics.total_income) * 100).toFixed(1)}%`}
                  color={metrics.profit >= 0 ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Proyectos
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">En Progreso:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {metrics.active_projects}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Completados:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {metrics.completed_projects}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Tasa de Completación:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {((metrics.completed_projects / metrics.total_projects) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de proyectos */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detalle de Proyectos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Presupuesto</TableCell>
                  <TableCell>Costo Real</TableCell>
                  <TableCell>Variación</TableCell>
                  <TableCell>Fechas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => {
                  const variation = project.actual_cost - project.budget;
                  const variationPercent = ((variation / project.budget) * 100);
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {project.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{project.client_name}</TableCell>
                      <TableCell>
                        <Chip
                          label={project.status === 'completed' ? 'Completado' : 
                                 project.status === 'in_progress' ? 'En Progreso' : 'Planificación'}
                          color={project.status === 'completed' ? 'success' : 
                                 project.status === 'in_progress' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>{formatCurrency(project.actual_cost)}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={variation >= 0 ? 'error.main' : 'success.main'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {variation >= 0 ? '+' : ''}{formatCurrency(variation)}
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            ({variationPercent >= 0 ? '+' : ''}{variationPercent.toFixed(1)}%)
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block">
                          Inicio: {formatDate(project.start_date)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Fin: {formatDate(project.estimated_end_date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExecutiveMetrics;
