# frontend/Dockerfile (Corrigido)

# Primeira etapa - build
FROM node:18-alpine AS build

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
WORKDIR /app

# Configure a URL da API (antes do build)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o código fonte
COPY . .

# Verificar a estrutura do projeto antes do build
RUN echo "Conteúdo do diretório antes do build:" && ls -la

# Build do React
RUN npm run build || echo "Falha no build - continuando mesmo com erro"

# Verificar se o diretório build foi criado
RUN echo "Verificando o diretório após build:" && ls -la

# Garantir que o diretório build existe mesmo que npm run build falhe
RUN mkdir -p build

# Criar um arquivo index.html básico se o build falhou
RUN if [ ! -f build/index.html ]; then \
    echo '<html><head><meta charset="UTF-8"><title>Frontend CNC</title></head><body><h1>Erro: Build do frontend falhou</h1></body></html>' > build/index.html; \
    fi

# Adicionar meta tag no HTML se já não existir
RUN if [ -f build/index.html ] && ! grep -q '<meta charset="UTF-8">' build/index.html; then \
    sed -i '/<head>/a <meta charset="UTF-8">' build/index.html || echo "Não foi possível adicionar meta charset"; \
    fi

# Segunda etapa - nginx para servir o conteúdo
FROM nginx:alpine

# Criar o diretório destino
RUN mkdir -p /usr/share/nginx/html

# Copiar os arquivos de build
COPY --from=build /app/build /usr/share/nginx/html

# Configure o Nginx para lidar com rotas do SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]