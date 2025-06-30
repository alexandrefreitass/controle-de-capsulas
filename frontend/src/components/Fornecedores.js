
// frontend/src/components/Fornecedores.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState({
    campo: '',
    direcao: 'asc' // 'asc' ou 'desc'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }
    buscarFornecedores();
  }, [navigate]);

  // Filtrar fornecedores quando o termo de busca ou a lista mudar
  useEffect(() => {
    filtrarFornecedores();
  }, [fornecedores, termoBusca]);

  // Ordenar fornecedores quando a ordenação mudar
  useEffect(() => {
    if (ordenacao.campo) {
      ordenarFornecedores();
    }
  }, [ordenacao]);

  const buscarFornecedores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.fornecedores.list);
      setFornecedores(response.data);
    } catch (error) {
      setError('Erro ao carregar fornecedores');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarFornecedores = () => {
    if (!termoBusca.trim()) {
      setFornecedoresFiltrados(fornecedores);
      return;
    }

    const termoLower = termoBusca.toLowerCase();
    const filtrados = fornecedores.filter(fornecedor => 
      fornecedor.cnpj.toLowerCase().includes(termoLower) ||
      fornecedor.razao_social.toLowerCase().includes(termoLower) ||
      fornecedor.fantasia.toLowerCase().includes(termoLower)
    );
    
    setFornecedoresFiltrados(filtrados);
  };

  const ordenarFornecedores = () => {
    const fornecedoresOrdenados = [...fornecedoresFiltrados].sort((a, b) => {
      const valorA = a[ordenacao.campo]?.toString().toLowerCase() || '';
      const valorB = b[ordenacao.campo]?.toString().toLowerCase() || '';

      if (ordenacao.direcao === 'asc') {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });

    setFornecedoresFiltrados(fornecedoresOrdenados);
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
    navigate('/fornecedores/novo');
  };

  const handleEditar = (id) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await apiClient.delete(apiEndpoints.fornecedores.detail(id));
        buscarFornecedores(); // Re-fetch na lista para atualizar a UI
      } catch (err) {
        console.error('Erro ao excluir fornecedor:', err);

        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Erro ao excluir fornecedor. Verifique o console para mais detalhes.');
        }
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

          {/* Campo de busca */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Icon name="Search" size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por CNPJ, Razão Social ou Nome Fantasia..."
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
            ) : fornecedoresFiltrados.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Building2" size={48} />
                </div>
                {termoBusca ? (
                  <>
                    <h3>Nenhum fornecedor encontrado</h3>
                    <p>Não foram encontrados fornecedores que correspondam à sua busca "{termoBusca}".</p>
                    <button className="btn btn-secondary" onClick={limparBusca}>
                      <Icon name="X" size={16} />
                      Limpar busca
                    </button>
                  </>
                ) : (
                  <>
                    <h3>Nenhum fornecedor cadastrado</h3>
                    <p>Comece adicionando seu primeiro fornecedor.</p>
                    <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                      <Icon name="Plus" size={16} />
                      Adicionar Fornecedor
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
                      onClick={() => handleOrdenacao('cnpj')}
                      title="Clique para ordenar por CNPJ"
                    >
                      <span>CNPJ</span>
                      {renderIconeOrdenacao('cnpj')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('razao_social')}
                      title="Clique para ordenar por Razão Social"
                    >
                      <span>Razão Social</span>
                      {renderIconeOrdenacao('razao_social')}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleOrdenacao('fantasia')}
                      title="Clique para ordenar por Nome Fantasia"
                    >
                      <span>Nome Fantasia</span>
                      {renderIconeOrdenacao('fantasia')}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedoresFiltrados.map((fornecedor) => (
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
