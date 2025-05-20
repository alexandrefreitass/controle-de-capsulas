from rest_framework import viewsets
from .models import Produto, Formula, Ingrediente
from .serializers import ProdutoSerializer, FormulaSerializer, IngredienteSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    Produto,
    Formula,
    Ingrediente,
    FormaFarmaceuticaEnum,
    ApresentacaoEnum,
)
from sc_materiasPrimas.models import MateriaPrima, LoteMateriaPrima
import json


# Json na sexta-feira vai testar isso
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class FormulaViewSet(viewsets.ModelViewSet):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer


class IngredienteViewSet(viewsets.ModelViewSet):
    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer


@csrf_exempt
def produto_list(request):
    """Listar todos os produtos ou criar um novo"""
    if request.method == "GET":
        produtos = Produto.objects.all()
        produtos_data = []
        for produto in produtos:
            produtos_data.append(
                {
                    "id": produto.id,
                    "nome": produto.nome,
                    "descricao": produto.descricao,
                    "apresentacao": produto.apresentacao,
                    "formula": {
                        "id": produto.formula.id,
                        "forma_farmaceutica": produto.formula.forma_farmaceutica,
                        "quant_unid_padrao": produto.formula.quant_unid_padrao,
                        "quant_kg_padrao": produto.formula.quant_kg_padrao,
                    },
                }
            )
        return JsonResponse(produtos_data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            # Criar ou obter a fórmula
            formula_data = data.get("formula", {})
            if "id" in formula_data and formula_data["id"]:
                # Usar uma fórmula existente
                try:
                    formula = Formula.objects.get(pk=formula_data["id"])
                except Formula.DoesNotExist:
                    return JsonResponse(
                        {
                            "error": f"Fórmula com ID {formula_data['id']} não encontrada"
                        },
                        status=404,
                    )
            else:
                # Criar uma nova fórmula
                formula = Formula.objects.create(
                    forma_farmaceutica=formula_data.get("forma_farmaceutica"),
                    quant_unid_padrao=int(formula_data.get("quant_unid_padrao", 0)),
                    quant_kg_padrao=float(formula_data.get("quant_kg_padrao", 0)),
                )

            # Criar o produto
            produto = Produto.objects.create(
                nome=data.get("nome"),
                descricao=data.get("descricao", ""),
                apresentacao=data.get("apresentacao"),
                formula=formula,
            )

            # Adicionar ingredientes à fórmula, se fornecidos
            ingredientes_data = []
            if "ingredientes" in data:
                for ingrediente_data in data["ingredientes"]:
                    lote_materia_prima_id = ingrediente_data.get(
                        "lote_materia_prima_id"
                    )
                    try:
                        lote_materia_prima = LoteMateriaPrima.objects.get(
                            pk=lote_materia_prima_id
                        )
                    except LoteMateriaPrima.DoesNotExist:
                        return JsonResponse(
                            {
                                "error": f"Lote de matéria-prima com ID {lote_materia_prima_id} não encontrado"
                            },
                            status=404,
                        )

                    ingrediente = Ingrediente.objects.create(
                        formula=formula,
                        lote_materia_prima=lote_materia_prima,
                        quant_mg=float(ingrediente_data.get("quant_mg", 0)),
                    )

                    ingredientes_data.append(
                        {
                            "id": ingrediente.id,
                            "lote_materia_prima": {
                                "id": ingrediente.lote_materia_prima.id,
                                "lote": ingrediente.lote_materia_prima.lote,
                                "materia_prima": {
                                    "id": ingrediente.lote_materia_prima.materia_prima.id,
                                    "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                                },
                            },
                            "quant_mg": ingrediente.quant_mg,
                        }
                    )

            return JsonResponse(
                {
                    "id": produto.id,
                    "nome": produto.nome,
                    "descricao": produto.descricao,
                    "apresentacao": produto.apresentacao,
                    "formula": {
                        "id": formula.id,
                        "forma_farmaceutica": formula.forma_farmaceutica,
                        "quant_unid_padrao": formula.quant_unid_padrao,
                        "quant_kg_padrao": formula.quant_kg_padrao,
                        "ingredientes": ingredientes_data,
                    },
                },
                status=201,
            )

        except Exception as e:
            import traceback

            print("Erro ao criar produto:", str(e))
            print(traceback.format_exc())
            return JsonResponse(
                {"error": f"Erro ao criar produto: {str(e)}"}, status=400
            )


@csrf_exempt
def produto_detail(request, pk):
    """Recuperar, atualizar ou excluir um produto"""
    try:
        produto = Produto.objects.get(pk=pk)
    except Produto.DoesNotExist:
        return JsonResponse({"error": "Produto não encontrado"}, status=404)

    if request.method == "GET":
        # Obter ingredientes da fórmula
        ingredientes = []
        for ingrediente in produto.formula.ingredientes.all():
            ingredientes.append(
                {
                    "id": ingrediente.id,
                    "lote_materia_prima": {
                        "id": ingrediente.lote_materia_prima.id,
                        "lote": ingrediente.lote_materia_prima.lote,
                        "materia_prima": {
                            "id": ingrediente.lote_materia_prima.materia_prima.id,
                            "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                        },
                    },
                    "quant_mg": ingrediente.quant_mg,
                }
            )

        return JsonResponse(
            {
                "id": produto.id,
                "nome": produto.nome,
                "descricao": produto.descricao,
                "apresentacao": produto.apresentacao,
                "formula": {
                    "id": produto.formula.id,
                    "forma_farmaceutica": produto.formula.forma_farmaceutica,
                    "quant_unid_padrao": produto.formula.quant_unid_padrao,
                    "quant_kg_padrao": produto.formula.quant_kg_padrao,
                    "ingredientes": ingredientes,
                },
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)
        try:
            # Atualizar campos básicos do produto
            produto.nome = data.get("nome", produto.nome)
            produto.descricao = data.get("descricao", produto.descricao)
            produto.apresentacao = data.get("apresentacao", produto.apresentacao)

            # Atualizar a fórmula (campos básicos apenas)
            if "formula" in data:
                formula_data = data["formula"]
                formula = produto.formula
                formula.forma_farmaceutica = formula_data.get(
                    "forma_farmaceutica", formula.forma_farmaceutica
                )
                formula.quant_unid_padrao = int(
                    formula_data.get("quant_unid_padrao", formula.quant_unid_padrao)
                )
                formula.quant_kg_padrao = float(
                    formula_data.get("quant_kg_padrao", formula.quant_kg_padrao)
                )
                formula.save()

            produto.save()

            # Obter ingredientes atualizados
            ingredientes = []
            for ingrediente in produto.formula.ingredientes.all():
                ingredientes.append(
                    {
                        "id": ingrediente.id,
                        "lote_materia_prima": {
                            "id": ingrediente.lote_materia_prima.id,
                            "lote": ingrediente.lote_materia_prima.lote,
                            "materia_prima": {
                                "id": ingrediente.lote_materia_prima.materia_prima.id,
                                "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                            },
                        },
                        "quant_mg": ingrediente.quant_mg,
                    }
                )

            return JsonResponse(
                {
                    "id": produto.id,
                    "nome": produto.nome,
                    "descricao": produto.descricao,
                    "apresentacao": produto.apresentacao,
                    "formula": {
                        "id": produto.formula.id,
                        "forma_farmaceutica": produto.formula.forma_farmaceutica,
                        "quant_unid_padrao": produto.formula.quant_unid_padrao,
                        "quant_kg_padrao": produto.formula.quant_kg_padrao,
                        "ingredientes": ingredientes,
                    },
                }
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao atualizar produto: {str(e)}"}, status=400
            )

    elif request.method == "DELETE":
        try:
            # Deletar o produto (a fórmula é mantida, pois pode ser usada por outros produtos)
            produto.delete()
            return JsonResponse({"message": "Produto excluído com sucesso"}, status=204)
        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao excluir produto: {str(e)}"}, status=400
            )


@csrf_exempt
def formula_list(request):
    """Listar todas as fórmulas ou criar uma nova"""
    if request.method == "GET":
        formulas = Formula.objects.all()
        formulas_data = []
        for formula in formulas:
            # Obter ingredientes da fórmula
            ingredientes = []
            for ingrediente in formula.ingredientes.all():
                ingredientes.append(
                    {
                        "id": ingrediente.id,
                        "lote_materia_prima": {
                            "id": ingrediente.lote_materia_prima.id,
                            "lote": ingrediente.lote_materia_prima.lote,
                            "materia_prima": {
                                "id": ingrediente.lote_materia_prima.materia_prima.id,
                                "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                            },
                        },
                        "quant_mg": ingrediente.quant_mg,
                    }
                )

            formulas_data.append(
                {
                    "id": formula.id,
                    "forma_farmaceutica": formula.forma_farmaceutica,
                    "quant_unid_padrao": formula.quant_unid_padrao,
                    "quant_kg_padrao": formula.quant_kg_padrao,
                    "ingredientes": ingredientes,
                }
            )

        return JsonResponse(formulas_data, safe=False)


@csrf_exempt
def ingrediente_list(request, formula_id):
    """Listar ou adicionar ingredientes a uma fórmula"""
    try:
        formula = Formula.objects.get(pk=formula_id)
    except Formula.DoesNotExist:
        return JsonResponse({"error": "Fórmula não encontrada"}, status=404)

    if request.method == "GET":
        ingredientes = []
        for ingrediente in formula.ingredientes.all():
            ingredientes.append(
                {
                    "id": ingrediente.id,
                    "lote_materia_prima": {
                        "id": ingrediente.lote_materia_prima.id,
                        "lote": ingrediente.lote_materia_prima.lote,
                        "materia_prima": {
                            "id": ingrediente.lote_materia_prima.materia_prima.id,
                            "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                        },
                    },
                    "quant_mg": ingrediente.quant_mg,
                }
            )

        return JsonResponse(ingredientes, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            lote_materia_prima_id = data.get("lote_materia_prima_id")
            try:
                lote_materia_prima = LoteMateriaPrima.objects.get(
                    pk=lote_materia_prima_id
                )
            except LoteMateriaPrima.DoesNotExist:
                return JsonResponse(
                    {
                        "error": f"Lote de matéria-prima com ID {lote_materia_prima_id} não encontrado"
                    },
                    status=404,
                )

            ingrediente = Ingrediente.objects.create(
                formula=formula,
                lote_materia_prima=lote_materia_prima,
                quant_mg=float(data.get("quant_mg", 0)),
            )

            return JsonResponse(
                {
                    "id": ingrediente.id,
                    "lote_materia_prima": {
                        "id": ingrediente.lote_materia_prima.id,
                        "lote": ingrediente.lote_materia_prima.lote,
                        "materia_prima": {
                            "id": ingrediente.lote_materia_prima.materia_prima.id,
                            "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                        },
                    },
                    "quant_mg": ingrediente.quant_mg,
                },
                status=201,
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao adicionar ingrediente: {str(e)}"}, status=400
            )


@csrf_exempt
def ingrediente_detail(request, pk):
    """Recuperar, atualizar ou excluir um ingrediente"""
    try:
        ingrediente = Ingrediente.objects.get(pk=pk)
    except Ingrediente.DoesNotExist:
        return JsonResponse({"error": "Ingrediente não encontrado"}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "id": ingrediente.id,
                "formula_id": ingrediente.formula.id,
                "lote_materia_prima": {
                    "id": ingrediente.lote_materia_prima.id,
                    "lote": ingrediente.lote_materia_prima.lote,
                    "materia_prima": {
                        "id": ingrediente.lote_materia_prima.materia_prima.id,
                        "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                    },
                },
                "quant_mg": ingrediente.quant_mg,
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)
        try:
            # Atualizar apenas a quantidade
            ingrediente.quant_mg = float(data.get("quant_mg", ingrediente.quant_mg))
            ingrediente.save()

            return JsonResponse(
                {
                    "id": ingrediente.id,
                    "formula_id": ingrediente.formula.id,
                    "lote_materia_prima": {
                        "id": ingrediente.lote_materia_prima.id,
                        "lote": ingrediente.lote_materia_prima.lote,
                        "materia_prima": {
                            "id": ingrediente.lote_materia_prima.materia_prima.id,
                            "nome": ingrediente.lote_materia_prima.materia_prima.nome,
                        },
                    },
                    "quant_mg": ingrediente.quant_mg,
                }
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao atualizar ingrediente: {str(e)}"}, status=400
            )

    elif request.method == "DELETE":
        try:
            ingrediente.delete()
            return JsonResponse(
                {"message": "Ingrediente excluído com sucesso"}, status=204
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao excluir ingrediente: {str(e)}"}, status=400
            )


@csrf_exempt
def forma_farmaceutica_list(request):
    """Listar todas as formas farmacêuticas disponíveis"""
    if request.method == "GET":
        formas = []
        for forma in FormaFarmaceuticaEnum.choices:
            formas.append({"value": forma[0], "label": forma[1]})
        return JsonResponse(formas, safe=False)


@csrf_exempt
def apresentacao_list(request):
    """Listar todas as apresentações disponíveis"""
    if request.method == "GET":
        apresentacoes = []
        for apresentacao in ApresentacaoEnum.choices:
            apresentacoes.append({"value": apresentacao[0], "label": apresentacao[1]})
        return JsonResponse(apresentacoes, safe=False)
