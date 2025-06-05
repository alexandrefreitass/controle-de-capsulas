import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ URL dinâmica baseada no ambiente
  const getApiUrl = () => {
    // Se estiver no Replit
    if (window.location.hostname.includes('replit.dev') || window.location.hostname.includes('repl.co')) {
      return `${window.location.protocol}//${window.location.hostname}`;
    }
    // Se estiver em desenvolvimento local
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8080';
    }
    // Para outros ambientes (produção, etc)
    return process.env.REACT_APP_API_URL || 'http://localhost:8080';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      console.log('Tentando conectar em:', `${apiUrl}/accounts/login/`);

      const response = await axios.post(`${apiUrl}/accounts/login/`, {
        username,
        password
      }, {
        // ✅ Headers adicionais para compatibilidade
        headers: {
          'Content-Type': 'application/json',
        },
        // ✅ Timeout para evitar travamento
        timeout: 10000,
      });

      if (response.data.success) {
        localStorage.setItem('username', username);
        navigate('/success');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);

      if (error.code === 'ECONNABORTED') {
        setError('Timeout: Servidor demorou para responder. Tente novamente.');
      } else if (error.response) {
        // Servidor respondeu com erro
        setError(`Erro do servidor: ${error.response.status}. ${error.response.data?.error || 'Tente novamente.'}`);
      } else if (error.request) {
        // Requisição foi feita mas não houve resposta
        setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">CNC System</div>
          <div className="auth-subtitle">KONNEKIT - Sistema de Gestão</div>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Usuário</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                  Entrando...
                </>
              ) : (
                <>
                  🔐 Entrar
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Não tem uma conta?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Cadastre-se aqui
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;