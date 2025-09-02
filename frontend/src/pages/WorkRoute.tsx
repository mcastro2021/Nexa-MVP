import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Route,
  Schedule,
  Business,
  LocationOn,
  Engineering,
  TrendingUp,
  FilterList
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  client_name: string;
  start_date: string;
  estimated_end_date: string;
  status: string;
  progress: number;
  construction_type: string;
  square_meters: number;
}

const WorkRoute: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const theme = useTheme();

  useEffect(() => {
    fetchWorkRoute();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, startDate, endDate, statusFilter]);

  const fetchWorkRoute = async () => {
    try {
      const response = await axios.get('/api/logistics/route');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching work route:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (startDate) {
      filtered = filtered.filter(p => new Date(p.start_date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(p => new Date(p.estimated_end_date) <= new Date(endDate));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'planning':
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
      case 'planning':
        return 'Planificación';
      default:
        return status;
    }
  };

  const getConstructionTypeText = (type: string) => {
    switch (type) {
      case 'wood_frame':
        return 'Wood Frame';
      case 'steel_frame':
        return 'Steel Frame';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando hoja de ruta...</Typography>
      </Box>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const planningProjects = projects.filter(p => p.status === 'planning');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hoja de Ruta - Logística
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Planificación y seguimiento de proyectos en curso
      </Typography>

      {/* Resumen de proyectos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Route sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" color="primary.main" gutterBottom>
                {projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Proyectos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" color="primary.main" gutterBottom>
                {activeProjects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Progreso
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h3" color="warning.main" gutterBottom>
                {planningProjects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Planificación
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" color="success.main" gutterBottom>
                {completedProjects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros de Búsqueda
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos los Estados</MenuItem>
                  <MenuItem value="planning">Planificación</MenuItem>
                  <MenuItem value="in_progress">En Progreso</MenuItem>
                  <MenuItem value="completed">Completado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setStatusFilter('all');
                }}
                fullWidth
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vista de proyectos */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => {
          const daysRemaining = getDaysRemaining(project.estimated_end_date);
          const isOverdue = daysRemaining < 0;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: isOverdue ? `2px solid ${theme.palette.error.main}` : 'none'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {project.name}
                    </Typography>
                    <Chip
                      label={getStatusText(project.status)}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Cliente: {project.client_name}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Engineering sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {getConstructionTypeText(project.construction_type)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {project.square_meters} m²
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(project.start_date)} - {formatDate(project.estimated_end_date)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progreso: {project.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="body2" 
                      color={isOverdue ? 'error.main' : daysRemaining <= 7 ? 'warning.main' : 'text.secondary'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {isOverdue 
                        ? `${Math.abs(daysRemaining)} días de retraso`
                        : `${daysRemaining} días restantes`
                      }
                    </Typography>
                    
                    {isOverdue && (
                      <Chip
                        label="RETRASADO"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredProjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Route sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay proyectos que coincidan con los filtros
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los criterios de búsqueda
          </Typography>
        </Box>
      )}

      {/* Tabla resumen */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumen de Proyectos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Fecha de Inicio</TableCell>
                  <TableCell>Fecha de Fin</TableCell>
                  <TableCell>Días Restantes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project) => {
                  const daysRemaining = getDaysRemaining(project.estimated_end_date);
                  const isOverdue = daysRemaining < 0;
                  
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
                          label={getStatusText(project.status)}
                          color={getStatusColor(project.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 35 }}>
                            {project.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(project.start_date)}</TableCell>
                      <TableCell>{formatDate(project.estimated_end_date)}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOverdue ? 'error.main' : daysRemaining <= 7 ? 'warning.main' : 'text.primary'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {isOverdue 
                            ? `-${Math.abs(daysRemaining)}`
                            : daysRemaining
                          }
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

export default WorkRoute;
