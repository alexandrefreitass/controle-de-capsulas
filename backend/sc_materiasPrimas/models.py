from django.db import models
from django.utils import timezone
from datetime import timedelta
from sc_fornecedores.models import Fornecedor


class MateriaPrima(models.Model):
    id = models.AutoField(primary_key=True)
    cod_interno = models.IntegerField(unique=True, default=0, auto_created=True)
    nome = models.CharField(max_length=255)
    desc = models.TextField(blank=True, null=True)
    numero_lote = models.CharField(max_length=50, null=True, blank=True)
    nota_fiscal = models.IntegerField(null=True, blank=True)
    fornecedor = models.ForeignKey(
        Fornecedor, on_delete=models.PROTECT, related_name="materias_primas", default=1
    )
    data_fabricacao = models.DateField(null=True, blank=True)
    data_validade = models.DateField(null=True, blank=True)
    dias_validade_apos_aberto = models.IntegerField(
        default=30
    )  # Dias válidos após abertura
    embalagem_aberta = models.BooleanField(default=False)  # Status de abertura
    data_abertura_embalagem = models.DateField(
        null=True, blank=True
    )  # Data de abertura

    # Campos adicionados para o MVP
    quantidade_disponivel = models.FloatField(default=0)
    unidade_medida = models.CharField(max_length=20, default="kg")
    categoria = models.CharField(max_length=50, blank=True)
    condicao_armazenamento = models.CharField(max_length=255, blank=True)
    localizacao = models.CharField(max_length=100, blank=True)
    # status = models.CharField(max_length=50, default="disponível")
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    data_entrada = models.DateField(default=timezone.now)

    # Adicione um campo para armazenar o status manualmente quando necessário
    _status_interno = models.CharField(
        max_length=50, default="disponível", db_column="status"
    )

    def __str__(self):
        return f"{self.nome} - Lote: {self.lote}"

    def abrir_embalagem(self):
        """Marca a embalagem como aberta e registra a data de abertura"""
        self.embalagem_aberta = True
        self.definir_data_abertura_embalagem()
        self.definir_data_validade_efetiva()
        self.save()
        return self.embalagem_aberta

    def definir_data_validade_efetiva(self):
        """Define a data útil com base na validade regular ou do produto aberto"""
        if self.embalagem_aberta and self.data_abertura_embalagem:
            self.data_validade_efetiva = self.data_abertura_embalagem + timedelta(
                days=self.dias_validade_apos_aberto
            )
        else:
            self.data_validade_efetiva = self.data_validade
        self.save()
        return self.data_validade_efetiva

    def definir_data_abertura_embalagem(self):
        """Registra a data de abertura da embalagem como hoje"""
        if not self.data_abertura_embalagem and self.embalagem_aberta:
            self.data_abertura_embalagem = timezone.now().date()
            self.save()
        return self.data_abertura_embalagem

    def verificar_validade(self):
        """Verifica se a matéria prima está dentro do prazo de validade"""
        hoje = timezone.now().date()
        data_referencia = (
            self.data_validade_efetiva if self.embalagem_aberta else self.data_validade
        )

        if data_referencia < hoje:
            self.status = "vencido"
            self.save()
            return False
        elif (data_referencia - hoje).days <= 30:
            self.status = "próximo ao vencimento"
            self.save()
        return True

    def atualizar_quantidade(self, quantidade_usada):
        """Atualiza a quantidade disponível após uso"""
        if quantidade_usada > self.quantidade_disponivel:
            raise ValueError("Quantidade insuficiente em estoque")

        self.quantidade_disponivel -= quantidade_usada

        if self.quantidade_disponivel <= 0:
            self.status = "esgotado"

        self.save()
        return self.quantidade_disponivel

    def adicionar_estoque(self, quantidade):
        """Adiciona quantidade ao estoque existente"""
        if quantidade <= 0:
            raise ValueError("A quantidade deve ser maior que zero")

        self.quantidade_disponivel += quantidade

        if self.status == "esgotado":
            self.status = "disponível"

        self.save()
        return self.quantidade_disponivel

    def transferir_para_quarentena(self, motivo=""):
        """Transfere a matéria prima para quarentena"""
        self.status = "em quarentena"
        self.save()
        return {"status": self.status, "motivo": motivo}

    def calcular_valor_em_estoque(self):
        """Calcula o valor total da matéria prima em estoque"""
        return self.quantidade_disponivel * self.preco_unitario

    @property
    def data_validade_efetiva(self):
        """Retorna a data de validade considerando abertura da embalagem"""
        import datetime

        # Se não tiver data de validade, retorna None
        if not self.data_validade:
            return None

        # Garantir que data_validade seja um objeto date
        data_validade = self.data_validade
        if isinstance(data_validade, str):
            try:
                data_validade = datetime.datetime.strptime(
                    data_validade, "%Y-%m-%d"
                ).date()
            except ValueError:
                return None

        # Se não estiver aberto ou não tiver data de abertura, retorna a validade original
        if not self.embalagem_aberta or not self.data_abertura_embalagem:
            return data_validade

        # Garantir que data_abertura seja objeto date
        data_abertura = self.data_abertura_embalagem
        if isinstance(data_abertura, str):
            try:
                data_abertura = datetime.datetime.strptime(
                    data_abertura, "%Y-%m-%d"
                ).date()
            except ValueError:
                return data_validade

        # Calcular nova data
        try:
            return data_abertura + datetime.timedelta(
                days=self.dias_validade_apos_aberto or 30
            )
        except Exception as e:
            print(f"Erro ao calcular data_validade_efetiva: {e}")
            return data_validade  # Fallback para validade original

    @property
    def status(self):
        """Determina o status da matéria prima baseado na validade e quantidade"""
        # Retornar o status interno armazenado
        # Isto evita os problemas anteriores com o cálculo dinâmico
        return self._status_interno

    @status.setter
    def status(self, valor):
        """Define o status manualmente"""
        self._status_interno = valor

    def calcular_status(self):
        """Calcula o status com base em regras de negócio e atualiza o campo interno"""
        from django.utils import timezone
        import datetime

        hoje = timezone.now().date()

        # Determinar qual data de validade usar
        data_validade = self.data_validade_efetiva

        if not data_validade:
            novo_status = "sem validade"
        else:
            # Garantir que data_validade seja objeto date
            if isinstance(data_validade, str):
                try:
                    data_validade = datetime.datetime.strptime(
                        data_validade, "%Y-%m-%d"
                    ).date()
                except ValueError:
                    return "sem validade"

            # Calcular dias para vencer
            try:
                dias_para_vencer = (data_validade - hoje).days

                if self.quantidade_disponivel <= 0:
                    novo_status = "esgotado"
                elif dias_para_vencer < 0:
                    novo_status = "vencido"
                elif dias_para_vencer <= 30:
                    novo_status = "próximo ao vencimento"
                else:
                    novo_status = "disponível"
            except TypeError:
                novo_status = "erro na data"

        # Atualizar o status interno
        self._status_interno = novo_status
        return novo_status

    def save(self, *args, **kwargs):
        """Sobrescreve método save para recalcular status se necessário"""
        # Calcular o status antes de salvar
        # Descomente se desejar atualizar o status automaticamente
        # self.calcular_status()
        super().save(*args, **kwargs)


class LoteMateriaPrima(models.Model):
    """
    Modelo para gerenciar lotes específicos de matérias-primas
    Permite rastrear informações mais detalhadas sobre cada lote recebido
    """

    id = models.AutoField(primary_key=True)
    materia_prima = models.ForeignKey(
        MateriaPrima, on_delete=models.CASCADE, related_name="lotes"
    )
    numero_lote = models.CharField(max_length=50, default="")
    data_fabricacao = models.DateField(null=True, blank=True)
    data_validade = models.DateField(null=True, blank=True)
    nota_fiscal = models.CharField(max_length=50)
    quant_recebida_kg = models.FloatField(default=0)
    quant_disponivel_kg = models.FloatField(default=0)
    data_recebimento = models.DateField(default=timezone.now)

    # Campos para controle de qualidade
    aprovado_controle_qualidade = models.BooleanField(default=False)
    data_aprovacao = models.DateField(null=True, blank=True)
    responsavel_aprovacao = models.CharField(max_length=100, blank=True)
    observacoes = models.TextField(blank=True)

    # Campos para controle de armazenagem
    local_armazenamento = models.CharField(max_length=100, blank=True)
    condicoes_armazenamento = models.CharField(max_length=255, blank=True)

    # Controle de embalagem
    embalagem_original_aberta = models.BooleanField(default=False)
    data_abertura_embalagem = models.DateField(null=True, blank=True)

    # Campos para rastreabilidade
    codigo_rastreabilidade = models.CharField(max_length=100, blank=True)
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.PROTECT,
        related_name="lotes_fornecidos",
        null=True,
        default=None,
    )

    class Meta:
        verbose_name = "Lote de Matéria Prima"
        verbose_name_plural = "Lotes de Matérias Primas"
        unique_together = ["materia_prima", "numero_lote"]

    def __str__(self):
        return f"{self.materia_prima.nome} - Lote: {self.numero_lote}"

    def abrir_embalagem(self):
        """Registra a abertura da embalagem original"""
        if not self.embalagem_original_aberta:
            self.embalagem_original_aberta = True
            self.data_abertura_embalagem = timezone.now().date()
            self.save()
        return self.embalagem_original_aberta

    def calcular_dias_ate_vencimento(self):
        """Calcula quantos dias faltam até o vencimento"""
        hoje = timezone.now().date()
        return (self.data_validade - hoje).days

    def consumir_quantidade(self, quantidade):
        """Remove uma quantidade do lote e atualiza o disponível"""
        if quantidade > self.quant_disponivel_kg:
            raise ValueError(
                f"Quantidade insuficiente no lote. Disponível: {self.quant_disponivel_kg}kg"
            )

        self.quant_disponivel_kg -= quantidade
        self.save()
        return self.quant_disponivel_kg

    def adicionar_quantidade(self, quantidade):
        """Adiciona uma quantidade ao lote"""
        if quantidade <= 0:
            raise ValueError("A quantidade deve ser maior que zero")

        self.quant_disponivel_kg += quantidade
        self.quant_recebida_kg += quantidade
        self.save()
        return self.quant_disponivel_kg

    @property
    def status(self):
        """Retorna o status atual do lote baseado na validade e quantidade"""
        hoje = timezone.now().date()

        if self.data_validade < hoje:
            return "vencido"

        if self.quant_disponivel_kg <= 0:
            return "esgotado"

        dias_para_vencimento = self.calcular_dias_ate_vencimento()
        if dias_para_vencimento <= 30:
            return "próximo ao vencimento"

        if not self.aprovado_controle_qualidade:
            return "aguardando aprovação"

        return "disponível"
