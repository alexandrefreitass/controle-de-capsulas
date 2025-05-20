import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProducaoForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    produto_id: '',
    lote: '',
    lote_tamanho: '',
    data_producao: new Date().toISOString().split('T')[0], // Data atual como padrão
    materiais_consumidos: []
  });
  
  const [produtos, setProdutos] = useState([]);
  const [lotesMateriasPrimas, setLotesMateriasPrimas] = useState([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);
  const [novoMaterial, setNovoMaterial] = useState({
    lote_materia_prima_id: '',
    quant_consumida_mg: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    // Carregar produtos
    fetchProdutos();
    
    // Carregar lotes de matérias-primas
    fetchLotesMateriasPrimas();
  }, [navigate]);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/produtos/');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar lista de produtos.');
    }
  };

  const fetchLotesMateriasPrimas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lotes/');
      // Filtrar apenas lotes com quantidade disponível
      const lotesDisponiveis = response.data.filter(lote => lote.quant_disponivel_mg > 0);
      setLotesMateriasPrimas(lotesDisponiveis);
    } catch (error) {
      console.error('Erro ao carregar lotes de matérias-primas:', error);
      setError('Erro ao carregar lista de lotes de matérias-primas.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNovoMaterialChange = (e) => {
    const { name, value } = e.target;
    setNovoMaterial({
      ...novoMaterial,
      [name]: value
    });
  };

  const handleAdicionarMaterial = () => {
    if (!novoMaterial.lote_materia_prima_id || !novoMaterial.quant_consumida_mg) {
      setError('Selecione uma matéria-prima e informe a quantidade consumida.');
      return;
    }
    
    // Verificar se a quantidade é válida
    const loteSelecionado = lotesMateriasPrimas.find(
      lote => lote.id === parseInt(novoMaterial.lote_materia_prima_id)
    );
    
    if (!loteSelecionado) {
      setError('Lote de matéria-prima não encontrado.');
      return;
    }
    
    const quantidadeConsumida = parseFloat(novoMaterial.quant_consumida_mg);
    
    if (quantidadeConsumida <= 0) {
      setError('A quantidade consumida deve ser maior que zero.');
      return;
    }
    
    if (quantidadeConsumida > loteSelecionado.quant_disponivel_mg) {
      setError(`Quantidade insuficiente. Disponível: ${loteSelecionado.quant_disponivel_mg}mg`);
      return;
    }
    
    // Verificar se o lote já foi adicionado
    if (materiaisSelecionados.some(m => m.lote_materia_prima_id === novoMaterial.lote_materia_prima_id)) {
      setError('Este lote de matéria-prima já foi adicionado.');
      return;
    }
    
    // Adicionar material à lista
    const novosMateriais = [
      ...materiaisSelecionados,
      { ...novoMaterial, id: Date.now() } // ID temporário
    ];
    
    setMateriaisSelecionados(novosMateriais);
    
    // Atualizar formData
    setFormData({
      ...formData,
      materiais_consumidos: novosMateriais.map(material => ({
        lote_materia_prima_id: material.lote_materia_prima_id,
        quant_consumida_mg: material.quant_consumida_mg
      }))
    });
    
    // Limpar o formulário de novo material
    setNovoMaterial({
      lote_materia_prima_id: '',
      quant_consumida_mg: ''
    });
    
    setError('');
  };

  const handleRemoverMaterial = (id) => {
    const novosMateriais = materiaisSelecionados.filter(material => material.id !== id);
    
    setMateriaisSelecionados(novosMateriais);
    
    // Atualizar formData
    setFormData({
      ...formData,
      materiais_consumidos: novosMateriais.map(material => ({
        lote_materia_prima_id: material.lote_materia_prima_id,
        quant_consumida_mg: material.quant_consumida_mg
      }))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (materiaisSelecionados.length === 0) {
      setError('Adicione pelo menos uma matéria-prima consumida.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Converter para formatos corretos
      const dataToSend = {
        ...formData,
        produto_id: parseInt(formData.produto_id),
        lote_tamanho: parseFloat(formData.lote_tamanho),
        materiais_consumidos: formData.materiais_consumidos.map(material => ({
          lote_materia_prima_id: parseInt(material.lote_materia_prima_id),
          quant_consumida_mg: parseFloat(material.quant_consumida_mg)
        }))
      };
      
      console.log('Enviando dados:', dataToSend);
      
      const response = await axios.post('http://localhost:8000/api/producao/', dataToSend);
      console.log('Resposta da criação:', response.data);
      
      navigate('/producao');
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (error.response) {
        console.error('Resposta de erro do servidor:', error.response.data);
        
        if (error.response.data && error.response.data.error) {
          setError(`Erro ao salvar lote de produção: ${error.response.data.error}`);
        } else {
          setError(`Erro ao salvar lote de produção. Código: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor');
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        console.error('Erro na configuração da requisição:', error.message);
        setError('Erro na requisição: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/producao');
  };

  // Encontrar nome da matéria-prima a partir do ID do lote
  const obterNomeMateriaPrima = (loteMpId) => {
    const lote = lotesMateriasPrimas.find(l => l.id === parseInt(loteMpId));
    return lote ? `${lote.materia_prima.nome} (Lote: ${lote.lote})` : 'Não encontrado';
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Novo Lote de Produção</h2>
        <button className="back-btn" onClick={handleVoltar}>Voltar</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="produto_id">Produto:</label>
            <select
              id="produto_id"
              name="produto_id"
              value={formData.produto_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lote">Número do Lote:</label>
            <input
              type="text"
              id="lote"
              name="lote"
              value={formData.lote}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lote_tamanho">Tamanho do Lote:</label>
            <input
              type="number"
              id="lote_tamanho"
              name="lote_tamanho"
              value={formData.lote_tamanho}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_producao">Data de Produção:</label>
            <input
              type="date"
              id="data_producao"
              name="data_producao"
              value={formData.data_producao}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="material-section">
          <h3>Matérias-primas Consumidas</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="lote_materia_prima_id">Matéria-prima (Lote):</label>
              <select
                id="lote_materia_prima_id"
                name="lote_materia_prima_id"
                value={novoMaterial.lote_materia_prima_id}
                onChange={handleNovoMaterialChange}
              >
                <option value="">Selecione um lote de matéria-prima</option>
                {lotesMateriasPrimas.map(lote => (
                  <option key={lote.id} value={lote.id}>
                    {lote.materia_prima.nome} - Lote: {lote.lote} ({lote.quant_disponivel_mg}mg disponível)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quant_consumida_mg">Quantidade Consumida (mg):</label>
              <input
                type="number"
                id="quant_consumida_mg"
                name="quant_consumida_mg"
                value={novoMaterial.quant_consumida_mg}
                onChange={handleNovoMaterialChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>&nbsp;</label>
              <button 
                type="button" 
                onClick={handleAdicionarMaterial}
                className="add-btn"
              >
                Adicionar Matéria-prima
              </button>
            </div>
          </div>

          {materiaisSelecionados.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matéria-prima (Lote)</th>
                  <th>Quantidade Consumida (mg)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiaisSelecionados.map(material => (
                  <tr key={material.id}>
                    <td>{obterNomeMateriaPrima(material.lote_materia_prima_id)}</td>
                    <td>{material.quant_consumida_mg} mg</td>
                    <td>
                      <button 
                        type="button"
                        className="delete-btn"
                        onClick={() => handleRemoverMaterial(material.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma matéria-prima adicionada.</p>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" onClick={handleVoltar} style={{ marginRight: '10px' }}>Cancelar</button>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProducaoForm;