import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function MateriasPrimas() {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
      
      // Processar datas para garantir formato consistente
      const materiasProcessadas = response.data.map(mp => ({
        ...mp,
        // Garantir que datas sejam strings no formato ISO ou null
        data_validade: mp.data_validade || null,
        data_validade_efetiva: mp.data_validade_efetiva || mp.data_validade || null,
        data_abertura_embalagem: mp.data_abertura_embalagem || null
      }));
      
      setMateriasPrimas(materiasProcessadas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matérias primas:', error);
      setError('Erro ao carregar matérias primas. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Função para formatar datas de maneira segura
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-"; // Data inválida
      return date.toLocaleDateString('pt-BR'); // DD/MM/AAAA
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "-";
    }
  };

  // Função para exibir o status com ícone e cor apropriada
  const renderStatus = (status) => {
    let icon = 'Check';
    let className = 'status-badge';
    
    switch (status) {
      case 'disponível':
        icon = 'Check';
        className += ' status-available';
        break;
      case 'próximo ao vencimento':
        icon = 'AlertCircle';
        className += ' status-warning';
        break;
      case 'vencido':
        icon = 'XCircle';
        className += ' status-expired';
        break;
      case 'esgotado':
        icon = 'AlertOctagon';
        className += ' status-depleted';
        break;
      case 'em quarentena':
        icon = 'ShieldAlert';
        className += ' status-quarantine';
        break;
      default:
        icon = 'HelpCircle';
        className += ' status-unknown';
    }
    
    return (
      <div className={className}>
        <Icon name={icon} size={14} />
        <span>{status}</span>
      </div>
    );
  };

  // Função para mostrar a data de validade correta
  const renderValidade = (materiaPrima) => {
    // Se não há dados de validade, mostra traço
    if (!materiaPrima.data_validade) return "-";
    
    // Se a embalagem está aberta, mostrar a data de validade efetiva
    if (materiaPrima.embalagem_aberta && materiaPrima.data_abertura_embalagem) {
      const dataValidade = formatDate(materiaPrima.data_validade); // Data original
      const dataEfetiva = formatDate(materiaPrima.data_validade_efetiva); // Nova data após abertura
      
      return (
        <div className="validade-info">
          <div className="validade-original text-muted small">
            <span>Original: {dataValidade}</span>
          </div>
          <div className="nova-validade font-weight-bold">
            <span>Após abertura: {dataEfetiva}</span>
          </div>
          <div className="abertura-info text-muted small">
            <span>Aberto em: {formatDate(materiaPrima.data_abertura_embalagem)}</span>
          </div>
        </div>
      );
    }
    
    // Se a embalagem não está aberta, mostrar apenas a data de validade normal
    return formatDate(materiaPrima.data_validade);
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

  // Atualizar função handleAbrirEmbalagem para mostrar o feedback
  const handleAbrirEmbalagem = async (id) => {
    if (window.confirm('Deseja marcar esta embalagem como aberta? Isso afetará o cálculo da data de validade.')) {
      try {
        setLoading(true);
        const response = await apiClient.post(apiEndpoints.materiaPrimaAbrirEmbalagem(id), {});
        
        // Mostrar mensagem de feedback se disponível
        if (response.data.mensagem) {
          setSuccessMessage(response.data.mensagem);
          
          // Limpar mensagem após alguns segundos
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }
        
        fetchMateriasPrimas();
      } catch (error) {
        console.error('Erro ao marcar embalagem como aberta:', error);
        
        // Verificar se há mensagem de erro específica
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Erro ao atualizar o status da embalagem. Tente novamente.');
        }
        
        setLoading(false);
        
        // Limpar mensagem de erro após alguns segundos
        setTimeout(() => {
          setError('');
        }, 5000);
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
          {successMessage && (
            <div className="alert alert-success">
              <Icon name="CheckCircle" size={16} />
              {successMessage}
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
                <button className="btn btn-primary btn-add-first" onClick={handleNovo}>
                  <Icon name="Plus" size={16} />
                  Adicionar Matéria Prima
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Nome</th>
                    <th>Lote</th>
                    <th>Fornecedor</th>
                    <th>Quantidade</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materiasPrimas.map((materiaPrima) => (
                    <tr key={materiaPrima.id}>
                      <td>{materiaPrima.cod_interno}</td>
                      <td>{materiaPrima.nome}</td>
                      <td>{materiaPrima.numero_lote || "-"}</td>
                      <td>
                        {materiaPrima.fornecedor ? materiaPrima.fornecedor.razao_social : "-"}
                      </td>
                      <td>
                        {materiaPrima.quantidade_disponivel} {materiaPrima.unidade_medida}
                      </td>
                      <td>{renderValidade(materiaPrima)}</td>
                      <td>{renderStatus(materiaPrima.status)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleLotes(materiaPrima.id)}
                            title="Gerenciar Lotes"
                          >
                            <Icon name="Package" size={14} />
                          </button>
                          
                          {/* Mostrar botão apenas se embalagem não estiver aberta */}
                          {!materiaPrima.embalagem_aberta && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleAbrirEmbalagem(materiaPrima.id)}
                              title="Marcar embalagem como aberta"
                            >
                              <Icon name="Scissors" size={14} />
                            </button>
                          )}
                          
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(materiaPrima.id)}
                            title="Editar matéria prima"
                          >
                            <Icon name="Edit" size={14} />
                          </button>
                          
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(materiaPrima.id)}
                            title="Excluir matéria prima"
                          >
                            <Icon name="Trash2" size={14} />
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
