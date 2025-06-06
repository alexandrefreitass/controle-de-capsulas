
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

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
      const response = await apiClient.get(apiEndpoints.materiaPrima(id));
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
        await apiClient.put(apiEndpoints.materiaPrima(id), formData);
      } else {
        await apiClient.post(apiEndpoints.materiasPrimas, formData);
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
              {isEditing ? '✏️ Editar Matéria Prima' : '➕ Nova Matéria Prima'}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                ← Voltar às Matérias Primas
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nome">Nome da Matéria Prima</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex: Vitamina C"
                      required
                    />
                  </div>

                  <div className="form-group form-full-width">
                    <label htmlFor="desc">Descrição</label>
                    <textarea
                      id="desc"
                      name="desc"
                      value={formData.desc}
                      onChange={handleChange}
                      placeholder="Descreva as características da matéria prima..."
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleVoltar}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner spinner-sm"></div>
                        Salvando...
                      </>
                    ) : (
                      '💾 Salvar'
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
