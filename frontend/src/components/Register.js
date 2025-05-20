import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Implemente aqui a lógica para registrar um novo usuário
      // Esta rota ainda precisará ser implementada no backend
      const response = await axios.post('http://localhost:8000/accounts/register/', {
        username,
        password
      });
      
      // Se o cadastro for bem-sucedido, redireciona para a página de sucesso
      navigate('/success');
    } catch (error) {
      setError('Ocorreu um erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastro</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;