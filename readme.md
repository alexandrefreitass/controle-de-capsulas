


## Estrutura de diretórios

```bash
seu-projeto-cnc/
├── backend/                # Django
│   ├── projeto_django/  
│   ├── app/                # app Django (models.py, views.py, serializers.py, urls.py do app)
│   ├── outro_ap/           # Outro app Django, se necessário
│   ├── manage.py
│   ├── requirements.txt    # Dependências Python
│   └── ...
│   └── .env               # Variáveis de ambiente do Django
├── frontend/               # React
│   ├── public/
│   ├── src/                # Código fonte do React (components, services, pages, etc.)
│   ├── package.json        # Dependências Node.js/React
│   ├── yarn.lock ou package-lock.json
│   └── ...
│   └── .env               # Variáveis de ambiente do React
├── .gitignore        # Arquivo gitignore geral
├── README.md
└── ... (outros arquivos de configuração, ex: Dockerfile, CI/CD pipelines)

```

## Criar venvs

```powershell 

python -m venv .venv

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
``` 


```bash
django-admin startproject sistema_capsulas . 
python manage.py startapp core

python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser
```


## testes de usuário

user_test

### Criação dos apps

- [ ] `python manage.py startapp produtos`
- [ ] `python manage.py startapp fornecedores`
- [ ] `python manage.py startapp producao`
- [ ] `python manage.py startapp materias_primas`


### dicas 

 - Sempre coloque a barra / no final da URL ao fazer requisições POST, PUT, PATCH ou DELETE no Django REST Framework.

```bash

# json de saida para inserir nas secrets do repositório

az ad sp create-for-rbac --name "CNC-GitHub-Actions" --role contributor \
  --scopes /subscriptions/6d27da98-23c1-421e-b96c-25e1112b7875/resourceGroups/CNC \
  --sdk-auth



az webapp config appsettings set --resource-group CNC --name $BACKEND_APP_NAME --settings \
  DJANGO_SECRET_KEY="django-insecure-agf&-5qs2#9r2$fgak6zinoa2=gpk1$u_1vtxz8k2xy9(2eao9"\
  DEBUG="False" \
  DJANGO_ALLOWED_HOSTS="$BACKEND_APP_NAME.azurewebsites.net" \
  DATABASE_URL="sqlite:////tmp/db.sqlite3" \
  DJANGO_SETTINGS_MODULE="sistema_capsulas.settings"


az webapp cors add --resource-group CNC --name $BACKEND_APP_NAME --allowed-origins "https://$FRONTEND_APP_NAME.azurewebsites.net"

az webapp config appsettings set --resource-group CNC --name $FRONTEND_APP_NAME --settings \
  REACT_APP_API_URL="https://$BACKEND_APP_NAME.azurewebsites.net"



# Criar servidor PostgreSQL
az postgres server create --resource-group CNC \
  --name cnc-postgres \
  --location brazilsouth \
  --admin-user cncadmin \
  --admin-password "SenhaSegura123!" \
  --sku-name B_Gen5_1

# Criar banco de dados
az postgres db create --resource-group CNC \
  --server-name cnc-postgres \
  --name cncdb


az webapp config appsettings set --resource-group CNC --name $BACKEND_APP_NAME --settings \
  DATABASE_URL="postgres://cncadmin:SenhaSegura123!@cnc-postgres.postgres.database.azure.com:5432/cncdb"

```