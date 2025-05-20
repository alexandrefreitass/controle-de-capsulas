import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:8000/api/materias-primas/');
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
        await axios.delete(`http://localhost:8000/api/materias-primas/${id}/`);
        fetchMateriasPrimas();
      } catch (error) {
        console.error('Erro ao excluir matéria prima:', error);
        setError('Erro ao excluir matéria prima. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Gestão de Matérias Primas</h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar ao Dashboard</button>
          <button onClick={handleNovo}>Nova Matéria Prima</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Carregando matérias primas...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materiasPrimas.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma matéria prima cadastrada.</td>
              </tr>
            ) : (
              materiasPrimas.map((materiaPrima) => (
                <tr key={materiaPrima.id}>
                  <td>{materiaPrima.nome}</td>
                  <td>{materiaPrima.desc}</td>
                  <td className="action-buttons">
                    <button className="lotes-btn" onClick={() => handleLotes(materiaPrima.id)}>Lotes</button>
                    <button className="edit-btn" onClick={() => handleEditar(materiaPrima.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleExcluir(materiaPrima.id)}>Excluir</button>
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

export default MateriasPrimas;