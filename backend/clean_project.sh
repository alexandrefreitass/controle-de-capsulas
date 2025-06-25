#!/bin/bash

# --- ALERTA MÁXIMO ---
echo "🔴 CUIDADO! Este script é DESTRUTIVO. 🔴"
echo "Ele vai apagar o banco de dados (db.sqlite3) e todos os arquivos de migração."
echo "Use APENAS em ambiente de desenvolvimento."
read -p "Você tem certeza que quer continuar? (s/n) " -n 1 -r
echo # Move para a próxima linha
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "Operação cancelada."
    exit 1
fi
echo ""

# --- Remoção do Banco de Dados ---
echo "💣 Apagando o banco de dados (db.sqlite3)..."
# O [ -f ... ] garante que o script não falhe se o arquivo não existir
[ -f db.sqlite3 ] && rm db.sqlite3
echo "Banco de dados removido!"
echo ""

# --- Limpeza de Cache do Python ---
echo "🧹 Limpando o cache do Python (.pyc e __pycache__)..."
find . -path "*/__pycache__/*" -delete
find . -type d -name "__pycache__" -empty -delete
echo "Cache do Python limpo!"
echo ""

# --- Limpeza dos Arquivos de Migração ---
echo "🔥 Removendo arquivos de migração (arquivos 0*.py)..."

# Itera sobre todos os diretórios no nível raiz e dentro de 'backend'
# Isso torna o script flexível para diferentes estruturas de projeto
for app_path in */ backend/*/ ; do
    # Verifica se é um diretório válido
    if [ -d "$app_path" ]; then
        MIGRATIONS_DIR="${app_path}migrations"
        
        # Verifica se o diretório de migrações existe
        if [ -d "$MIGRATIONS_DIR" ]; then
            echo "  -> Limpando migrações em $MIGRATIONS_DIR"
            # Apaga todos os arquivos .py que começam com '0', exceto __init__.py
            find "$MIGRATIONS_DIR" -type f -name "0*.py" ! -name "__init__.py" -delete
        fi
    fi
done

echo "Arquivos de migração removidos!"
echo ""
echo "✅ Reset completo concluído com sucesso!"
echo "Próximos passos recomendados:"
echo "1. Crie novas migrações: python manage.py makemigrations"
echo "2. Aplique-as ao novo banco: python manage.py migrate"