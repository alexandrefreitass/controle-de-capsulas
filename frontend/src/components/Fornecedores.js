
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    buscarFornecedores();
  }, []);

  const buscarFornecedores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/sc_fornecedores/fornecedores/');
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
        await axios.delete(`http://localhost:8000/sc_fornecedores/fornecedores/${id}/`);
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
            <h1 className="module-title">🏢 Gestão de Fornecedores</h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                ← Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                ➕ Novo Fornecedor
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

          <div className="table-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : fornecedores.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">🏢</div>
                <h3>Nenhum fornecedor cadastrado</h3>
                <p>Comece adicionando seu primeiro fornecedor.</p>
                <button className="btn btn-primary" onClick={handleNovo}>
                  ➕ Adicionar Fornecedor
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Contato</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{fornecedor.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {fornecedor.endereco}
                        </div>
                      </td>
                      <td>{fornecedor.cnpj}</td>
                      <td>{fornecedor.telefone}</td>
                      <td>{fornecedor.email}</td>
                      <td>
                        <span className={`badge ${fornecedor.ativo ? 'badge-success' : 'badge-danger'}`}>
                          {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(fornecedor.id)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(fornecedor.id)}
                          >
                            🗑️ Excluir
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
