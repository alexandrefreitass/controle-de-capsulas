#!/bin/bash

# Verifica se a pasta .venv já existe
if [ -d ".venv" ]; then
    echo "⚠️  Ambiente virtual existente detectado (.venv)"
    echo "Escolha uma opção:"
    echo "[1] Apagar e recriar o ambiente virtual"
    echo "[2] Apenas ativar o ambiente existente"
    echo "[3] Cancelar"
    read -rp "Digite o número da opção desejada: " opcao

    case "$opcao" in
        1)
            echo "🧹 Removendo ambiente virtual anterior (.venv)..."
            rm -rf .venv || { echo "❌ Falha ao remover a pasta .venv"; exit 1; }
            criar_novo=true
            ;;
        2)
            criar_novo=false
            ;;
        *)
            echo "❌ Operação cancelada."
            exit 0
            ;;
    esac
else
    criar_novo=true
fi

if [ "$criar_novo" = true ]; then
    echo "🐍 Criando ambiente virtual .venv..."

    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        python -m venv .venv || { echo "❌ Erro ao criar ambiente virtual (Windows)"; exit 1; }
    else
        python3 -m venv .venv || { echo "❌ Erro ao criar ambiente virtual (Unix)"; exit 1; }
    fi
fi

echo "⚙️  Ativando ambiente virtual..."

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source .venv/Scripts/activate || { echo "❌ Falha ao ativar o ambiente virtual (Windows)"; exit 1; }
else
    source .venv/bin/activate || { echo "❌ Falha ao ativar o ambiente virtual (Unix)"; exit 1; }
fi