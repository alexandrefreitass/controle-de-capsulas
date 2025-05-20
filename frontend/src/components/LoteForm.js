import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get(`http://localhost:8000/api/materias-primas/${materiaPrimaId}/`);
      setMateriaPrima(response.data);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar informações da matéria prima.');
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/fornecedores/');
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Erro ao carregar lista de fornecedores.');
    }
  };

  const fetchLote = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/lotes/${id}/`);
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
      const response = await axios.put(`http://localhost:8000/api/lotes/${id}/`, dataToSend);
      console.log('Resposta da edição:', response.data);
    } else {
      const response = await axios.post('http://localhost:8000/api/lotes/', dataToSend);
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

  const handleVoltar = () => {
    navigate(`/materias-primas/${materiaPrimaId}/lotes`);
  };

  if (loading && isEditing) {
    return <p>Carregando dados do lote...</p>;
  }

  // DEBUG
  console.log('Dados do formulário antes do envio:', formData);
  console.log('Tipo de materia_prima_id:', typeof formData.materia_prima_id);
  console.log('Tipo de fornecedor_id:', typeof formData.fornecedor_id);
  console.log('Tipo de quant_total_mg:', typeof formData.quant_total_mg);

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>
          {isEditing ? 'Editar Lote' : 'Novo Lote'} 
          {materiaPrima ? ` - ${materiaPrima.nome}` : ''}
        </h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="lote">Número do Lote:</label>
            <input
              type="text"
              id="lote"
              name="lote"
              value={formData.lote}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nota_fiscal">Nota Fiscal:</label>
            <input
              type="text"
              id="nota_fiscal"
              name="nota_fiscal"
              value={formData.nota_fiscal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quant_total_mg">Quantidade Total (mg):</label>
            <input
              type="number"
              id="quant_total_mg"
              name="quant_total_mg"
              value={formData.quant_total_mg}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quant_disponivel_mg">Quantidade Disponível (mg):</label>
            <input
              type="number"
              id="quant_disponivel_mg"
              name="quant_disponivel_mg"
              value={formData.quant_disponivel_mg}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group form-full-width">
            <label htmlFor="fornecedor_id">Fornecedor:</label>
            <select
              id="fornecedor_id"
              name="fornecedor_id"
              value={formData.fornecedor_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.razao_social}
                </option>
              ))}
            </select>
          </div>
        </div>

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

export default LoteForm;