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
  useTheme
} from '@mui/material';
import {
  Payment,
  Add,
  CheckCircle,
  Warning,
  Error,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface PaymentRecord {
  id: number;
  amount: number;
  payment_date: string;
  status: string;
  payment_method: string;
  reference: string;
  project_name: string;
  client_name?: string;
}

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<PaymentRecord>>({
    amount: 0,
    payment_date: '',
    payment_method: '',
    reference: '',
    project_name: ''
  });
  const theme = useTheme();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      let response;
      if (user?.role === 'cliente') {
        response = await axios.get('/api/client/payments');
      } else {
        response = await axios.get('/api/admin/payments');
      }
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    try {
      await axios.post('/api/admin/payments', newPayment);
      setDialogOpen(false);
      setNewPayment({ amount: 0, payment_date: '', payment_method: '', reference: '', project_name: '' });
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <Warning />;
      case 'failed':
        return <Error />;
      default:
        return <Payment />;
    }
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
        <Typography>Cargando pagos...</Typography>
      </Box>
    );
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Pagos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {user?.role === 'cliente' 
          ? 'Historial de tus pagos realizados'
          : 'Administración y seguimiento de todos los pagos'
        }
      </Typography>

      {/* Resumen de pagos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Payment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" color="primary.main" gutterBottom>
                {payments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Pagos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" color="success.main" gutterBottom>
                {formatCurrency(totalAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monto Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" color="success.main" gutterBottom>
                {completedPayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pagos Completados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h3" color="warning.main" gutterBottom>
                {pendingPayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pagos Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón para crear pago (solo admin) */}
      {user?.role !== 'cliente' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Nuevo Pago
          </Button>
        </Box>
      )}

      {/* Tabla de pagos */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Pagos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Proyecto</TableCell>
                  {user?.role !== 'cliente' && <TableCell>Cliente</TableCell>}
                  <TableCell>Monto</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {payment.reference}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.project_name}</TableCell>
                    {user?.role !== 'cliente' && (
                      <TableCell>{payment.client_name}</TableCell>
                    )}
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(payment.status)}
                        label={getStatusText(payment.status)}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear pago */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Pago</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment(prev => ({ ...prev, amount: Number(e.target.value) }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Referencia"
              value={newPayment.reference}
              onChange={(e) => setNewPayment(prev => ({ ...prev, reference: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nombre del Proyecto"
              value={newPayment.project_name}
              onChange={(e) => setNewPayment(prev => ({ ...prev, project_name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={newPayment.payment_method}
                label="Método de Pago"
                onChange={(e) => setNewPayment(prev => ({ ...prev, payment_method: e.target.value }))}
              >
                <MenuItem value="transfer">Transferencia Bancaria</MenuItem>
                <MenuItem value="cash">Efectivo</MenuItem>
                <MenuItem value="check">Cheque</MenuItem>
                <MenuItem value="card">Tarjeta de Crédito/Débito</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Fecha de Pago"
              type="date"
              value={newPayment.payment_date}
              onChange={(e) => setNewPayment(prev => ({ ...prev, payment_date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreatePayment} 
            variant="contained"
            disabled={!newPayment.amount || !newPayment.reference || !newPayment.project_name || !newPayment.payment_method || !newPayment.payment_date}
          >
            Crear Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;
