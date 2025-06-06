#!/bin/bash

# ==============================================================================
# 🚀 SCRIPT DE INICIALIZAÇÃO "DOIS TERMINAIS"
# Inicia o Frontend e o Backend em paralelo, de forma limpa.
# ==============================================================================

echo "#####################################################"
echo "#       INICIANDO AMBIENTE DE DESENVOLVIMENTO         #"
echo "#####################################################"
echo ""

# Navega para o diretório do frontend, que será nosso orquestrador
cd frontend

echo "📦 Instalando TODAS as dependências (React e Concurrently)..."
npm install

echo "🚀 Iniciando os dois servidores (React com Proxy + Django)..."
# O npm run dev agora inicia os dois processos em paralelo!
npm run dev

