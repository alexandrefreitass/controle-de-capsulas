
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
  const [chartExpanded, setChartExpanded] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    loadDashboardData();
    setLoading(false);
  }, []);

  useEffect(() => {
    // Cleanup do gráfico quando o componente for desmontado
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Carregando dados do dashboard...');
      
      // Verificar se o backend está rodando
      const backendCheck = await fetch('http://localhost:8000/api/', { 
        method: 'GET',
        mode: 'cors'
      }).catch(err => {
        console.warn('⚠️ Backend não está acessível:', err);
        return null;
      });

      if (!backendCheck || !backendCheck.ok) {
        console.warn('⚠️ Backend não disponível, usando dados de demonstração');
        
        // Dados de demonstração quando o backend não estiver disponível
        const demoData = {
          totalFornecedores: 5,
          totalMateriasPrimas: 12,
          totalProducoes: 3,
          valorTotalEstoque: 25000
        };
        
        setDashboardData(demoData);
        setTimeout(() => initializeChart(demoData.valorTotalEstoque), 100);
        return;
      }

      // Carregar dados reais do backend
      const [fornecedoresRes, materiasRes] = await Promise.allSettled([
        apiClient.get(apiEndpoints.fornecedores.list).catch(err => {
          console.warn('Erro ao carregar fornecedores:', err);
          return { data: [] };
        }),
        apiClient.get(apiEndpoints.materiasPrimas.list).catch(err => {
          console.warn('Erro ao carregar matérias-primas:', err);
          return { data: [] };
        })
      ]);

      const fornecedores = fornecedoresRes.status === 'fulfilled' ? 
        (Array.isArray(fornecedoresRes.value?.data) ? fornecedoresRes.value.data : []) : [];
      const materias = materiasRes.status === 'fulfilled' ? 
        (Array.isArray(materiasRes.value?.data) ? materiasRes.value.data : []) : [];

      // Calcular valor total do estoque
      const valorTotal = materias.reduce((total, materia) => {
        const valor = parseFloat(materia.valor_unitario || 0);
        const quantidade = parseFloat(materia.quantidade_estoque || 0);
        return total + (valor * quantidade);
      }, 0);

      const newDashboardData = {
        totalFornecedores: fornecedores.length,
        totalMateriasPrimas: materias.length,
        totalProducoes: 0, // Valor fixo até o endpoint estar disponível
        valorTotalEstoque: valorTotal || 1000 // Valor mínimo para demonstração
      };

      console.log('✅ Dados carregados:', newDashboardData);
      setDashboardData(newDashboardData);
      
      // Inicializar gráfico após carregar os dados
      setTimeout(() => {
        initializeChart(newDashboardData.valorTotalEstoque);
      }, 100);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      
      // Fallback para dados de demonstração em caso de erro
      const fallbackData = {
        totalFornecedores: 0,
        totalMateriasPrimas: 0,
        totalProducoes: 0,
        valorTotalEstoque: 1000
      };
      
      setDashboardData(fallbackData);
      setTimeout(() => initializeChart(fallbackData.valorTotalEstoque), 100);
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

  const initializeChart = (valorEstoque = null) => {
    console.log('🎯 Inicializando gráfico com valor:', valorEstoque);
    
    const chartCanvas = document.getElementById('estoqueChart');
    if (!chartCanvas) {
      console.warn('⚠️ Canvas do gráfico não encontrado, tentando novamente...');
      setTimeout(() => initializeChart(valorEstoque), 500);
      return;
    }

    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      console.error('❌ Chart.js não carregado');
      setTimeout(() => initializeChart(valorEstoque), 1000);
      return;
    }

    // Destruir gráfico existente se houver
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    const valorBase = valorEstoque || dashboardData.valorTotalEstoque || 1000;
    
    // Dados simulados para demonstração - últimos 7 dias
    const hoje = new Date();
    const labels = [];
    const dados = [];
    
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      labels.push(data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
      
      // Simular variação no valor do estoque (±10% do valor atual)
      const variacao = (Math.random() - 0.5) * 0.2; // -10% a +10%
      dados.push(Math.max(0, valorBase + (valorBase * variacao)));
    }
    
    // Garantir que o último valor seja o valor atual
    dados[dados.length - 1] = valorBase;

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Valor do Estoque (R$)',
        data: dados,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderColor: '#4A90E2',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4A90E2',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };

    try {
      const newChartInstance = new window.Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#4A90E2',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `Valor: ${formatCurrency(context.parsed.y)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.06)',
                borderDash: [5, 5]
              },
              ticks: {
                color: '#7f8c8d',
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0.06)',
                borderDash: [5, 5]
              },
              ticks: {
                color: '#7f8c8d',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return formatCurrency(value);
                }
              }
            }
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          elements: {
            point: {
              hoverBackgroundColor: '#4A90E2'
            }
          }
        }
      });

      setChartInstance(newChartInstance);
      console.log('Gráfico inicializado com sucesso');
      
    } catch (error) {
      console.error('Erro ao criar gráfico:', error);
    }
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

          {/* Seção do Gráfico */}
          <section className="db-dashboard-chart-card">
            <div className="db-dashboard-chart-header">
              <h3 className="db-dashboard-chart-title">Evolução do Valor Total do Estoque</h3>
              <button className="db-dashboard-chart-expand" onClick={() => setChartExpanded(!chartExpanded)}>
                <Icon name={chartExpanded ? "Minimize2" : "Maximize2"} size={16} />
              </button>
            </div>
            <div className={`db-dashboard-chart-container ${chartExpanded ? 'expanded' : ''}`}>
              <canvas id="estoqueChart"></canvas>
            </div>
          </section>

          {/* Seção original do Success - Apps Grid */}
          <header className="db-dashboard-header">
            <div className="db-dashboard-title">
              <h1>Módulos do Sistema</h1>
              <h2>Selecione um módulo abaixo para começar</h2>
            </div>
          </header>
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
