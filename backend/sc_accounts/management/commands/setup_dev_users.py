from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Cria usuários para ambiente de desenvolvimento'

    def handle(self, *args, **kwargs):
        # Lista de usuários comuns para criar
        regular_users = [
            {'username': 'user1', 'email': 'user1@email.com', 'password': '123@mudar'},
            {'username': 'operador', 'email': 'operador@email.com', 'password': '123@mudar'},
            {'username': 'farmaceutico', 'email': 'farm@email.com', 'password': '123@mudar'},
        ]

        # Lista de administradores para criar
        admin_users = [
            {'username': 'admin', 'email': 'admin@exemplo.com', 'password': '123@mudar'},
            {'username': 'admin2', 'email': 'admin2@exemplo.com', 'password': '123@mudar'},
        ]
        
        self.stdout.write(self.style.SUCCESS("Criando usuários para ambiente de desenvolvimento..."))
        
        # Criar usuários comuns
        for user_data in regular_users:
            if not User.objects.filter(username=user_data['username']).exists():
                User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password']
                )
                self.stdout.write(self.style.SUCCESS(f"Usuário comum '{user_data['username']}' criado com sucesso!"))
            else:
                self.stdout.write(self.style.WARNING(f"Usuário '{user_data['username']}' já existe, pulando..."))
        
        # Criar superusuários
        for admin_data in admin_users:
            if not User.objects.filter(username=admin_data['username']).exists():
                User.objects.create_superuser(
                    username=admin_data['username'],
                    email=admin_data.get('email', ''),
                    password=admin_data['password']
                )
                self.stdout.write(self.style.SUCCESS(f"Superusuário '{admin_data['username']}' criado com sucesso!"))
            else:
                self.stdout.write(self.style.WARNING(f"Superusuário '{admin_data['username']}' já existe, pulando..."))
        
        # Exibir resumo
        self.stdout.write(self.style.SUCCESS("\nUsuários disponíveis para teste:"))
        self.stdout.write("--------------------------------")
        self.stdout.write("Usuários comuns:")
        for user in regular_users:
            self.stdout.write(f"  - Username: {user['username']}, Senha: {user['password']}")
        self.stdout.write("\nAdministradores:")
        for admin in admin_users:
            self.stdout.write(f"  - Username: {admin['username']}, Senha: {admin['password']}")
        
        self.stdout.write(self.style.SUCCESS("\n✨ Configuração de usuários concluída!"))