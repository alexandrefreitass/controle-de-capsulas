
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

// Estilos customizados para o React Select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'var(--background-primary)',
    border: state.isFocused ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '0',
    minHeight: '42px',
    height: '42px',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    boxShadow: state.isFocused ? '0 0 0 1px var(--primary-light)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--primary-color)' : '#9ca3af'
    },
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0.625rem 0.75rem',
    height: '40px',
    display: 'flex',
    alignItems: 'center'
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    padding: '0',
    color: 'var(--text-primary)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: 'var(--text-muted)',
    padding: '0 8px',
    '&:hover': {
      color: 'var(--text-secondary)'
    },
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--text-muted)',
    fontSize: '0.875rem'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-primary)',
    fontSize: '0.875rem'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)',
    zIndex: 9999
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--primary-color)' 
      : state.isFocused 
        ? 'var(--background-accent)' 
        : 'transparent',
    color: state.isSelected ? '#ffffff' : 'var(--text-primary)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? 'var(--primary-hover)' : 'var(--background-accent)'
    }
  })
};

function LoteForm() {
  const { materiaPrimaId, id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materia_prima_id: materiaPrimaId,
    lote: '',
    quant_total_mg: '',
    quant_disponivel_mg: '',
    nota_fiscal: '',
    fornecedor_id: ''
  });

  const [fornecedores, setFornecedores] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    // Carregar a matéria prima
    fetchMateriaPrima();

    // Carregar fornecedores para o dropdown
    fetchFornecedores();

    // Se estiver editando, carregar os dados do lote
    if (isEditing) {
      fetchLote();
    }
  }, [isEditing, id, materiaPrimaId, navigate]);

  const fetchMateriaPrima = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.materiasPrimas.detail(materiaPrimaId));
      setMateriaPrima(response.data);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar informações da matéria prima.');
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.fornecedores.list);
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Erro ao carregar lista de fornecedores.');
    }
  };

  const fetchLote = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.lotes.detail(id));
      setFormData({
        materia_prima_id: response.data.materia_prima.id,
        lote: response.data.lote,
        quant_total_mg: response.data.quant_total_mg,
        quant_disponivel_mg: response.data.quant_disponivel_mg,
        nota_fiscal: response.data.nota_fiscal,
        fornecedor_id: response.data.fornecedor.id
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lote:', error);
      setError('Erro ao carregar dados do lote.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFornecedorChange = (selectedOption) => {
    setFormData({
      ...formData,
      fornecedor_id: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Preparar os dados para envio, garantindo que estão no formato correto
      const dataToSend = {
        ...formData,
        materia_prima_id: parseInt(formData.materia_prima_id),
        fornecedor_id: parseInt(formData.fornecedor_id),
        quant_total_mg: parseFloat(formData.quant_total_mg),
        quant_disponivel_mg: parseFloat(formData.quant_disponivel_mg)
      };

      console.log('Enviando dados:', dataToSend);

      if (isEditing) {
        const response = await apiClient.put(apiEndpoints.lotes.detail(id), dataToSend);
        console.log('Resposta da edição:', response.data);
      } else {
        const response = await apiClient.post(apiEndpoints.lotes.list, dataToSend);
        console.log('Resposta da criação:', response.data);
      }

      navigate(`/materias-primas/${materiaPrimaId}/lotes`);
    } catch (error) {
      console.error('Erro completo:', error);

      if (error.response) {
        console.error('Resposta de erro do servidor:', error.response.data);

        // Exibir mensagem de erro detalhada se disponível
        if (error.response.data && error.response.data.error) {
          setError(`Erro ao salvar lote: ${error.response.data.error}`);
        } else {
          setError(`Erro ao salvar lote. Código: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor');
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        console.error('Erro na configuração da requisição:', error.message);
        setError('Erro na requisição: ' + error.message);
      }

      setLoading(false);
    }
  };

  const fornecedorOptions = fornecedores.map(fornecedor => ({
    value: fornecedor.id,
    label: fornecedor.razao_social
  }));

  const handleVoltar = () => {
    navigate(`/materias-primas/${materiaPrimaId}/lotes`);
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
              <Icon name="Package" size={32} className="module-title-icon" />
              {isEditing ? 'Editar Lote' : 'Novo Lote'}
              {materiaPrima ? ` - ${materiaPrima.nome}` : ''}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          {error && (
            <div className="alert alert-error">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="form-section-title">Informações do Lote</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="lote">
                      Número do Lote *
                    </label>
                    <input
                      type="text"
                      id="lote"
                      name="lote"
                      className="form-input"
                      value={formData.lote}
                      onChange={handleChange}
                      placeholder="Ex: LOT2024001"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="nota_fiscal">
                      Nota Fiscal *
                    </label>
                    <input
                      type="text"
                      id="nota_fiscal"
                      name="nota_fiscal"
                      className="form-input"
                      value={formData.nota_fiscal}
                      onChange={handleChange}
                      placeholder="Ex: 123456"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quant_total_mg">
                      Quantidade Total (mg) *
                    </label>
                    <input
                      type="number"
                      id="quant_total_mg"
                      name="quant_total_mg"
                      className="form-input"
                      value={formData.quant_total_mg}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quant_disponivel_mg">
                      Quantidade Disponível (mg) *
                    </label>
                    <input
                      type="number"
                      id="quant_disponivel_mg"
                      name="quant_disponivel_mg"
                      className="form-input"
                      value={formData.quant_disponivel_mg}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="fornecedor_id">
                      Fornecedor *
                    </label>
                    <Select
                      id="fornecedor_id"
                      name="fornecedor_id"
                      options={fornecedorOptions}
                      value={fornecedorOptions.find(option => option.value === formData.fornecedor_id) || null}
                      onChange={handleFornecedorChange}
                      isDisabled={loading || !fornecedores.length}
                      placeholder={fornecedores.length ? "Selecione um fornecedor..." : "Carregando..."}
                      styles={customSelectStyles}
                      isSearchable={true}
                      isClearable={true}
                      classNamePrefix="react-select"
                      noOptionsMessage={() => "Nenhuma opção"}
                      loadingMessage={() => "Carregando..."}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
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

export default LoteForm;
