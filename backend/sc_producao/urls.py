from django.urls import path
from . import views

urlpatterns = [
    path("producao/", views.lote_producao_list, name="lote-producao-list"),
    path("producao/<int:pk>/", views.lote_producao_detail, name="lote-producao-detail"),
]
