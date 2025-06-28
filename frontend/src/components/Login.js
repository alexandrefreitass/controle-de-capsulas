import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

// ===================================================================
// ADICIONADO: Importação da sua logo
// ===================================================================
// Lembre-se de criar a pasta 'assets/images' e colocar sua logo lá.
// Pode ser .svg, .png, etc. O Webpack vai cuidar do resto.
import LogoCNC from '../assets/images/logo-preto.svg'; 
// ===================================================================


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post(apiEndpoints.auth.login, {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('username', username);
        navigate('/success');
      } else {
        setError(response.data.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);

      if (error.code === 'ECONNABORTED') {
        setError('Timeout: Servidor demorou para responder. Tente novamente.');
      } else if (error.response) {
        setError(`Erro do servidor: ${error.response.status}. ${error.response.data?.error || 'Tente novamente.'}`);
      } else if (error.request) {
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
          <div className="auth-logo-section">
            <img src={LogoCNC} alt="Logo CNC" className="auth-logo-img" />
          </div>
          <div className="auth-content-section">
            <div className="auth-subtitle">Entrar na conta</div>
            <div className="auth-description">
              Acesse sua conta para continuar
            </div>
          </div>
        </div>
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <Icon name="AlertTriangle" size={16} />
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">
                <Icon name="User" size={16} />
                Usuário
              </label>
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
              <label className="form-label">
                <Icon name="Lock" size={16} />
                Senha
              </label>
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
                  <Icon name="LogIn" size={16} />
                  Entrar
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
            <Icon name="UserPlus" size={14} />
            Cadastre-se aqui
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;