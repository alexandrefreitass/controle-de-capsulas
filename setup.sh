#!/bin/bash

echo "🛠️ Configurando projeto CNC para Replit..."

# Dar permissão de execução aos scripts
chmod +x start.sh
chmod +x setup.sh

echo "✅ Permissões concedidas aos scripts"

# Verificar estrutura do projeto
echo "📁 Verificando estrutura do projeto..."

if [ -d "backend" ]; then
    echo "✅ Diretório backend encontrado"
else
    echo "❌ Diretório backend NÃO encontrado"
    exit 1
fi

if [ -d "frontend" ]; then
    echo "✅ Diretório frontend encontrado"
else
    echo "⚠️ Diretório frontend não encontrado (opcional)"
fi

# Verificar arquivos importantes
echo "📄 Verificando arquivos importantes..."

if [ -f "backend/manage.py" ]; then
    echo "✅ manage.py encontrado"
else
    echo "❌ manage.py NÃO encontrado"
    exit 1
fi

if [ -f "backend/requirements.txt" ]; then
    echo "✅ requirements.txt encontrado"
else
    echo "⚠️ requirements.txt não encontrado - será criado pelo start.sh"
fi

echo "🎯 Configuração concluída!"
echo "📋 Próximos passos:"
echo "   1. Execute: ./start.sh"
echo "   2. Ou clique no botão 'Run' no Replit"
echo ""
echo "🌐 Após iniciar, acesse:"
echo "   - API: https://SEU-REPL-SLUG-SEU-USERNAME.replit.app"
echo "   - Admin: https://SEU-REPL-SLUG-SEU-USERNAME.replit.app/admin"