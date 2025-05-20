import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Success() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar o nome de usuário do localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Se não houver usuário logado, redirecionar para login
  if (!loading && !username) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema CNC - KONNEKIT</h1>
        <div className="user-info">
          <span>Bem-vindo, {username}!</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <div className="apps-grid">
        <div className="app-card" onClick={() => navigate('/fornecedores')}>
          <h3>Fornecedores</h3>
          <p>Gerenciamento de fornecedores</p>
        </div>
        
        <div className="app-card" onClick={() => navigate('/materias-primas')}>
          <h3>Matérias Primas</h3>
          <p>Controle de estoque e materiais</p>
        </div>
        
        <div className="app-card" onClick={() => navigate('/producao')}>
          <h3>Produção</h3>
          <p>Acompanhamento de produção</p>
        </div>
        
        <div className="app-card" onClick={() => navigate('/produtos')}>
          <h3>Produtos</h3>
          <p>Catálogo de produtos</p>
        </div>

        <div className="app-card" onClick={() => navigate('/materias-primas')}>
          <h3>Matérias Primas</h3>
          <p>Controle de estoque e materiais</p>
        </div>

      </div>
    </div>
  );
}

export default Success;