from django.db import models

# Create your models here.
from django.db import models
from sc_produtos.models import Produto
from sc_materiasPrimas.models import LoteMateriaPrima


class LoteProducao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    lote = models.CharField(max_length=50)
    lote_tamanho = models.FloatField()
    data_producao = models.DateField()


class LoteMateriaPrimaConsumida(models.Model):
    lote_producao = models.ForeignKey(
        LoteProducao, on_delete=models.CASCADE, related_name="materias_consumidas"
    )
    lote_materia_prima = models.ForeignKey(LoteMateriaPrima, on_delete=models.CASCADE)
    quant_consumida_mg = models.FloatField()
