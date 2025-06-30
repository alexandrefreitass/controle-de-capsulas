
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Producao() {
  const [lotesProducao, setLotesProducao] = useState([]);
  const [lotesProducaoFiltrados, setLotesProducaoFiltrados] = useState([]);
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

    fetchLotesProducao();
  }, [navigate]);

  // Filtrar lotes quando o termo de busca ou a lista mudar
  useEffect(() => {
    filtrarLotesProducao();
  }, [lotesProducao, termoBusca]);

  // Ordenar lotes quando a ordenação mudar
  useEffect(() => {
    if (ordenacao.campo) {
      ordenarLotesProducao();
    }
  }, [ordenacao]);

  const fetchLotesProducao = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.producao.list);
      setLotesProducao(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lotes de produção:', error);
      setError('Erro ao carregar lotes de produção. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const filtrarLotesProducao = () => {
    if (!termoBusca.trim()) {
      setLotesProducaoFiltrados(lotesProducao);
      return;
    }

    const termoLower = termoBusca.toLowerCase();
    const filtrados = lotesProducao.filter(lote => 
      lote.produto.nome.toLowerCase().includes(termoLower) ||
      lote.lote.toLowerCase().includes(termoLower) ||
      lote.lote_tamanho.toString().includes(termoLower) ||
      formatarData(lote.data_producao).includes(termoLower)
    );
    
    setLotesProducaoFiltrados(filtrados);
  };

  const ordenarLotesProducao = () => {
    const lotesOrdenados = [...lotesProducaoFiltrados].sort((a, b) => {
      let valorA, valorB;

      switch (ordenacao.campo) {
        case 'produto':
          valorA = a.produto.nome.toLowerCase();
          valorB = b.produto.nome.toLowerCase();
          break;
        case 'data_producao':
          valorA = new Date(a.data_producao);
          valorB = new Date(b.data_producao);
          break;
        case 'lote_tamanho':
          valorA = parseInt(a.lote_tamanho) || 0;
          valorB = parseInt(b.lote_tamanho) || 0;
          break;
        default:
          valorA = a[ordenacao.campo]?.toString().toLowerCase() || '';
          valorB = b[ordenacao.campo]?.toString().toLowerCase() || '';
      }

      if (ordenacao.campo === 'data_producao' || ordenacao.campo === 'lote_tamanho') {
        if (ordenacao.direcao === 'asc') {
          return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
        } else {
          return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
        }
      } else {
        if (ordenacao.direcao === 'asc') {
          return valorA.localeCompare(valorB);
        } else {
          return valorB.localeCompare(valorA);
        }
      }
    });

    setLotesProducaoFiltrados(lotesOrdenados);
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
    navigate('/producao/novo');
  };

  const handleDetalhar = (id) => {
    navigate(`/producao/detalhar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lote de produção? A quantidade das matérias-primas consumidas será devolvida ao estoque.')) {
      try {
        await apiClient.delete(apiEndpoints.producao.detail(id));
        fetchLotesProducao();
      } catch (error) {
        console.error('Erro ao excluir lote de produção:', error);
        setError('Erro ao excluir lote de produção. Tente novamente.');
      }
    }
  };

  const limparBusca = () => {
    setTermoBusca('');
  };

  // Função para formatar a data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="Factory" size={32} className="module-title-icon" />
              Gestão de Produção
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Novo Lote de Produção
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
                placeholder="Buscar por Produto, Lote, Tamanho ou Data de Produção..."
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
            ) : lotesProducaoFiltrados.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Factory" size={48} />
                </div>
                {termoBusca ? (
                  <>
                    <h3>Nenhum lote encontrado</h3>
                    <p>Não foram encontrados lotes que correspondam à sua busca "{termoBusca}".</p>
                    <button className="btn btn-secondary" onClick={limparBusca}>
                      <Icon name="X" size={16} />
                      Limpar busca
                    </button>
                  </>
                ) : (
                  <>
                    <h3>Nenhum lote de produção cadastrado</h3>
                    <p>Comece adicionando seu primeiro lote de produção.</p>
                    <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                      <Icon name="Plus" size={16} />
                      Adicionar Lote de Produção
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
                      onClick={() => handleOrdenacao('produto')}
                      title="Clique para ordenar por Produto"
                    >
                      <span>Produto</span>
                      {renderIconeOrdenacao('produto')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('lote')}
                      title="Clique para ordenar por Lote"
                    >
                      <span>Lote</span>
                      {renderIconeOrdenacao('lote')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('lote_tamanho')}
                      title="Clique para ordenar por Tamanho do Lote"
                    >
                      <span>Tamanho do Lote</span>
                      {renderIconeOrdenacao('lote_tamanho')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('data_producao')}
                      title="Clique para ordenar por Data de Produção"
                    >
                      <span>Data de Produção</span>
                      {renderIconeOrdenacao('data_producao')}
                    </th>
                    <th>Matérias-primas Utilizadas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesProducaoFiltrados.map((lote) => (
                    <tr key={lote.id}>
                      <td>{lote.produto.nome}</td>
                      <td>{lote.lote}</td>
                      <td>{lote.lote_tamanho}</td>
                      <td>{formatarData(lote.data_producao)}</td>
                      <td>{lote.materiais_consumidos.length} item(ns)</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDetalhar(lote.id)}
                          >
                            <Icon name="Eye" size={14} />
                            Detalhes
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(lote.id)}
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

export default Producao;
