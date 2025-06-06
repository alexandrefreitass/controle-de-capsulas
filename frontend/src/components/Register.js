
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiEndpoints } from '../config/api';
import Icon from './Icon';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(apiEndpoints.register, {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('username', username);
        navigate('/success');
      } else {
        setError('Erro ao cadastrar usuário. Tente novamente.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Usuário já existe ou dados inválidos.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Sistema CNC</div>
          <div className="auth-subtitle">Criar nova conta</div>
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
                placeholder="Escolha um nome de usuário"
                required
                disabled={loading}
                minLength={3}
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
                placeholder="Crie uma senha segura"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Icon name="KeyRound" size={16} />
                Confirmar Senha
              </label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-success btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                  Cadastrando...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={16} />
                  Criar Conta
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Já tem uma conta?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon name="LogIn" size={14} />
            Faça login aqui
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
