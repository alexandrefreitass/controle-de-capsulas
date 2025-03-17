from datetime import date


class ApresentacaoEnum:
    EMBALAGEM_30 = "Embalagem com 30"
    EMBALAGEM_60 = "Embalagem com 60"
    EMBALAGEM_90 = "Embalagem com 90"


class FormaFarmaceuticaEnum:
    CAPSULA_GELATINA_MOLE = "cápsula gelatina mole"
    CAPSULA_MASTIGAVEL = "cápsula mastigável"
    COMPRIMIDO = "comprimido"
    LIQUIDO = "líquido"


class Formula:
    def __init__(
        self,
        id: int,
        forma_farmaceutica: FormaFarmaceuticaEnum,
        quant_unid_padrao: int,
        quant_kg_padrao: float,
    ):
        self.id = id
        self.forma_farmaceutica = forma_farmaceutica
        self.quant_unid_padrao = quant_unid_padrao
        self.quant_kg_padrao = quant_kg_padrao
        self.ingredientes = []

    def add_ingrediente(self, ingrediente):
        self.ingredientes.append(ingrediente)

    def calcular_proporcao(self):
        total_ingredientes = len(self.ingredientes)
        if total_ingredientes == 0:
            return 0
        soma_quantidades = sum(
            ingrediente.quant_mg for ingrediente in self.ingredientes
        )
        return (soma_quantidades / total_ingredientes) * 100

    def get_ingredientes(self):
        return self.ingredientes

    def __str__(self):
        ingredientes_str = "\n".join(
            [
                f"  - {ingrediente.lote_materia_prima.materia_prima.nome} ({ingrediente.quant_mg}mg, Lote: {ingrediente.lote_materia_prima.lote}, Fornecedor: {ingrediente.lote_materia_prima.fornecedor.fantasia})"
                for ingrediente in self.ingredientes
            ]
        )
        return (
            f"Formula ID: {self.id}\n"
            f"Forma Farmacêutica: {self.forma_farmaceutica}\n"
            f"Quantidade Unidades Padrão: {self.quant_unid_padrao}\n"
            f"Quantidade KG Padrão: {self.quant_kg_padrao}\n"
            f"Ingredientes:\n{ingredientes_str}"
        )


class Ingrediente:
    def __init__(self, lote_materia_prima, quant_mg: float):
        self.lote_materia_prima = lote_materia_prima
        self.quant_mg = self._validar_quant_mg(quant_mg)

    def _validar_quant_mg(self, quant_mg: float) -> float:
        if quant_mg <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")
        return quant_mg


class MateriaPrima:
    def __init__(self, id: int, nome: str, desc: str):
        self.id = id
        self.nome = nome
        self.desc = desc

    def __str__(self):
        return (
            f"Materia Prima ID: {self.id}\n"
            f"Nome: {self.nome}\n"
            f"Descrição: {self.desc}\n"
        )


class Fornecedor:
    def __init__(self, cnpj: str, razao_social: str, fantasia: str):
        self.cnpj = cnpj
        self.razao_social = razao_social
        self.fantasia = fantasia
        self.produtos = []
        self.lotes_fornecidos = []

    def listar_produtos(self):
        """Retorna uma lista de todos os produtos que este fornecedor oferece."""
        return self.produtos

    def listar_lotes(self):
        """Retorna uma lista de todos os lotes adquiridos deste fornecedor."""
        return self.lotes_fornecidos

    def __str__(self):
        return (
            f"CNPJ: {self.cnpj}\n"
            f"Razão Social: {self.razao_social}\n"
            f"Fantasia: {self.fantasia}"
        )


class Produto:
    def __init__(
        self,
        id: int,
        nome: str,
        descricao: str,
        apresentacao: ApresentacaoEnum,
        formula: Formula,
    ):
        self.id = id
        self.nome = nome
        self.descricao = descricao
        self.apresentacao = apresentacao
        self.formula = formula

    def listar_produtos(self, produto):
        # Implementar lógica para listar produtos
        pass

    def obter_receita(self, formula: Formula):
        return formula

    def rastrear_produtos(self):
        # Implementar lógica para rastrear produtos
        pass

    def __str__(self):
        return (
            f"Produto ID: {self.id}\n"
            f"Nome: {self.nome}\n"
            f"Descrição: {self.descricao}\n"
            f"Apresentação: {self.apresentacao}\n"
            f"Formula:\n{self.formula}"
        )


class LoteMateriaPrima:
    def __init__(
        self,
        id: int,
        materia_prima: MateriaPrima,
        lote: str,
        quant_total_mg: float,
        nota_fiscal: int,
        fornecedor: Fornecedor,
    ):
        self.id = id
        self.materia_prima = materia_prima
        self.lote = lote
        self.quant_total_mg = quant_total_mg
        self.quant_disponivel_mg = quant_total_mg  # Initially, all is available
        self.nota_fiscal = nota_fiscal
        self.fornecedor = fornecedor
        # Add the lot to the supplier's list
        self.fornecedor.lotes_fornecidos.append(self)
        # Add the product to the supplier's list
        if self.materia_prima not in self.fornecedor.produtos:
            self.fornecedor.produtos.append(self.materia_prima)

    def __str__(self):
        return (
            f"Lote Matéria Prima ID: {self.id}\n"
            f"Matéria Prima: {self.materia_prima.nome}\n"
            f"Lote: {self.lote}\n"
            f"Quantidade Total: {self.quant_total_mg}mg\n"
            f"Quantidade Disponível: {self.quant_disponivel_mg}mg\n"
            f"Nota Fiscal: {self.nota_fiscal}\n"
            f"Fornecedor: {self.fornecedor.fantasia}"
        )


class LoteProducao:
    def __init__(
        self,
        id: int,
        produto: Produto,
        lote: str,
        lote_tamanho: float,
        data_producao: date,
    ):
        self.id = id
        self.produto = produto
        self.lote = lote
        self.lote_tamanho = lote_tamanho
        self.data_producao = data_producao
        self.lotes_materias_primas_consumidas = []

    def registrar_consumo(self, lote_materia_prima, quant_consumida_mg):
        if quant_consumida_mg <= 0:
            raise ValueError("A quantidade consumida deve ser maior que zero.")
        if quant_consumida_mg > lote_materia_prima.quant_disponivel_mg:
            raise ValueError(
                f"Quantidade consumida ({quant_consumida_mg}mg) maior que a quantidade disponível no lote ({lote_materia_prima.quant_disponivel_mg}mg)."
            )

        lote_materia_prima.quant_disponivel_mg -= quant_consumida_mg
        consumo = LoteMateriaPrimaConsumida(
            len(self.lotes_materias_primas_consumidas) + 1,
            self,
            lote_materia_prima,
            quant_consumida_mg,
        )
        self.lotes_materias_primas_consumidas.append(consumo)

    def __str__(self):
        consumos_str = "\n".join(
            [
                f"  - {consumo.lote_materia_prima.materia_prima.nome} (Lote: {consumo.lote_materia_prima.lote}, Quantidade: {consumo.quant_consumida_mg}mg)"
                for consumo in self.lotes_materias_primas_consumidas
            ]
        )
        return (
            f"Lote Produção ID: {self.id}\n"
            f"Produto: {self.produto.nome}\n"
            f"Lote: {self.lote}\n"
            f"Tamanho do Lote: {self.lote_tamanho}\n"
            f"Data de Produção: {self.data_producao}\n"
            f"Matérias Primas Consumidas:\n{consumos_str}"
        )


class LoteMateriaPrimaConsumida:
    def __init__(
        self,
        id: int,
        lote_producao: LoteProducao,
        lote_materia_prima: LoteMateriaPrima,
        quant_consumida_mg: float,
    ):
        self.id = id
        self.lote_producao = lote_producao
        self.lote_materia_prima = lote_materia_prima
        self.quant_consumida_mg = quant_consumida_mg

    def __str__(self):
        return (
            f"Consumo ID: {self.id}\n"
            f"Lote Produção: {self.lote_producao.lote}\n"
            f"Lote Matéria Prima: {self.lote_materia_prima.lote}\n"
            f"Quantidade Consumida: {self.quant_consumida_mg}mg"
        )


