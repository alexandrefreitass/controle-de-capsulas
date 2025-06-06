import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

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
      const response = await apiClient.get(apiEndpoints.fornecedor(id));
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
        await apiClient.put(apiEndpoints.fornecedor(id), formData);
      } else {
        await apiClient.post(apiEndpoints.fornecedores, formData);
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
    return (
      <div className="module-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando dados do fornecedor...</p>
          </div>
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
              {isEditing ? '✏️ Editar Fornecedor' : '➕ Novo Fornecedor'}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                ← Voltar aos Fornecedores
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
                    <label className="form-label" htmlFor="cnpj">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      className="form-input"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="razao_social">
                      Razão Social
                    </label>
                    <input
                      type="text"
                      id="razao_social"
                      name="razao_social"
                      className="form-input"
                      value={formData.razao_social}
                      onChange={handleChange}
                      placeholder="Digite a razão social"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group form-full-width">
                    <label className="form-label" htmlFor="fantasia">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      id="fantasia"
                      name="fantasia"
                      className="form-input"
                      value={formData.fantasia}
                      onChange={handleChange}
                      placeholder="Digite o nome fantasia"
                      required
                      disabled={loading}
                    />
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
                        💾 Salvar
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

export default FornecedorForm;