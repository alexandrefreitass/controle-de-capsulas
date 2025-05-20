import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
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

    fetchProdutos();
  }, [navigate]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/produtos/');
      setProdutos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/success');
  };

  const handleNovo = () => {
    navigate('/produtos/novo');
  };

  const handleDetalhar = (id) => {
    navigate(`/produtos/detalhar/${id}`);
  };

  const handleEditar = (id) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:8000/api/produtos/${id}/`);
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setError('Erro ao excluir produto. Tente novamente.');
      }
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Gestão de Produtos</h2>
        <div>
          <button className="back-btn" onClick={handleVoltar}>Voltar ao Dashboard</button>
          <button onClick={handleNovo}>Novo Produto</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Apresentação</th>
              <th>Forma Farmacêutica</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.apresentacao}</td>
                  <td>{produto.formula.forma_farmaceutica}</td>
                  <td className="action-buttons">
                    <button className="view-btn" onClick={() => handleDetalhar(produto.id)}>Detalhes</button>
                    <button className="edit-btn" onClick={() => handleEditar(produto.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleExcluir(produto.id)}>Excluir</button>
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

export default Produtos;