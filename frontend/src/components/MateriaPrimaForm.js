import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function MateriaPrimaForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    desc: ''
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

    // Se estiver editando, carregar os dados da matéria prima
    if (isEditing) {
      fetchMateriaPrima();
    }
  }, [isEditing, id, navigate]);

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/materias-primas/${id}/`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar dados da matéria prima.');
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
        await axios.put(`http://localhost:8000/api/materias-primas/${id}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/materias-primas/', formData);
      }
      
      navigate('/materias-primas');
    } catch (error) {
      console.error('Erro ao salvar matéria prima:', error);
      setError('Erro ao salvar matéria prima. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/materias-primas');
  };

  if (loading && isEditing) {
    return <p>Carregando dados da matéria prima...</p>;
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>{isEditing ? 'Editar Matéria Prima' : 'Nova Matéria Prima'}</h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
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

          <div className="form-group form-full-width">
            <label htmlFor="desc">Descrição:</label>
            <textarea
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
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

export default MateriaPrimaForm;