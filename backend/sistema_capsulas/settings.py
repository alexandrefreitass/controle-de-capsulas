# Arquivo: backend/sistema_capsulas/settings.py

from pathlib import Path
import os
import socket

# Caminho base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Carregamento de Segredos e Debug ---
# Perfeito como está. Usa Replit Secrets para produção e um fallback para dev.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-agf&-5qs2#9r2$fgak6zinoa2=gpk1$u_1vtxz8k2xy9(2eao9",
)
DEBUG = os.environ.get("DEBUG", "True") == "True"


# ==============================================================================
# ✅ CONFIGURAÇÃO DINÂMICA DE HOSTS, CORS E CSRF (VERSÃO MELHORADA)
# ==============================================================================

# Lista base de hosts permitidos
ALLOWED_HOSTS = ['*'] # Manter '*' em dev é aceitável, mas para prod, restrinja!

# Lista base de origens permitidas para CORS e CSRF
TRUSTED_ORIGINS = []

# --- Configuração para o ambiente Replit ---
IS_REPLIT = "REPL_ID" in os.environ or "REPLIT_DEV_DOMAIN" in os.environ

if IS_REPLIT:
    replit_domain = os.environ.get("REPLIT_DEV_DOMAIN")
    if replit_domain:
        ALLOWED_HOSTS.append(replit_domain)
        TRUSTED_ORIGINS.append(f"https://{replit_domain}")
    
    repl_slug = os.environ.get("REPL_SLUG") 
    repl_owner = os.environ.get("REPL_OWNER")
    
    if repl_slug and repl_owner:
        replit_host = f"{repl_slug}.{repl_owner}.replit.dev"
        ALLOWED_HOSTS.append(replit_host)
        TRUSTED_ORIGINS.append(f"https://{replit_host}")
    
    ALLOWED_HOSTS.extend([
        "*.replit.dev",
        "*.repl.co",
        "*.replitusercontent.com"
    ])

# --- Configuração para o ambiente Local ---
if not IS_REPLIT or DEBUG:
    # Adicionando explicitamente as origens de desenvolvimento local
    TRUSTED_ORIGINS.extend([
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.3.9:3000", # <--- A GRANDE MUDANÇA ESTÁ AQUI!
    ])

# --- Atribuição final das configurações ---
CORS_ALLOWED_ORIGINS = TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = TRUSTED_ORIGINS

# Essencial para o Django confiar nos cabeçalhos de proxy
if IS_REPLIT:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_HOST = True
    USE_X_FORWARDED_PORT = True

CORS_ALLOW_CREDENTIALS = True

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
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
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

# Logging (seu logging estava ótimo, mantive como está)
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
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

# Logs de configuração para debug
# Movido para dentro de um if DEBUG para não poluir os logs de produção.
if DEBUG:
    print("=" * 40)
    print("🔧 CONFIGURAÇÕES DO DJANGO CARREGADAS (MODO DEBUG)")
    print(f"🐛 DEBUG: {DEBUG}")
    print(f"🌍 ALLOWED_HOSTS: {ALLOWED_HOSTS}")
    print(f"🔒 TRUSTED_ORIGINS (CORS/CSRF): {TRUSTED_ORIGINS}")
    print(f"🍪 CORS_ALLOW_CREDENTIALS: {CORS_ALLOW_CREDENTIALS}")
    print("=" * 40)