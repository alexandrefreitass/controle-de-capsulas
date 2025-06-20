from django.urls import path
from . import views

urlpatterns = [
    path("materias-primas/", views.materia_prima_list, name="materia_prima_list"),
    path(
        "materias-primas/<int:pk>/",
        views.materia_prima_detail,
        name="materia_prima_detail",
    ),
    path(
        "materias-primas/<int:pk>/estoque/",
        views.atualizar_estoque,
        name="atualizar_estoque",
    ),
    path(
        "materias-primas/<int:pk>/abrir-embalagem/",
        views.registrar_abertura_embalagem,
        name="registrar_abertura_embalagem",
    ),
    path("lotes/", views.lote_list, name="lote_list"),
    path("lotes/<int:pk>/", views.lote_detail, name="lote_detail"),
    path("lotes/<int:pk>/estoque/", views.lote_estoque, name="lote_estoque"),
]
