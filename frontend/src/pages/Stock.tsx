import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
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
  Inventory,
  Warning,
  Add,
  Edit,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';

interface Material {
  id: number;
  name: string;
  description: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  unit_price: number;
  supplier_name: string;
  low_stock_alert: boolean;
}

const Stock: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await axios.get('/api/admin/stock');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setDialogOpen(true);
  };

  const handleSaveMaterial = async () => {
    if (!editingMaterial) return;
    
    try {
      // Aquí se haría la llamada para actualizar el material
      await axios.put(`/api/admin/stock/${editingMaterial.id}`, editingMaterial);
      setDialogOpen(false);
      setEditingMaterial(null);
      fetchStock();
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const getStockStatus = (material: Material) => {
    if (material.current_stock <= material.min_stock) {
      return { color: 'error', text: 'Stock Crítico' };
    } else if (material.current_stock <= material.min_stock * 1.5) {
      return { color: 'warning', text: 'Stock Bajo' };
    } else {
      return { color: 'success', text: 'Stock Normal' };
    }
  };

  const lowStockMaterials = materials.filter(m => m.low_stock_alert);
  const normalStockMaterials = materials.filter(m => !m.low_stock_alert);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando stock...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Control de Stock
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gestión y monitoreo del inventario de materiales
      </Typography>

      {/* Alertas de stock crítico */}
      {lowStockMaterials.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ¡Atención! {lowStockMaterials.length} material(es) con stock crítico
          </Typography>
          <Typography variant="body2">
            Es necesario realizar pedidos urgentes para estos materiales
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Resumen de stock */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Stock
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary.main">
                  {materials.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Materiales Totales
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Crítico
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="error.main">
                  {lowStockMaterials.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Necesitan Reposición
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Normal
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="success.main">
                  {normalStockMaterials.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En Niveles Adecuados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de materiales */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Lista de Materiales
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingMaterial({
                  id: 0,
                  name: '',
                  description: '',
                  unit: '',
                  current_stock: 0,
                  min_stock: 0,
                  unit_price: 0,
                  supplier_name: '',
                  low_stock_alert: false
                });
                setDialogOpen(true);
              }}
            >
              Agregar Material
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>Stock Actual</TableCell>
                  <TableCell>Stock Mínimo</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell>Precio Unitario</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((material) => {
                  const status = getStockStatus(material);
                  return (
                    <TableRow key={material.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {material.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {material.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={material.current_stock <= material.min_stock ? 'error.main' : 'text.primary'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {material.current_stock}
                        </Typography>
                      </TableCell>
                      <TableCell>{material.min_stock}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>${material.unit_price.toLocaleString()}</TableCell>
                      <TableCell>{material.supplier_name}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.text}
                          color={status.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditMaterial(material)}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para editar/crear material */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMaterial?.id ? 'Editar Material' : 'Nuevo Material'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Material"
              value={editingMaterial?.name || ''}
              onChange={(e) => setEditingMaterial(prev => prev ? {...prev, name: e.target.value} : null)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={editingMaterial?.description || ''}
              onChange={(e) => setEditingMaterial(prev => prev ? {...prev, description: e.target.value} : null)}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Actual"
                  type="number"
                  value={editingMaterial?.current_stock || 0}
                  onChange={(e) => setEditingMaterial(prev => prev ? {...prev, current_stock: Number(e.target.value)} : null)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Mínimo"
                  type="number"
                  value={editingMaterial?.min_stock || 0}
                  onChange={(e) => setEditingMaterial(prev => prev ? {...prev, min_stock: Number(e.target.value)} : null)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Unidad"
                  value={editingMaterial?.unit || ''}
                  onChange={(e) => setEditingMaterial(prev => prev ? {...prev, unit: e.target.value} : null)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Precio Unitario"
                  type="number"
                  value={editingMaterial?.unit_price || 0}
                  onChange={(e) => setEditingMaterial(prev => prev ? {...prev, unit_price: Number(e.target.value)} : null)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveMaterial} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Stock;
