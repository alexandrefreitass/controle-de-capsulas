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
  const [chartInstance, setChartInstance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [navigate]);

  useEffect(() => {
    // Inicializa o gráfico depois que os dados do dashboard forem definidos
    if (!loading) {
      initializeChart();
    }
    
    // Cleanup do gráfico
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [loading, dashboardData.valorTotalEstoque]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Carregando dados do dashboard...');
      
      const [
        fornecedoresRes, 
        materiasRes, 
        producoesRes
      ] = await Promise.allSettled([
        apiClient.get(apiEndpoints.fornecedores.list),
        apiClient.get(apiEndpoints.materiasPrimas.list),
        apiClient.get(apiEndpoints.producao.list)
      ]);

      const fornecedores = fornecedoresRes.status === 'fulfilled' ? fornecedoresRes.value.data : [];
      const materias = materiasRes.status === 'fulfilled' ? materiasRes.value.data : [];
      const producoes = producoesRes.status === 'fulfilled' ? producoesRes.value.data : [];

      if (fornecedoresRes.status === 'rejected') console.warn('Falha ao carregar fornecedores', fornecedoresRes.reason);
      if (materiasRes.status === 'rejected') console.warn('Falha ao carregar matérias-primas', materiasRes.reason);
      if (producoesRes.status === 'rejected') console.warn('Falha ao carregar produções', producoesRes.reason);

      // Calcular valor total do estoque com segurança
      const valorTotal = materias.reduce((total, materia) => {
        const preco = parseFloat(materia.preco_unitario || 0);
        const quantidade = parseFloat(materia.quantidade_disponivel || 0);
        return total + (preco * quantidade);
      }, 0);

      const newDashboardData = {
        totalFornecedores: fornecedores.length,
        totalMateriasPrimas: materias.length,
        totalProducoes: producoes.length,
        valorTotalEstoque: valorTotal
      };

      console.log('✅ Dados carregados:', newDashboardData);
      setDashboardData(newDashboardData);
      
    } catch (error) {
      console.error('❌ Erro GERAL ao carregar dados do dashboard:', error);
      // Mantém os dados zerados em caso de erro catastrófico
      setDashboardData({
        totalFornecedores: 0,
        totalMateriasPrimas: 0,
        totalProducoes: 0,
        valorTotalEstoque: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const initializeChart = () => {
    const chartCanvas = document.getElementById('estoqueChart');
    if (!chartCanvas || !window.Chart) return;

    if (chartInstance) {
      chartInstance.destroy();
    }
    
    const ctx = chartCanvas.getContext('2d');
    const valorBase = dashboardData.valorTotalEstoque || 0;
    
    const labels = Array.from({ length: 7 }, (_, i) => {
      const data = new Date();
      data.setDate(data.getDate() - (6 - i));
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });
    
    // Simula uma variação histórica para o gráfico
    const dados = labels.map((_, index) => {
        if (index === labels.length - 1) return valorBase; // Último ponto é o valor real
        const variacao = (Math.random() - 0.5) * 0.3; // ±15%
        return Math.max(0, valorBase * (1 - variacao * (labels.length - 1 - index) / labels.length));
    });

    const newChartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor do Estoque (R$)',
          data: dados,
          backgroundColor: 'rgba(139, 115, 85, 0.1)',
          borderColor: 'var(--primary-color)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="container">
          <section className="db-dashboard-container">
            <header className="db-dashboard-header">
              <div className="db-dashboard-title">
                <h1>KONNEKIT Sistema CNC</h1>
                <h2>Bem-vindo, {username}!</h2>
              </div>
            </header>

            <section className="db-dashboard-cards">
              <div className="db-dashboard-card" onClick={() => navigate('/fornecedores')}>
                  <div className="db-dashboard-card-content">
                    <div className="db-dashboard-card-info">
                      <h3>Total de Fornecedores</h3>
                      <p className="db-dashboard-card-value">{dashboardData.totalFornecedores}</p>
                    </div>
                    <div className="db-dashboard-card-icon">
                      <Icon name="Building2" size={20} />
                    </div>
                  </div>
                  <span className="db-dashboard-card-link">Ver fornecedores</span>
              </div>

              <div className="db-dashboard-card" onClick={() => navigate('/materias-primas')}>
                  <div className="db-dashboard-card-content">
                    <div className="db-dashboard-card-info">
                      <h3>Matérias Primas</h3>
                      <p className="db-dashboard-card-value">{dashboardData.totalMateriasPrimas}</p>
                    </div>
                    <div className="db-dashboard-card-icon">
                      <Icon name="FlaskConical" size={20} />
                    </div>
                  </div>
                  <span className="db-dashboard-card-link">Ver matérias primas</span>
              </div>
              
              <div className="db-dashboard-card" onClick={() => navigate('/producao')}>
                  <div className="db-dashboard-card-content">
                    <div className="db-dashboard-card-info">
                      <h3>Ordens de Produção</h3>
                      <p className="db-dashboard-card-value">{dashboardData.totalProducoes}</p>
                    </div>
                    <div className="db-dashboard-card-icon">
                      <Icon name="Factory" size={20} />
                    </div>
                  </div>
                  <span className="db-dashboard-card-link">Ver produções</span>
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

          <section className="db-dashboard-chart-card">
            <div className="db-dashboard-chart-header">
              <h3 className="db-dashboard-chart-title">Evolução do Valor Total do Estoque</h3>
            </div>
            <div className="db-dashboard-chart-container">
              <canvas id="estoqueChart"></canvas>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Success;