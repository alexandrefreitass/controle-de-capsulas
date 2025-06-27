#!/bin/bash

echo "🐍 Criando ambiente virtual .venv..."
python3 -m venv .venv || { echo "❌ Erro ao criar ambiente virtual"; exit 1; }

echo "⚙️  Ativando ambiente virtual..."
source .venv/bin/activate || { echo "❌ Falha ao ativar o ambiente virtual"; exit 1; }

echo "📁 Acessando a pasta backend..."
cd backend || { echo "❌ Pasta 'backend' não encontrada"; exit 1; }

echo "📦 Instalando dependências do requirements.txt..."
if [ -f requirements.txt ]; then
    pip install --no-user -r requirements.txt || { echo "❌ Erro ao instalar dependências"; exit 1; }
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "⚠️  Arquivo requirements.txt não encontrado na pasta backend"
    exit 1
fi