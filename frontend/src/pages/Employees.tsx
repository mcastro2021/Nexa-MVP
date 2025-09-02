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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  useTheme
} from '@mui/material';
import {
  People,
  Add,
  Edit,
  Work,
  Schedule,
  AttachMoney,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Employee {
  id: number;
  full_name: string;
  phone: string;
  area: string;
  position: string;
  hire_date: string;
  salary: number;
  is_active: boolean;
}

const Employees: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployee = async () => {
    if (!editingEmployee) return;
    
    try {
      if (editingEmployee.id) {
        await axios.put(`/api/admin/employees/${editingEmployee.id}`, editingEmployee);
      } else {
        await axios.post('/api/admin/employees', editingEmployee);
      }
      setDialogOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'administracion':
        return 'primary';
      case 'logistica':
        return 'secondary';
      case 'obra':
        return 'success';
      default:
        return 'default';
    }
  };

  const getAreaText = (area: string) => {
    switch (area) {
      case 'administracion':
        return 'Administración';
      case 'logistica':
        return 'Logística';
      case 'obra':
        return 'Obra';
      default:
        return area;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando empleados...</Typography>
      </Box>
    );
  }

  const activeEmployees = employees.filter(e => e.is_active);
  const inactiveEmployees = employees.filter(e => !e.is_active);
  const totalSalary = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Empleados
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Administración del capital humano y legajos del personal
      </Typography>

      {/* Resumen de empleados */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" color="primary.main" gutterBottom>
                {employees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Empleados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" color="success.main" gutterBottom>
                {activeEmployees.length}
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
              <Work sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h3" color="info.main" gutterBottom>
                {employees.filter(e => e.area === 'obra').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personal de Obra
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h3" color="warning.main" gutterBottom>
                {formatCurrency(totalSalary)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nómina Mensual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón para agregar empleado */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingEmployee({
              id: 0,
              full_name: '',
              phone: '',
              area: '',
              position: '',
              hire_date: '',
              salary: 0,
              is_active: true
            });
            setDialogOpen(true);
          }}
        >
          Nuevo Empleado
        </Button>
      </Box>

      {/* Tabla de empleados */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Empleados
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Área</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Fecha de Contratación</TableCell>
                  <TableCell>Salario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {employee.full_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {employee.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getAreaText(employee.area)}
                        color={getAreaColor(employee.area) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{formatDate(employee.hire_date)}</TableCell>
                    <TableCell>{formatCurrency(employee.salary)}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.is_active ? 'Activo' : 'Inactivo'}
                        color={employee.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => {
                          setEditingEmployee(employee);
                          setDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para editar/crear empleado */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEmployee?.id ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={editingEmployee?.full_name || ''}
              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, full_name: e.target.value} : null)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={editingEmployee?.phone || ''}
              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, phone: e.target.value} : null)}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Área</InputLabel>
                  <Select
                    value={editingEmployee?.area || ''}
                    label="Área"
                    onChange={(e) => setEditingEmployee(prev => prev ? {...prev, area: e.target.value} : null)}
                  >
                    <MenuItem value="administracion">Administración</MenuItem>
                    <MenuItem value="logistica">Logística</MenuItem>
                    <MenuItem value="obra">Obra</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={editingEmployee?.position || ''}
                  onChange={(e) => setEditingEmployee(prev => prev ? {...prev, position: e.target.value} : null)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Contratación"
                  type="date"
                  value={editingEmployee?.hire_date || ''}
                  onChange={(e) => setEditingEmployee(prev => prev ? {...prev, hire_date: e.target.value} : null)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Salario"
                  type="number"
                  value={editingEmployee?.salary || 0}
                  onChange={(e) => setEditingEmployee(prev => prev ? {...prev, salary: Number(e.target.value)} : null)}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={editingEmployee?.is_active ? 'active' : 'inactive'}
                label="Estado"
                onChange={(e) => setEditingEmployee(prev => prev ? {...prev, is_active: e.target.value === 'active'} : null)}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleSaveEmployee} 
            variant="contained"
            disabled={!editingEmployee?.full_name || !editingEmployee?.area || !editingEmployee?.position}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;
