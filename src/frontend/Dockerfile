FROM node:18-alpine

WORKDIR /app

# Copia los definidores de dependencias
COPY package.json .

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "dev"]