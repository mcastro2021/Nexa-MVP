import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Employees: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Empleados
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Gestión de empleados y recursos humanos...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Employees;
