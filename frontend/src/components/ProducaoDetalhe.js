import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

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
    return <p>Carregando detalhes do lote de produção...</p>;
  }

  if (error) {
    return (
      <div className="module-container">
        <div className="error">{error}</div>
        <button onClick={handleVoltar}>Voltar</button>
      </div>
    );
  }

  if (!loteProducao) {
    return (
      <div className="module-container">
        <div className="error">Lote de produção não encontrado.</div>
        <button onClick={handleVoltar}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Detalhes do Lote de Produção</h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      <div className="detail-container">
        <div className="detail-section">
          <h3>Informações Gerais</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Produto:</th>
                <td>{loteProducao.produto.nome}</td>
              </tr>
              <tr>
                <th>Lote:</th>
                <td>{loteProducao.lote}</td>
              </tr>
              <tr>
                <th>Tamanho do Lote:</th>
                <td>{loteProducao.lote_tamanho}</td>
              </tr>
              <tr>
                <th>Data de Produção:</th>
                <td>{formatarData(loteProducao.data_producao)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h3>Matérias-primas Utilizadas</h3>
          {loteProducao.materiais_consumidos.length === 0 ? (
            <p>Nenhuma matéria-prima registrada para este lote.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matéria-prima</th>
                  <th>Lote</th>
                  <th>Quantidade Consumida (mg)</th>
                </tr>
              </thead>
              <tbody>
                {loteProducao.materiais_consumidos.map((material) => (
                  <tr key={material.id}>
                    <td>{material.lote_materia_prima.materia_prima.nome}</td>
                    <td>{material.lote_materia_prima.numero_lote}</td>
                    <td>{material.quant_consumida_mg} mg</td>
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

export default ProducaoDetalhe;