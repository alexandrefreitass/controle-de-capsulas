// frontend/src/components/MateriaPrimaForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

// Estilos customizados para o React Select (sem alterações aqui)
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
    zIndex: 1000
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

const unidadeDeMedidaOptions = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'unidade', label: 'Unidade' }
];


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
    preco_unitario: 0
  });

  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    fetchFornecedores();

    if (isEditing) {
      fetchMateriaPrima();
    }
  }, [isEditing, id, navigate]);

  const fetchFornecedores = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.fornecedores.list);
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Não foi possível carregar a lista de fornecedores.');
    }
  };

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.materiasPrimas.detail(id));
      const fetchedData = response.data;

      // ===================================================================
      // AQUI ESTÁ A CORREÇÃO PRINCIPAL
      // Vamos garantir que nenhum valor `null` seja passado para o estado.
      // Substituímos `null` por string vazia `''` para todos os campos.
      // ===================================================================
      const sanitizedData = {};
      for (const key in formData) {
        sanitizedData[key] = fetchedData[key] ?? '';
      }

      // Tratamento especial para o ID do fornecedor
      sanitizedData.fornecedor_id = fetchedData.fornecedor ? fetchedData.fornecedor.id : '';

      // Formatar datas para o input type="date"
      sanitizedData.data_fabricacao = formatDateForInput(fetchedData.data_fabricacao);
      sanitizedData.data_validade = formatDateForInput(fetchedData.data_validade);

      setFormData(sanitizedData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar dados da matéria prima.');
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Checa se a data já está no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

    // Converte outros formatos
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Retorna vazio se a data for inválida
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUnidadeMedidaChange = (selectedOption) => {
    setFormData({
      ...formData,
      unidade_medida: selectedOption ? selectedOption.value : ''
    });
  };

  const handleFornecedorChange = (selectedOption) => {
    setFormData({
      ...formData,
      fornecedor_id: selectedOption ? selectedOption.value : ''
    });
  };

  const fornecedorOptions = fornecedores.map(fornecedor => ({
    value: fornecedor.id,
    label: fornecedor.razao_social
  }));

  const validateForm = () => {
    const requiredFields = [
      'nome', 'cod_interno', 'numero_lote', 'nota_fiscal', 
      'fornecedor_id', 'data_fabricacao', 'data_validade'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => {
        const fieldMap = {
          'nome': 'Nome',
          'cod_interno': 'Código Interno',
          'numero_lote': 'Número do Lote',
          'nota_fiscal': 'Nota Fiscal',
          'fornecedor_id': 'Fornecedor',
          'data_fabricacao': 'Data de Fabricação',
          'data_validade': 'Data de Validade'
        };
        return fieldMap[field] || field;
      });

      setError(`Campos obrigatórios não preenchidos: ${fieldNames.join(', ')}`);
      return false;
    }

    if (formData.preco_unitario < 0) {
      setError('O preço unitário não pode ser negativo');
      return false;
    }

    if (formData.quantidade_disponivel < 0) {
      setError('A quantidade disponível não pode ser negativa');
      return false;
    }

    if (formData.data_fabricacao && formData.data_validade) {
      const fabricacao = new Date(formData.data_fabricacao);
      const validade = new Date(formData.data_validade);

      if (validade <= fabricacao) {
        setError('A data de validade deve ser posterior à data de fabricação');
        return false;
      }
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

      // Prepara os dados para envio, convertendo strings vazias para null onde o backend espera
      const dataToSend = { ...formData };
      for (const key in dataToSend) {
        if (dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      }
      // Garante que os campos numéricos sejam números
      dataToSend.cod_interno = parseInt(dataToSend.cod_interno, 10);
      dataToSend.nota_fiscal = parseInt(dataToSend.nota_fiscal, 10);
      dataToSend.fornecedor_id = parseInt(dataToSend.fornecedor_id, 10);
      dataToSend.dias_validade_apos_aberto = parseInt(dataToSend.dias_validade_apos_aberto, 10) || 30;
      dataToSend.quantidade_disponivel = parseFloat(dataToSend.quantidade_disponivel) || 0;
      dataToSend.preco_unitario = parseFloat(dataToSend.preco_unitario) || 0;


      if (isEditing) {
        await apiClient.put(apiEndpoints.materiasPrimas.detail(id), dataToSend);
      } else {
        await apiClient.post(apiEndpoints.materiasPrimas.list, dataToSend);
      }

      navigate('/materias-primas');
    } catch (error) {
      console.error('Erro ao salvar matéria prima:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao salvar matéria prima. Verifique os dados e tente novamente.';
      setError(errorMsg);
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

  // O restante do JSX do seu formulário continua igual.
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
                      />
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
                      <Select
                        id="unidade_medida"
                        name="unidade_medida"
                        options={unidadeDeMedidaOptions}
                        value={unidadeDeMedidaOptions.find(option => option.value === formData.unidade_medida)}
                        onChange={handleUnidadeMedidaChange}
                        isDisabled={loading}
                        placeholder="Selecione uma unidade..."
                        styles={customSelectStyles}
                        isSearchable={true}
                        classNamePrefix="react-select"
                      />
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