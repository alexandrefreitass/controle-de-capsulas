import unittest
from datetime import date
import sys
import os

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (one level up)
parent_dir = os.path.dirname(current_dir)

# Add the parent directory to the Python path
sys.path.append(parent_dir)

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


class TestClasses(unittest.TestCase):
    def setUp(self):
        # Create some instances for testing
        self.fornecedor_a = Fornecedor("1234567890001", "Empresa A", "Empresa A")
        self.fornecedor_b = Fornecedor("9876543210001", "Empresa B", "Empresa B")

        self.vitamina_c = MateriaPrima(1, "Vitamina C", "Ácido Ascórbico")
        self.vitamina_d = MateriaPrima(2, "Vitamina D3", "Colecalciferol")

        self.lote_vitamina_c_1 = LoteMateriaPrima(
            1, self.vitamina_c, "LV123", 100000.0, 12345, self.fornecedor_a
        )
        self.lote_vitamina_d_1 = LoteMateriaPrima(
            2, self.vitamina_d, "LD456", 50000.0, 67890, self.fornecedor_b
        )

        self.formula_complexa = Formula(
            2, FormaFarmaceuticaEnum.COMPRIMIDO, 60, 0.8
        )

        self.produto_complexo = Produto(
            2,
            "Multivitamínico e Mineral",
            "Suplemento completo de vitaminas e minerais",
            ApresentacaoEnum.EMBALAGEM_30,
            self.formula_complexa,
        )

        self.lote_producao_1 = LoteProducao(
            1, self.produto_complexo, "LP001", 1000.0, date(2024, 1, 20)
        )

    def test_fornecedor_listar_produtos(self):
        self.assertIn(self.vitamina_c, self.fornecedor_a.listar_produtos())
        self.assertIn(self.vitamina_d, self.fornecedor_b.listar_produtos())

    def test_fornecedor_listar_lotes(self):
        self.assertIn(self.lote_vitamina_c_1, self.fornecedor_a.listar_lotes())
        self.assertIn(self.lote_vitamina_d_1, self.fornecedor_b.listar_lotes())

    def test_formula_add_ingrediente(self):
        ingrediente_vitamina_c = Ingrediente(self.lote_vitamina_c_1, 200.0)
        self.formula_complexa.add_ingrediente(ingrediente_vitamina_c)
        self.assertIn(ingrediente_vitamina_c, self.formula_complexa.get_ingredientes())

    def test_formula_calcular_proporcao(self):
        ingrediente_vitamina_c = Ingrediente(self.lote_vitamina_c_1, 200.0)
        ingrediente_vitamina_d = Ingrediente(self.lote_vitamina_d_1, 50.0)
        self.formula_complexa.add_ingrediente(ingrediente_vitamina_c)
        self.formula_complexa.add_ingrediente(ingrediente_vitamina_d)
        proporcao = self.formula_complexa.calcular_proporcao()
        self.assertAlmostEqual(proporcao, 12500.0)

    def test_ingrediente_validar_quant_mg(self):
        with self.assertRaises(ValueError):
            Ingrediente(self.lote_vitamina_c_1, -100.0)

    def test_lote_materia_prima_creation(self):
        self.assertEqual(self.lote_vitamina_c_1.quant_disponivel_mg, 100000.0)
        self.assertEqual(self.lote_vitamina_c_1.fornecedor, self.fornecedor_a)
        self.assertEqual(self.lote_vitamina_c_1.materia_prima, self.vitamina_c)

    def test_lote_producao_registrar_consumo(self):
        self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 5000.0)
        self.assertEqual(self.lote_vitamina_c_1.quant_disponivel_mg, 95000.0)
        self.assertEqual(len(self.lote_producao_1.lotes_materias_primas_consumidas), 1)
        self.assertEqual(self.lote_producao_1.lotes_materias_primas_consumidas[0].quant_consumida_mg, 5000.0)

    def test_lote_producao_registrar_consumo_invalid_quantity(self):
        with self.assertRaises(ValueError):
            self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, -5000.0)

    def test_lote_producao_registrar_consumo_insufficient_quantity(self):
        with self.assertRaises(ValueError):
            self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 100001.0)

    def test_lote_materia_prima_consumida_creation(self):
        self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 5000.0)
        consumo = self.lote_producao_1.lotes_materias_primas_consumidas[0]
        self.assertEqual(consumo.quant_consumida_mg, 5000.0)
        self.assertEqual(consumo.lote_materia_prima, self.lote_vitamina_c_1)
        self.assertEqual(consumo.lote_producao, self.lote_producao_1)

    def test_produto_creation(self):
        self.assertEqual(self.produto_complexo.nome, "Multivitamínico e Mineral")
        self.assertEqual(self.produto_complexo.formula, self.formula_complexa)
        self.assertEqual(self.produto_complexo.apresentacao, ApresentacaoEnum.EMBALAGEM_30)

    def test_ingrediente_creation(self):
        ingrediente_vitamina_c = Ingrediente(self.lote_vitamina_c_1, 200.0)
        self.assertEqual(ingrediente_vitamina_c.quant_mg, 200.0)
        self.assertEqual(ingrediente_vitamina_c.lote_materia_prima, self.lote_vitamina_c_1)

    def test_ingrediente_invalid_quant_mg(self):
        with self.assertRaises(ValueError):
            Ingrediente(self.lote_vitamina_c_1, -100.0)

    def test_lote_producao_creation(self):
        self.assertEqual(self.lote_producao_1.produto, self.produto_complexo)
        self.assertEqual(self.lote_producao_1.lote, "LP001")
        self.assertEqual(self.lote_producao_1.lote_tamanho, 1000.0)
        self.assertEqual(self.lote_producao_1.data_producao, date(2024, 1, 20))

    def test_lote_producao_registrar_consumo_with_valid_quantity(self):
        self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 5000.0)
        self.assertEqual(self.lote_vitamina_c_1.quant_disponivel_mg, 95000.0)
        self.assertEqual(len(self.lote_producao_1.lotes_materias_primas_consumidas), 1)
        self.assertEqual(self.lote_producao_1.lotes_materias_primas_consumidas[0].quant_consumida_mg, 5000.0)

    def test_lote_producao_registrar_consumo_with_invalid_quantity(self):
        with self.assertRaises(ValueError):
            self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, -5000.0)

    def test_lote_producao_registrar_consumo_with_insufficient_quantity(self):
        with self.assertRaises(ValueError):
            self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 100001.0)

    def test_lote_materia_prima_consumida_creation(self):
        self.lote_producao_1.registrar_consumo(self.lote_vitamina_c_1, 5000.0)
        consumo = self.lote_producao_1.lotes_materias_primas_consumidas[0]
        self.assertEqual(consumo.quant_consumida_mg, 5000.0)
        self.assertEqual(consumo.lote_materia_prima, self.lote_vitamina_c_1)
        self.assertEqual(consumo.lote_producao, self.lote_producao_1)

    def test_materia_prima_creation(self):
        self.assertEqual(self.vitamina_c.nome, "Vitamina C")
        self.assertEqual(self.vitamina_c.desc, "Ácido Ascórbico")

    def test_fornecedor_creation(self):
        self.assertEqual(self.fornecedor_a.cnpj, "1234567890001")
        self.assertEqual(self.fornecedor_a.razao_social, "Empresa A")
        self.assertEqual(self.fornecedor_a.fantasia, "Empresa A")

if __name__ == "__main__":
    unittest.main()
