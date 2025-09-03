import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Stock: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventario
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Gestión de materiales y stock...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Stock;
