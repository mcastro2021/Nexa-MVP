import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WorkRoute: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ruta de Trabajo
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Planificación y seguimiento de rutas de trabajo...
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkRoute;
