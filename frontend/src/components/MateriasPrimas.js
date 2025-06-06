
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function MateriasPrimas() {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
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

    fetchMateriasPrimas();
  }, [navigate]);

  const fetchMateriasPrimas = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.materiasPrimas);
      setMateriasPrimas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matérias primas:', error);
      setError('Erro ao carregar matérias primas. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/success');
  };

  const handleNovo = () => {
    navigate('/materias-primas/novo');
  };

  const handleLotes = (id) => {
    navigate(`/materias-primas/${id}/lotes`);
  };

  const handleEditar = (id) => {
    navigate(`/materias-primas/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria prima?')) {
      try {
        await apiClient.delete(apiEndpoints.materiaPrima(id));
        fetchMateriasPrimas();
      } catch (error) {
        console.error('Erro ao excluir matéria prima:', error);
        setError('Erro ao excluir matéria prima. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="FlaskConical" size={32} className="module-title-icon" />
              Gestão de Matérias Primas
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar ao Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleNovo}>
                <Icon name="Plus" size={16} />
                Nova Matéria Prima
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
            ) : materiasPrimas.length === 0 ? (
              <div className="table-empty">
                <div className="table-empty-icon">
                  <Icon name="FlaskConical" size={48} />
                </div>
                <h3>Nenhuma matéria prima cadastrada</h3>
                <p>Comece adicionando sua primeira matéria prima.</p>
                <button className="btn btn-primary" onClick={handleNovo}>
                  <Icon name="Plus" size={16} />
                  Adicionar Matéria Prima
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materiasPrimas.map((materiaPrima) => (
                    <tr key={materiaPrima.id}>
                      <td>{materiaPrima.nome}</td>
                      <td>{materiaPrima.desc}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleLotes(materiaPrima.id)}
                          >
                            <Icon name="Package" size={14} />
                            Lotes
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(materiaPrima.id)}
                          >
                            <Icon name="Edit" size={14} />
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(materiaPrima.id)}
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

export default MateriasPrimas;
