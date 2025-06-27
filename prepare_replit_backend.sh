#!/bin/bash

echo "🐍 Criando ambiente virtual .venv..."
python3 -m venv .venv || { echo "❌ Erro ao criar ambiente virtual"; exit 1; }

echo "⚙️  Ativando ambiente virtual..."
source .venv/bin/activate || { echo "❌ Falha ao ativar o ambiente virtual"; exit 1; }