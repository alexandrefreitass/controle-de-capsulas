import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function MateriaPrimaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materiaPrima, setMateriaPrima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMateriaPrima();
  }, [id]);

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.materiasPrimas.detail(id));
      setMateriaPrima(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar matéria prima:', error);
      setError('Erro ao carregar detalhes da matéria prima.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleVoltar = () => {
    navigate('/materias-primas');
  };

  if (loading) {
    return (
      <div className="module-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!materiaPrima) {
    return (
      <div className="module-container">
        <div className="alert alert-error">
          <Icon name="AlertTriangle" size={16} />
          Matéria prima não encontrada
        </div>
        <button className="btn btn-secondary" onClick={handleVoltar}>
          <Icon name="ArrowLeft" size={16} />
          Voltar
        </button>
      </div>
    );
  }

  // Calcular informações de validade
  const calcularInfoValidade = () => {
    if (!materiaPrima.data_validade) {
      return {
        diasRestantes: null,
        percentualValidade: 0,
        statusValidade: 'sem-validade',
        mensagemValidade: 'Sem data de validade',
      };
    }

    const hoje = new Date();
    const dataValidade = new Date(materiaPrima.data_validade);
    
    // Se embalagem está aberta, usar nova data de validade
    if (materiaPrima.embalagem_aberta && materiaPrima.data_abertura_embalagem) {
      const dataAbertura = new Date(materiaPrima.data_abertura_embalagem);
      const novaValidade = new Date(dataAbertura);
      novaValidade.setDate(dataAbertura.getDate() + materiaPrima.dias_validade_apos_aberto);
      
      const diasRestantes = Math.ceil((novaValidade - hoje) / (1000 * 60 * 60 * 24));
      const diasTotais = materiaPrima.dias_validade_apos_aberto;
      const percentualValidade = Math.max(0, Math.min(100, (diasRestantes / diasTotais) * 100));
      
      let statusValidade, mensagemValidade;
      if (diasRestantes < 0) {
        statusValidade = 'vencido';
        mensagemValidade = `Vencido há ${Math.abs(diasRestantes)} dias`;
      } else if (diasRestantes <= 7) {
        statusValidade = 'critico';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      } else if (diasRestantes <= 30) {
        statusValidade = 'alerta';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      } else {
        statusValidade = 'normal';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      }
      
      return {
        diasRestantes,
        percentualValidade,
        statusValidade,
        mensagemValidade,
        dataOriginal: dataValidade,
        dataAbertura,
        novaValidade,
      };
    } else {
      // Cálculo normal para embalagem não aberta
      const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
      const diasTotais = Math.ceil((dataValidade - new Date(materiaPrima.data_fabricacao)) / (1000 * 60 * 60 * 24));
      const percentualValidade = Math.max(0, Math.min(100, (diasRestantes / diasTotais) * 100));
      
      let statusValidade, mensagemValidade;
      if (diasRestantes < 0) {
        statusValidade = 'vencido';
        mensagemValidade = `Vencido há ${Math.abs(diasRestantes)} dias`;
      } else if (diasRestantes <= 7) {
        statusValidade = 'critico';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      } else if (diasRestantes <= 30) {
        statusValidade = 'alerta';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      } else {
        statusValidade = 'normal';
        mensagemValidade = `Vence em ${diasRestantes} dias`;
      }
      
      return {
        diasRestantes,
        percentualValidade,
        statusValidade,
        mensagemValidade,
      };
    }
  };

  const infoValidade = calcularInfoValidade();

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="FlaskConical" size={20} className="module-title-icon" />
              Detalhes da Matéria Prima
            </h1>
            <div className="module-actions">
              <button className="btn btn-secondary" onClick={handleVoltar}>
                <Icon name="ArrowLeft" size={16} />
                Voltar às Matérias Primas
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2>{materiaPrima.nome}</h2>
              <div className="card-subtitle">Código: {materiaPrima.cod_interno}</div>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Lote:</div>
                  <div className="info-value">{materiaPrima.numero_lote || "-"}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Fornecedor:</div>
                  <div className="info-value">
                    {materiaPrima.fornecedor ? materiaPrima.fornecedor.razao_social : "-"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Quantidade disponível:</div>
                  <div className="info-value">
                    {materiaPrima.quantidade_disponivel} {materiaPrima.unidade_medida}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Status:</div>
                  <div className="info-value">{materiaPrima.status}</div>
                </div>
              </div>

              {/* Seção de Validade com Detalhes */}
              <div className="validade-section">
                <h3>Informações de Validade</h3>
                
                <div className="validade-card">
                  <div className="validade-header">
                    <div className={`validade-status ${infoValidade.statusValidade}`}>
                      {infoValidade.mensagemValidade}
                    </div>
                    
                    {infoValidade.percentualValidade > 0 && (
                      <div className="validade-barra-container">
                        <div 
                          className={`validade-barra ${infoValidade.statusValidade}`} 
                          style={{width: `${infoValidade.percentualValidade}%`}}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="validade-detalhes">
                    <div className="validade-item">
                      <div className="validade-label">Data de fabricação:</div>
                      <div className="validade-valor">{formatDate(materiaPrima.data_fabricacao)}</div>
                    </div>
                    
                    <div className="validade-item">
                      <div className="validade-label">Validade original:</div>
                      <div className={`validade-valor ${materiaPrima.embalagem_aberta ? 'riscado' : ''}`}>
                        {formatDate(materiaPrima.data_validade)}
                      </div>
                    </div>
                    
                    {materiaPrima.embalagem_aberta && materiaPrima.data_abertura_embalagem && (
                      <>
                        <div className="validade-item">
                          <div className="validade-label">Data de abertura:</div>
                          <div className="validade-valor">{formatDate(materiaPrima.data_abertura_embalagem)}</div>
                        </div>
                        
                        <div className="validade-item">
                          <div className="validade-label">Dias válidos após abertura:</div>
                          <div className="validade-valor">{materiaPrima.dias_validade_apos_aberto} dias</div>
                        </div>
                        
                        <div className="validade-item destaque">
                          <div className="validade-label">Nova data de validade:</div>
                          <div className="validade-valor">{formatDate(materiaPrima.data_validade_efetiva)}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Outras informações */}
              <div className="outros-detalhes">
                <h3>Informações adicionais</h3>
                
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Nota fiscal:</div>
                    <div className="info-value">{materiaPrima.nota_fiscal || "-"}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Categoria:</div>
                    <div className="info-value">{materiaPrima.categoria || "-"}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Localização:</div>
                    <div className="info-value">{materiaPrima.localizacao || "-"}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Preço unitário:</div>
                    <div className="info-value">
                      {materiaPrima.preco_unitario 
                        ? `R$ ${parseFloat(materiaPrima.preco_unitario).toFixed(2)}` 
                        : "-"}
                    </div>
                  </div>
                </div>
                
                {materiaPrima.desc && (
                  <div className="descricao-section">
                    <h4>Descrição</h4>
                    <p>{materiaPrima.desc}</p>
                  </div>
                )}
                
                {materiaPrima.condicao_armazenamento && (
                  <div className="descricao-section">
                    <h4>Condições de armazenamento</h4>
                    <p>{materiaPrima.condicao_armazenamento}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MateriaPrimaDetalhes;