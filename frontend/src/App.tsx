import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Payments from './pages/Payments';
import Stock from './pages/Stock';
import Employees from './pages/Employees';
import WorkRoute from './pages/WorkRoute';
import ExecutiveMetrics from './pages/ExecutiveMetrics';
import Calendar from './pages/Calendar';
import Chatbot from './components/Chatbot';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

// Tema personalizado de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['cliente', 'admin', 'logistica', 'ejecutivo']}>
          <Layout>
            <Projects />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/payments" element={
        <ProtectedRoute allowedRoles={['cliente', 'admin', 'ejecutivo']}>
          <Layout>
            <Payments />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/stock" element={
        <ProtectedRoute allowedRoles={['admin', 'logistica', 'ejecutivo']}>
          <Layout>
            <Stock />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/employees" element={
        <ProtectedRoute allowedRoles={['admin', 'ejecutivo']}>
          <Layout>
            <Employees />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/work-route" element={
        <ProtectedRoute allowedRoles={['logistica', 'ejecutivo']}>
          <Layout>
            <WorkRoute />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/executive-metrics" element={
        <ProtectedRoute allowedRoles={['ejecutivo']}>
          <Layout>
            <ExecutiveMetrics />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Layout>
            <Calendar />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppRoutes />
            <Chatbot />
          </Box>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
