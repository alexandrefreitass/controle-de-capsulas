


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