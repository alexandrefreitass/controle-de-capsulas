
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function FornecedorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    cnpj: '',
    razao_social: '',
    fantasia: '',
    email: '',
    telefone: '',
    endereco: ''
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

    if (isEditing) {
      buscarFornecedor();
    }
  }, [id, isEditing, navigate]);

  const buscarFornecedor = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.fornecedores.detail(id));
      setFormData(response.data);
    } catch (error) {
      setError('Erro ao carregar fornecedor');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      if (isEditing) {
        await apiClient.put(apiEndpoints.fornecedores.detail(id), formData);
      } else {
        await apiClient.post(apiEndpoints.fornecedores.list, formData);
      }

      navigate('/fornecedores');
    } catch (error) {
      console.error('Erro completo:', error);

      if (error.response) {
        console.error('Dados da resposta de erro:', error.response.data);

        if (error.response.data && error.response.data.error) {
          setError(`Erro ao salvar fornecedor: ${error.response.data.error}`);
        } else {
          setError(`Erro ao salvar fornecedor. Código: ${error.response.status}`);
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
    navigate('/fornecedores');
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
                  Editar Fornecedor
                </>
              ) : (
                <>
                  <Icon name="Plus" size={20} className="module-title-icon" />
                  Novo Fornecedor
                </>
              )}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar aos Fornecedores
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
                      placeholder="Ex: 12.345.678/0001-90"
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
                      placeholder="Ex: Empresa XYZ Ltda"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
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
                      placeholder="Ex: XYZ Store"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ex: contato@empresa.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="telefone">
                      Telefone
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      className="form-input"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="Ex: (11) 99999-9999"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group form-full-width">
                    <label className="form-label" htmlFor="endereco">
                      Endereço
                    </label>
                    <textarea
                      id="endereco"
                      name="endereco"
                      className="form-input"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo do fornecedor..."
                      rows="3"
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

export default FornecedorForm;
