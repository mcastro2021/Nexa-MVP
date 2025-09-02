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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Business,
  Schedule,
  LocationOn,
  AttachMoney,
  Engineering,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  description: string;
  construction_type: string;
  square_meters: number;
  start_date: string;
  estimated_end_date: string;
  status: string;
  budget: number;
  actual_cost: number;
  progress: number;
  client_name?: string;
}

interface ProjectStage {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStages, setProjectStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      let response;
      if (user?.role === 'cliente') {
        response = await axios.get('/api/client/projects');
      } else if (user?.role === 'logistica') {
        response = await axios.get('/api/logistics/route');
      } else {
        // Para admin y ejecutivo, mostrar todos los proyectos
        response = await axios.get('/api/admin/projects');
      }
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    try {
      // Aquí se podría hacer una llamada para obtener las etapas del proyecto
      // Por ahora usamos datos de ejemplo
      const stages: ProjectStage[] = [
        {
          id: 1,
          name: 'Cimientos',
          description: 'Excavación y hormigonado de cimientos',
          start_date: '2024-01-15',
          end_date: '2024-01-30',
          status: 'completed',
          progress: 100
        },
        {
          id: 2,
          name: 'Estructura',
          description: 'Montaje de estructura steel frame',
          start_date: '2024-02-01',
          end_date: '2024-02-28',
          status: 'in_progress',
          progress: 75
        },
        {
          id: 3,
          name: 'Cerramientos',
          description: 'Instalación de paneles y aislaciones',
          start_date: '2024-03-01',
          end_date: '2024-03-31',
          status: 'pending',
          progress: 0
        }
      ];
      setProjectStages(stages);
    } catch (error) {
      console.error('Error fetching project stages:', error);
    }
    setDialogOpen(true);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando proyectos...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Proyectos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {user?.role === 'cliente' 
          ? 'Aquí puedes ver el estado de tus proyectos de construcción'
          : 'Gestión y seguimiento de todos los proyectos'
        }
      </Typography>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => handleProjectClick(project)}
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
                  {project.description}
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

                  {user?.role !== 'cliente' && project.client_name && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {project.client_name}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progreso General
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {project.progress}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Inicio: {formatDate(project.start_date)}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Fin estimado: {formatDate(project.estimated_end_date)}
                    </Typography>
                  </Box>
                  
                  {project.budget && (
                    <Chip
                      label={`$${project.budget.toLocaleString()}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay proyectos disponibles
          </Typography>
        </Box>
      )}

      {/* Dialog de detalles del proyecto */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedProject?.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedProject && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Engineering />
                      </ListItemIcon>
                      <ListItemText
                        primary="Tipo de Construcción"
                        secondary={getConstructionTypeText(selectedProject.construction_type)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary="Superficie"
                        secondary={`${selectedProject.square_meters} m²`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary="Fechas"
                        secondary={`${formatDate(selectedProject.start_date)} - ${formatDate(selectedProject.estimated_end_date)}`}
                      />
                    </ListItem>
                    {selectedProject.budget && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney />
                        </ListItemIcon>
                        <ListItemText
                          primary="Presupuesto"
                          secondary={`$${selectedProject.budget.toLocaleString()}`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Estado del Proyecto
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progreso General: {selectedProject.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={selectedProject.progress}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Chip
                    label={getStatusText(selectedProject.status)}
                    color={getStatusColor(selectedProject.status) as any}
                    sx={{ fontSize: '1rem', py: 1 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Etapas del Proyecto
              </Typography>
              
              <List>
                {projectStages.map((stage) => (
                  <ListItem key={stage.id} sx={{ mb: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <ListItemIcon>
                      {stage.status === 'completed' ? (
                        <CheckCircle color="success" />
                      ) : stage.status === 'in_progress' ? (
                        <Warning color="primary" />
                      ) : (
                        <Info color="action" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={stage.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {stage.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(stage.start_date)} - {formatDate(stage.end_date)}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={stage.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              {stage.progress}%
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;
