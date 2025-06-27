
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Success() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalFornecedores: 0,
    totalMateriasPrimas: 0,
    totalProducoes: 0,
    valorTotalEstoque: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    loadDashboardData();
    setLoading(false);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar dados para o dashboard
      const [fornecedoresRes, materiasRes, producaoRes] = await Promise.allSettled([
        apiClient.get(apiEndpoints.fornecedores.list),
        apiClient.get(apiEndpoints.materiasPrimas.list),
        apiClient.get('/api/producao/')
      ]);

      const fornecedores = fornecedoresRes.status === 'fulfilled' ? fornecedoresRes.value.data : [];
      const materias = materiasRes.status === 'fulfilled' ? materiasRes.value.data : [];
      const producoes = producaoRes.status === 'fulfilled' ? producaoRes.value.data : [];

      // Calcular valor total do estoque
      const valorTotal = materias.reduce((total, materia) => {
        const valor = parseFloat(materia.valor_unitario || 0);
        const quantidade = parseFloat(materia.quantidade_estoque || 0);
        return total + (valor * quantidade);
      }, 0);

      setDashboardData({
        totalFornecedores: fornecedores.length,
        totalMateriasPrimas: materias.length,
        totalProducoes: producoes.length,
        valorTotalEstoque: valorTotal
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          {/* Dashboard com Cards de Estatísticas */}
          <section className="db-dashboard-container">
            <header className="db-dashboard-header">
              <div className="db-dashboard-title">
                <h1>KONNEKIT Sistema CNC</h1>
                <h2>Sistema de Gestão Industrial</h2>
              </div>
            </header>

            <section className="db-dashboard-cards">
              <div className="db-dashboard-card">
                <div className="db-dashboard-card-content">
                  <div className="db-dashboard-card-info">
                    <h3>Total de Fornecedores</h3>
                    <p className="db-dashboard-card-value">{dashboardData.totalFornecedores}</p>
                  </div>
                  <div className="db-dashboard-card-icon">
                    <Icon name="Building2" size={20} />
                  </div>
                </div>
                <button 
                  className="db-dashboard-card-link" 
                  onClick={() => navigate('/fornecedores')}
                >
                  Ver fornecedores
                </button>
              </div>

              <div className="db-dashboard-card">
                <div className="db-dashboard-card-content">
                  <div className="db-dashboard-card-info">
                    <h3>Matérias Primas</h3>
                    <p className="db-dashboard-card-value">{dashboardData.totalMateriasPrimas}</p>
                  </div>
                  <div className="db-dashboard-card-icon">
                    <Icon name="FlaskConical" size={20} />
                  </div>
                </div>
                <button 
                  className="db-dashboard-card-link" 
                  onClick={() => navigate('/materias-primas')}
                >
                  Ver matérias primas
                </button>
              </div>

              <div className="db-dashboard-card">
                <div className="db-dashboard-card-content">
                  <div className="db-dashboard-card-info">
                    <h3>Produções Ativas</h3>
                    <p className="db-dashboard-card-value">{dashboardData.totalProducoes}</p>
                  </div>
                  <div className="db-dashboard-card-icon">
                    <Icon name="Factory" size={20} />
                  </div>
                </div>
                <button 
                  className="db-dashboard-card-link" 
                  onClick={() => navigate('/producao')}
                >
                  Ver produções
                </button>
              </div>

              <div className="db-dashboard-card">
                <div className="db-dashboard-card-content">
                  <div className="db-dashboard-card-info">
                    <h3>Valor Total Estoque</h3>
                    <p className="db-dashboard-card-value">{formatCurrency(dashboardData.valorTotalEstoque)}</p>
                  </div>
                  <div className="db-dashboard-card-icon">
                    <Icon name="DollarSign" size={20} />
                  </div>
                </div>
                <p className="db-dashboard-card-description">Soma do valor em estoque</p>
              </div>
            </section>
          </section>

          {/* Seção original do Success - Apps Grid */}
          <div className="dashboard-title">
            <Icon name="LayoutDashboard" size={24} />
            Módulos do Sistema
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
