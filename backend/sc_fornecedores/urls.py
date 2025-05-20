from django.urls import path
from . import views

urlpatterns = [
    path("fornecedores/", views.fornecedor_list, name="fornecedor-list"),
    path("fornecedores/<int:pk>/", views.fornecedor_detail, name="fornecedor-detail"),
]
