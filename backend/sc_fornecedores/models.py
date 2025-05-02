from django.db import models


class Fornecedor(models.Model):
    cnpj = models.CharField(max_length=18, unique=True)
    razao_social = models.CharField(max_length=200)
    fantasia = models.CharField(max_length=100)
