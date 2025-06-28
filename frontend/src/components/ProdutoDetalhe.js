import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

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
    return <p>Carregando detalhes do produto...</p>;
  }

  if (error) {
    return (
      <div className="module-container">
        <div className="error">{error}</div>
        <button onClick={handleVoltar}>Voltar</button>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="module-container">
        <div className="error">Produto não encontrado.</div>
        <button onClick={handleVoltar}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Detalhes do Produto</h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar</button>
          <button onClick={handleEditar}>Editar</button>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-section">
          <h3>Informações Gerais</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Nome:</th>
                <td>{produto.nome}</td>
              </tr>
              <tr>
                <th>Descrição:</th>
                <td>{produto.descricao}</td>
              </tr>
              <tr>
                <th>Apresentação:</th>
                <td>{produto.apresentacao}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h3>Fórmula</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Forma Farmacêutica:</th>
                <td>{produto.formula.forma_farmaceutica}</td>
              </tr>
              <tr>
                <th>Unidades Padrão:</th>
                <td>{produto.formula.quant_unid_padrao}</td>
              </tr>
              <tr>
                <th>Peso Padrão (kg):</th>
                <td>{produto.formula.quant_kg_padrao}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h3>Ingredientes</h3>
          {!produto.formula.ingredientes || produto.formula.ingredientes.length === 0 ? (
            <p>Nenhum ingrediente cadastrado para este produto.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matéria-prima</th>
                  <th>Lote</th>
                  <th>Quantidade (mg)</th>
                </tr>
              </thead>
              <tbody>
                {produto.formula.ingredientes.map((ingrediente) => (
                  <tr key={ingrediente.id}>
                    <td>{ingrediente.lote_materia_prima.materia_prima.nome}</td>
                    <td>{ingrediente.lote_materia_prima.numero_lote}</td>
                    <td>{ingrediente.quant_mg} mg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProdutoDetalhe;