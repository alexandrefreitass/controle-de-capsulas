import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:8000/api/producao/');
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
        await axios.delete(`http://localhost:8000/api/producao/${id}/`);
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
      <div className="module-header">
        <h2>Gestão de Produção</h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar ao Dashboard</button>
          <button onClick={handleNovo}>Novo Lote de Produção</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Carregando lotes de produção...</p>
      ) : (
        <table className="data-table">
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
            {lotesProducao.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum lote de produção cadastrado.</td>
              </tr>
            ) : (
              lotesProducao.map((lote) => (
                <tr key={lote.id}>
                  <td>{lote.produto.nome}</td>
                  <td>{lote.lote}</td>
                  <td>{lote.lote_tamanho}</td>
                  <td>{formatarData(lote.data_producao)}</td>
                  <td>{lote.materiais_consumidos.length} item(ns)</td>
                  <td className="action-buttons">
                    <button className="view-btn" onClick={() => handleDetalhar(lote.id)}>Detalhes</button>
                    <button className="delete-btn" onClick={() => handleExcluir(lote.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Producao;