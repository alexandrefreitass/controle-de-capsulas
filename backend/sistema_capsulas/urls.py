from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("sc_accounts.urls")),
    path("api/", include("sc_fornecedores.urls")),
    path("api/", include("sc_materiasPrimas.urls")),
    path("api/", include("sc_producao.urls")),
    path("api/", include("sc_produtos.urls")),
]
