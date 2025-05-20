# backend/accounts/views.py
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.contrib.auth.models import User
import json


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Usuário e senha são obrigatórios.", "success": False},
                status=400,
            )

        # Autenticar usuário (não criar)
        user = authenticate(username=username, password=password)

        if user is not None:
            # Login bem-sucedido
            login(request, user)
            return JsonResponse(
                {
                    "message": "Login realizado com sucesso!",
                    "username": user.username,
                    "success": True,
                }
            )
        else:
            # Credenciais inválidas
            return JsonResponse(
                {
                    "error": "Credenciais inválidas. Usuário não encontrado ou senha incorreta.",
                    "success": False,
                },
                status=401,
            )

    return JsonResponse(
        {"error": "Método não permitido.", "success": False}, status=405
    )


# Adicione uma nova função para registro de usuários
@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Usuário e senha são obrigatórios.", "success": False},
                status=400,
            )

        try:
            # Criar um novo usuário
            user = User.objects.create_user(username=username, password=password)
            login(request, user)
            return JsonResponse(
                {
                    "message": "Usuário criado com sucesso!",
                    "username": user.username,
                    "success": True,
                }
            )
        except IntegrityError:
            return JsonResponse(
                {"error": "Este nome de usuário já está em uso.", "success": False},
                status=400,
            )
        except Exception as e:
            return JsonResponse({"error": str(e), "success": False}, status=500)

    return JsonResponse(
        {"error": "Método não permitido.", "success": False}, status=405
    )
