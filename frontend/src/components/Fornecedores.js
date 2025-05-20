import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
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

    // Carregar fornecedores
    fetchFornecedores();
  }, [navigate]);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/fornecedores/');
      setFornecedores(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError('Erro ao carregar fornecedores. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/success');
  };

  const handleNovo = () => {
    navigate('/fornecedores/novo');
  };

  const handleEditar = (id) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await axios.delete(`http://localhost:8000/api/fornecedores/${id}/`);
        fetchFornecedores(); // Recarregar a lista
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        setError('Erro ao excluir fornecedor. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Gestão de Fornecedores</h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar ao Dashboard</button>
          <button onClick={handleNovo}>Novo Fornecedor</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Carregando fornecedores...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>CNPJ</th>
              <th>Razão Social</th>
              <th>Nome Fantasia</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum fornecedor cadastrado.</td>
              </tr>
            ) : (
              fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td>{fornecedor.cnpj}</td>
                  <td>{fornecedor.razao_social}</td>
                  <td>{fornecedor.fantasia}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEditar(fornecedor.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleExcluir(fornecedor.id)}>Excluir</button>
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

export default Fornecedores;