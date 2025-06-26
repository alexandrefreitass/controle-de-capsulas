#!/bin/bash

echo "📁 Entrando na pasta backend..."
cd backend

echo "🚀 Instalando dependências do projeto..."
pip install --no-user -r requirements.txt

echo "📦 Rodando migrações..."
python manage.py makemigrations
python manage.py migrate

echo "👤 Criando usuários de desenvolvimento..."
python manage.py setup_dev_users

echo "✅ Backend pronto!"

echo "📁 Indo para a pasta frontend..."
cd ../frontend

echo "📦 Instalando pacotes do frontend..."
npm install