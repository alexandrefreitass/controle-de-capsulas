// Dashboard.js - Scripts para a página de dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do gráfico de orçamentos
    const chartCanvas = document.getElementById('orcamentosChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        // Extrai dados JSON dos elementos script
        const labels = JSON.parse(document.getElementById('chart-labels-data').textContent);
        const data = JSON.parse(document.getElementById('chart-data-data').textContent);
        
        // Configura os dados do gráfico
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Valor de Orçamentos (R$)',
                data: data,
                backgroundColor: '#4A90E2',
                borderColor: '#4A90E2',
                borderWidth: 0,
                borderRadius: 4,
                barThickness: 30
            }]
        };

        // Cria o gráfico
        const chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.06)',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            padding: 10,
                            callback: function(value) {
                                return 'R$' + value;
                            },
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                hover: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }
    
    // Adicionar animação para os números dos cards
    const cardValues = document.querySelectorAll('.db-dashboard-card-value');
    
    cardValues.forEach(valueElement => {
        const finalValue = valueElement.textContent;
        
        // Se o valor começar com R$, tratamos diferente
        if (finalValue.startsWith('R$')) {
            const numericValue = parseFloat(finalValue.replace('R$', '').trim().replace('.', '').replace(',', '.'));
            
            if (!isNaN(numericValue) && numericValue > 0) {
                animateValue(valueElement, 0, numericValue, 1000, true);
            }
        } else {
            const numericValue = parseInt(finalValue, 10);
            
            if (!isNaN(numericValue) && numericValue > 0) {
                animateValue(valueElement, 0, numericValue, 800, false);
            }
        }
    });
    
    // Função para animar incremento de valores
    function animateValue(element, start, end, duration, isCurrency) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Easing function para tornar a animação mais suave
            const currentValue = Math.floor(easeOutProgress * (end - start) + start);
            
            if (isCurrency) {
                element.textContent = formatCurrency(currentValue);
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Função para formatar valores monetários
    function formatCurrency(value) {
        return 'R$ ' + value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('.', ',');
    }
    
    // Adicionar evento para o botão de expandir o gráfico
    const expandButton = document.querySelector('.db-dashboard-chart-expand');
    if (expandButton) {
        expandButton.addEventListener('click', function(e) {
            e.preventDefault();
            const chartCard = document.querySelector('.db-dashboard-chart-card');
            chartCard.classList.toggle('db-chart-expanded');
            
            if (chartCard.classList.contains('db-chart-expanded')) {
                document.querySelector('.db-dashboard-chart-container').style.height = '500px';
            } else {
                document.querySelector('.db-dashboard-chart-container').style.height = '300px';
            }
            
            // Redimensionar o gráfico
            const chart = Chart.getChart('orcamentosChart');
            if (chart) {
                chart.resize();
            }
        });
    }
});
