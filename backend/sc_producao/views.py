from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import LoteProducao, LoteMateriaPrimaConsumida
from sc_produtos.models import Produto
from sc_materiasPrimas.models import LoteMateriaPrima
import json
from datetime import datetime


@csrf_exempt
def lote_producao_list(request):
    """Listar todos os lotes de produção ou criar um novo"""
    if request.method == "GET":
        lotes = LoteProducao.objects.all()
        lotes_data = []
        for lote in lotes:
            # Obter materiais consumidos para este lote
            materiais_consumidos = []
            for material in lote.materias_consumidas.all():
                materiais_consumidos.append(
                    {
                        "id": material.id,
                        "lote_materia_prima": {
                            "id": material.lote_materia_prima.id,
                            "lote": material.lote_materia_prima.lote,
                            "materia_prima": {
                                "id": material.lote_materia_prima.materia_prima.id,
                                "nome": material.lote_materia_prima.materia_prima.nome,
                            },
                        },
                        "quant_consumida_mg": material.quant_consumida_mg,
                    }
                )

            lotes_data.append(
                {
                    "id": lote.id,
                    "produto": {"id": lote.produto.id, "nome": lote.produto.nome},
                    "lote": lote.lote,
                    "lote_tamanho": lote.lote_tamanho,
                    "data_producao": lote.data_producao.strftime("%Y-%m-%d"),
                    "materiais_consumidos": materiais_consumidos,
                }
            )

        return JsonResponse(lotes_data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            # Obter o produto
            produto_id = int(data.get("produto_id"))
            try:
                produto = Produto.objects.get(pk=produto_id)
            except Produto.DoesNotExist:
                return JsonResponse(
                    {"error": f"Produto com ID {produto_id} não encontrado"}, status=404
                )

            # Converter data
            try:
                data_producao = datetime.strptime(
                    data.get("data_producao"), "%Y-%m-%d"
                ).date()
            except ValueError:
                return JsonResponse(
                    {"error": "Formato de data inválido. Use YYYY-MM-DD"}, status=400
                )

            # Criar o lote de produção
            lote = LoteProducao.objects.create(
                produto=produto,
                lote=data.get("lote"),
                lote_tamanho=float(data.get("lote_tamanho")),
                data_producao=data_producao,
            )

            # Processar as matérias-primas consumidas
            materiais_consumidos = []
            if "materiais_consumidos" in data:
                for material_data in data["materiais_consumidos"]:
                    lote_materia_prima_id = int(
                        material_data.get("lote_materia_prima_id")
                    )
                    quant_consumida_mg = float(material_data.get("quant_consumida_mg"))

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

                    # Verificar se há quantidade suficiente
                    if lote_materia_prima.quant_disponivel_mg < quant_consumida_mg:
                        return JsonResponse(
                            {
                                "error": f"Quantidade insuficiente para o lote de matéria-prima {lote_materia_prima.lote}. Disponível: {lote_materia_prima.quant_disponivel_mg}mg"
                            },
                            status=400,
                        )

                    # Criar o consumo
                    material_consumido = LoteMateriaPrimaConsumida.objects.create(
                        lote_producao=lote,
                        lote_materia_prima=lote_materia_prima,
                        quant_consumida_mg=quant_consumida_mg,
                    )

                    # Atualizar a quantidade disponível
                    lote_materia_prima.quant_disponivel_mg -= quant_consumida_mg
                    lote_materia_prima.save()

                    materiais_consumidos.append(
                        {
                            "id": material_consumido.id,
                            "lote_materia_prima": {
                                "id": lote_materia_prima.id,
                                "lote": lote_materia_prima.lote,
                                "materia_prima": {
                                    "id": lote_materia_prima.materia_prima.id,
                                    "nome": lote_materia_prima.materia_prima.nome,
                                },
                            },
                            "quant_consumida_mg": material_consumido.quant_consumida_mg,
                        }
                    )

            return JsonResponse(
                {
                    "id": lote.id,
                    "produto": {"id": lote.produto.id, "nome": lote.produto.nome},
                    "lote": lote.lote,
                    "lote_tamanho": lote.lote_tamanho,
                    "data_producao": lote.data_producao.strftime("%Y-%m-%d"),
                    "materiais_consumidos": materiais_consumidos,
                },
                status=201,
            )

        except Exception as e:
            import traceback

            print("Erro ao criar lote de produção:", str(e))
            print(traceback.format_exc())
            return JsonResponse(
                {"error": f"Erro ao criar lote de produção: {str(e)}"}, status=400
            )


@csrf_exempt
def lote_producao_detail(request, pk):
    """Recuperar, atualizar ou excluir um lote de produção"""
    try:
        lote = LoteProducao.objects.get(pk=pk)
    except LoteProducao.DoesNotExist:
        return JsonResponse({"error": "Lote de produção não encontrado"}, status=404)

    if request.method == "GET":
        # Obter materiais consumidos para este lote
        materiais_consumidos = []
        for material in lote.materias_consumidas.all():
            materiais_consumidos.append(
                {
                    "id": material.id,
                    "lote_materia_prima": {
                        "id": material.lote_materia_prima.id,
                        "lote": material.lote_materia_prima.lote,
                        "materia_prima": {
                            "id": material.lote_materia_prima.materia_prima.id,
                            "nome": material.lote_materia_prima.materia_prima.nome,
                        },
                    },
                    "quant_consumida_mg": material.quant_consumida_mg,
                }
            )

        return JsonResponse(
            {
                "id": lote.id,
                "produto": {"id": lote.produto.id, "nome": lote.produto.nome},
                "lote": lote.lote,
                "lote_tamanho": lote.lote_tamanho,
                "data_producao": lote.data_producao.strftime("%Y-%m-%d"),
                "materiais_consumidos": materiais_consumidos,
            }
        )

    elif request.method == "DELETE":
        # Antes de excluir, reverter as quantidades consumidas de matérias-primas
        for material in lote.materias_consumidas.all():
            lote_materia_prima = material.lote_materia_prima
            lote_materia_prima.quant_disponivel_mg += material.quant_consumida_mg
            lote_materia_prima.save()

        lote.delete()
        return JsonResponse(
            {"message": "Lote de produção excluído com sucesso"}, status=204
        )

    elif request.method == "PUT":
        data = json.loads(request.body)

        # Atualização não permite mudar o produto nem materiais consumidos
        # (isso exigiria uma lógica mais complexa para reverter quantidades)
        try:
            # Atualizar campos simples
            lote.lote = data.get("lote", lote.lote)
            lote.lote_tamanho = float(data.get("lote_tamanho", lote.lote_tamanho))

            # Atualizar data se fornecida
            if "data_producao" in data:
                try:
                    lote.data_producao = datetime.strptime(
                        data.get("data_producao"), "%Y-%m-%d"
                    ).date()
                except ValueError:
                    return JsonResponse(
                        {"error": "Formato de data inválido. Use YYYY-MM-DD"},
                        status=400,
                    )

            lote.save()

            # Obter materiais consumidos para este lote
            materiais_consumidos = []
            for material in lote.materias_consumidas.all():
                materiais_consumidos.append(
                    {
                        "id": material.id,
                        "lote_materia_prima": {
                            "id": material.lote_materia_prima.id,
                            "lote": material.lote_materia_prima.lote,
                            "materia_prima": {
                                "id": material.lote_materia_prima.materia_prima.id,
                                "nome": material.lote_materia_prima.materia_prima.nome,
                            },
                        },
                        "quant_consumida_mg": material.quant_consumida_mg,
                    }
                )

            return JsonResponse(
                {
                    "id": lote.id,
                    "produto": {"id": lote.produto.id, "nome": lote.produto.nome},
                    "lote": lote.lote,
                    "lote_tamanho": lote.lote_tamanho,
                    "data_producao": lote.data_producao.strftime("%Y-%m-%d"),
                    "materiais_consumidos": materiais_consumidos,
                }
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao atualizar lote de produção: {str(e)}"}, status=400
            )
