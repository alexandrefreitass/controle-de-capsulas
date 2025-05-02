from django.db import models
from sc_fornecedores.models import Fornecedor


class MateriaPrima(models.Model):
    nome = models.CharField(max_length=100)
    desc = models.TextField()


class LoteMateriaPrima(models.Model):
    materia_prima = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    lote = models.CharField(max_length=50)
    quant_total_mg = models.FloatField()
    quant_disponivel_mg = models.FloatField()
    nota_fiscal = models.CharField(max_length=50)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.CASCADE)
