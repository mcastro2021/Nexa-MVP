"""
Tests para la aplicación Nexa MVP
"""
import unittest
import json
from app import app

class NexaMVPTests(unittest.TestCase):
    """Clase de tests para Nexa MVP"""
    
    def setUp(self):
        """Configuración inicial para cada test"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_home_endpoint(self):
        """Test del endpoint principal"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('status', data)
    
    def test_health_endpoint(self):
        """Test del endpoint de salud"""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
    
    def test_404_endpoint(self):
        """Test de endpoint no encontrado"""
        response = self.app.get('/endpoint-inexistente')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)
        self.assertEqual(data['status'], 404)

if __name__ == '__main__':
    unittest.main()
