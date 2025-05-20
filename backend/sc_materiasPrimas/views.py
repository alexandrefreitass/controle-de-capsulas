from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MateriaPrima, LoteMateriaPrima
from sc_fornecedores.models import Fornecedor
import json


@csrf_exempt
def materia_prima_list(request):
    """Listar todas as matérias primas ou criar uma nova"""
    if request.method == "GET":
        materias_primas = list(MateriaPrima.objects.values())
        return JsonResponse(materias_primas, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            materia_prima = MateriaPrima.objects.create(
                nome=data.get("nome"), desc=data.get("desc")
            )
            return JsonResponse(
                {
                    "id": materia_prima.id,
                    "nome": materia_prima.nome,
                    "desc": materia_prima.desc,
                },
                status=201,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def materia_prima_detail(request, pk):
    """Recuperar, atualizar ou excluir uma matéria prima"""
    try:
        materia_prima = MateriaPrima.objects.get(pk=pk)
    except MateriaPrima.DoesNotExist:
        return JsonResponse({"error": "Matéria prima não encontrada"}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "id": materia_prima.id,
                "nome": materia_prima.nome,
                "desc": materia_prima.desc,
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)
        materia_prima.nome = data.get("nome", materia_prima.nome)
        materia_prima.desc = data.get("desc", materia_prima.desc)
        materia_prima.save()
        return JsonResponse(
            {
                "id": materia_prima.id,
                "nome": materia_prima.nome,
                "desc": materia_prima.desc,
            }
        )

    elif request.method == "DELETE":
        materia_prima.delete()
        return JsonResponse(
            {"message": "Matéria prima excluída com sucesso"}, status=204
        )


@csrf_exempt
def lote_list(request):
    """Listar todos os lotes ou criar um novo"""
    if request.method == "GET":
        lotes = LoteMateriaPrima.objects.all()
        lotes_data = []
        for lote in lotes:
            lotes_data.append(
                {
                    "id": lote.id,
                    "materia_prima": {
                        "id": lote.materia_prima.id,
                        "nome": lote.materia_prima.nome,
                    },
                    "lote": lote.lote,
                    "quant_total_mg": lote.quant_total_mg,
                    "quant_disponivel_mg": lote.quant_disponivel_mg,
                    "nota_fiscal": lote.nota_fiscal,
                    "fornecedor": {
                        "id": lote.fornecedor.id,
                        "razao_social": lote.fornecedor.razao_social,
                    },
                }
            )

        return JsonResponse(lotes_data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)

        # Log para debug
        print("Dados recebidos:", data)

        # Validar dados recebidos
        required_fields = [
            "materia_prima_id",
            "lote",
            "quant_total_mg",
            "quant_disponivel_mg",
            "nota_fiscal",
            "fornecedor_id",
        ]

        for field in required_fields:
            if not field in data or not data[field]:
                return JsonResponse(
                    {"error": f"O campo {field} é obrigatório.", "received_data": data},
                    status=400,
                )

        try:
            # Converter IDs para inteiros
            materia_prima_id = int(data.get("materia_prima_id"))
            fornecedor_id = int(data.get("fornecedor_id"))

            # Buscar objetos relacionados
            try:
                materia_prima = MateriaPrima.objects.get(pk=materia_prima_id)
            except MateriaPrima.DoesNotExist:
                return JsonResponse(
                    {
                        "error": f"Matéria prima com ID {materia_prima_id} não encontrada"
                    },
                    status=404,
                )

            try:
                fornecedor = Fornecedor.objects.get(pk=fornecedor_id)
            except Fornecedor.DoesNotExist:
                return JsonResponse(
                    {"error": f"Fornecedor com ID {fornecedor_id} não encontrado"},
                    status=404,
                )

            # Converter valores numéricos
            try:
                quant_total_mg = float(data.get("quant_total_mg"))
                quant_disponivel_mg = float(data.get("quant_disponivel_mg"))
            except ValueError:
                return JsonResponse(
                    {"error": "Valores de quantidade devem ser numéricos"}, status=400
                )

            # Criar o lote
            lote = LoteMateriaPrima.objects.create(
                materia_prima=materia_prima,
                lote=data.get("lote"),
                quant_total_mg=quant_total_mg,
                quant_disponivel_mg=quant_disponivel_mg,
                nota_fiscal=data.get("nota_fiscal"),
                fornecedor=fornecedor,
            )

            # Retornar dados do lote criado
            return JsonResponse(
                {
                    "id": lote.id,
                    "materia_prima": {
                        "id": lote.materia_prima.id,
                        "nome": lote.materia_prima.nome,
                    },
                    "lote": lote.lote,
                    "quant_total_mg": float(lote.quant_total_mg),
                    "quant_disponivel_mg": float(lote.quant_disponivel_mg),
                    "nota_fiscal": lote.nota_fiscal,
                    "fornecedor": {
                        "id": lote.fornecedor.id,
                        "razao_social": lote.fornecedor.razao_social,
                    },
                },
                status=201,
            )

        except Exception as e:
            import traceback

            print("Erro ao criar lote:", str(e))
            print(traceback.format_exc())
            return JsonResponse(
                {
                    "error": f"Erro ao criar lote: {str(e)}",
                    "traceback": traceback.format_exc(),
                },
                status=400,
            )


@csrf_exempt
def lote_detail(request, pk):
    """Recuperar, atualizar ou excluir um lote"""
    try:
        lote = LoteMateriaPrima.objects.get(pk=pk)
    except LoteMateriaPrima.DoesNotExist:
        return JsonResponse({"error": "Lote não encontrado"}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "id": lote.id,
                "materia_prima": {
                    "id": lote.materia_prima.id,
                    "nome": lote.materia_prima.nome,
                },
                "lote": lote.lote,
                "quant_total_mg": lote.quant_total_mg,
                "quant_disponivel_mg": lote.quant_disponivel_mg,
                "nota_fiscal": lote.nota_fiscal,
                "fornecedor": {
                    "id": lote.fornecedor.id,
                    "razao_social": lote.fornecedor.razao_social,
                },
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)

        # Atualizar campos simples
        lote.lote = data.get("lote", lote.lote)
        lote.quant_total_mg = data.get("quant_total_mg", lote.quant_total_mg)
        lote.quant_disponivel_mg = data.get(
            "quant_disponivel_mg", lote.quant_disponivel_mg
        )
        lote.nota_fiscal = data.get("nota_fiscal", lote.nota_fiscal)

        # Atualizar relações se os IDs forem fornecidos
        if "materia_prima_id" in data:
            try:
                lote.materia_prima = MateriaPrima.objects.get(
                    pk=data["materia_prima_id"]
                )
            except MateriaPrima.DoesNotExist:
                return JsonResponse(
                    {"error": "Matéria prima não encontrada"}, status=404
                )

        if "fornecedor_id" in data:
            try:
                lote.fornecedor = Fornecedor.objects.get(pk=data["fornecedor_id"])
            except Fornecedor.DoesNotExist:
                return JsonResponse({"error": "Fornecedor não encontrado"}, status=404)

        lote.save()

        return JsonResponse(
            {
                "id": lote.id,
                "materia_prima": {
                    "id": lote.materia_prima.id,
                    "nome": lote.materia_prima.nome,
                },
                "lote": lote.lote,
                "quant_total_mg": lote.quant_total_mg,
                "quant_disponivel_mg": lote.quant_disponivel_mg,
                "nota_fiscal": lote.nota_fiscal,
                "fornecedor": {
                    "id": lote.fornecedor.id,
                    "razao_social": lote.fornecedor.razao_social,
                },
            }
        )

    elif request.method == "DELETE":
        lote.delete()
        return JsonResponse({"message": "Lote excluído com sucesso"}, status=204)
