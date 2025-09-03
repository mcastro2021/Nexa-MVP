import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import {
  Business as BusinessIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'cliente':
        return 'Bienvenido a su dashboard de cliente';
      case 'admin':
        return 'Panel de administración';
      case 'logistica':
        return 'Panel de logística y operaciones';
      case 'ejecutivo':
        return 'Panel ejecutivo';
      default:
        return 'Bienvenido al sistema';
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'cliente':
        return [
          { text: 'Ver Proyectos', path: '/projects', icon: <BusinessIcon /> },
          { text: 'Ver Pagos', path: '/payments', icon: <PaymentIcon /> },
        ];
      case 'admin':
        return [
          { text: 'Gestionar Stock', path: '/stock', icon: <InventoryIcon /> },
          { text: 'Gestionar Empleados', path: '/employees', icon: <PeopleIcon /> },
        ];
      case 'logistica':
        return [
          { text: 'Ver Ruta de Trabajo', path: '/work-route', icon: <BusinessIcon /> },
          { text: 'Gestionar Stock', path: '/stock', icon: <InventoryIcon /> },
        ];
      case 'ejecutivo':
        return [
          { text: 'Ver Métricas', path: '/executive-metrics', icon: <BusinessIcon /> },
          { text: 'Gestionar Empleados', path: '/employees', icon: <PeopleIcon /> },
        ];
      default:
        return [];
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {getWelcomeMessage()}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Información del Usuario
            </Typography>
            <Typography variant="body1">
              <strong>Usuario:</strong> {user?.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1">
              <strong>Rol:</strong> {user?.role}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {getQuickActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={action.icon}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {action.text}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Sistema
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Proyectos Activos
                    </Typography>
                    <Typography variant="h4">
                      12
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Empleados
                    </Typography>
                    <Typography variant="h4">
                      25
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Materiales
                    </Typography>
                    <Typography variant="h4">
                      150
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pagos Pendientes
                    </Typography>
                    <Typography variant="h4">
                      8
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
