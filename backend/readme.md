# CNC - Sistema de Autenticação (Backend)

Backend desenvolvido em Django para o sistema de autenticação do projeto CNC (KONNEKIT).

## Tecnologias Utilizadas

- Django
- Django REST Framework (implícito através das respostas JSON)
- SQLite (banco de dados padrão)

## Estrutura do Projeto

```
backend/
├── sistema_capsulas/         # Projeto principal Django
│   ├── settings.py           # Configurações do projeto
│   ├── urls.py               # Configurações de URL principal
│   └── ...
├── sc_accounts/              # App de autenticação
│   ├── views.py              # Controladores/Views
│   ├── urls.py               # Configurações de URL do app
│   └── ...
├── manage.py                 # Script de gerenciamento Django
└── README.md
```

## Funcionalidades

- **Autenticação de Usuários**: Login usando Django Authentication
- **Registro de Usuários**: Criação de novos usuários no sistema
- **API RESTful**: Endpoints para interação com o frontend
- **Proteção CSRF**: Configuração para requisições seguras

## Endpoints da API

- **POST /accounts/login/**: Autenticação de usuários existentes
- **POST /accounts/register/**: Registro de novos usuários

### Exemplo de Requisição (Login)

```json
POST /accounts/login/
Content-Type: application/json

{
  "username": "usuario_exemplo",
  "password": "senha_secreta"
}
```

### Exemplo de Resposta (Login bem-sucedido)

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Login realizado com sucesso!",
  "username": "usuario_exemplo",
  "success": true
}
```

## Instalação

Para instalar e executar este projeto localmente:

```bash
# Navegue até o diretório do projeto
cd c:\CODES\KONNEKIT\CNC\backend

# Crie um ambiente virtual (opcional, mas recomendado)
python -m venv venv
venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações do banco de dados
python manage.py migrate

# Crie um superusuário para acessar o admin
python manage.py createsuperuser

# Inicie o servidor de desenvolvimento
python manage.py runserver
```

O servidor estará disponível em [http://localhost:8000](http://localhost:8000).

## Configuração CORS

Para permitir requisições do frontend, o CORS está configurado para aceitar solicitações da origem `http://localhost:3000`.

## Desenvolvimento

### Criação de Usuários no Admin

Acesse o painel administrativo em [http://localhost:8000/admin/](http://localhost:8000/admin/) para gerenciar usuários e outros dados do sistema.

### Testes com Postman

Use o Postman para testar os endpoints da API conforme documentado na seção "Endpoints da API".

## Autores

KONNEKIT Team

## Licença

Este projeto está licenciado sob [inserir tipo de licença].

----------

python manage.py createsuperuser
python manage.py runserver

```shell
# criar usuários (náo admin) via shell
# No shell do Django (python manage.py shell)
from django.contrib.auth.models import User

# Criar usuário comum
user = User.objects.create_user(
    username='nomedousuario',
    email='email@exemplo.com',
    password='senhasegura'
)

# Criar superusuário
admin = User.objects.create_superuser(
    username='admin2',
    email='admin@exemplo.com',
    password='senhaseguraadmin'
)

```