# Primeira etapa - build
FROM node:18-alpine as build

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Adicionar meta tag no HTML
RUN sed -i '/<head>/a <meta charset="UTF-8">' /usr/share/nginx/html/index.html

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Configure a URL da API
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build do React
RUN npm run build

# Segunda etapa - nginx para servir o conteúdo
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Configure o Nginx para lidar com rotas do SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]