import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function MateriaPrimaForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    desc: '',
    cod_interno: '',
    numero_lote: '',
    nota_fiscal: '',
    fornecedor_id: '',
    data_fabricacao: '',
    data_validade: '',
    dias_validade_apos_aberto: 30,
    quantidade_disponivel: 0,
    unidade_medida: 'kg',
    categoria: '',
    condicao_armazenamento: '',
    localizacao: '',
    status: 'disponível',
    preco_unitario: 0
  });
  
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    // Carregar fornecedores para o select
    fetchFornecedores();

    // Se estiver editando, carregar os dados da matéria prima
    if (isEditing) {
      fetchMateriaPrima();
    }
  }, [isEditing, id, navigate]);

  const fetchFornecedores = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.fornecedores);
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Não foi possível carregar a lista de fornecedores.');
    }
  };

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.materiaPrima(id));
      
      // Formatação de datas para o formato esperado pelo input type="date"
      const data = {
        ...response.data,
        data_fabricacao: response.data.data_fabricacao ? formatDateForInput(response.data.data_fabricacao) : '',
        data_validade: response.data.data_validade ? formatDateForInput(response.data.data_validade) : '',
        fornecedor_id: response.data.fornecedor ? response.data.fornecedor.id : ''
      };
      
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar dados da matéria prima.');
      setLoading(false);
    }
  };

  // Função para formatar datas do formato 'YYYY-MM-DD' para o formato do input HTML
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Se já estiver no formato YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Converter valores numéricos
    if (['cod_interno', 'nota_fiscal', 'dias_validade_apos_aberto'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseInt(value, 10)
      });
    } 
    // Converter valores decimais
    else if (['quantidade_disponivel', 'preco_unitario'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseFloat(value)
      });
    }
    // Valores normais (strings)
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'nome', 'cod_interno', 'numero_lote', 'nota_fiscal', 
      'fornecedor_id', 'data_fabricacao', 'data_validade'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEditing) {
        await apiClient.put(apiEndpoints.materiaPrima(id), formData);
      } else {
        await apiClient.post(apiEndpoints.materiasPrimas, formData);
      }

      navigate('/materias-primas');
    } catch (error) {
      console.error('Erro ao salvar matéria prima:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(`Erro: ${error.response.data.error}`);
      } else {
        setError('Erro ao salvar matéria prima. Verifique os dados e tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/materias-primas');
  };

  if (loading && isEditing) {
    return (
      <div className="module-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              {isEditing ? (
                <>
                  <Icon name="Edit" size={20} className="module-title-icon" />
                  Editar Matéria Prima
                </>
              ) : (
                <>
                  <Icon name="Plus" size={20} className="module-title-icon" />
                  Nova Matéria Prima
                </>
              )}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar às Matérias Primas
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          {error && (
            <div className="alert alert-error">
              <Icon name="AlertTriangle" size={16} />
              {error}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3 className="form-section-title">Informações básicas</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="nome">
                        Nome da Matéria Prima *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        className="form-input"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Ex: Vitamina C"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="cod_interno">
                        Código Interno *
                      </label>
                      <input
                        type="number"
                        id="cod_interno"
                        name="cod_interno"
                        className="form-input"
                        value={formData.cod_interno}
                        onChange={handleChange}
                        placeholder="Ex: 1001"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group form-full-width">
                      <label className="form-label" htmlFor="desc">
                        Descrição
                      </label>
                      <textarea
                        id="desc"
                        name="desc"
                        className="form-input"
                        value={formData.desc}
                        onChange={handleChange}
                        placeholder="Descreva as características da matéria prima..."
                        rows="3"
                        disabled={loading}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Informações de lote e validade</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="numero_lote">
                        Número do Lote *
                      </label>
                      <input
                        type="text"
                        id="numero_lote"
                        name="numero_lote"
                        className="form-input"
                        value={formData.numero_lote}
                        onChange={handleChange}
                        placeholder="Ex: LOT2023001"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="nota_fiscal">
                        Nota Fiscal *
                      </label>
                      <input
                        type="number"
                        id="nota_fiscal"
                        name="nota_fiscal"
                        className="form-input"
                        value={formData.nota_fiscal}
                        onChange={handleChange}
                        placeholder="Ex: 12345"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="fornecedor_id">
                        Fornecedor *
                      </label>
                      <select
                        id="fornecedor_id"
                        name="fornecedor_id"
                        className="form-select"
                        value={formData.fornecedor_id}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Selecione um fornecedor</option>
                        {fornecedores.map((fornecedor) => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.razao_social}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="data_fabricacao">
                        Data de Fabricação *
                      </label>
                      <input
                        type="date"
                        id="data_fabricacao"
                        name="data_fabricacao"
                        className="form-input"
                        value={formData.data_fabricacao}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="data_validade">
                        Data de Validade *
                      </label>
                      <input
                        type="date"
                        id="data_validade"
                        name="data_validade"
                        className="form-input"
                        value={formData.data_validade}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="dias_validade_apos_aberto">
                        Dias de validade após aberto
                      </label>
                      <input
                        type="number"
                        id="dias_validade_apos_aberto"
                        name="dias_validade_apos_aberto"
                        className="form-input"
                        value={formData.dias_validade_apos_aberto}
                        onChange={handleChange}
                        placeholder="Ex: 30"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Informações de estoque</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="quantidade_disponivel">
                        Quantidade Disponível
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="quantidade_disponivel"
                        name="quantidade_disponivel"
                        className="form-input"
                        value={formData.quantidade_disponivel}
                        onChange={handleChange}
                        placeholder="Ex: 10.5"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="unidade_medida">
                        Unidade de Medida
                      </label>
                      <select
                        id="unidade_medida"
                        name="unidade_medida"
                        className="form-select"
                        value={formData.unidade_medida}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="kg">Quilograma (kg)</option>
                        <option value="g">Grama (g)</option>
                        <option value="l">Litro (l)</option>
                        <option value="ml">Mililitro (ml)</option>
                        <option value="unidade">Unidade</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="preco_unitario">
                        Preço Unitário
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="preco_unitario"
                        name="preco_unitario"
                        className="form-input"
                        value={formData.preco_unitario}
                        onChange={handleChange}
                        placeholder="Ex: 45.75"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="categoria">
                        Categoria
                      </label>
                      <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        className="form-input"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Ex: Vitamina"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Armazenamento</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="localizacao">
                        Localização
                      </label>
                      <input
                        type="text"
                        id="localizacao"
                        name="localizacao"
                        className="form-input"
                        value={formData.localizacao}
                        onChange={handleChange}
                        placeholder="Ex: Prateleira A3"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group form-full-width">
                      <label className="form-label" htmlFor="condicao_armazenamento">
                        Condições de Armazenamento
                      </label>
                      <textarea
                        id="condicao_armazenamento"
                        name="condicao_armazenamento"
                        className="form-input"
                        value={formData.condicao_armazenamento}
                        onChange={handleChange}
                        placeholder="Ex: Local seco e arejado, temperatura entre 15°C e 25°C"
                        rows="2"
                        disabled={loading}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="module-actions" style={{ marginTop: '2rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleVoltar}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={16} />
                        {isEditing ? 'Atualizar' : 'Salvar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MateriaPrimaForm;
