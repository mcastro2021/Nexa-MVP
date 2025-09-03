import React, { useState } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material';
import { Chat as ChatIcon, Send as SendIcon } from '@mui/icons-material';

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: '¡Hola! Soy el asistente virtual de Nexa MVP. ¿En qué puedo ayudarte?', isUser: false }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Agregar mensaje del usuario
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      
      // Simular respuesta del bot
      setTimeout(() => {
        const botResponse = getBotResponse(message);
        setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
      }, 1000);
      
      setMessage('');
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('progreso')) {
      return 'Puede ver el progreso de su obra en la sección "Mis Proyectos" del dashboard.';
    } else if (lowerMessage.includes('pago')) {
      return 'Los pagos se pueden realizar a través de transferencia bancaria o efectivo. Consulte su cronograma de pagos.';
    } else if (lowerMessage.includes('materiales')) {
      return 'Utilizamos materiales certificados de primera calidad. Todos los materiales cumplen con las normativas vigentes.';
    } else if (lowerMessage.includes('garantia')) {
      return 'Ofrecemos garantía de 10 años en la estructura y 2 años en terminaciones.';
    } else if (lowerMessage.includes('tiempo')) {
      return 'El tiempo de construcción varía según el tamaño del proyecto. Una casa de 100m2 tarda aproximadamente 4-6 meses.';
    } else if (lowerMessage.includes('whatsapp')) {
      return 'Para consultas urgentes, puede contactarnos por WhatsApp al +54 9 11 1234-5678';
    } else {
      return 'No entiendo su consulta. ¿Podría reformularla? Para contacto directo, use WhatsApp.';
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <ChatIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asistente Virtual - Nexa MVP</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  ml: msg.isUser ? 'auto' : 0,
                  mr: msg.isUser ? 0 : 'auto',
                  maxWidth: '80%',
                  backgroundColor: msg.isUser ? 'primary.main' : 'grey.100',
                  color: msg.isUser ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Escriba su mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <SendIcon />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
