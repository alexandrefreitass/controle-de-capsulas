
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState({
    campo: '',
    direcao: 'asc' // 'asc' ou 'desc'
  });
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

  // Filtrar produtos quando o termo de busca ou a lista mudar
  useEffect(() => {
    filtrarProdutos();
  }, [produtos, termoBusca]);

  // Ordenar produtos quando a ordenação mudar
  useEffect(() => {
    if (ordenacao.campo) {
      ordenarProdutos();
    }
  }, [ordenacao]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.produtos.list);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProdutos = () => {
    if (!termoBusca.trim()) {
      setProdutosFiltrados(produtos);
      return;
    }

    const termoLower = termoBusca.toLowerCase();
    const filtrados = produtos.filter(produto => 
      produto.nome.toLowerCase().includes(termoLower) ||
      produto.apresentacao.toLowerCase().includes(termoLower) ||
      produto.formula.forma_farmaceutica.toLowerCase().includes(termoLower)
    );
    
    setProdutosFiltrados(filtrados);
  };

  const ordenarProdutos = () => {
    const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
      let valorA, valorB;

      if (ordenacao.campo === 'forma_farmaceutica') {
        valorA = a.formula.forma_farmaceutica?.toString().toLowerCase() || '';
        valorB = b.formula.forma_farmaceutica?.toString().toLowerCase() || '';
      } else {
        valorA = a[ordenacao.campo]?.toString().toLowerCase() || '';
        valorB = b[ordenacao.campo]?.toString().toLowerCase() || '';
      }

      if (ordenacao.direcao === 'asc') {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });

    setProdutosFiltrados(produtosOrdenados);
  };

  const handleOrdenacao = (campo) => {
    setOrdenacao(prevOrdenacao => ({
      campo,
      direcao: prevOrdenacao.campo === campo && prevOrdenacao.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) {
      return <Icon name="ArrowUpDown" size={14} className="sort-icon" />;
    }
    
    return ordenacao.direcao === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="sort-icon active" />
      : <Icon name="ArrowDown" size={14} className="sort-icon active" />;
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
        await apiClient.delete(apiEndpoints.produtos.detail(id));
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setError('Erro ao excluir produto');
      }
    }
  };

  const limparBusca = () => {
    setTermoBusca('');
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

          {/* Campo de busca */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Icon name="Search" size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por Nome, Apresentação ou Forma Farmacêutica..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="search-input"
              />
              {termoBusca && (
                <button
                  onClick={limparBusca}
                  className="search-clear-btn"
                  title="Limpar busca"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Package" size={48} />
                </div>
                {termoBusca ? (
                  <>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Não foram encontrados produtos que correspondam à sua busca "{termoBusca}".</p>
                    <button className="btn btn-secondary" onClick={limparBusca}>
                      <Icon name="X" size={16} />
                      Limpar busca
                    </button>
                  </>
                ) : (
                  <>
                    <h3>Nenhum produto cadastrado</h3>
                    <p>Comece adicionando seu primeiro produto.</p>
                    <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                      <Icon name="Plus" size={16} />
                      Adicionar Produto
                    </button>
                  </>
                )}
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('nome')}
                      title="Clique para ordenar por Nome"
                    >
                      <span>Nome</span>
                      {renderIconeOrdenacao('nome')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('apresentacao')}
                      title="Clique para ordenar por Apresentação"
                    >
                      <span>Apresentação</span>
                      {renderIconeOrdenacao('apresentacao')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('forma_farmaceutica')}
                      title="Clique para ordenar por Forma Farmacêutica"
                    >
                      <span>Forma Farmacêutica</span>
                      {renderIconeOrdenacao('forma_farmaceutica')}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto) => (
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
