
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
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

    fetchProdutos();
  }, [navigate]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.produtos);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/success');
  };

  const handleNovo = () => {
    navigate('/produtos/novo');
  };

  const handleDetalhar = (id) => {
    navigate(`/produtos/detalhar/${id}`);
  };

  const handleEditar = (id) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await apiClient.delete(apiEndpoints.produto(id));
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setError('Erro ao excluir produto');
      }
    }
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">🧬 Gestão de Produtos</h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                ← Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                ➕ Novo Produto
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
            ) : produtos.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">🧬</div>
                <h3>Nenhum produto cadastrado</h3>
                <p>Comece adicionando seu primeiro produto.</p>
                <button className="btn btn-primary" onClick={handleNovo}>
                  ➕ Adicionar Produto
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Apresentação</th>
                    <th>Forma Farmacêutica</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{produto.apresentacao}</td>
                      <td>{produto.formula.forma_farmaceutica}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleDetalhar(produto.id)}
                          >
                            👁️ Detalhes
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(produto.id)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(produto.id)}
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

export default Produtos;
