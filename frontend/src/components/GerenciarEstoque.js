import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function GerenciarEstoque() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materiaPrima, setMateriaPrima] = useState(null);
  const [formData, setFormData] = useState({
    quantidade: '',
    operacao: 'adicionar'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setError('Erro ao carregar dados da matéria prima.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantidade || parseFloat(formData.quantidade) <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      const response = await apiClient.post(
        apiEndpoints.materiasPrimas.estoque(id),
        {
          operacao: formData.operacao,
          quantidade: parseFloat(formData.quantidade)
        }
      );
      
      setMateriaPrima(prevState => ({
        ...prevState,
        quantidade_disponivel: response.data.quantidade_disponivel,
        status: response.data.status
      }));
      
      setSuccess(response.data.mensagem);
      setFormData({ ...formData, quantidade: '' });
      setSubmitting(false);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erro ao atualizar o estoque. Tente novamente.');
      }
      setSubmitting(false);
    }
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

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="container">
          <nav className="module-nav">
            <h1 className="module-title">
              <Icon name="Package" size={20} className="module-title-icon" />
              Gerenciar Estoque
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
          {error && (
            <div className="alert alert-error">
              <Icon name="AlertTriangle" size={16} />
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <Icon name="CheckCircle" size={16} />
              {success}
            </div>
          )}

          {materiaPrima && (
            <div className="card mb-4">
              <div className="card-header">
                <h2>{materiaPrima.nome}</h2>
                <div className="card-subtitle">Código: {materiaPrima.cod_interno}</div>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Quantidade atual:</div>
                    <div className="info-value">{materiaPrima.quantidade_disponivel} {materiaPrima.unidade_medida}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status:</div>
                    <div className="info-value">{materiaPrima.status}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Lote:</div>
                    <div className="info-value">{materiaPrima.numero_lote || "-"}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Localização:</div>
                    <div className="info-value">{materiaPrima.localizacao || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3>Atualizar Estoque</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="operacao">
                      Operação
                    </label>
                    <select
                      id="operacao"
                      name="operacao"
                      className="form-select"
                      value={formData.operacao}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="adicionar">Adicionar ao estoque</option>
                      <option value="subtrair">Remover do estoque</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quantidade">
                      Quantidade ({materiaPrima?.unidade_medida})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      id="quantidade"
                      name="quantidade"
                      className="form-input"
                      value={formData.quantidade}
                      onChange={handleChange}
                      placeholder={`Ex: 5.0 ${materiaPrima?.unidade_medida || ''}`}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Icon name={formData.operacao === 'adicionar' ? 'Plus' : 'Minus'} size={16} />
                        {formData.operacao === 'adicionar' ? 'Adicionar ao Estoque' : 'Remover do Estoque'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GerenciarEstoque;