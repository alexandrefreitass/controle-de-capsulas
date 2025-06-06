#!/bin/bash

# 🚀 Script de inicialização aprimorado para rodar Backend e Frontend

echo "#####################################################"
echo "#       INICIANDO AMBIENTE FULL-STACK (CNC)         #"
echo "#####################################################"
echo ""

# --- 1. Iniciar o Frontend (React) em background ---
echo "--- [1/2] Iniciando Frontend (React) ---"
echo "🔧 Navegando para o diretório 'frontend'..."
cd frontend

echo "📦 Instalando dependências do Node.js (npm install)..."
npm install --silent # --silent para um log mais limpo

echo "⚛️  Iniciando servidor de desenvolvimento do React em segundo plano (npm start &)..."
# Usamos `&` para rodar o processo em background
npm start &

# Guarda o ID do processo do frontend para podermos finalizá-lo depois
FRONTEND_PID=$!
echo "✅ Servidor do Frontend iniciado com PID: $FRONTEND_PID. Logs aparecerão aqui."
echo ""

# --- 2. Iniciar o Backend (Django) em foreground ---
echo "--- [2/2] Iniciando Backend (Django) ---"
echo "🔧 Navegando de volta e para o diretório 'backend'..."
cd ../backend

# As dependências do Python geralmente ficam em cache no Replit, será rápido
echo "📦 Instalando dependências do Python (pip install)..."
pip install -r requirements.txt --quiet # --quiet para um log mais limpo

echo "🗃️ Executando migrações do Django..."
python manage.py migrate

echo "👥 Configurando usuários de desenvolvimento..."
python manage.py setup_dev_users

echo "🚀 Iniciando servidor Django..."
echo "📡 A aplicação estará disponível em: https://$REPL_SLUG-$REPL_OWNER.replit.app"
# O Django roda em primeiro plano, segurando o script aqui
python manage.py runserver 0.0.0.0:8000

# --- Finalização (só será executado se o servidor Django for derrubado com Ctrl+C) ---
echo "🛑 Servidor Django finalizado."
echo "🔪 Finalizando o processo do servidor do Frontend (PID: $FRONTEND_PID)..."
kill $FRONTEND_PID
echo "✅ Ambiente finalizado."