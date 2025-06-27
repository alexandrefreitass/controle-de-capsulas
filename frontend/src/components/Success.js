import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

function Success() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!loading && !username) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-title">
            <Icon name="LayoutDashboard" size={24} />
            Sistema de Gestão
          </div>
          <div className="dashboard-subtitle">
            Selecione um módulo abaixo para começar
          </div>

          <div className="apps-grid">
            <div className="app-card" onClick={() => navigate('/fornecedores')}>
              <div className="app-card-icon">
                <Icon name="Building2" size={40} />
              </div>
              <div className="app-card-title">Fornecedores</div>
              <div className="app-card-description">
                Gerencie informações de fornecedores, contatos e dados comerciais
              </div>
            </div>

            <div className="app-card" onClick={() => navigate('/materias-primas')}>
              <div className="app-card-icon">
                <Icon name="FlaskConical" size={40} />
              </div>
              <div className="app-card-title">Matérias Primas</div>
              <div className="app-card-description">
                Controle de estoque, lotes e movimentação de materiais
              </div>
            </div>

            <div className="app-card" onClick={() => navigate('/producao')}>
              <div className="app-card-icon">
                <Icon name="Factory" size={40} />
              </div>
              <div className="app-card-title">Produção</div>
              <div className="app-card-description">
                Acompanhe processos produtivos e controle de qualidade
              </div>
            </div>

            <div className="app-card" onClick={() => navigate('/produtos')}>
              <div className="app-card-icon">
                <Icon name="Package" size={40} />
              </div>
              <div className="app-card-title">Produtos</div>
              <div className="app-card-description">
                Catálogo de produtos, especificações e informações técnicas
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Success;