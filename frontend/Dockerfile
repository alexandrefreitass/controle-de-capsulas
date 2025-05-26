FROM node:16-alpine as build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte e construir
COPY . .
# Configurar a URL da API para apontar para o backend
ARG REACT_APP_API_URL=https://cnc-backend.azurewebsites.net
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# Stage de produção
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]