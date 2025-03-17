from datetime import date

class ApresentacaoEnum:
    EMBALAGEM_30 = 'Embalagem com 30'
    EMBALAGEM_60 = 'Embalagem com 60'
    EMBALAGEM_90 = 'Embalagem com 90'

class FormaFarmaceuticaEnum:
    CAPSULA_GELATINA_MOLE = 'cápsula gelatina mole'
    CAPSULA_MASTIGAVEL = 'cápsula mastigável'
    COMPRIMIDO = 'comprimido'
    LIQUIDO = 'líquido'

class Formula:
    def __init__(self, id: int, forma_farmaceutica: FormaFarmaceuticaEnum, quant_unid_padrao: int, quant_kg_padrao: float):
        self.id = id
        self.forma_farmaceutica = forma_farmaceutica
        self.quant_unid_padrao = quant_unid_padrao
        self.quant_kg_padrao = quant_kg_padrao
        self.ingredientes =[]

    def add_ingrediente(self, ingrediente):
        self.ingredientes.append(ingrediente)

    def calcular_proporcao(self):
        total_ingredientes = len(self.ingredientes)
        if total_ingredientes == 0:
            return 0
        soma_quantidades = sum(ingrediente.quant_mg for ingrediente in self.ingredientes)
        return (soma_quantidades / total_ingredientes) * 100
    
    def get_ingredientes(self):
        return self.ingredientes
    
    def __str__(self):
        ingredientes_str = "\n".join([f"  - {ingrediente.materia_prima.nome} ({ingrediente.quant_mg}mg, Lote: {ingrediente.lote}, Fornecedor: {ingrediente.fornecedor.fantasia})" for ingrediente in self.ingredientes])
        return (
            f"Formula ID: {self.id}\n"
            f"Forma Farmacêutica: {self.forma_farmaceutica}\n"
            f"Quantidade Unidades Padrão: {self.quant_unid_padrao}\n"
            f"Quantidade KG Padrão: {self.quant_kg_padrao}\n"
            f"Ingredientes:\n{ingredientes_str}"
        )

class Ingrediente:
    def __init__(self, materia_prima, quant_mg: float, lote: str, fornecedor):
        self.materia_prima = materia_prima
        self.quant_mg = self._validar_quant_mg(quant_mg) 
        self.lote = lote
        self.fornecedor = fornecedor

    def _validar_quant_mg(self, quant_mg: float) -> float:
        if quant_mg <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")
        return quant_mg


class MateriaPrima:
    def __init__(self, id: int, nome: str, desc: str, lote: str, nota_fiscal: int, fornecedor):
        self.id = id
        self.nome = nome
        self.desc = desc
        self.lote = lote
        self.nota_fiscal = nota_fiscal
        self.fornecedor = fornecedor

    def method(self, type):
        return type
    
    def __str__(self):
        return (
            f"Materia Prima ID: {self.id}\n"
            f"Nome: {self.nome}\n"
            f"Descrição: {self.desc}\n"
            f"Lote: {self.lote}\n"
            f"Nota Fiscal: {self.nota_fiscal}\n"
            f"Fornecedor: {self.fornecedor.fantasia}"
        )

class Fornecedor:
    def __init__(self, cnpj: str, razao_social: str, fantasia: str):
        self.cnpj = cnpj
        self.razao_social = razao_social
        self.fantasia = fantasia
        self.produtos = []
        self.lotes_fornecidos = []

    def listar_lotes(self):
        # Implementar lógica para listar lotes
        pass

    def listar_produtos(self):
        # Implementar lógica para listar produtos
        pass
    
    def __str__(self):
        return (
            f"CNPJ: {self.cnpj}\n"
            f"Razão Social: {self.razao_social}\n"
            f"Fantasia: {self.fantasia}"
        )

class Produto:
    def __init__(self, id: int, nome: str, lote: str, lote_tamanho: float, descricao: str,
                 apresentacao: ApresentacaoEnum, formula: Formula, validade: date):
        self.id = id
        self.nome = nome
        self.lote = lote
        self.lote_tamanho = lote_tamanho
        self.descricao = descricao
        self.apresentacao = apresentacao
        self.formula = formula
        self.validade = validade

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
            f"Lote: {self.lote}\n"
            f"Tamanho do Lote: {self.lote_tamanho}\n"
            f"Descrição: {self.descricao}\n"
            f"Apresentação: {self.apresentacao}\n"
            f"Validade: {self.validade}\n"
            f"Formula:\n{self.formula}"
        )

# Exemplo de uso - Criando uma fórmula complexa
fornecedor_a = Fornecedor("1234567890001", "Empresa A", "Empresa A")
fornecedor_b = Fornecedor("9876543210001", "Empresa B", "Empresa B")
fornecedor_c = Fornecedor("11223344550001", "Empresa C", "Empresa C")
fornecedor_d = Fornecedor("99887766550001", "Empresa D", "Empresa D")

# Matérias-primas
vitamina_c = MateriaPrima(1, "Vitamina C", "Ácido Ascórbico", "L123", 12345, fornecedor_a)
vitamina_d = MateriaPrima(2, "Vitamina D3", "Colecalciferol", "L456", 67890, fornecedor_b)
zinco = MateriaPrima(3, "Zinco", "Sulfato de Zinco", "L789", 13579, fornecedor_c)
magnesio = MateriaPrima(4, "Magnésio", "Cloreto de Magnésio", "L987", 24680, fornecedor_d)
excipiente = MateriaPrima(5, "Excipiente", "Celulose Microcristalina", "L654", 11223, fornecedor_a)
agua = MateriaPrima(6, "Água Purificada", "H2O", "L321", 33445, fornecedor_b)

# Fórmula complexa para um suplemento multivitamínico e mineral
formula_complexa = Formula(2, FormaFarmaceuticaEnum.COMPRIMIDO, 60, 0.8)

# Ingredientes
ingrediente_vitamina_c = Ingrediente(vitamina_c, 250.0, "L111", fornecedor_a)
ingrediente_vitamina_d = Ingrediente(vitamina_d, 20.0, "L222", fornecedor_b)
ingrediente_zinco = Ingrediente(zinco, 10.0, "L333", fornecedor_c)
ingrediente_magnesio = Ingrediente(magnesio, 50.0, "L444", fornecedor_d)
ingrediente_excipiente = Ingrediente(excipiente, 100.0, "L555", fornecedor_a)

# Adicionando ingredientes à fórmula
formula_complexa.add_ingrediente(ingrediente_vitamina_c)
formula_complexa.add_ingrediente(ingrediente_vitamina_d)
formula_complexa.add_ingrediente(ingrediente_zinco)
formula_complexa.add_ingrediente(ingrediente_magnesio)
formula_complexa.add_ingrediente(ingrediente_excipiente)

# Criando um produto com a fórmula complexa
produto_complexo = Produto(2, "Multivitamínico e Mineral", "L999", 5000.0,
                           "Suplemento completo de vitaminas e minerais",
                           ApresentacaoEnum.EMBALAGEM_60, formula_complexa, date(2025, 6, 30))

# Imprimindo informações
print("\n--- Informações do Produto Complexo ---")
print(produto_complexo)

print(f"\nProporção da Formula Complexa: {produto_complexo.formula.calcular_proporcao()}")

print("\n--- Informações da Formula Complexa ---")
print(formula_complexa)

print("\n--- Informações das Materias Primas ---")
print(vitamina_c)
print(vitamina_d)
print(zinco)
print(magnesio)
print(excipiente)
print(agua)

print("\n--- Informações dos Fornecedores ---")
print(fornecedor_a)
print(fornecedor_b)
print(fornecedor_c)
print(fornecedor_d)

print('-- Tratamento de exceções --')
try:
    ingrediente = Ingrediente(vitamina_c, -500.0, "L456", fornecedor_b)
except ValueError as e:
    print(f"Erro ao criar ingrediente: {e}")
