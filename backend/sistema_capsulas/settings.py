from pathlib import Path
import os
import socket

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-agf&-5qs2#9r2$fgak6zinoa2=gpk1$u_1vtxz8k2xy9(2eao9"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ✅ Função para detectar ambiente Replit
def is_replit():
    return 'REPL_ID' in os.environ or 'REPLIT_DB_URL' in os.environ or 'replit' in socket.gethostname().lower()

# ✅ Função para obter URL do Replit
def get_replit_url():
    try:
        repl_slug = os.environ.get('REPL_SLUG', '')
        repl_owner = os.environ.get('REPL_OWNER', '')
        if repl_slug and repl_owner:
            return f"{repl_slug}.{repl_owner}.repl.co"
    except:
        pass
    return None

# ✅ ALLOWED_HOSTS configurado dinamicamente
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1',
    '0.0.0.0',
]

# Adicionar hosts específicos do Replit
if is_replit():
    replit_url = get_replit_url()
    if replit_url:
        ALLOWED_HOSTS.extend([
            replit_url,
            f"https://{replit_url}",
            f"http://{replit_url}",
        ])

    # Adicionar padrões gerais do Replit
    ALLOWED_HOSTS.extend([
        '*.replit.dev',
        '*.repl.co',
        '*'  # Para desenvolvimento - remover em produção
    ])

    print(f"🌍 Ambiente Replit detectado - URL: {replit_url}")
else:
    print("🏠 Ambiente local detectado")

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

# ✅ Configuração CORS otimizada
if is_replit():
    # Configuração para Replit
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://.*\.replit\.dev$",
        r"^https://.*\.repl\.co$",
        r"^http://.*\.replit\.dev$",
        r"^http://.*\.repl\.co$",
    ]

    # Adicionar URL específica do Replit se disponível
    replit_url = get_replit_url()
    if replit_url:
        CORS_ALLOWED_ORIGINS = [
            f"https://{replit_url}",
            f"http://{replit_url}",
        ]
    else:
        CORS_ALLOWED_ORIGINS = []
else:
    # Configuração para desenvolvimento local
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

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
    'x-forwarded-for',
    'x-forwarded-proto',
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

# ✅ Configurações de logging melhoradas para debug
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'corsheaders': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# ✅ Configurações de segurança flexíveis para desenvolvimento
if DEBUG:
    SECURE_SSL_REDIRECT = False
    SECURE_PROXY_SSL_HEADER = None
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    CSRF_TRUSTED_ORIGINS = []

    # Adicionar origens confiáveis para CSRF
    if is_replit():
        replit_url = get_replit_url()
        if replit_url:
            CSRF_TRUSTED_ORIGINS = [
                f"https://{replit_url}",
                f"http://{replit_url}",
            ]

# ✅ Configurações específicas do Replit
if is_replit():
    # Configuração de proxy para Replit
    USE_X_FORWARDED_HOST = True
    USE_X_FORWARDED_PORT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ✅ Configuração de porta
PORT = int(os.environ.get('PORT', 8000))

# ✅ Logs de configuração para debug
print("🔧 CONFIGURAÇÕES DO DJANGO")
print("=" * 40)
print(f"🐛 DEBUG: {DEBUG}")
print(f"🌍 ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"🚪 PORT: {PORT}")
print(f"📡 CORS_ALLOW_ALL_ORIGINS: {CORS_ALLOW_ALL_ORIGINS}")
if hasattr(locals(), 'CORS_ALLOWED_ORIGINS'):
    print(f"🔗 CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")
if hasattr(locals(), 'CSRF_TRUSTED_ORIGINS'):
    print(f"🛡️ CSRF_TRUSTED_ORIGINS: {CSRF_TRUSTED_ORIGINS}")
print(f"🏠 Ambiente Replit: {is_replit()}")
print("=" * 40)