
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Producao() {
  const [lotesProducao, setLotesProducao] = useState([]);
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

    fetchLotesProducao();
  }, [navigate]);

  const fetchLotesProducao = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.producao);
      setLotesProducao(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lotes de produção:', error);
      setError('Erro ao carregar lotes de produção. Tente novamente mais tarde.');
      setLoading(false);
    }
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
        await apiClient.delete(apiEndpoints.producaoDetalhe(id));
        fetchLotesProducao();
      } catch (error) {
        console.error('Erro ao excluir lote de produção:', error);
        setError('Erro ao excluir lote de produção. Tente novamente.');
      }
    }
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

          <div className="table-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : lotesProducao.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="Factory" size={48} />
                </div>
                <h3>Nenhum lote de produção cadastrado</h3>
                <p>Comece adicionando seu primeiro lote de produção.</p>
                <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                  <Icon name="Plus" size={16} />
                  Adicionar Lote de Produção
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Lote</th>
                    <th>Tamanho do Lote</th>
                    <th>Data de Produção</th>
                    <th>Matérias-primas Utilizadas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesProducao.map((lote) => (
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
