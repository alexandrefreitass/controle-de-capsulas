import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ProdutoForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    apresentacao: '',
    formula: {
      forma_farmaceutica: '',
      quant_unid_padrao: '',
      quant_kg_padrao: '',
    },
    ingredientes: []
  });
  
  const [apresentacoes, setApresentacoes] = useState([]);
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [formulaSelecionada, setFormulaSelecionada] = useState('nova');
  const [lotesMateriasPrimas, setLotesMateriasPrimas] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState({
    lote_materia_prima_id: '',
    quant_mg: ''
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

    // Carregar apresentações disponíveis
    fetchApresentacoes();
    
    // Carregar formas farmacêuticas disponíveis
    fetchFormasFarmaceuticas();
    
    // Carregar fórmulas existentes
    fetchFormulas();
    
    // Carregar lotes de matérias-primas
    fetchLotesMateriasPrimas();
    
    // Se estiver editando, carregar os dados do produto
    if (isEditing) {
      fetchProduto();
    }
  }, [isEditing, id, navigate]);

  const fetchApresentacoes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/apresentacoes/');
      setApresentacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar apresentações:', error);
      setError('Erro ao carregar apresentações disponíveis.');
    }
  };

  const fetchFormasFarmaceuticas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/formas-farmaceuticas/');
      setFormasFarmaceuticas(response.data);
    } catch (error) {
      console.error('Erro ao carregar formas farmacêuticas:', error);
      setError('Erro ao carregar formas farmacêuticas disponíveis.');
    }
  };

  const fetchFormulas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/formulas/');
      setFormulas(response.data);
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
      setError('Erro ao carregar fórmulas existentes.');
    }
  };

  const fetchLotesMateriasPrimas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lotes/');
      setLotesMateriasPrimas(response.data);
    } catch (error) {
      console.error('Erro ao carregar lotes de matérias-primas:', error);
      setError('Erro ao carregar lotes de matérias-primas.');
    }
  };

  const fetchProduto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/produtos/${id}/`);
      const produtoData = response.data;
      
      setFormData({
        nome: produtoData.nome,
        descricao: produtoData.descricao,
        apresentacao: produtoData.apresentacao,
        formula: {
          id: produtoData.formula.id,
          forma_farmaceutica: produtoData.formula.forma_farmaceutica,
          quant_unid_padrao: produtoData.formula.quant_unid_padrao,
          quant_kg_padrao: produtoData.formula.quant_kg_padrao,
        },
        ingredientes: produtoData.formula.ingredientes || []
      });
      
      // Definir que estamos usando uma fórmula existente
      setFormulaSelecionada('existente');
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setError('Erro ao carregar dados do produto.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('formula.')) {
      const formulaField = name.split('.')[1];
      setFormData({
        ...formData,
        formula: {
          ...formData.formula,
          [formulaField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFormulaChange = (e) => {
    const value = e.target.value;
    setFormulaSelecionada(value);
    
    if (value === 'nova') {
      // Reiniciar dados da fórmula
      setFormData({
        ...formData,
        formula: {
          forma_farmaceutica: '',
          quant_unid_padrao: '',
          quant_kg_padrao: '',
        },
        ingredientes: []
      });
    } else {
      // Carregar fórmula existente
      const formulaId = parseInt(value);
      const formulaEncontrada = formulas.find(f => f.id === formulaId);
      
      if (formulaEncontrada) {
        setFormData({
          ...formData,
          formula: {
            id: formulaEncontrada.id,
            forma_farmaceutica: formulaEncontrada.forma_farmaceutica,
            quant_unid_padrao: formulaEncontrada.quant_unid_padrao,
            quant_kg_padrao: formulaEncontrada.quant_kg_padrao,
          },
          ingredientes: formulaEncontrada.ingredientes || []
        });
      }
    }
  };

  const handleNovoIngredienteChange = (e) => {
    const { name, value } = e.target;
    setNovoIngrediente({
      ...novoIngrediente,
      [name]: value
    });
  };

  const handleAdicionarIngrediente = () => {
    if (!novoIngrediente.lote_materia_prima_id || !novoIngrediente.quant_mg) {
      setError('Selecione uma matéria-prima e informe a quantidade.');
      return;
    }
    
    // Verificar se a quantidade é válida
    const quantidadeMg = parseFloat(novoIngrediente.quant_mg);
    
    if (quantidadeMg <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }
    
    // Verificar se o lote já foi adicionado
    if (formData.ingredientes.some(i => i.lote_materia_prima.id === parseInt(novoIngrediente.lote_materia_prima_id))) {
      setError('Este lote de matéria-prima já foi adicionado.');
      return;
    }
    
    // Buscar detalhes da matéria-prima
    const loteSelecionado = lotesMateriasPrimas.find(lote => lote.id === parseInt(novoIngrediente.lote_materia_prima_id));
    
    if (!loteSelecionado) {
      setError('Lote de matéria-prima não encontrado.');
      return;
    }
    
    // Adicionar ingrediente à lista
    const novoIngredienteCompleto = {
      id: Date.now(), // ID temporário
      lote_materia_prima: {
        id: loteSelecionado.id,
        lote: loteSelecionado.lote,
        materia_prima: {
          id: loteSelecionado.materia_prima.id,
          nome: loteSelecionado.materia_prima.nome
        }
      },
      quant_mg: quantidadeMg
    };
    
    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, novoIngredienteCompleto]
    });
    
    // Limpar o formulário de novo ingrediente
    setNovoIngrediente({
      lote_materia_prima_id: '',
      quant_mg: ''
    });
    
    setError('');
  };

  const handleRemoverIngrediente = (id) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter(ingrediente => ingrediente.id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Preparar dados para envio
      const dataToSend = {
        nome: formData.nome,
        descricao: formData.descricao,
        apresentacao: formData.apresentacao,
        formula: {
          ...(formulaSelecionada === 'existente' && { id: formData.formula.id }),
          forma_farmaceutica: formData.formula.forma_farmaceutica,
          quant_unid_padrao: parseInt(formData.formula.quant_unid_padrao),
          quant_kg_padrao: parseFloat(formData.formula.quant_kg_padrao)
        }
      };
      
      // Adicionar ingredientes apenas se for uma nova fórmula
      if (formulaSelecionada === 'nova' && formData.ingredientes.length > 0) {
        dataToSend.ingredientes = formData.ingredientes.map(ingrediente => ({
          lote_materia_prima_id: ingrediente.lote_materia_prima.id,
          quant_mg: ingrediente.quant_mg
        }));
      }
      
      console.log('Enviando dados:', dataToSend);
      
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8000/api/produtos/${id}/`, dataToSend);
      } else {
        response = await axios.post('http://localhost:8000/api/produtos/', dataToSend);
      }
      
      console.log('Resposta:', response.data);
      navigate('/produtos');
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (error.response) {
        console.error('Resposta de erro do servidor:', error.response.data);
        
        if (error.response.data && error.response.data.error) {
          setError(`Erro ao salvar produto: ${error.response.data.error}`);
        } else {
          setError(`Erro ao salvar produto. Código: ${error.response.status}`);
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
    navigate('/produtos');
  };

  if (loading && isEditing) {
    return <p>Carregando dados do produto...</p>;
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informações Gerais</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apresentacao">Apresentação:</label>
              <select
                id="apresentacao"
                name="apresentacao"
                value={formData.apresentacao}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma apresentação</option>
                {apresentacoes.map(apresentacao => (
                  <option key={apresentacao.value} value={apresentacao.value}>
                    {apresentacao.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-full-width">
              <label htmlFor="descricao">Descrição:</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Fórmula</h3>
          
          {!isEditing && (
            <div className="form-group">
              <label htmlFor="formula_tipo">Tipo de Fórmula:</label>
              <select
                id="formula_tipo"
                name="formula_tipo"
                value={formulaSelecionada}
                onChange={handleFormulaChange}
                required
              >
                <option value="nova">Nova Fórmula</option>
                {formulas.length > 0 && <option value="existente">Fórmula Existente</option>}
                {formulas.map(formula => (
                  <option key={formula.id} value={formula.id}>
                    {formula.forma_farmaceutica} - {formula.quant_unid_padrao} unidades
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="formula.forma_farmaceutica">Forma Farmacêutica:</label>
              <select
                id="formula.forma_farmaceutica"
                name="formula.forma_farmaceutica"
                value={formData.formula.forma_farmaceutica}
                onChange={handleChange}
                required
                disabled={formulaSelecionada !== 'nova' && isEditing}
              >
                <option value="">Selecione uma forma farmacêutica</option>
                {formasFarmaceuticas.map(forma => (
                  <option key={forma.value} value={forma.value}>
                    {forma.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="formula.quant_unid_padrao">Unidades Padrão:</label>
              <input
                type="number"
                id="formula.quant_unid_padrao"
                name="formula.quant_unid_padrao"
                value={formData.formula.quant_unid_padrao}
                onChange={handleChange}
                min="1"
                required
                disabled={formulaSelecionada !== 'nova' && isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formula.quant_kg_padrao">Peso Padrão (kg):</label>
              <input
                type="number"
                id="formula.quant_kg_padrao"
                name="formula.quant_kg_padrao"
                value={formData.formula.quant_kg_padrao}
                onChange={handleChange}
                min="0.001"
                step="0.001"
                required
                disabled={formulaSelecionada !== 'nova' && isEditing}
              />
            </div>
          </div>
        </div>

        {formulaSelecionada === 'nova' && !isEditing && (
          <div className="form-section">
            <h3>Ingredientes</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="lote_materia_prima_id">Matéria-prima (Lote):</label>
                <select
                  id="lote_materia_prima_id"
                  name="lote_materia_prima_id"
                  value={novoIngrediente.lote_materia_prima_id}
                  onChange={handleNovoIngredienteChange}
                >
                  <option value="">Selecione um lote de matéria-prima</option>
                  {lotesMateriasPrimas.map(lote => (
                    <option key={lote.id} value={lote.id}>
                      {lote.materia_prima.nome} - Lote: {lote.lote} ({lote.quant_disponivel_mg}mg disponível)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quant_mg">Quantidade (mg):</label>
                <input
                  type="number"
                  id="quant_mg"
                  name="quant_mg"
                  value={novoIngrediente.quant_mg}
                  onChange={handleNovoIngredienteChange}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <button 
                  type="button" 
                  onClick={handleAdicionarIngrediente}
                  className="add-btn"
                >
                  Adicionar Ingrediente
                </button>
              </div>
            </div>

            {formData.ingredientes.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matéria-prima</th>
                    <th>Lote</th>
                    <th>Quantidade (mg)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.ingredientes.map(ingrediente => (
                    <tr key={ingrediente.id}>
                      <td>{ingrediente.lote_materia_prima.materia_prima.nome}</td>
                      <td>{ingrediente.lote_materia_prima.lote}</td>
                      <td>{ingrediente.quant_mg} mg</td>
                      <td>
                        <button 
                          type="button"
                          className="delete-btn"
                          onClick={() => handleRemoverIngrediente(ingrediente.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum ingrediente adicionado.</p>
            )}
          </div>
        )}

        {(formulaSelecionada !== 'nova' || isEditing) && formData.ingredientes.length > 0 && (
          <div className="form-section">
            <h3>Ingredientes da Fórmula</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matéria-prima</th>
                  <th>Lote</th>
                  <th>Quantidade (mg)</th>
                </tr>
              </thead>
              <tbody>
                {formData.ingredientes.map(ingrediente => (
                  <tr key={ingrediente.id}>
                    <td>{ingrediente.lote_materia_prima.materia_prima.nome}</td>
                    <td>{ingrediente.lote_materia_prima.lote}</td>
                    <td>{ingrediente.quant_mg} mg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" onClick={handleVoltar} style={{ marginRight: '10px' }}>Cancelar</button>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProdutoForm;