from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Uma view simples para a raiz da API, para health checks.
def api_home_view(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'API do Sistema de Cápsulas está no ar!',
        'apps': ['fornecedores', 'materias-primas', 'producao', 'produtos']
    })

# Agrupando as URLs da API em uma lista separada para organização
api_urlpatterns = [
    path("", api_home_view, name="api-home"), # Endpoint para /api/
    path("", include("sc_fornecedores.urls")),
    path("", include("sc_materiasPrimas.urls")),
    path("", include("sc_producao.urls")),
    path("", include("sc_produtos.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("sc_accounts.urls")),
    
    # PONTO CENTRAL DE ENTRADA PARA A API
    # Todas as requisições para /api/ serão gerenciadas por api_urlpatterns
    path("api/", include(api_urlpatterns)),
]