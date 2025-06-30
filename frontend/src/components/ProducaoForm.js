import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
// 1. ✅ Importar o apiClient e os endpoints
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

function ProducaoForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    produto_id: '',
    lote: '',
    lote_tamanho: '',
    data_producao: new Date().toISOString().split('T')[0], // Data atual como padrão
    materiais_consumidos: []
  });

  const [produtos, setProdutos] = useState([]);
  const [lotesMateriasPrimas, setLotesMateriasPrimas] = useState([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);
  const [novoMaterial, setNovoMaterial] = useState({
    lote_materia_prima_id: '',
    quant_consumida_mg: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    // Carregar produtos
    fetchProdutos();

    // Carregar lotes de matérias-primas
    fetchLotesMateriasPrimas();
  }, [navigate]);

  const fetchProdutos = async () => {
    try {
      // 2. ✅ Usar o apiClient e os endpoints
      const response = await apiClient.get(apiEndpoints.produtos.list);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar lista de produtos.');
    }
  };

  const fetchLotesMateriasPrimas = async () => {
    try {
      // 3. ✅ Usar o apiClient e os endpoints
      const response = await apiClient.get(apiEndpoints.lotes.list);
      // Filtrar apenas lotes com quantidade disponível
      const lotesDisponiveis = response.data.filter(lote => lote.quant_disponivel_mg > 0);
      setLotesMateriasPrimas(lotesDisponiveis);
    } catch (error) {
      console.error('Erro ao carregar lotes de matérias-primas:', error);
      setError('Erro ao carregar lista de lotes de matérias-primas.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNovoMaterialChange = (e) => {
    const { name, value } = e.target;
    setNovoMaterial({
      ...novoMaterial,
      [name]: value
    });
  };

  // Handler específico para o React Select de matéria-prima
  const handleMateriaPrimaSelectChange = (selectedOption) => {
    setNovoMaterial({
      ...novoMaterial,
      lote_materia_prima_id: selectedOption ? selectedOption.value : ''
    });
  };

  // Handler específico para o React Select de produto
  const handleProdutoSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      produto_id: selectedOption ? selectedOption.value : ''
    });
  };

  // Criar opções para o React Select
  const materiaPrimaOptions = lotesMateriasPrimas.map(lote => ({
    value: lote.id,
    label: `${lote.materia_prima.nome} - Lote: ${lote.lote} (${lote.quant_disponivel_mg}mg disponível)`
  }));

  // Criar opções para o select de produtos
  const produtoOptions = produtos.map(produto => ({
    value: produto.id,
    label: produto.nome
  }));

  const handleAdicionarMaterial = () => {
    if (!novoMaterial.lote_materia_prima_id || !novoMaterial.quant_consumida_mg) {
      setError('Selecione uma matéria-prima e informe a quantidade consumida.');
      return;
    }

    // Verificar se a quantidade é válida
    const loteSelecionado = lotesMateriasPrimas.find(
      lote => lote.id === parseInt(novoMaterial.lote_materia_prima_id)
    );

    if (!loteSelecionado) {
      setError('Lote de matéria-prima não encontrado.');
      return;
    }

    const quantidadeConsumida = parseFloat(novoMaterial.quant_consumida_mg);

    if (quantidadeConsumida <= 0) {
      setError('A quantidade consumida deve ser maior que zero.');
      return;
    }

    if (quantidadeConsumida > loteSelecionado.quant_disponivel_mg) {
      setError(`Quantidade insuficiente. Disponível: ${loteSelecionado.quant_disponivel_mg}mg`);
      return;
    }

    // Verificar se o lote já foi adicionado
    if (materiaisSelecionados.some(m => m.lote_materia_prima_id === novoMaterial.lote_materia_prima_id)) {
      setError('Este lote de matéria-prima já foi adicionado.');
      return;
    }

    // Adicionar material à lista
    const novosMateriais = [
      ...materiaisSelecionados,
      { ...novoMaterial, id: Date.now() } // ID temporário
    ];

    setMateriaisSelecionados(novosMateriais);

    // Atualizar formData
    setFormData({
      ...formData,
      materiais_consumidos: novosMateriais.map(material => ({
        lote_materia_prima_id: material.lote_materia_prima_id,
        quant_consumida_mg: material.quant_consumida_mg
      }))
    });

    // Limpar o formulário de novo material
    setNovoMaterial({
      lote_materia_prima_id: '',
      quant_consumida_mg: ''
    });

    setError('');
  };

  const handleRemoverMaterial = (id) => {
    const novosMateriais = materiaisSelecionados.filter(material => material.id !== id);

    setMateriaisSelecionados(novosMateriais);

    // Atualizar formData
    setFormData({
      ...formData,
      materiais_consumidos: novosMateriais.map(material => ({
        lote_materia_prima_id: material.lote_materia_prima_id,
        quant_consumida_mg: material.quant_consumida_mg
      }))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (materiaisSelecionados.length === 0) {
      setError('Adicione pelo menos uma matéria-prima consumida.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Converter para formatos corretos
      const dataToSend = {
        ...formData,
        produto_id: parseInt(formData.produto_id),
        lote_tamanho: parseFloat(formData.lote_tamanho),
        materiais_consumidos: formData.materiais_consumidos.map(material => ({
          lote_materia_prima_id: parseInt(material.lote_materia_prima_id),
          quant_consumida_mg: parseFloat(material.quant_consumida_mg)
        }))
      };

      console.log('Enviando dados:', dataToSend);

      // 4. ✅ Usar o apiClient e os endpoints para o POST
      const response = await apiClient.post(apiEndpoints.producao.list, dataToSend);
      console.log('Resposta da criação:', response.data);

      navigate('/producao');
    } catch (error) {
      console.error('Erro completo:', error);

      if (error.response) {
        console.error('Resposta de erro do servidor:', error.response.data);

        if (error.response.data && error.response.data.error) {
          setError(`Erro ao salvar lote de produção: ${error.response.data.error}`);
        } else {
          setError(`Erro ao salvar lote de produção. Código: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor');
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        console.error('Erro na configuração da requisição:', error.message);
        setError('Erro na requisição: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/producao');
  };

  // Encontrar nome da matéria-prima a partir do ID do lote
  const obterNomeMateriaPrima = (loteMpId) => {
    const lote = lotesMateriasPrimas.find(l => l.id === parseInt(loteMpId));
    return lote ? `${lote.materia_prima.nome} (Lote: ${lote.lote})` : 'Não encontrado';
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="Plus" size={20} className="module-title-icon" />
              Novo Lote de Produção
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar à Produção
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
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="produto_id">
                      Produto *
                    </label>
                    <Select
                      id="produto_id"
                      name="produto_id"
                      options={produtoOptions}
                      value={produtoOptions.find(option => option.value === parseInt(formData.produto_id)) || null}
                      onChange={handleProdutoSelectChange}
                      isDisabled={loading}
                      placeholder="Selecione um produto..."
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

                  <div className="form-group">
                    <label className="form-label" htmlFor="lote">
                      Número do Lote
                    </label>
                    <input
                      type="text"
                      id="lote"
                      name="lote"
                      className="form-input"
                      value={formData.lote}
                      onChange={handleChange}
                      placeholder="Ex: L001"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="lote_tamanho">
                      Tamanho do Lote
                    </label>
                    <input
                      type="number"
                      id="lote_tamanho"
                      name="lote_tamanho"
                      className="form-input"
                      value={formData.lote_tamanho}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="data_producao">
                      Data de Produção
                    </label>
                    <input
                      type="date"
                      id="data_producao"
                      name="data_producao"
                      className="form-input"
                      value={formData.data_producao}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-section" style={{ marginTop: '2rem' }}>
                  <h3>Matérias-primas Consumidas</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="lote_materia_prima_id">
                        Matéria-prima (Lote)
                      </label>
                      <Select
                        id="lote_materia_prima_id"
                        name="lote_materia_prima_id"
                        options={materiaPrimaOptions}
                        value={materiaPrimaOptions.find(option => option.value === parseInt(novoMaterial.lote_materia_prima_id)) || null}
                        onChange={handleMateriaPrimaSelectChange}
                        isDisabled={loading}
                        placeholder="Selecione um lote de matéria-prima..."
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

                    <div className="form-group">
                      <label className="form-label" htmlFor="quant_consumida_mg">
                        Quantidade Consumida (mg)
                      </label>
                      <input
                        type="number"
                        id="quant_consumida_mg"
                        name="quant_consumida_mg"
                        className="form-input"
                        value={novoMaterial.quant_consumida_mg}
                        onChange={handleNovoMaterialChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">&nbsp;</label>
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handleAdicionarMaterial}
                        disabled={loading}
                      >
                        <Icon name="Plus" size={16} />
                        Adicionar Matéria-prima
                      </button>
                    </div>
                  </div>

                  {materiaisSelecionados.length > 0 ? (
                    <div className="table-container" style={{ marginTop: '1rem' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Matéria-prima (Lote)</th>
                            <th>Quantidade Consumida (mg)</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materiaisSelecionados.map(material => (
                            <tr key={material.id}>
                              <td>{obterNomeMateriaPrima(material.lote_materia_prima_id)}</td>
                              <td>{material.quant_consumida_mg} mg</td>
                              <td>
                                <div className="table-actions">
                                  <button 
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoverMaterial(material.id)}
                                    disabled={loading}
                                  >
                                    <Icon name="Trash2" size={14} />
                                    Remover
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="table-empty" style={{ marginTop: '1rem' }}>
                      <p>Nenhuma matéria-prima adicionada.</p>
                    </div>
                  )}
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
                        Salvar
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

export default ProducaoForm;