#!/bin/bash

echo "🔴 ATENÇÃO MÁXIMA!"
echo "Este script é DESTRUTIVO. Ele:"
echo " - Apaga o banco de dados (db.sqlite3)"
echo " - Remove todas as migrações (exceto __init__.py)"
echo " - Limpa cache Python (__pycache__ e .pyc)"
echo ""
read -p "Você tem certeza que quer continuar? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo ""
echo "📁 Entrando na pasta backend..."
cd backend || { echo "❌ Pasta backend não encontrada! Abortando."; exit 1; }

echo "💣 Removendo banco de dados (db.sqlite3)..."
[ -f db.sqlite3 ] && rm db.sqlite3 && echo "✅ Banco removido." || echo "ℹ️ Nenhum banco encontrado."

echo ""
echo "🧹 Limpando cache do Python (.pyc e __pycache__)..."
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete
echo "✅ Cache limpo."

echo ""
echo "🔥 Removendo arquivos de migração (exceto __init__.py)..."
for app_path in */ ; do
    MIGRATIONS_DIR="${app_path}migrations"
    if [ -d "$MIGRATIONS_DIR" ]; then
        echo "  ➤ Limpando: $MIGRATIONS_DIR"
        find "$MIGRATIONS_DIR" -type f -name "0*.py" ! -name "__init__.py" -delete
    fi
done
echo "✅ Migrações limpas."

echo ""
echo "✅ Projeto resetado com sucesso!"
echo "➡️ Agora você pode rodar:"
echo "   python manage.py makemigrations"
echo "   python manage.py migrate"