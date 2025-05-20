import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function FornecedorForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cnpj: '',
    razao_social: '',
    fantasia: ''
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

    // Se estiver editando, carregar os dados do fornecedor
    if (isEditing) {
      fetchFornecedor();
    }
  }, [isEditing, id, navigate]);

  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/fornecedores/${id}/`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar fornecedor:', error);
      setError('Erro ao carregar dados do fornecedor.');
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
      
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/fornecedores/${id}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/fornecedores/', formData);
      }
      
      navigate('/fornecedores');
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      setError('Erro ao salvar fornecedor. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/fornecedores');
  };

  if (loading && isEditing) {
    return <p>Carregando dados do fornecedor...</p>;
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>{isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cnpj">CNPJ:</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="razao_social">Razão Social:</label>
            <input
              type="text"
              id="razao_social"
              name="razao_social"
              value={formData.razao_social}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group form-full-width">
            <label htmlFor="fantasia">Nome Fantasia:</label>
            <input
              type="text"
              id="fantasia"
              name="fantasia"
              value={formData.fantasia}
              onChange={handleChange}
              required
            />
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

export default FornecedorForm;