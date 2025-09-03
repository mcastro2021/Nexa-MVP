// Configuración de la API
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  
  // Clientes
  CLIENT_PROJECTS: `${API_BASE_URL}/api/client/projects`,
  CLIENT_PAYMENTS: `${API_BASE_URL}/api/client/payments`,
  
  // Administración
  STOCK: `${API_BASE_URL}/api/admin/stock`,
  EMPLOYEES: `${API_BASE_URL}/api/admin/employees`,
  
  // Logística
  WORK_ROUTE: `${API_BASE_URL}/api/logistics/route`,
  
  // Ejecutivos
  EXECUTIVE_METRICS: `${API_BASE_URL}/api/executive/metrics`,
  
  // Chatbot
  CHATBOT: `${API_BASE_URL}/api/chatbot`,
  
  // Calendario
  CALENDAR: `${API_BASE_URL}/api/calendar`,
  
  // Base de datos
  INIT_DB: `${API_BASE_URL}/api/init-db`,
};

export default API_ENDPOINTS;
