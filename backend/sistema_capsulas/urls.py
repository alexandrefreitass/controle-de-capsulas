from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'Backend CNC está rodando!',
        'endpoints': {
            'admin': '/admin/',
            'auth': {
                'login': '/accounts/login/',
                'register': '/accounts/register/'
            },
            'api': {
                'fornecedores': '/api/fornecedores/',
                'materias-primas': '/api/materias-primas/',
                'lotes': '/api/lotes/',
                'produtos': '/api/produtos/',
                'producao': '/api/producao/'
            }
        }
    })

urlpatterns = [
    path("", home_view, name="home"),  # Rota padrão
    path("admin/", admin.site.urls),
    path("accounts/", include("sc_accounts.urls")),
    path("api/", include("sc_fornecedores.urls")),
    path("api/", include("sc_materiasPrimas.urls")),
    path("api/", include("sc_producao.urls")),
    path("api/", include("sc_produtos.urls")),
]