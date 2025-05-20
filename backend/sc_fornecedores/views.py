from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Fornecedor
import json


@csrf_exempt
def fornecedor_list(request):
    """Listar todos os fornecedores ou criar um novo"""
    if request.method == "GET":
        fornecedores = list(Fornecedor.objects.values())
        return JsonResponse(fornecedores, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            fornecedor = Fornecedor.objects.create(
                cnpj=data.get("cnpj"),
                razao_social=data.get("razao_social"),
                fantasia=data.get("fantasia"),
            )
            return JsonResponse(
                {
                    "id": fornecedor.id,
                    "cnpj": fornecedor.cnpj,
                    "razao_social": fornecedor.razao_social,
                    "fantasia": fornecedor.fantasia,
                },
                status=201,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def fornecedor_detail(request, pk):
    """Recuperar, atualizar ou excluir um fornecedor"""
    try:
        fornecedor = Fornecedor.objects.get(pk=pk)
    except Fornecedor.DoesNotExist:
        return JsonResponse({"error": "Fornecedor não encontrado"}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "id": fornecedor.id,
                "cnpj": fornecedor.cnpj,
                "razao_social": fornecedor.razao_social,
                "fantasia": fornecedor.fantasia,
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)
        fornecedor.cnpj = data.get("cnpj", fornecedor.cnpj)
        fornecedor.razao_social = data.get("razao_social", fornecedor.razao_social)
        fornecedor.fantasia = data.get("fantasia", fornecedor.fantasia)
        fornecedor.save()
        return JsonResponse(
            {
                "id": fornecedor.id,
                "cnpj": fornecedor.cnpj,
                "razao_social": fornecedor.razao_social,
                "fantasia": fornecedor.fantasia,
            }
        )

    elif request.method == "DELETE":
        fornecedor.delete()
        return JsonResponse({"message": "Fornecedor excluído com sucesso"}, status=204)
