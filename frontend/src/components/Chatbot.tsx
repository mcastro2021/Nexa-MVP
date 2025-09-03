import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send,
  Chat,
  Close,
  WhatsApp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock responses como fallback
const mockResponses: { [key: string]: string } = {
  'progreso': 'Según nuestros registros, tu proyecto tiene un avance del 75%. Estamos en la etapa de acabados interiores.',
  'pago': 'Tu próximo pago está programado para el 15 de marzo por un monto de $75,000. Puedes realizarlo a través de transferencia bancaria.',
  'materiales': 'Utilizamos materiales de primera calidad: cemento Portland, hierro del 420, ladrillos cerámicos y pintura premium.',
  'garantía': 'Ofrecemos garantía de 2 años en estructura y 1 año en instalaciones. También incluye mantenimiento gratuito los primeros 6 meses.',
  'tiempo': 'El tiempo estimado de construcción varía según el proyecto. Para una casa estándar son aproximadamente 8-12 meses.',
  'contacto': 'Puedes contactarnos por WhatsApp al +54 9 11 1234-5678 o por email a info@nexamvp.com',
  'default': 'Gracias por tu consulta. Para información más específica sobre tu proyecto, te recomiendo contactarnos por WhatsApp.'
};

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('progreso') || lowerMessage.includes('avance') || lowerMessage.includes('obra')) {
    return mockResponses.progreso;
  }
  if (lowerMessage.includes('pago') || lowerMessage.includes('cuota') || lowerMessage.includes('dinero')) {
    return mockResponses.pago;
  }
  if (lowerMessage.includes('material') || lowerMessage.includes('cemento') || lowerMessage.includes('ladrillo')) {
    return mockResponses.materiales;
  }
  if (lowerMessage.includes('garantía') || lowerMessage.includes('garantia')) {
    return mockResponses.garantía;
  }
  if (lowerMessage.includes('tiempo') || lowerMessage.includes('cuánto') || lowerMessage.includes('duración')) {
    return mockResponses.tiempo;
  }
  if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('telefono')) {
    return mockResponses.contacto;
  }
  
  return mockResponses.default;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de Nexa MVP. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // Intentar usar el backend primero
      const response = await axios.post('/api/chatbot', {
        message: currentInput
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Si el chatbot sugiere WhatsApp, mostrar botón
      if (response.data.redirect_whatsapp) {
        setTimeout(() => {
          const whatsappMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: '¿Te gustaría contactarnos por WhatsApp para una consulta más detallada?',
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, whatsappMessage]);
        }, 1000);
      }
    } catch (error) {
      // Fallback a respuestas mock si falla el backend
      console.log('Backend no disponible, usando respuestas mock');
      
      setTimeout(() => {
        const response = getResponse(currentInput);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);

        // Si la respuesta es la default, sugerir WhatsApp
        if (response === mockResponses.default) {
          setTimeout(() => {
            const whatsappMessage: Message = {
              id: (Date.now() + 2).toString(),
              text: '¿Te gustaría contactarnos por WhatsApp para una consulta más detallada?',
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, whatsappMessage]);
          }, 1000);
        }
      }, 1000 + Math.random() * 1000); // Delay aleatorio entre 1-2 segundos
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = '+5491112345678';
    const message = encodeURIComponent('Hola, necesito información sobre Nexa MVP');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    '¿Cuál es el progreso de mi obra?',
    '¿Cuándo debo realizar el próximo pago?',
    '¿Qué materiales utilizan?',
    '¿Tienen garantía?',
    '¿Cuánto tiempo tarda la construcción?'
  ];

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <Chat />
      </Fab>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            height: isMobile ? '100%' : '600px',
            maxHeight: isMobile ? '100%' : '600px'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Asistente Virtual - Nexa MVP
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.isUser ? 'primary.main' : 'grey.100',
                    color: message.isUser ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper sx={{ p: 2, backgroundColor: 'grey.100' }}>
                  <Typography variant="body2">
                    Escribiendo...
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />

            {messages.length === 1 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Preguntas sugeridas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestedQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      size="small"
                      onClick={() => setInputText(question)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe tu mensaje..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                size="small"
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Send />
              </IconButton>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppRedirect}
                sx={{ textTransform: 'none' }}
              >
                Contactar por WhatsApp
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
