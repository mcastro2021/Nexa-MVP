// Dynamic configuration for Nexa-MVP frontend
window.NEXA_MVP_CONFIG = {
  // Backend API URL - will be set by environment variable or detected automatically
  API_URL: process.env.REACT_APP_API_URL || window.location.origin.replace('nexa-mvp-frontend', 'nexa-mvp-backend'),
  
  // App version
  VERSION: '1.0.0',
  
  // Environment
  ENV: process.env.NODE_ENV || 'production'
};
