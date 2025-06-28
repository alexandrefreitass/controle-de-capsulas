#!/bin/bash

# Verifica se a pasta .venv já existe e remove se necessário
if [ -d ".venv" ]; then
    echo "🧹 Removendo ambiente virtual anterior (.venv)..."
    rm -rf .venv || { echo "❌ Falha ao remover a pasta .venv"; exit 1; }
fi

echo "🐍 Criando ambiente virtual .venv..."

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    python -m venv .venv || { echo "❌ Erro ao criar ambiente virtual (Windows)"; exit 1; }
    echo "⚙️  Ativando ambiente virtual (Windows)..."
    source .venv/Scripts/activate || { echo "❌ Falha ao ativar o ambiente virtual (Windows)"; exit 1; }
else
    # Replit ou Unix-like (Linux, macOS)
    python3 -m venv .venv || { echo "❌ Erro ao criar ambiente virtual (Unix)"; exit 1; }
    echo "⚙️  Ativando ambiente virtual (Unix)..."
    source .venv/bin/activate || { echo "❌ Falha ao ativar o ambiente virtual (Unix)"; exit 1; }
fi