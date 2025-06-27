#!/bin/bash

echo "📁 Entrando na pasta frontend..."
cd frontend || { echo "❌ Pasta frontend não encontrada!"; exit 1; }

echo "🚀 Iniciando servidor React..."
npm start