from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MateriaPrima, LoteMateriaPrima
from sc_fornecedores.models import Fornecedor
import json
from django.utils import timezone


@csrf_exempt
def materia_prima_list(request):
    """Listar todas as matérias primas ou criar uma nova"""
    if request.method == "GET":
        materias_primas = MateriaPrima.objects.all()
        materias_primas_data = []
        for mp in materias_primas:
            materias_primas_data.append(
                {
                    "id": mp.id,
                    "cod_interno": mp.cod_interno,
                    "nome": mp.nome,
                    "desc": mp.desc,
                    "lote": mp.lote,
                    "nota_fiscal": mp.nota_fiscal,
                    "fornecedor": {
                        "id": mp.fornecedor.id,
                        "razao_social": mp.fornecedor.razao_social,
                    },
                    "data_fabricacao": mp.data_fabricacao,
                    "data_validade": mp.data_validade,
                    "dias_validade_apos_aberto": mp.dias_validade_apos_aberto,
                    "data_util": mp.data_util,
                    "embalagem_aberta": mp.embalagem_aberta,
                    "quantidade_disponivel": mp.quantidade_disponivel,
                    "unidade_medida": mp.unidade_medida,
                    "categoria": mp.categoria,
                    "status": mp.status,
                    "preco_unitario": float(mp.preco_unitario),
                }
            )
        return JsonResponse(materias_primas_data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            # Validar campos obrigatórios
            required_fields = [
                "cod_interno",
                "nome",
                "lote",
                "nota_fiscal",
                "fornecedor_id",
                "data_fabricacao",
                "data_validade",
            ]

            for field in required_fields:
                if not field in data or not data[field]:
                    return JsonResponse(
                        {
                            "error": f"O campo {field} é obrigatório.",
                            "received_data": data,
                        },
                        status=400,
                    )

            # Buscar fornecedor
            try:
                fornecedor = Fornecedor.objects.get(pk=data.get("fornecedor_id"))
            except Fornecedor.DoesNotExist:
                return JsonResponse(
                    {
                        "error": f"Fornecedor com ID {data.get('fornecedor_id')} não encontrado"
                    },
                    status=404,
                )

            # Criar a matéria prima
            materia_prima = MateriaPrima.objects.create(
                cod_interno=data.get("cod_interno"),
                nome=data.get("nome"),
                desc=data.get("desc", ""),
                lote=data.get("lote"),
                nota_fiscal=data.get("nota_fiscal"),
                fornecedor=fornecedor,
                data_fabricacao=data.get("data_fabricacao"),
                data_validade=data.get("data_validade"),
                dias_validade_apos_aberto=data.get("dias_validade_apos_aberto", 30),
                embalagem_aberta=data.get("embalagem_aberta", False),
                quantidade_disponivel=data.get("quantidade_disponivel", 0),
                unidade_medida=data.get("unidade_medida", "kg"),
                categoria=data.get("categoria", ""),
                condicao_armazenamento=data.get("condicao_armazenamento", ""),
                localizacao=data.get("localizacao", ""),
                status=data.get("status", "disponível"),
                preco_unitario=data.get("preco_unitario", 0),
            )

            # Se a embalagem estiver aberta, definir a data de abertura
            if materia_prima.embalagem_aberta:
                materia_prima.definir_data_abertura_embalagem()
                materia_prima.definir_data_util()

            return JsonResponse(
                {
                    "id": materia_prima.id,
                    "cod_interno": materia_prima.cod_interno,
                    "nome": materia_prima.nome,
                    "desc": materia_prima.desc,
                    "lote": materia_prima.lote,
                    "nota_fiscal": materia_prima.nota_fiscal,
                    "fornecedor": {
                        "id": materia_prima.fornecedor.id,
                        "razao_social": materia_prima.fornecedor.razao_social,
                    },
                    "data_fabricacao": materia_prima.data_fabricacao,
                    "data_validade": materia_prima.data_validade,
                    "data_util": materia_prima.data_util,
                    "quantidade_disponivel": materia_prima.quantidade_disponivel,
                    "status": materia_prima.status,
                },
                status=201,
            )
        except Exception as e:
            import traceback

            print("Erro ao criar matéria prima:", str(e))
            print(traceback.format_exc())
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
                "cod_interno": materia_prima.cod_interno,
                "nome": materia_prima.nome,
                "desc": materia_prima.desc,
                "lote": materia_prima.lote,
                "nota_fiscal": materia_prima.nota_fiscal,
                "fornecedor": {
                    "id": materia_prima.fornecedor.id,
                    "razao_social": materia_prima.fornecedor.razao_social,
                },
                "data_fabricacao": materia_prima.data_fabricacao,
                "data_validade": materia_prima.data_validade,
                "dias_validade_apos_aberto": materia_prima.dias_validade_apos_aberto,
                "data_abertura_embalagem": materia_prima.data_abertura_embalagem,
                "data_util": materia_prima.data_util,
                "embalagem_aberta": materia_prima.embalagem_aberta,
                "quantidade_disponivel": materia_prima.quantidade_disponivel,
                "unidade_medida": materia_prima.unidade_medida,
                "categoria": materia_prima.categoria,
                "condicao_armazenamento": materia_prima.condicao_armazenamento,
                "localizacao": materia_prima.localizacao,
                "status": materia_prima.status,
                "preco_unitario": float(materia_prima.preco_unitario),
                "data_entrada": materia_prima.data_entrada,
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)

        # Atualizar campos simples
        for field in [
            "nome",
            "desc",
            "lote",
            "nota_fiscal",
            "data_fabricacao",
            "data_validade",
            "dias_validade_apos_aberto",
            "quantidade_disponivel",
            "unidade_medida",
            "categoria",
            "condicao_armazenamento",
            "localizacao",
            "status",
            "preco_unitario",
            "cod_interno",
        ]:
            if field in data:
                setattr(materia_prima, field, data[field])

        # Atualizar fornecedor se informado
        if "fornecedor_id" in data:
            try:
                materia_prima.fornecedor = Fornecedor.objects.get(
                    pk=data["fornecedor_id"]
                )
            except Fornecedor.DoesNotExist:
                return JsonResponse({"error": "Fornecedor não encontrado"}, status=404)

        # Tratamento especial para embalagem aberta
        if "embalagem_aberta" in data:
            was_closed = not materia_prima.embalagem_aberta
            materia_prima.embalagem_aberta = data["embalagem_aberta"]

            # Se estava fechada e agora está aberta, definir data de abertura
            if was_closed and materia_prima.embalagem_aberta:
                materia_prima.definir_data_abertura_embalagem()
                materia_prima.definir_data_util()

        materia_prima.save()
        materia_prima.verificar_validade()  # Atualiza o status com base na validade

        return JsonResponse(
            {
                "id": materia_prima.id,
                "cod_interno": materia_prima.cod_interno,
                "nome": materia_prima.nome,
                "desc": materia_prima.desc,
                "lote": materia_prima.lote,
                "nota_fiscal": materia_prima.nota_fiscal,
                "fornecedor": {
                    "id": materia_prima.fornecedor.id,
                    "razao_social": materia_prima.fornecedor.razao_social,
                },
                "data_fabricacao": materia_prima.data_fabricacao,
                "data_validade": materia_prima.data_validade,
                "data_util": materia_prima.data_util,
                "embalagem_aberta": materia_prima.embalagem_aberta,
                "quantidade_disponivel": materia_prima.quantidade_disponivel,
                "status": materia_prima.status,
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
                    "numero_lote": lote.numero_lote,
                    "data_fabricacao": lote.data_fabricacao,
                    "data_validade": lote.data_validade,
                    "nota_fiscal": lote.nota_fiscal,
                    "quant_recebida_kg": lote.quant_recebida_kg,
                    "quant_disponivel_kg": lote.quant_disponivel_kg,
                    "status": lote.status,
                    "data_recebimento": lote.data_recebimento,
                    "fornecedor": (
                        {
                            "id": lote.fornecedor.id,
                            "razao_social": lote.fornecedor.razao_social,
                        }
                        if lote.fornecedor
                        else None
                    ),
                    "local_armazenamento": lote.local_armazenamento,
                    "embalagem_original_aberta": lote.embalagem_original_aberta,
                }
            )

        return JsonResponse(lotes_data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        try:
            # Validar campos obrigatórios
            required_fields = [
                "materia_prima_id",
                "numero_lote",
                "data_fabricacao",
                "data_validade",
                "quant_recebida_kg",
            ]

            for field in required_fields:
                if not field in data or not data[field]:
                    return JsonResponse(
                        {"error": f"O campo {field} é obrigatório."},
                        status=400,
                    )

            # Buscar matéria prima
            try:
                materia_prima = MateriaPrima.objects.get(
                    pk=data.get("materia_prima_id")
                )
            except MateriaPrima.DoesNotExist:
                return JsonResponse(
                    {
                        "error": f"Matéria prima com ID {data.get('materia_prima_id')} não encontrada"
                    },
                    status=404,
                )

            # Buscar fornecedor se fornecido
            fornecedor = None
            if "fornecedor_id" in data and data["fornecedor_id"]:
                try:
                    fornecedor = Fornecedor.objects.get(pk=data["fornecedor_id"])
                except Fornecedor.DoesNotExist:
                    return JsonResponse(
                        {
                            "error": f"Fornecedor com ID {data.get('fornecedor_id')} não encontrado"
                        },
                        status=404,
                    )

            # Criar o lote
            lote = LoteMateriaPrima.objects.create(
                materia_prima=materia_prima,
                numero_lote=data["numero_lote"],
                data_fabricacao=data["data_fabricacao"],
                data_validade=data["data_validade"],
                nota_fiscal=data.get("nota_fiscal", ""),
                quant_recebida_kg=data["quant_recebida_kg"],
                quant_disponivel_kg=data[
                    "quant_recebida_kg"
                ],  # Inicialmente igual à quantidade recebida
                fornecedor=fornecedor,
                local_armazenamento=data.get("local_armazenamento", ""),
                condicoes_armazenamento=data.get("condicoes_armazenamento", ""),
                observacoes=data.get("observacoes", ""),
                aprovado_controle_qualidade=data.get(
                    "aprovado_controle_qualidade", False
                ),
            )

            # Atualizar matéria prima com quantidade recebida
            materia_prima.adicionar_estoque(float(data["quant_recebida_kg"]))

            return JsonResponse(
                {
                    "id": lote.id,
                    "materia_prima": {
                        "id": lote.materia_prima.id,
                        "nome": lote.materia_prima.nome,
                    },
                    "numero_lote": lote.numero_lote,
                    "data_fabricacao": lote.data_fabricacao,
                    "data_validade": lote.data_validade,
                    "quant_disponivel_kg": lote.quant_disponivel_kg,
                    "status": lote.status,
                },
                status=201,
            )

        except Exception as e:
            import traceback

            print("Erro ao criar lote:", str(e))
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=400)


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
                    "cod_interno": lote.materia_prima.cod_interno,
                },
                "numero_lote": lote.numero_lote,
                "data_fabricacao": lote.data_fabricacao,
                "data_validade": lote.data_validade,
                "nota_fiscal": lote.nota_fiscal,
                "quant_recebida_kg": lote.quant_recebida_kg,
                "quant_disponivel_kg": lote.quant_disponivel_kg,
                "data_recebimento": lote.data_recebimento,
                "aprovado_controle_qualidade": lote.aprovado_controle_qualidade,
                "data_aprovacao": lote.data_aprovacao,
                "responsavel_aprovacao": lote.responsavel_aprovacao,
                "observacoes": lote.observacoes,
                "local_armazenamento": lote.local_armazenamento,
                "condicoes_armazenamento": lote.condicoes_armazenamento,
                "embalagem_original_aberta": lote.embalagem_original_aberta,
                "data_abertura_embalagem": lote.data_abertura_embalagem,
                "codigo_rastreabilidade": lote.codigo_rastreabilidade,
                "fornecedor": (
                    {
                        "id": lote.fornecedor.id,
                        "razao_social": lote.fornecedor.razao_social,
                    }
                    if lote.fornecedor
                    else None
                ),
                "status": lote.status,
                "dias_ate_vencimento": lote.calcular_dias_ate_vencimento(),
            }
        )

    elif request.method == "PUT":
        data = json.loads(request.body)

        # Atualizar campos simples
        simple_fields = [
            "numero_lote",
            "data_fabricacao",
            "data_validade",
            "nota_fiscal",
            "local_armazenamento",
            "condicoes_armazenamento",
            "observacoes",
            "codigo_rastreabilidade",
            "responsavel_aprovacao",
        ]

        for field in simple_fields:
            if field in data:
                setattr(lote, field, data[field])

        # Campos especiais
        if "aprovado_controle_qualidade" in data:
            was_not_approved = not lote.aprovado_controle_qualidade
            lote.aprovado_controle_qualidade = data["aprovado_controle_qualidade"]

            # Se acabou de ser aprovado, registrar a data de aprovação
            if was_not_approved and lote.aprovado_controle_qualidade:
                lote.data_aprovacao = timezone.now().date()

        # Tratar abertura de embalagem
        if (
            "embalagem_original_aberta" in data
            and data["embalagem_original_aberta"]
            and not lote.embalagem_original_aberta
        ):
            lote.abrir_embalagem()

        lote.save()

        return JsonResponse(
            {
                "id": lote.id,
                "materia_prima": {
                    "id": lote.materia_prima.id,
                    "nome": lote.materia_prima.nome,
                },
                "numero_lote": lote.numero_lote,
                "status": lote.status,
                "quant_disponivel_kg": lote.quant_disponivel_kg,
                "aprovado_controle_qualidade": lote.aprovado_controle_qualidade,
            }
        )

    elif request.method == "DELETE":
        materia_prima = lote.materia_prima
        quantidade_a_remover = lote.quant_disponivel_kg

        # Remover quantidade do estoque da matéria prima antes de deletar o lote
        if quantidade_a_remover > 0:
            try:
                materia_prima.atualizar_quantidade(quantidade_a_remover)
            except ValueError:
                # Se não houver quantidade suficiente, apenas ajustar para zero
                materia_prima.quantidade_disponivel = max(
                    0, materia_prima.quantidade_disponivel - quantidade_a_remover
                )
                materia_prima.save()

        lote.delete()
        return JsonResponse({"message": "Lote excluído com sucesso"}, status=204)


@csrf_exempt
def atualizar_estoque(request, pk):
    """Endpoint para adicionar ou subtrair estoque"""
    try:
        materia_prima = MateriaPrima.objects.get(pk=pk)
    except MateriaPrima.DoesNotExist:
        return JsonResponse({"error": "Matéria prima não encontrada"}, status=404)

    if request.method == "POST":
        data = json.loads(request.body)

        try:
            quantidade = float(data.get("quantidade", 0))
            operacao = data.get("operacao", "")

            if operacao == "adicionar":
                materia_prima.adicionar_estoque(quantidade)
                mensagem = f"Adicionado {quantidade} {materia_prima.unidade_medida}(s) ao estoque"
            elif operacao == "subtrair":
                materia_prima.atualizar_quantidade(quantidade)
                mensagem = f"Removido {quantidade} {materia_prima.unidade_medida}(s) do estoque"
            else:
                return JsonResponse(
                    {"error": "Operação inválida. Use 'adicionar' ou 'subtrair'"},
                    status=400,
                )

            return JsonResponse(
                {
                    "id": materia_prima.id,
                    "nome": materia_prima.nome,
                    "quantidade_disponivel": materia_prima.quantidade_disponivel,
                    "status": materia_prima.status,
                    "mensagem": mensagem,
                }
            )

        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao atualizar estoque: {str(e)}"}, status=500
            )


@csrf_exempt
def registrar_abertura_embalagem(request, pk):
    """Endpoint para registrar a abertura de uma embalagem"""
    try:
        materia_prima = MateriaPrima.objects.get(pk=pk)
    except MateriaPrima.DoesNotExist:
        return JsonResponse({"error": "Matéria prima não encontrada"}, status=404)

    if request.method == "POST":
        if materia_prima.embalagem_aberta:
            return JsonResponse({"error": "Embalagem já está aberta"}, status=400)

        materia_prima.abrir_embalagem()

        return JsonResponse(
            {
                "id": materia_prima.id,
                "nome": materia_prima.nome,
                "embalagem_aberta": materia_prima.embalagem_aberta,
                "data_abertura_embalagem": materia_prima.data_abertura_embalagem,
                "data_util": materia_prima.data_util,
                "mensagem": "Embalagem marcada como aberta com sucesso",
            }
        )


@csrf_exempt
def lote_estoque(request, pk):
    """Endpoint para gerenciar o estoque de um lote específico"""
    try:
        lote = LoteMateriaPrima.objects.get(pk=pk)
    except LoteMateriaPrima.DoesNotExist:
        return JsonResponse({"error": "Lote não encontrado"}, status=404)

    if request.method == "POST":
        data = json.loads(request.body)

        try:
            quantidade = float(data.get("quantidade", 0))
            operacao = data.get("operacao", "")

            materia_prima = lote.materia_prima

            if operacao == "adicionar":
                lote.adicionar_quantidade(quantidade)
                materia_prima.adicionar_estoque(quantidade)
                mensagem = f"Adicionado {quantidade}kg ao lote"
            elif operacao == "consumir":
                lote.consumir_quantidade(quantidade)
                materia_prima.atualizar_quantidade(quantidade)
                mensagem = f"Consumido {quantidade}kg do lote"
            else:
                return JsonResponse(
                    {"error": "Operação inválida. Use 'adicionar' ou 'consumir'"},
                    status=400,
                )

            return JsonResponse(
                {
                    "id": lote.id,
                    "materia_prima": {
                        "id": materia_prima.id,
                        "nome": materia_prima.nome,
                    },
                    "numero_lote": lote.numero_lote,
                    "quant_disponivel_kg": lote.quant_disponivel_kg,
                    "quant_disponivel_materia_prima": materia_prima.quantidade_disponivel,
                    "status": lote.status,
                    "mensagem": mensagem,
                }
            )

        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse(
                {"error": f"Erro ao atualizar estoque: {str(e)}"}, status=500
            )
