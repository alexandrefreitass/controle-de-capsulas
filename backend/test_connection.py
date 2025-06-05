#!/usr/bin/env python3
"""
Script de debug para testar conectividade e configuração do sistema CNC
Execute: python test_connection.py
"""

import os
import sys
import socket
import requests
import subprocess
from urllib.parse import urlparse

def print_header(title):
    print(f"\n{'='*50}")
    print(f" {title}")
    print(f"{'='*50}")

def print_status(message, success=True):
    icon = "✅" if success else "❌"
    print(f"{icon} {message}")

def test_environment():
    print_header("INFORMAÇÕES DO AMBIENTE")

    # Informações básicas
    print(f"Python Version: {sys.version}")
    print(f"Working Directory: {os.getcwd()}")

    # Detectar ambiente
    hostname = socket.gethostname()
    if 'replit' in hostname.lower() or 'repl' in hostname.lower():
        print_status("Ambiente detectado: REPLIT")
        print(f"Hostname: {hostname}")
    else:
        print_status("Ambiente detectado: LOCAL/OUTROS")
        print(f"Hostname: {hostname}")

    # Verificar portas
    try:
        # Testar se a porta 8080 está disponível
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 8080))
        if result == 0:
            print_status("Porta 8080: Ocupada (Backend pode estar rodando)")
        else:
            print_status("Porta 8080: Disponível", False)
        sock.close()
    except Exception as e:
        print_status(f"Erro ao testar porta 8080: {e}", False)

def test_django_setup():
    print_header("TESTE DO DJANGO")

    # Verificar se estamos no diretório correto
    django_files = ['manage.py', 'sistema_capsulas/settings.py']
    backend_path = 'backend'

    if os.path.exists(backend_path):
        os.chdir(backend_path)
        print_status(f"Mudança para diretório: {os.getcwd()}")

    for file in django_files:
        if os.path.exists(file):
            print_status(f"Arquivo encontrado: {file}")
        else:
            print_status(f"Arquivo NÃO encontrado: {file}", False)

    # Testar importação das configurações
    try:
        sys.path.append(os.getcwd())
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_capsulas.settings')
        import django
        django.setup()
        print_status("Django setup: SUCCESS")

        # Testar banco de dados
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print_status("Conexão com banco de dados: SUCCESS")

        # Verificar usuários
        from django.contrib.auth.models import User
        user_count = User.objects.count()
        print_status(f"Usuários no sistema: {user_count}")

    except Exception as e:
        print_status(f"Django setup FAILED: {e}", False)

def test_api_endpoints():
    print_header("TESTE DOS ENDPOINTS DA API")

    base_urls = [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
    ]

    # Adicionar URL do Replit se aplicável
    hostname = socket.gethostname()
    if 'replit' in hostname.lower():
        replit_url = f"https://{hostname}"
        base_urls.append(replit_url)

    endpoints = [
        '/admin/',
        '/accounts/login/',
        '/api/fornecedores/',
    ]

    for base_url in base_urls:
        print(f"\n🔍 Testando: {base_url}")

        for endpoint in endpoints:
            try:
                full_url = f"{base_url}{endpoint}"
                response = requests.get(full_url, timeout=5)

                if response.status_code < 500:
                    print_status(f"{endpoint}: {response.status_code}")
                else:
                    print_status(f"{endpoint}: {response.status_code} (Server Error)", False)

            except requests.exceptions.ConnectionError:
                print_status(f"{endpoint}: CONNECTION REFUSED", False)
            except requests.exceptions.Timeout:
                print_status(f"{endpoint}: TIMEOUT", False)
            except Exception as e:
                print_status(f"{endpoint}: ERROR - {e}", False)

def test_cors_headers():
    print_header("TESTE DE CORS")

    hostname = socket.gethostname()
    if 'replit' in hostname.lower():
        api_url = f"https://{hostname}/accounts/login/"
    else:
        api_url = "http://localhost:8080/accounts/login/"

    try:
        # Simular requisição OPTIONS (preflight)
        response = requests.options(
            api_url,
            headers={
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
            timeout=5
        )

        print(f"OPTIONS Response: {response.status_code}")

        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }

        for header, value in cors_headers.items():
            if value:
                print_status(f"{header}: {value}")
            else:
                print_status(f"{header}: NOT SET", False)

    except Exception as e:
        print_status(f"CORS test failed: {e}", False)

def run_diagnostics():
    print_header("🔧 DIAGNÓSTICO DO SISTEMA CNC")
    print("Este script irá testar a conectividade e configuração do seu sistema")

    test_environment()
    test_django_setup()
    test_api_endpoints()
    test_cors_headers()

    print_header("RESUMO")
    print("Se você viu muitos ❌, há problemas de configuração.")
    print("Se você viu mais ✅, o sistema está funcionando corretamente.")
    print("\nPara resolver problemas:")
    print("1. Certifique-se de que o Django está rodando: python manage.py runserver 0.0.0.0:8080")
    print("2. Verifique as configurações de CORS no settings.py")
    print("3. Teste as URLs no navegador")

if __name__ == "__main__":
    run_diagnostics()