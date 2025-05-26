#!/bin/bash

# Definir variáveis (com fallback para valores padrão)
RESOURCE_GROUP=${RESOURCE_GROUP:-"CNCResourceGroup"}
LOCATION=${LOCATION:-"eastus"}
ACR_NAME=${ACR_NAME:-"cnckonnekit"}  # Nome único para seu ACR
BACKEND_APP_NAME=${BACKEND_APP_NAME:-"cnc-backend"}
FRONTEND_APP_NAME=${FRONTEND_APP_NAME:-"cnc-frontend"}
APP_SERVICE_PLAN=${APP_SERVICE_PLAN:-"CNCAppServicePlan"}

echo "Usando assinatura: $(az account show --query name -o tsv)"

# Verificar se o Resource Group existe
if [ $(az group exists --name $RESOURCE_GROUP) = false ]; then
  echo "Criando Resource Group..."
  az group create --name $RESOURCE_GROUP --location $LOCATION
  if [ $? -ne 0 ]; then
    echo "Falha ao criar Resource Group. Verifique suas permissões."
    exit 1
  fi
else
  echo "Resource Group $RESOURCE_GROUP já existe."
fi

# Verificar se o ACR existe de forma mais robusta
echo "Verificando ACR..."
if az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "ACR $ACR_NAME já existe."
else
  echo "Criando Azure Container Registry..."
  az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true
  if [ $? -ne 0 ]; then
    echo "Falha ao criar ACR. Verifique se o nome '$ACR_NAME' está disponível ou tente outro nome."
    exit 1
  fi
fi

# Verificar e tentar login no ACR com retry
echo "Fazendo login no ACR..."
MAX_RETRIES=3
RETRY_COUNT=0
LOGIN_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$LOGIN_SUCCESS" != "true" ]; do
  az acr login --name $ACR_NAME
  if [ $? -eq 0 ]; then
    LOGIN_SUCCESS=true
    echo "Login no ACR bem-sucedido."
  else
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Falha no login ao ACR. Tentativa $RETRY_COUNT de $MAX_RETRIES."
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "Tentando novamente em 5 segundos..."
      sleep 5
    fi
  fi
done

if [ "$LOGIN_SUCCESS" != "true" ]; then
  echo "Todas as tentativas de login no ACR falharam."
  echo "Verificando se o Docker está instalado e funcionando..."
  docker --version
  if [ $? -ne 0 ]; then
    echo "Docker não está disponível. Verifique a instalação."
    echo "Continuando sem login direto no Docker..."
  fi
fi

# Construir e publicar as imagens no ACR usando az acr build (não requer Docker local)
echo "Construindo e publicando imagens Docker..."
if [ -d "./backend" ]; then
  az acr build --registry $ACR_NAME --image cnc-backend:latest ./backend
  if [ $? -ne 0 ]; then
    echo "Falha ao construir a imagem backend."
    exit 1
  fi
else
  echo "Diretório ./backend não encontrado."
  exit 1
fi

if [ -d "./frontend" ]; then
  az acr build --registry $ACR_NAME --image cnc-frontend:latest ./frontend
  if [ $? -ne 0 ]; then
    echo "Falha ao construir a imagem frontend."
    exit 1
  fi
else
  echo "Diretório ./frontend não encontrado."
  exit 1
fi

# Verificar se o App Service Plan existe
echo "Verificando App Service Plan..."
ASP_EXISTS=$(az appservice plan list --resource-group $RESOURCE_GROUP --query "[?name=='$APP_SERVICE_PLAN'].name" -o tsv)
if [ -z "$ASP_EXISTS" ]; then
  echo "Criando plano de App Service..."
  az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --is-linux --sku B1
  if [ $? -ne 0 ]; then
    echo "Falha ao criar App Service Plan."
    exit 1
  fi
else
  echo "App Service Plan $APP_SERVICE_PLAN já existe."
fi

# Obter credenciais do ACR
echo "Obtendo credenciais do ACR..."
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

if [ -z "$ACR_USERNAME" ] || [ -z "$ACR_PASSWORD" ]; then
  echo "Falha ao obter credenciais do ACR."
  exit 1
fi

# Verificar se o aplicativo backend existe
echo "Verificando aplicativo backend..."
BACKEND_EXISTS=$(az webapp list --resource-group $RESOURCE_GROUP --query "[?name=='$BACKEND_APP_NAME'].name" -o tsv)
if [ -z "$BACKEND_EXISTS" ]; then
  echo "Criando aplicativo backend..."
  az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $BACKEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest"
  if [ $? -ne 0 ]; then
    echo "Falha ao criar aplicativo backend."
    exit 1
  fi
else
  echo "Atualizando aplicativo backend..."
fi

# Configurar o backend
echo "Configurando backend..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --settings WEBSITES_PORT=8000 DEBUG=0 DJANGO_ALLOWED_HOSTS="$BACKEND_APP_NAME.azurewebsites.net"
az webapp config container set --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest" --docker-registry-server-url "https://$ACR_NAME.azurecr.io" --docker-registry-server-user $ACR_USERNAME --docker-registry-server-password $ACR_PASSWORD

# Verificar se o aplicativo frontend existe
echo "Verificando aplicativo frontend..."
FRONTEND_EXISTS=$(az webapp list --resource-group $RESOURCE_GROUP --query "[?name=='$FRONTEND_APP_NAME'].name" -o tsv)
if [ -z "$FRONTEND_EXISTS" ]; then
  echo "Criando aplicativo frontend..."
  az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $FRONTEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest"
  if [ $? -ne 0 ]; then
    echo "Falha ao criar aplicativo frontend."
    exit 1
  fi
else
  echo "Atualizando aplicativo frontend..."
fi

# Configurar o frontend
echo "Configurando frontend..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME --settings WEBSITES_PORT=80 REACT_APP_API_URL="https://$BACKEND_APP_NAME.azurewebsites.net"
az webapp config container set --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest" --docker-registry-server-url "https://$ACR_NAME.azurecr.io" --docker-registry-server-user $ACR_USERNAME --docker-registry-server-password $ACR_PASSWORD

# Configurar CORS para o backend
echo "Configurando CORS..."
az webapp cors add --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --allowed-origins "https://$FRONTEND_APP_NAME.azurewebsites.net"

echo "Implantação concluída!"
echo "Backend disponível em: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend disponível em: https://$FRONTEND_APP_NAME.azurewebsites.net"