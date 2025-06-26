#!/bin/bash

echo "📁 Entrando na pasta backend..."
cd backend || { echo "❌ Pasta backend não encontrada!"; exit 1; }

echo "🚀 Iniciando servidor Django..."
python manage.py runserver