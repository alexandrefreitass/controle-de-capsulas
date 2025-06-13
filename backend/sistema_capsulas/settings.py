# Arquivo: backend/sistema_capsulas/settings.py

from pathlib import Path
import os
import socket

# Caminho base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Carregamento de Segredos e Debug ---
# Em um projeto real, use o Replit Secrets para o SECRET_KEY.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-agf&-5qs2#9r2$fgak6zinoa2=gpk1$u_1vtxz8k2xy9(2eao9",
)
DEBUG = os.environ.get("DEBUG", "True") == "True"


# ==============================================================================
# ✅ CONFIGURAÇÃO DE HOSTS, CORS E CSRF PARA REPLIT E LOCAL
# ==============================================================================

# Permite os hosts locais e todos os subdomínios possíveis do Replit.
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    ".replit.dev",
    ".repl.co",
    ".replit.app",
    "df32-135-237-130-228.ngrok-free.app",
    "35.193.161.31",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Permite que o frontend (em qualquer URL do Replit) se comunique com o backend.
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.replit\.dev$",
    r"^https://.*\.repl\.co$",
    r"^https://.*\.replit\.app$",
]
# Adiciona origens locais se NÃO estivermos no ambiente Replit.
if "REPL_ID" not in os.environ:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Confia nos formulários e requisições vindas de qualquer URL do Replit.
CSRF_TRUSTED_ORIGINS = [
    "https://*.replit.dev",
    "https://*.repl.co",
    "https://*.replit.app",
]
if "REPL_ID" not in os.environ:
    CSRF_TRUSTED_ORIGINS.append("http://localhost:3000")

# Garante que o Django saiba que está atrás de um proxy seguro no Replit.
if "REPL_ID" in os.environ:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_HOST = True
    USE_X_FORWARDED_PORT = True

# Permite o envio de cookies entre origens (essencial para sessões de login).
CORS_ALLOW_CREDENTIALS = True

# Durante o debug, permite todas as origens para facilitar os testes.
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

# ==============================================================================
# FIM DA SEÇÃO DE CONFIGURAÇÃO DE SEGURANÇA
# ==============================================================================

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "sc_accounts",
    "sc_fornecedores",
    "sc_materiasPrimas",
    "sc_producao",
    "sc_produtos",
]

# O middleware de CORS deve vir o mais alto possível.
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "sistema_capsulas.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "sistema_capsulas.wsgi.application"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Logging para ver o que está acontecendo, especialmente com CORS.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "{levelname} {asctime} {module}: {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "corsheaders": {
            "handlers": ["console"],
            "level": "DEBUG",  # Nível DEBUG para CORS para ver todas as requisições
            "propagate": False,
        },
    },
}

# Logs de configuração para debug no final do arquivo, para confirmar o que foi carregado
print("=" * 40)
print("🔧 CONFIGURAÇÕES DO DJANGO CARREGADAS")
print(f"🐛 DEBUG: {DEBUG}")
print(f"🌍 ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"📡 CORS_ALLOWED_ORIGIN_REGEXES: {CORS_ALLOWED_ORIGIN_REGEXES}")
print(f"🔒 CSRF_TRUSTED_ORIGINS: {CSRF_TRUSTED_ORIGINS}")
print(f"🍪 CORS_ALLOW_CREDENTIALS: {CORS_ALLOW_CREDENTIALS}")
print("=" * 40)
