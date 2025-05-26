FROM python:3.9-slim

WORKDIR /app

# Instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV DEBUG=0
ENV DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,*.azurewebsites.net

# Executar migrações e iniciar servidor
CMD python manage.py migrate && \
    python manage.py setup_dev_users && \
    gunicorn sistema_capsulas.wsgi:application --bind 0.0.0.0:8000