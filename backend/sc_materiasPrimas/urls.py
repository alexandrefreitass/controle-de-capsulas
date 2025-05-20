from django.urls import path
from . import views

urlpatterns = [
    path("materias-primas/", views.materia_prima_list, name="materia-prima-list"),
    path(
        "materias-primas/<int:pk>/",
        views.materia_prima_detail,
        name="materia-prima-detail",
    ),
    path("lotes/", views.lote_list, name="lote-list"),
    path("lotes/<int:pk>/", views.lote_detail, name="lote-detail"),
]
