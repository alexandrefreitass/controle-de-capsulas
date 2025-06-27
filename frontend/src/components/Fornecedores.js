
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    buscarFornecedores();
  }, [navigate]);

  const buscarFornecedores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.fornecedores);
      setFornecedores(response.data);
    } catch (error) {
      setError('Erro ao carregar fornecedores');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/success');
  };

  const handleNovo = () => {
    navigate('/fornecedores/novo');
  };

  const handleEditar = (id) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await apiClient.delete(apiEndpoints.fornecedor(id));
        buscarFornecedores();
      } catch (error) {
        setError('Erro ao excluir fornecedor');
      }
    }
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="Building2" size={32} className="module-title-icon" />
              Gestão de Fornecedores
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Novo Fornecedor
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

          <div className="table-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : fornecedores.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Building2" size={48} />
                </div>
                <h3>Nenhum fornecedor cadastrado</h3>
                <p>Comece adicionando seu primeiro fornecedor.</p>
                <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                  <Icon name="Plus" size={16} />
                  Adicionar Fornecedor
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>CNPJ</th>
                    <th>Razão Social</th>
                    <th>Nome Fantasia</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id}>
                      <td>{fornecedor.cnpj}</td>
                      <td>{fornecedor.razao_social}</td>
                      <td>{fornecedor.fantasia}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(fornecedor.id)}
                          >
                            <Icon name="Edit" size={14} />
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(fornecedor.id)}
                          >
                            <Icon name="Trash2" size={14} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Fornecedores;
