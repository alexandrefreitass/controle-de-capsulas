#!/bin/bash

# Definir variáveis
RESOURCE_GROUP="CNCResourceGroup"
LOCATION="eastus"
ACR_NAME="cncregistry"
BACKEND_APP_NAME="cnc-backend"
FRONTEND_APP_NAME="cnc-frontend"
APP_SERVICE_PLAN="CNCAppServicePlan"

# Login no Azure (descomente se não estiver logado)
# az login

# Criar Resource Group
echo "Criando Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Criar Azure Container Registry
echo "Criando Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# Login no ACR
echo "Fazendo login no ACR..."
az acr login --name $ACR_NAME

# Construir e publicar as imagens no ACR
echo "Construindo e publicando imagens Docker..."
az acr build --registry $ACR_NAME --image cnc-backend:latest ./backend
az acr build --registry $ACR_NAME --image cnc-frontend:latest ./frontend

# Criar plano de App Service
echo "Criando plano de App Service..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --is-linux --sku B1

# Obter credenciais do ACR
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# Criar o aplicativo backend
echo "Criando aplicativo backend..."
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $BACKEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest"
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --settings WEBSITES_PORT=8000 DEBUG=0 DJANGO_ALLOWED_HOSTS="$BACKEND_APP_NAME.azurewebsites.net"
az webapp config container set --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest" --docker-registry-server-url "https://$ACR_NAME.azurecr.io" --docker-registry-server-user $ACR_USERNAME --docker-registry-server-password $ACR_PASSWORD

# Criar o aplicativo frontend
echo "Criando aplicativo frontend..."
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $FRONTEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest"
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME --settings WEBSITES_PORT=80 REACT_APP_API_URL="https://$BACKEND_APP_NAME.azurewebsites.net"
az webapp config container set --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest" --docker-registry-server-url "https://$ACR_NAME.azurecr.io" --docker-registry-server-user $ACR_USERNAME --docker-registry-server-password $ACR_PASSWORD

# Configurar CORS para o backend
echo "Configurando CORS..."
az webapp cors add --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --allowed-origins "https://$FRONTEND_APP_NAME.azurewebsites.net"

echo "Implantação concluída!"
echo "Backend disponível em: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend disponível em: https://$FRONTEND_APP_NAME.azurewebsites.net"