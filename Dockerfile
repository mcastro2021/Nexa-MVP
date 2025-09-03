# Dockerfile para Constructora E2E Platform
# Este archivo indica explícitamente que es un proyecto Node.js

FROM node:20.11.0-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY .node-version ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicaciones
RUN npm run build

# Exponer puertos
EXPOSE 3000 4000

# Comando por defecto (los servicios individuales usan render.yaml)
CMD ["echo", "Este proyecto usa render.yaml para configuración de servicios"]
