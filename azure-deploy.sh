
#!/bin/bash

RESOURCE_GROUP=${RESOURCE_GROUP:-"CNC"}  
LOCATION=${LOCATION:-"brazilsouth"}      
ACR_NAME=${ACR_NAME:-"cnckonnekit"}      
BACKEND_APP_NAME=${BACKEND_APP_NAME:-"cnc-backend"}
FRONTEND_APP_NAME=${FRONTEND_APP_NAME:-"cnc-frontend"}
APP_SERVICE_PLAN=${APP_SERVICE_PLAN:-"CNCAppServicePlan"}
FORCE_RECREATE=${FORCE_RECREATE:-"true"}  
SKIP_EXISTING=${SKIP_EXISTING:-"false"}    
NAME_SUFFIX=${NAME_SUFFIX:-"konnekit-$(date +%Y%m%d)"}  


if [ -n "$NAME_SUFFIX" ]; then
  BACKEND_APP_NAME="${BACKEND_APP_NAME}-${NAME_SUFFIX}"
  FRONTEND_APP_NAME="${FRONTEND_APP_NAME}-${NAME_SUFFIX}"
  echo "Usando sufixo para evitar conflitos: $NAME_SUFFIX"
  echo "Nomes ajustados: Backend=$BACKEND_APP_NAME, Frontend=$FRONTEND_APP_NAME"
fi


echo "Modo de execução:"
echo "- Forçar recriação: $FORCE_RECREATE"
echo "- Ignorar existentes: $SKIP_EXISTING"
echo "Usando assinatura: $(az account show --query name -o tsv)"


check_webapp_global_exists() {
  local app_name=$1
  
  local IS_AVAILABLE=$(az webapp check-name --name $app_name --query "nameAvailable" -o tsv)
  if [ "$IS_AVAILABLE" == "true" ]; then
    return 1  
  else
    return 0  
  fi
}


handle_existing_app() {
  local app_name=$1
  local app_type=$2
  
  if [ "$FORCE_RECREATE" == "true" ]; then
    echo "Forçando recriação: Removendo $app_type existente ($app_name)..."
    az webapp delete --name $app_name --resource-group $RESOURCE_GROUP --keep-empty-plan --keep-metrics --keep-dns-registration || true
    return 1  
  elif [ "$SKIP_EXISTING" == "true" ]; then
    echo "Configuração definida para ignorar recursos existentes. Pulando $app_type ($app_name)."
    return 0  
  else
    echo "ERRO: $app_type com nome '$app_name' já existe em alguma assinatura."
    echo "Use FORCE_RECREATE=true para recriar ou SKIP_EXISTING=true para ignorar."
    echo "Alternativamente, use NAME_SUFFIX para adicionar um sufixo único aos nomes."
    exit 1
  fi
}




echo "Verificando aplicativo backend..."
if check_webapp_global_exists $BACKEND_APP_NAME; then
  if handle_existing_app $BACKEND_APP_NAME "aplicativo backend"; then
    echo "Pulando criação do backend e usando existente."
  else
    echo "Criando aplicativo backend..."
    az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $BACKEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest"
    if [ $? -ne 0 ]; then
      echo "Falha ao criar aplicativo backend."
      exit 1
    fi
  fi
else
  echo "Criando aplicativo backend..."
  az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $BACKEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest"
  if [ $? -ne 0 ]; then
    echo "Falha ao criar aplicativo backend."
    exit 1
  fi
fi


echo "Configurando backend..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --settings WEBSITES_PORT=8000 DEBUG=0 DJANGO_ALLOWED_HOSTS="$BACKEND_APP_NAME.azurewebsites.net"
az webapp config container set --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --docker-custom-image-name "$ACR_NAME.azurecr.io/cnc-backend:latest" --docker-registry-server-url "https://$ACR_NAME.azurecr.io" --docker-registry-server-user $ACR_USERNAME --docker-registry-server-password $ACR_PASSWORD


echo "Verificando aplicativo frontend..."
if check_webapp_global_exists $FRONTEND_APP_NAME; then
  if handle_existing_app $FRONTEND_APP_NAME "aplicativo frontend"; then
    echo "Pulando criação do frontend e usando existente."
  else
    echo "Criando aplicativo frontend..."
    az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $FRONTEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest"
    if [ $? -ne 0 ]; then
      echo "Falha ao criar aplicativo frontend."
      exit 1
    fi
  fi
else
  echo "Criando aplicativo frontend..."
  az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $FRONTEND_APP_NAME --deployment-container-image-name "$ACR_NAME.azurecr.io/cnc-frontend:latest"
  if [ $? -ne 0 ]; then
    echo "Falha ao criar aplicativo frontend."
    exit 1
  fi
fi