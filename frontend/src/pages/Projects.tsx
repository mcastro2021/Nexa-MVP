import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Projects: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Proyectos
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Lista de proyectos en construcción...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Projects;
