from datetime import date
from prototypes.prototype_2 import (
    ApresentacaoEnum,
    FormaFarmaceuticaEnum,
    Formula,
    Ingrediente,
    MateriaPrima,
    Fornecedor,
    Produto,
    LoteMateriaPrima,
    LoteProducao,
    LoteMateriaPrimaConsumida,
)

# --- Fornecedores ---
fornecedor_a = Fornecedor("1234567890001", "Empresa A", "Empresa A")
fornecedor_b = Fornecedor("9876543210001", "Empresa B", "Empresa B")
fornecedor_c = Fornecedor("11223344550001", "Empresa C", "Empresa C")
fornecedor_d = Fornecedor("99887766550001", "Empresa D", "Empresa D")

# --- Matérias-primas ---
vitamina_c = MateriaPrima(1, "Vitamina C", "Ácido Ascórbico")
vitamina_d = MateriaPrima(2, "Vitamina D3", "Colecalciferol")
zinco = MateriaPrima(3, "Zinco", "Sulfato de Zinco")
magnesio = MateriaPrima(4, "Magnésio", "Cloreto de Magnésio")
excipiente = MateriaPrima(5, "Excipiente", "Celulose Microcristalina")
agua = MateriaPrima(6, "Água Purificada", "H2O")

# --- Lotes de Matéria-Prima ---
lote_vitamina_c_1 = LoteMateriaPrima(
    1, vitamina_c, "LV123", 100000.0, 12345, fornecedor_a
)  # 100g
lote_vitamina_c_2 = LoteMateriaPrima(
    7, vitamina_c, "LV456", 50000.0, 98765, fornecedor_b
)  # 50g
lote_vitamina_d_1 = LoteMateriaPrima(
    2, vitamina_d, "LD456", 50000.0, 67890, fornecedor_b
)  # 50g
lote_zinco_1 = LoteMateriaPrima(3, zinco, "LZ789", 20000.0, 13579, fornecedor_c)  # 20g
lote_magnesio_1 = LoteMateriaPrima(
    4, magnesio, "LM987", 80000.0, 24680, fornecedor_d
)  # 80g
lote_excipiente_1 = LoteMateriaPrima(
    5, excipiente, "LE654", 100000.0, 11223, fornecedor_a
)  # 100g

# --- Ingredientes ---
ingrediente_vitamina_c_1 = Ingrediente(lote_vitamina_c_1, 200.0)
ingrediente_vitamina_c_2 = Ingrediente(lote_vitamina_c_2, 50.0)
ingrediente_vitamina_d = Ingrediente(lote_vitamina_d_1, 20.0)
ingrediente_zinco = Ingrediente(lote_zinco_1, 10.0)
ingrediente_magnesio = Ingrediente(lote_magnesio_1, 50.0)
ingrediente_excipiente = Ingrediente(lote_excipiente_1, 100.0)

# --- Fórmula ---
formula_complexa = Formula(2, FormaFarmaceuticaEnum.COMPRIMIDO, 60, 0.8)
formula_complexa.add_ingrediente(ingrediente_vitamina_c_1)
formula_complexa.add_ingrediente(ingrediente_vitamina_c_2)
formula_complexa.add_ingrediente(ingrediente_vitamina_d)
formula_complexa.add_ingrediente(ingrediente_zinco)
formula_complexa.add_ingrediente(ingrediente_magnesio)
formula_complexa.add_ingrediente(ingrediente_excipiente)

# --- Produto ---
produto_complexo = Produto(
    2,
    "Multivitamínico e Mineral",
    "Suplemento completo de vitaminas e minerais",
    ApresentacaoEnum.EMBALAGEM_30,
    formula_complexa,
)

# --- Lote de Produção ---
lote_producao_1 = LoteProducao(1, produto_complexo, "LP001", 1000.0, date(2024, 1, 20))

# --- Registrar Consumo ---
print("\n--- Registrar Consumo ---")
try:
    lote_producao_1.registrar_consumo(lote_vitamina_c_1, 200.0 * 1000)  # 200mg * 1000 = 200000mg
    lote_producao_1.registrar_consumo(lote_vitamina_c_2, 50.0 * 1000)  # 50mg * 1000 = 50000mg
    lote_producao_1.registrar_consumo(lote_vitamina_d_1, 20.0 * 1000)  # 20mg * 1000 = 20000mg
    lote_producao_1.registrar_consumo(lote_zinco_1, 10.0 * 1000)  # 10mg * 1000 = 10000mg
    lote_producao_1.registrar_consumo(lote_magnesio_1, 50.0 * 1000)  # 50mg * 1000 = 50000mg
    lote_producao_1.registrar_consumo(lote_excipiente_1, 100.0 * 1000)  # 100mg * 1000 = 100000mg
    print(lote_producao_1)

except ValueError as e:
    print(f"Erro ao registrar consumo: {e}")
    if "maior que a quantidade disponível no lote" in str(e):
        materia_prima_nome = lote_vitamina_c_1.materia_prima.nome
        quantidade_necessaria = 200000.0
        lotes_disponiveis = []
        for lote in [lote_vitamina_c_1, lote_vitamina_c_2]:
            if lote.materia_prima.nome == materia_prima_nome:
                lotes_disponiveis.append(lote)

        print(f"\nLotes disponíveis para {materia_prima_nome}:")
        for lote in lotes_disponiveis:
            print(
                f"- Lote: {lote.lote}, Quantidade Disponível: {lote.quant_disponivel_mg}mg, Fornecedor: {lote.fornecedor.fantasia}"
            )
        
        print(f"\nQuantidade necessária: {quantidade_necessaria}mg")
        quantidade_atendida = 0
        for lote in lotes_disponiveis:
            if quantidade_atendida < quantidade_necessaria:
                quantidade_para_consumir = min(quantidade_necessaria - quantidade_atendida, lote.quant_disponivel_mg)
                print(f"Consumindo {quantidade_para_consumir}mg do lote {lote.lote}")
                lote_producao_1.registrar_consumo(lote, quantidade_para_consumir)
                quantidade_atendida += quantidade_para_consumir
        print(lote_producao_1)
