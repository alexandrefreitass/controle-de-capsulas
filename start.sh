#!/bin/bash

# 🚀 Script de inicialização para Replit
# Salve este arquivo como start.sh na raiz do projeto

echo "🔧 Configurando ambiente Replit..."

# Verificar se estamos no Replit
if [ -n "$REPL_ID" ]; then
    echo "✅ Ambiente Replit detectado"
    echo "📍 REPL_ID: $REPL_ID"
    echo "👤 REPL_OWNER: $REPL_OWNER"
    echo "📦 REPL_SLUG: $REPL_SLUG"
else
    echo "⚠️ Ambiente local detectado"
fi

# Navegar para o diretório do backend
cd backend

echo "🐍 Verificando Python..."
python --version

echo "📦 Instalando dependências..."
pip install -r requirements.txt

echo "🗃️ Executando migrações..."
python manage.py migrate

echo "👥 Configurando usuários de desenvolvimento..."
python manage.py setup_dev_users

echo "🧪 Testando configuração..."
python test_connection.py

echo "🚀 Iniciando servidor Django..."
echo "📡 Servidor estará disponível em:"
if [ -n "$REPL_ID" ]; then
    echo "   https://$REPL_SLUG.$REPL_OWNER.repl.co"
    echo "   (porta interna: 8000)"
else
    echo "   http://localhost:8000"
fi

echo "⏰ Aguarde alguns segundos para o servidor inicializar..."

# Iniciar o servidor
python manage.py runserver 0.0.0.0:8000