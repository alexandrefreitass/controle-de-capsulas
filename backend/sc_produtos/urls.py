from django.urls import path
from . import views

urlpatterns = [
    path("produtos/", views.produto_list, name="produto-list"),
    path("produtos/<int:pk>/", views.produto_detail, name="produto-detail"),
    path("formulas/", views.formula_list, name="formula-list"),
    path(
        "formulas/<int:formula_id>/ingredientes/",
        views.ingrediente_list,
        name="ingrediente-list",
    ),
    path("ingredientes/<int:pk>/", views.ingrediente_detail, name="ingrediente-detail"),
    path(
        "formas-farmaceuticas/",
        views.forma_farmaceutica_list,
        name="forma-farmaceutica-list",
    ),
    path("apresentacoes/", views.apresentacao_list, name="apresentacao-list"),
]
