import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Payments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pagos
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Historial de pagos y estado de cuenta...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payments;
