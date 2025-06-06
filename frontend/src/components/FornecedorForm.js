
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import { Edit, Plus, ArrowLeft, Save, AlertTriangle } from 'lucide-react';

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
      const response = await apiClient.get(apiEndpoints.fornecedor(id));
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
        await apiClient.put(apiEndpoints.fornecedor(id), formData);
      } else {
        await apiClient.post(apiEndpoints.fornecedores, formData);
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

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              {isEditing ? (
                <>
                  <Edit className="module-title-icon" />
                  Editar Fornecedor
                </>
              ) : (
                <>
                  <Plus className="module-title-icon" />
                  Novo Fornecedor
                </>
              )}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <ArrowLeft size={16} />
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
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

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
                  className="form-input"
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
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fantasia">Nome Fantasia:</label>
                <input
                  type="text"
                  id="fantasia"
                  name="fantasia"
                  value={formData.fantasia}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone:</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="endereco">Endereço:</label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleVoltar}>
                <ArrowLeft size={16} />
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} />
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default FornecedorForm;
