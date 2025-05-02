from rest_framework import serializers
from .models import Produto, Formula, Ingrediente


class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = "__all__"


class ProdutoSerializer(serializers.ModelSerializer):
    formula = FormulaSerializer(read_only=True)
    formula_id = serializers.PrimaryKeyRelatedField(
        queryset=Formula.objects.all(), source="formula", write_only=True
    )

    class Meta:
        model = Produto
        fields = ["id", "nome", "descricao", "apresentacao", "formula", "formula_id"]


class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = "__all__"
