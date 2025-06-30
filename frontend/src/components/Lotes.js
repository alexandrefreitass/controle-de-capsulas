
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

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
      const response = await apiClient.get(apiEndpoints.materiasPrimas.detail(materiaPrimaId));
      setMateriaPrima(response.data);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar informações da matéria prima.');
    }
  };

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.lotes.list);
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
        await apiClient.delete(apiEndpoints.lotes.detail(id));
        fetchLotes();
      } catch (error) {
        console.error('Erro ao excluir lote:', error);
        setError('Erro ao excluir lote. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="Package" size={32} className="module-title-icon" />
              Lotes de {materiaPrima ? materiaPrima.nome : 'Matéria Prima'}
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar às Matérias Primas
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Novo Lote
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert alert-error">
            <Icon name="AlertCircle" size={16} />
            {error}
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : lotes.length === 0 ? (
            <div className="table-empty">
              <div className="table-empty-icon">
                <Icon name="Package" size={48} />
              </div>
              <h3>Nenhum lote cadastrado</h3>
              <p>Nenhum lote foi cadastrado para esta matéria prima ainda.</p>
              <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Adicionar Primeiro Lote
              </button>
            </div>
          ) : (
            <table className="table">
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
                {lotes.map((lote) => (
                  <tr key={lote.id}>
                    <td>{lote.lote}</td>
                    <td>{lote.quant_total_mg} mg</td>
                    <td>{lote.quant_disponivel_mg} mg</td>
                    <td>{lote.nota_fiscal}</td>
                    <td>{lote.fornecedor.razao_social}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleEditar(lote.id)}
                        >
                          <Icon name="Edit" size={14} />
                          Editar
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
      </main>
    </div>
  );
}

export default Lotes;
