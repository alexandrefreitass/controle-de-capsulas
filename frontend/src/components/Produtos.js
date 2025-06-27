import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';
import Layout from './Layout';

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
            <h1 className="module-title">
              <Icon name="Package" size={32} className="module-title-icon" />
              Gestão de Produtos
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Novo Produto
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
            ) : produtos.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Package" size={48} />
                </div>
                <h3>Nenhum produto cadastrado</h3>
                <p>Comece adicionando seu primeiro produto.</p>
                <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                  <Icon name="Plus" size={16} />
                  Adicionar Produto
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
                            <Icon name="Eye" size={14} />
                            Detalhes
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(produto.id)}
                          >
                            <Icon name="Edit" size={14} />
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(produto.id)}
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

export default Produtos;