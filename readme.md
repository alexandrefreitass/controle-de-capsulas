

## Estrutura de diretórios

```bash
seu-projeto-cnc/
├── backend/                # Django
│   ├── projeto_django/  
│   ├── app/                # Um app Django (models.py, views.py, serializers.py, urls.py do app)
│   ├── outro_ap/           # Outro app Django, se necessário
│   ├── manage.py
│   ├── requirements.txt    # Dependências Python
│   └── ...
├── frontend/               # React
│   ├── public/
│   ├── src/                # Código fonte do React (components, services, pages, etc.)
│   ├── package.json        # Dependências Node.js/React
│   ├── yarn.lock ou package-lock.json
│   └── ...
├── .gitignore        # Arquivo gitignore geral
├── README.md
└── ... (outros arquivos de configuração, ex: Dockerfile, CI/CD pipelines)

```