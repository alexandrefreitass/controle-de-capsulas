
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Layout from './Layout';
import Icon from './Icon';

function ProducaoDetalhe() {
  const { id } = useParams();
  const [loteProducao, setLoteProducao] = useState(null);
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

    fetchLoteProducao();
  }, [id, navigate]);

  const fetchLoteProducao = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.producao.detail(id));
      setLoteProducao(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar detalhes do lote de produção:', error);
      setError('Erro ao carregar detalhes do lote de produção. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/producao');
  };

  // Função para formatar a data
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert-error">
            <Icon name="AlertTriangle" size={16} />
            {error}
          </div>
          <button className="btn btn-secondary" onClick={handleVoltar}>
            <Icon name="ArrowLeft" size={16} />
            Voltar
          </button>
        </div>
      </Layout>
    );
  }

  if (!loteProducao) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert-error">
            <Icon name="AlertTriangle" size={16} />
            Lote de produção não encontrado.
          </div>
          <button className="btn btn-secondary" onClick={handleVoltar}>
            <Icon name="ArrowLeft" size={16} />
            Voltar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="module-container">
        <div className="module-header">
          <div className="container">
            <div className="module-nav">
              <h1 className="module-title">
                <Icon name="Package" size={24} className="module-title-icon" />
                Detalhes do Lote de Produção
              </h1>
              <div className="module-actions">
                <button className="btn btn-secondary" onClick={handleVoltar}>
                  <Icon name="ArrowLeft" size={16} />
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span className="breadcrumb-item">Produção</span>
            <span className="breadcrumb-separator">
              <Icon name="ChevronRight" size={16} />
            </span>
            <span className="breadcrumb-item">Lote #{loteProducao.lote}</span>
          </div>

          {/* Informações Gerais */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="Info" size={20} />
                Informações Gerais
              </h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Package" size={16} />
                    Produto
                  </div>
                  <div className="info-value">{loteProducao.produto.nome}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Hash" size={16} />
                    Lote
                  </div>
                  <div className="info-value">{loteProducao.lote}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Scale" size={16} />
                    Tamanho do Lote
                  </div>
                  <div className="info-value">{loteProducao.lote_tamanho}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Calendar" size={16} />
                    Data de Produção
                  </div>
                  <div className="info-value">{formatarData(loteProducao.data_producao)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Matérias-primas Utilizadas */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="Layers" size={20} />
                Matérias-primas Utilizadas
              </h3>
            </div>
            <div className="card-body">
              {loteProducao.materiais_consumidos.length === 0 ? (
                <div className="table-empty">
                  <div className="table-empty-icon">
                    <Icon name="Package" size={48} />
                  </div>
                  <p>Nenhuma matéria-prima registrada para este lote.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Icon name="Package" size={16} />
                            Matéria-prima
                          </div>
                        </th>
                        <th>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Icon name="Hash" size={16} />
                            Lote
                          </div>
                        </th>
                        <th>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Icon name="Scale" size={16} />
                            Quantidade Consumida
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loteProducao.materiais_consumidos.map((material) => (
                        <tr key={material.id}>
                          <td>{material.lote_materia_prima.materia_prima.nome}</td>
                          <td>
                            <span className="badge badge-info">
                              {material.lote_materia_prima.numero_lote}
                            </span>
                          </td>
                          <td>{material.quant_consumida_mg} mg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProducaoDetalhe;
