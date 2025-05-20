"""
Script para criar usuários para ambiente de desenvolvimento.
Execute com: python manage.py shell < create_dev_users.py
"""

from django.contrib.auth.models import User
import sys

# Lista de usuários comuns para criar
regular_users = [
    {"username": "user1", "email": "user1@email.com", "password": "123@mudar"},
    {"username": "operador", "email": "operador@email.com", "password": "123@mudar"},
    {"username": "farmaceutico", "email": "farm@email.com", "password": "123@mudar"},
]

# Lista de administradores para criar
admin_users = [
    {"username": "admin", "email": "admin@exemplo.com", "password": "123@mudar"},
    {"username": "admin2", "email": "admin2@exemplo.com", "password": "123@mudar"},
]


def create_users():
    """Cria usuários para desenvolvimento se eles não existirem"""
    print("Criando usuários para ambiente de desenvolvimento...")

    # Listas para armazenar apenas os usuários realmente criados
    created_regular_users = []
    created_admin_users = []

    # Criar usuários comuns
    for user_data in regular_users:
        if not User.objects.filter(username=user_data["username"]).exists():
            User.objects.create_user(
                username=user_data["username"],
                email=user_data["email"],
                password=user_data["password"],
            )
            print(f"✅ Usuário comum '{user_data['username']}' criado com sucesso!")
            created_regular_users.append(user_data)
        else:
            print(f"⚠️ Usuário '{user_data['username']}' já existe, pulando...")

    # Criar superusuários
    for admin_data in admin_users:
        if not User.objects.filter(username=admin_data["username"]).exists():
            User.objects.create_superuser(
                username=admin_data["username"],
                email=admin_data["email"],
                password=admin_data["password"],
            )
            print(f"✅ Superusuário '{admin_data['username']}' criado com sucesso!")
            created_admin_users.append(admin_data)
        else:
            print(f"⚠️ Superusuário '{admin_data['username']}' já existe, pulando...")

    # Exibir resumo apenas dos usuários criados agora
    if created_regular_users or created_admin_users:
        print("\nUsuários criados nesta execução:")
        print("--------------------------------")

        if created_regular_users:
            print("Usuários comuns:")
            for user in created_regular_users:
                print(f"  - Username: {user['username']}, Senha: {user['password']}")
        else:
            print("Nenhum usuário comum foi criado.")

        if created_admin_users:
            print("\nAdministradores:")
            for admin in created_admin_users:
                print(f"  - Username: {admin['username']}, Senha: {admin['password']}")
        else:
            print("Nenhum administrador foi criado.")
    else:
        print("\nNenhum novo usuário foi criado. Todos já existem.")

    # Mostrar uma listagem completa de todos os usuários existentes
    print("\nTodos os usuários disponíveis no sistema:")
    print("---------------------------------------")
    all_regular_users = User.objects.filter(is_superuser=False)
    all_admin_users = User.objects.filter(is_superuser=True)

    print(f"Usuários comuns ({all_regular_users.count()}):")
    for user in all_regular_users:
        print(f"  - {user.username}")

    print(f"\nAdministradores ({all_admin_users.count()}):")
    for admin in all_admin_users:
        print(f"  - {admin.username}")

    print("\n✨ Configuração de usuários concluída!")


# Executar a função principal
create_users()
