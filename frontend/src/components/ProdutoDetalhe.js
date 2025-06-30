
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Layout from './Layout';
import Icon from './Icon';

function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
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

    fetchProduto();
  }, [id, navigate]);

  const fetchProduto = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.produtos.detail(id));
      setProduto(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar detalhes do produto:', error);
      setError('Erro ao carregar detalhes do produto. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/produtos');
  };

  const handleEditar = () => {
    navigate(`/produtos/editar/${id}`);
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

  if (!produto) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert-error">
            <Icon name="AlertTriangle" size={16} />
            Produto não encontrado.
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
                Detalhes do Produto
              </h1>
              <div className="module-actions">
                <button className="btn btn-secondary" onClick={handleVoltar}>
                  <Icon name="ArrowLeft" size={16} />
                  Voltar
                </button>
                <button className="btn btn-primary" onClick={handleEditar}>
                  <Icon name="Edit" size={16} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span className="breadcrumb-item">Produtos</span>
            <span className="breadcrumb-separator">
              <Icon name="ChevronRight" size={16} />
            </span>
            <span className="breadcrumb-item">{produto.nome}</span>
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
                    Nome
                  </div>
                  <div className="info-value">{produto.nome}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="FileText" size={16} />
                    Descrição
                  </div>
                  <div className="info-value">{produto.descricao}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Box" size={16} />
                    Apresentação
                  </div>
                  <div className="info-value">{produto.apresentacao}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fórmula */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="Beaker" size={20} />
                Fórmula
              </h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Pill" size={16} />
                    Forma Farmacêutica
                  </div>
                  <div className="info-value">{produto.formula.forma_farmaceutica}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Hash" size={16} />
                    Unidades Padrão
                  </div>
                  <div className="info-value">{produto.formula.quant_unid_padrao}</div>
                </div>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="Scale" size={16} />
                    Peso Padrão (kg)
                  </div>
                  <div className="info-value">{produto.formula.quant_kg_padrao}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="Layers" size={20} />
                Ingredientes
              </h3>
            </div>
            <div className="card-body">
              {!produto.formula.ingredientes || produto.formula.ingredientes.length === 0 ? (
                <div className="table-empty">
                  <div className="table-empty-icon">
                    <Icon name="Layers" size={48} />
                  </div>
                  <p>Nenhum ingrediente cadastrado para este produto.</p>
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
                            Quantidade (mg)
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {produto.formula.ingredientes.map((ingrediente) => (
                        <tr key={ingrediente.id}>
                          <td>{ingrediente.lote_materia_prima.materia_prima.nome}</td>
                          <td>
                            <span className="badge badge-info">
                              {ingrediente.lote_materia_prima.numero_lote}
                            </span>
                          </td>
                          <td>{ingrediente.quant_mg} mg</td>
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

export default ProdutoDetalhe;
