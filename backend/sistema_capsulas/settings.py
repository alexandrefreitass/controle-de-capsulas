from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-agf&-5qs2#9r2$fgak6zinoa2=gpk1$u_1vtxz8k2xy9(2eao9"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ✅ ALLOWED_HOSTS corrigido para Replit
ALLOWED_HOSTS = [
    '.replit.dev', 
    '.repl.co',
    'localhost', 
    '127.0.0.1',
    '0.0.0.0',
    '*'  # ⚠️ Apenas para desenvolvimento - remover em produção
]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",  # ✅ CORS deve estar aqui
    "sc_accounts",
    "sc_fornecedores",
    "sc_materiasPrimas",
    "sc_producao",
    "sc_produtos",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # ✅ CORS deve ser o primeiro
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ✅ Configuração CORS robusta para Replit
CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ Apenas para desenvolvimento

# URLs específicas que devem ser permitidas
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]

# ✅ Adicionar domínios Replit dinamicamente
import socket
try:
    hostname = socket.gethostname()
    if 'replit' in hostname or 'repl' in hostname:
        # Adicionar URLs do Replit
        replit_urls = [
            f"https://{hostname}",
            f"http://{hostname}",
        ]
        CORS_ALLOWED_ORIGINS.extend(replit_urls)
except:
    pass

# ✅ Headers CORS expandidos
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
]

# ✅ Métodos permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# ✅ Permitir cookies em requisições CORS
CORS_ALLOW_CREDENTIALS = True

# ✅ Configuração adicional para desenvolvimento
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://.*\.replit\.dev$",
        r"^https://.*\.repl\.co$",
        r"^http://localhost:\d+$",
        r"^https://localhost:\d+$",
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
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ Configurações de logging para debug
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'corsheaders': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# ✅ Configurações de segurança flexíveis para desenvolvimento
if DEBUG:
    SECURE_SSL_REDIRECT = False
    SECURE_PROXY_SSL_HEADER = None
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False