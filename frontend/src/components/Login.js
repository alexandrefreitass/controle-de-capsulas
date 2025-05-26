import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Exemplo de modificação para usar variável de ambiente
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Tentando login com:', { username, password });
    
    try {
      const response = await axios.post(`${apiUrl}/accounts/login/`, {
        username,
        password
      });
      
      console.log('Resposta do servidor:', response.data);
      
      // Verifica se o login foi bem-sucedido antes de redirecionar
      if (response.data && response.status === 200) {
        console.log('Login bem-sucedido, redirecionando...');
        // Armazena informações do usuário se necessário
        localStorage.setItem('username', username);
        
        // Use um timeout para garantir que o redirecionamento ocorra após o estado ser atualizado
        setTimeout(() => {
          navigate('/success');
        }, 100);
      } else {
        console.log('Resposta inesperada:', response);
        setError('Resposta inesperada do servidor');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (error.response) {
        console.log('Status do erro:', error.response.status);
        console.log('Dados do erro:', error.response.data);
        
        // Se o erro for 401 (Credenciais inválidas)
        if (error.response.status === 401) {
          setError('Usuário ou senha incorretos');
        } 
        // Se o erro for 400, verifique o motivo
        else if (error.response.status === 400) {
          if (error.response.data.error === "Este nome de usuário já está em uso.") {
            // Este erro não deve ocorrer no login, apenas no registro
            setError('Erro na configuração do servidor: resposta incorreta para login');
          } else {
            setError(error.response.data.error || 'Dados inválidos');
          }
        } else {
          // Redirecionar para registro apenas se for apropriado
          // Por exemplo, se o servidor indicar que o usuário não existe
          if (error.response.data.error === "Usuário não encontrado") {
            console.log('Usuário não encontrado, redirecionando para registro...');
            navigate('/register');
          } else {
            setError('Erro no servidor: ' + (error.response.data.error || 'Desconhecido'));
          }
        }
      } else if (error.request) {
        console.log('Sem resposta do servidor');
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        console.log('Erro na configuração:', error.message);
        setError('Erro na requisição: ' + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <button type="submit">Entrar</button>
        
        {/* Mantenha o botão de teste descomentado para debug */}
        <button 
          type="button" 
          onClick={() => {
            console.log('Testando redirecionamento manual');
            navigate('/success');
          }}
          style={{marginTop: '10px', backgroundColor: '#3498db'}}
        >
          Teste Redirecionamento
        </button>
      </form>
    </div>
  );
}

export default Login;