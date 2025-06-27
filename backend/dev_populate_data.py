
#!/usr/bin/env python3
"""
Script para popular dados de desenvolvimento
Cria dados fictícios para todas as entidades do sistema
"""

import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_capsulas.settings')
django.setup()

from sc_fornecedores.models import Fornecedor
from sc_materiasPrimas.models import MateriaPrima, LoteMateriaPrima
from sc_produtos.models import Produto, Formula, Ingrediente, FormaFarmaceuticaEnum, ApresentacaoEnum
from sc_producao.models import LoteProducao, LoteMateriaPrimaConsumida


def clear_data():
    """Remove todos os dados existentes"""
    print("🗑️  Limpando dados existentes...")
    
    LoteMateriaPrimaConsumida.objects.all().delete()
    LoteProducao.objects.all().delete()
    Ingrediente.objects.all().delete()
    Produto.objects.all().delete()
    Formula.objects.all().delete()
    LoteMateriaPrima.objects.all().delete()
    MateriaPrima.objects.all().delete()
    Fornecedor.objects.all().delete()
    
    print("✅ Dados limpos com sucesso!")


def create_fornecedores():
    """Cria fornecedores de exemplo"""
    print("👥 Criando fornecedores...")
    
    fornecedores_data = [
        {
            'cnpj': '12.345.678/0001-90',
            'razao_social': 'Vitaminas Brasileiras Ltda',
            'fantasia': 'VitaBrasil'
        },
        {
            'cnpj': '23.456.789/0001-01',
            'razao_social': 'Suplementos Naturais do Brasil S.A.',
            'fantasia': 'NaturalBrasil'
        },
        {
            'cnpj': '34.567.890/0001-12',
            'razao_social': 'Laboratório Farmacêutico Nacional',
            'fantasia': 'FarmacoNacional'
        },
        {
            'cnpj': '45.678.901/0001-23',
            'razao_social': 'Ingredientes Ativos Importados Ltda',
            'fantasia': 'AtivosImport'
        },
        {
            'cnpj': '56.789.012/0001-34',
            'razao_social': 'Cápsulas e Excipientes do Sul',
            'fantasia': 'CapsulSul'
        }
    ]
    
    fornecedores = []
    for data in fornecedores_data:
        fornecedor = Fornecedor.objects.create(**data)
        fornecedores.append(fornecedor)
        print(f"   ✓ {fornecedor.fantasia}")
    
    return fornecedores


def create_materias_primas(fornecedores):
    """Cria matérias-primas de exemplo"""
    print("🧪 Criando matérias-primas...")
    
    materias_data = [
        {
            'cod_interno': 1001,
            'nome': 'Vitamina C (Ácido Ascórbico)',
            'desc': 'Vitamina C em pó, grau farmacêutico',
            'categoria': 'Vitaminas',
            'quantidade_disponivel': 50.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('125.50'),
            'condicao_armazenamento': 'Local seco, temperatura ambiente',
            'localizacao': 'Prateleira A1',
            'data_validade': date.today() + timedelta(days=365),
            'fornecedor': fornecedores[0]
        },
        {
            'cod_interno': 1002,
            'nome': 'Vitamina D3 (Colecalciferol)',
            'desc': 'Vitamina D3 em pó micronizado',
            'categoria': 'Vitaminas',
            'quantidade_disponivel': 25.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('275.00'),
            'condicao_armazenamento': 'Proteger da luz, temperatura ambiente',
            'localizacao': 'Prateleira A2',
            'data_validade': date.today() + timedelta(days=730),
            'fornecedor': fornecedores[1]
        },
        {
            'cod_interno': 1003,
            'nome': 'Óxido de Magnésio',
            'desc': 'Óxido de magnésio farmacêutico',
            'categoria': 'Minerais',
            'quantidade_disponivel': 100.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('45.75'),
            'condicao_armazenamento': 'Local seco',
            'localizacao': 'Prateleira B1',
            'data_validade': date.today() + timedelta(days=1095),
            'fornecedor': fornecedores[2]
        },
        {
            'cod_interno': 1004,
            'nome': 'Zinco Quelato',
            'desc': 'Zinco bisglicinato quelato',
            'categoria': 'Minerais',
            'quantidade_disponivel': 30.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('185.20'),
            'condicao_armazenamento': 'Local seco, temperatura ambiente',
            'localizacao': 'Prateleira B2',
            'data_validade': date.today() + timedelta(days=900),
            'fornecedor': fornecedores[3]
        },
        {
            'cod_interno': 1005,
            'nome': 'Gelatina Bovina',
            'desc': 'Gelatina bovina para cápsulas',
            'categoria': 'Excipientes',
            'quantidade_disponivel': 75.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('32.90'),
            'condicao_armazenamento': 'Local seco, proteger da umidade',
            'localizacao': 'Prateleira C1',
            'data_validade': date.today() + timedelta(days=600),
            'fornecedor': fornecedores[4]
        },
        {
            'cod_interno': 1006,
            'nome': 'Vitamina B12 (Cianocobalamina)',
            'desc': 'Vitamina B12 cristalina',
            'categoria': 'Vitaminas',
            'quantidade_disponivel': 5.0,
            'unidade_medida': 'kg',
            'preco_unitario': Decimal('450.00'),
            'condicao_armazenamento': 'Refrigerado 2-8°C',
            'localizacao': 'Geladeira A',
            'data_validade': date.today() + timedelta(days=540),
            'fornecedor': fornecedores[0]
        }
    ]
    
    materias_primas = []
    for data in materias_data:
        materia = MateriaPrima.objects.create(**data)
        # Calcular status inicial
        materia.calcular_status()
        materia.save()
        materias_primas.append(materia)
        print(f"   ✓ {materia.nome} - Status: {materia.status}")
    
    return materias_primas


def create_lotes_materias_primas(materias_primas, fornecedores):
    """Cria lotes de matérias-primas"""
    print("📦 Criando lotes de matérias-primas...")
    
    lotes = []
    for i, materia in enumerate(materias_primas):
        # Criar 2 lotes para cada matéria-prima
        for j in range(2):
            lote_data = {
                'materia_prima': materia,
                'numero_lote': f"L{materia.cod_interno}-{j+1:03d}",
                'data_fabricacao': date.today() - timedelta(days=30 + j*15),
                'data_validade': materia.data_validade,
                'nota_fiscal': f"NF{12345 + i*10 + j}",
                'quant_recebida_kg': materia.quantidade_disponivel / 2,
                'quant_disponivel_kg': materia.quantidade_disponivel / 2,
                'data_recebimento': date.today() - timedelta(days=25 + j*10),
                'aprovado_controle_qualidade': True,
                'data_aprovacao': date.today() - timedelta(days=20 + j*10),
                'responsavel_aprovacao': 'Carlos Silva' if j == 0 else 'Ana Santos',
                'local_armazenamento': materia.localizacao,
                'condicoes_armazenamento': materia.condicao_armazenamento,
                'codigo_rastreabilidade': f"RT{materia.cod_interno}{j+1:02d}",
                'fornecedor': materia.fornecedor
            }
            
            lote = LoteMateriaPrima.objects.create(**lote_data)
            lotes.append(lote)
            print(f"   ✓ {lote.numero_lote} - {lote.materia_prima.nome}")
    
    return lotes


def create_formulas():
    """Cria fórmulas de exemplo"""
    print("🧮 Criando fórmulas...")
    
    formulas_data = [
        {
            'forma_farmaceutica': FormaFarmaceuticaEnum.CAPSULA_GELATINA_MOLE,
            'quant_unid_padrao': 60,
            'quant_kg_padrao': 1.5
        },
        {
            'forma_farmaceutica': FormaFarmaceuticaEnum.CAPSULA_MASTIGAVEL,
            'quant_unid_padrao': 30,
            'quant_kg_padrao': 0.8
        },
        {
            'forma_farmaceutica': FormaFarmaceuticaEnum.COMPRIMIDO,
            'quant_unid_padrao': 120,
            'quant_kg_padrao': 2.0
        },
        {
            'forma_farmaceutica': FormaFarmaceuticaEnum.CAPSULA_GELATINA_MOLE,
            'quant_unid_padrao': 90,
            'quant_kg_padrao': 1.8
        },
        {
            'forma_farmaceutica': FormaFarmaceuticaEnum.COMPRIMIDO,
            'quant_unid_padrao': 60,
            'quant_kg_padrao': 1.2
        }
    ]
    
    formulas = []
    for i, data in enumerate(formulas_data):
        formula = Formula.objects.create(**data)
        formulas.append(formula)
        print(f"   ✓ Fórmula {i+1} - {formula.forma_farmaceutica}")
    
    return formulas


def create_produtos(formulas):
    """Cria produtos de exemplo"""
    print("💊 Criando produtos...")
    
    produtos_data = [
        {
            'nome': 'VitaMax Multivitamínico',
            'descricao': 'Complexo multivitamínico com vitaminas C, D3 e minerais',
            'apresentacao': ApresentacaoEnum.EMBALAGEM_60,
            'formula': formulas[0]
        },
        {
            'nome': 'CalMag Plus',
            'descricao': 'Suplemento de cálcio e magnésio com vitamina D3',
            'apresentacao': ApresentacaoEnum.EMBALAGEM_30,
            'formula': formulas[1]
        },
        {
            'nome': 'Vitamina C 1000mg',
            'descricao': 'Vitamina C de alta potência para imunidade',
            'apresentacao': ApresentacaoEnum.EMBALAGEM_120,
            'formula': formulas[2]
        },
        {
            'nome': 'Complexo B Ativo',
            'descricao': 'Complexo de vitaminas do complexo B com B12',
            'apresentacao': ApresentacaoEnum.EMBALAGEM_90,
            'formula': formulas[3]
        },
        {
            'nome': 'Zinco Quelato 15mg',
            'descricao': 'Zinco bisglicinato para melhor absorção',
            'apresentacao': ApresentacaoEnum.EMBALAGEM_60,
            'formula': formulas[4]
        }
    ]
    
    produtos = []
    for data in produtos_data:
        produto = Produto.objects.create(**data)
        produtos.append(produto)
        print(f"   ✓ {produto.nome}")
    
    return produtos


def create_ingredientes(formulas, lotes_materias_primas):
    """Cria ingredientes para as fórmulas"""
    print("🔬 Criando ingredientes...")
    
    # Mapear matérias-primas por nome para facilitar
    lotes_por_nome = {}
    for lote in lotes_materias_primas:
        nome_materia = lote.materia_prima.nome
        if nome_materia not in lotes_por_nome:
            lotes_por_nome[nome_materia] = []
        lotes_por_nome[nome_materia].append(lote)
    
    # Receitas para cada fórmula
    receitas = [
        # Fórmula 1 - VitaMax Multivitamínico
        [
            ('Vitamina C (Ácido Ascórbico)', 500.0),
            ('Vitamina D3 (Colecalciferol)', 25.0),
            ('Óxido de Magnésio', 200.0),
            ('Zinco Quelato', 15.0)
        ],
        # Fórmula 2 - CalMag Plus
        [
            ('Óxido de Magnésio', 300.0),
            ('Vitamina D3 (Colecalciferol)', 20.0)
        ],
        # Fórmula 3 - Vitamina C 1000mg
        [
            ('Vitamina C (Ácido Ascórbico)', 1000.0)
        ],
        # Fórmula 4 - Complexo B Ativo
        [
            ('Vitamina B12 (Cianocobalamina)', 50.0),
            ('Zinco Quelato', 10.0)
        ],
        # Fórmula 5 - Zinco Quelato 15mg
        [
            ('Zinco Quelato', 15.0)
        ]
    ]
    
    ingredientes = []
    for i, formula in enumerate(formulas):
        receita = receitas[i]
        print(f"   Fórmula {i+1}:")
        
        for nome_materia, quantidade_mg in receita:
            if nome_materia in lotes_por_nome:
                lote = lotes_por_nome[nome_materia][0]  # Usar primeiro lote
                ingrediente = Ingrediente.objects.create(
                    formula=formula,
                    lote_materia_prima=lote,
                    quant_mg=quantidade_mg
                )
                ingredientes.append(ingrediente)
                print(f"     ✓ {nome_materia}: {quantidade_mg}mg")
    
    return ingredientes


def create_lotes_producao(produtos):
    """Cria lotes de produção"""
    print("🏭 Criando lotes de produção...")
    
    lotes_producao = []
    for i, produto in enumerate(produtos):
        # Criar 2 lotes para cada produto
        for j in range(2):
            lote_data = {
                'produto': produto,
                'lote': f"LP{produto.id:03d}-{j+1:03d}",
                'lote_tamanho': produto.formula.quant_kg_padrao * (j + 1),
                'data_producao': date.today() - timedelta(days=15 + j*7)
            }
            
            lote = LoteProducao.objects.create(**lote_data)
            lotes_producao.append(lote)
            print(f"   ✓ {lote.lote} - {lote.produto.nome} ({lote.lote_tamanho}kg)")
    
    return lotes_producao


def create_materias_consumidas(lotes_producao):
    """Cria registros de matérias-primas consumidas na produção"""
    print("📋 Registrando consumo de matérias-primas...")
    
    materias_consumidas = []
    for lote_producao in lotes_producao:
        # Para cada ingrediente da fórmula do produto
        for ingrediente in lote_producao.produto.formula.ingredientes.all():
            # Calcular quantidade consumida baseada no tamanho do lote
            fator_multiplicacao = lote_producao.lote_tamanho / lote_producao.produto.formula.quant_kg_padrao
            quantidade_consumida = ingrediente.quant_mg * fator_multiplicacao
            
            consumo = LoteMateriaPrimaConsumida.objects.create(
                lote_producao=lote_producao,
                lote_materia_prima=ingrediente.lote_materia_prima,
                quant_consumida_mg=quantidade_consumida
            )
            materias_consumidas.append(consumo)
            
            # Atualizar quantidade disponível no lote
            lote_materia = ingrediente.lote_materia_prima
            quantidade_kg = quantidade_consumida / 1000000  # Converter mg para kg
            if lote_materia.quant_disponivel_kg >= quantidade_kg:
                lote_materia.quant_disponivel_kg -= quantidade_kg
                lote_materia.save()
        
        print(f"   ✓ {lote_producao.lote} - {len(lote_producao.produto.formula.ingredientes.all())} ingredientes")
    
    return materias_consumidas


def show_summary():
    """Mostra resumo dos dados criados"""
    print("\n" + "="*60)
    print("📊 RESUMO DOS DADOS CRIADOS")
    print("="*60)
    
    print(f"👥 Fornecedores: {Fornecedor.objects.count()}")
    print(f"🧪 Matérias-primas: {MateriaPrima.objects.count()}")
    print(f"📦 Lotes de matérias-primas: {LoteMateriaPrima.objects.count()}")
    print(f"🧮 Fórmulas: {Formula.objects.count()}")
    print(f"💊 Produtos: {Produto.objects.count()}")
    print(f"🔬 Ingredientes: {Ingrediente.objects.count()}")
    print(f"🏭 Lotes de produção: {LoteProducao.objects.count()}")
    print(f"📋 Consumos registrados: {LoteMateriaPrimaConsumida.objects.count()}")
    
    print("\n✅ Dados de desenvolvimento criados com sucesso!")
    print("💡 Use o admin do Django ou a API para visualizar os dados")


def main():
    """Função principal"""
    print("🚀 INICIANDO POPULAÇÃO DE DADOS DE DESENVOLVIMENTO")
    print("="*60)
    
    try:
        # Limpar dados existentes
        clear_data()
        
        # Criar dados em ordem de dependência
        fornecedores = create_fornecedores()
        materias_primas = create_materias_primas(fornecedores)
        lotes_materias_primas = create_lotes_materias_primas(materias_primas, fornecedores)
        formulas = create_formulas()
        produtos = create_produtos(formulas)
        ingredientes = create_ingredientes(formulas, lotes_materias_primas)
        lotes_producao = create_lotes_producao(produtos)
        materias_consumidas = create_materias_consumidas(lotes_producao)
        
        # Mostrar resumo
        show_summary()
        
    except Exception as e:
        print(f"❌ Erro durante a criação dos dados: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
