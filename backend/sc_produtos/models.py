from django.db import models
from sc_materiasPrimas.models import LoteMateriaPrima


class ApresentacaoEnum(models.TextChoices):
    EMBALAGEM_30 = "Embalagem com 30 unidades"
    EMBALAGEM_60 = "Embalagem com 60 unidades"
    EMBALAGEM_90 = "Embalagem com 90 unidades"
    EMBALAGEM_120 = "Embalagem com 120 unidades"


class FormaFarmaceuticaEnum(models.TextChoices):
    CAPSULA_GELATINA_MOLE = "cápsula gelatina mole"
    CAPSULA_MASTIGAVEL = "cápsula mastigável"
    COMPRIMIDO = "comprimido"
    LIQUIDO = "líquido"


class Formula(models.Model):
    forma_farmaceutica = models.CharField(
        max_length=30, choices=FormaFarmaceuticaEnum.choices
    )
    quant_unid_padrao = models.IntegerField()
    quant_kg_padrao = models.FloatField()


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    apresentacao = models.CharField(max_length=30, choices=ApresentacaoEnum.choices)
    formula = models.ForeignKey(
        Formula, on_delete=models.CASCADE, related_name="produtos"
    )


class Ingrediente(models.Model):
    formula = models.ForeignKey(
        Formula, on_delete=models.CASCADE, related_name="ingredientes"
    )
    lote_materia_prima = models.ForeignKey(LoteMateriaPrima, on_delete=models.CASCADE)
    quant_mg = models.FloatField()
