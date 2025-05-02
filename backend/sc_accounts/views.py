# backend/accounts/views.py
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login realizado com sucesso!'})
        else:
            return JsonResponse({'error': 'Usuário ou senha inválidos.'}, status=400)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)