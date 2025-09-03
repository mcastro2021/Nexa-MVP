import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ExecutiveMetrics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Métricas Ejecutivas
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          KPIs y métricas del negocio...
        </Typography>
      </Paper>
    </Box>
  );
};

export default ExecutiveMetrics;
