#!/bin/bash

# 🚀 Script de inicialização para Replit - Versão Corrigida
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

# Verificar se o diretório backend existe
if [ ! -d "backend" ]; then
    echo "❌ Diretório 'backend' não encontrado!"
    echo "📍 Certifique-se de estar na raiz do projeto"
    exit 1
fi

# Navegar para o diretório do backend
cd backend

echo "🐍 Verificando Python..."
python --version

# Verificar se requirements.txt existe
if [ ! -f "requirements.txt" ]; then
    echo "❌ Arquivo requirements.txt não encontrado no diretório backend!"
    echo "📁 Criando requirements.txt básico..."
    cat > requirements.txt << EOF
Django==5.2
djangorestframework==3.14.0
django-cors-headers==4.3.1
gunicorn==21.2.0
psycopg2-binary==2.9.7
whitenoise==6.6.0
python-decouple==3.8
requests==2.31.0
EOF
    echo "✅ requirements.txt criado"
fi

echo "📦 Instalando dependências..."
pip install -r requirements.txt

# Verificar se manage.py existe
if [ ! -f "manage.py" ]; then
    echo "❌ Arquivo manage.py não encontrado!"
    echo "📍 Certifique-se de estar no diretório correto"
    exit 1
fi

echo "🗃️ Executando migrações..."
python manage.py migrate

echo "👥 Configurando usuários de desenvolvimento..."
python manage.py setup_dev_users

# Teste de conexão opcional (se existe na raiz)
if [ -f "../test_connection.py" ]; then
    echo "🧪 Testando configuração..."
    python ../test_connection.py
else
    echo "⚠️ Script de teste não encontrado (opcional)"
fi

echo "🚀 Iniciando servidor Django..."
echo "📡 Servidor estará disponível em:"
if [ -n "$REPL_ID" ]; then
    echo "   https://$REPL_SLUG-$REPL_OWNER.replit.app"
    echo "   (porta interna: 8000)"
else
    echo "   http://localhost:8000"
fi

echo "⏰ Aguarde alguns segundos para o servidor inicializar..."

# Definir variáveis de ambiente para Replit
export DJANGO_SETTINGS_MODULE=sistema_capsulas.settings
export PYTHONPATH=/home/runner/$REPL_SLUG/backend:$PYTHONPATH

# Iniciar o servidor
python manage.py runserver 0.0.0.0:8000