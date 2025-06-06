import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';

function Lotes() {
  const { materiaPrimaId } = useParams();
  const [lotes, setLotes] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState(null);
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

    // Carregar a matéria prima
    fetchMateriaPrima();

    // Carregar os lotes
    fetchLotes();
  }, [navigate, materiaPrimaId]);

  const fetchMateriaPrima = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.materiaPrima(materiaPrimaId));
      setMateriaPrima(response.data);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar informações da matéria prima.');
    }
  };

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.lotes);
      // Filtrar apenas os lotes da matéria prima selecionada
      const lotesFiltrados = response.data.filter(
        lote => lote.materia_prima.id === parseInt(materiaPrimaId)
      );
      setLotes(lotesFiltrados);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
      setError('Erro ao carregar lotes. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/materias-primas');
  };

  const handleNovo = () => {
    navigate(`/materias-primas/${materiaPrimaId}/lotes/novo`);
  };

  const handleEditar = (id) => {
    navigate(`/materias-primas/${materiaPrimaId}/lotes/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      try {
        await apiClient.delete(apiEndpoints.lote(id));
        fetchLotes();
      } catch (error) {
        console.error('Erro ao excluir lote:', error);
        setError('Erro ao excluir lote. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>
          Lotes de {materiaPrima ? materiaPrima.nome : 'Matéria Prima'}
        </h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar às Matérias Primas</button>
          <button onClick={handleNovo}>Novo Lote</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Carregando lotes...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Qtd. Total (mg)</th>
              <th>Qtd. Disponível (mg)</th>
              <th>Nota Fiscal</th>
              <th>Fornecedor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lotes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum lote cadastrado para esta matéria prima.</td>
              </tr>
            ) : (
              lotes.map((lote) => (
                <tr key={lote.id}>
                  <td>{lote.lote}</td>
                  <td>{lote.quant_total_mg} mg</td>
                  <td>{lote.quant_disponivel_mg} mg</td>
                  <td>{lote.nota_fiscal}</td>
                  <td>{lote.fornecedor.razao_social}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEditar(lote.id)}>Editar</button>
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

export default Lotes;