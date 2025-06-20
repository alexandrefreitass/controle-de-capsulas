// src/config/api.js - Versão simplificada e robusta para desenvolvimento
import axios from 'axios';

/**
 * ✅ Lógica de URL simplificada.
 * Em desenvolvimento, com o proxy, a URL base é o próprio host do frontend ('').
 * Em produção, usaremos uma variável de ambiente.
 */

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';


const getApiBaseUrl = () => {
  // Para produção, a URL será injetada pelo processo de build (ex: Azure App Service)
  if (process.env.NODE_ENV === 'production') {
    // A variável REACT_APP_API_URL deve ser configurada no seu ambiente de produção
    return process.env.REACT_APP_API_URL || '';
  }
  // Em desenvolvimento, o proxy do webpack cuida do redirecionamento.
  // Usar uma string vazia faz com que as requisições sejam relativas ao host atual.
  // Ex: '/api/produtos' vai para http://localhost:3000/api/produtos e o proxy redireciona.
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * ✅ Instância configurada do Axios
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos é um bom valor para ambientes de dev/cloud
  headers: {
    'Content-Type': 'application/json',
  },
  // Essencial para o Django receber o cookie de sessão em requisições cross-origin
  withCredentials: true,
});

/**
 * ✅ Interceptadores para logs de debug (mantidos por serem uma ótima prática)
 */
// Interceptador para requisições
apiClient.interceptors.request.use(
  (config) => {
    // Log de requisição
    console.log('🔄 API Request:', config.method.toUpperCase(), config.url);
    
    // Se for POST ou PUT, mostrar os dados sendo enviados
    if ((config.method === 'post' || config.method === 'put') && config.data) {
      console.log('📤 Request Data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptador para respostas
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', 
      error.response ? `${error.response.status} ${error.config.url}` : error.message,
      error
    );
    
    // Mostrar detalhes do erro se disponíveis
    if (error.response && error.response.data) {
      console.error('📥 Error Details:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

/**
 * ✅ Endpoints centralizados (mantidos por serem uma ótima prática)
 */
// Endpoints da API - Adicione prefixo '/api/' a todos os endpoints
export const apiEndpoints = {
  // Auth
  login: 'auth/login/',  // Este pode continuar sem o prefixo /api/, se for um endpoint de autenticação separado
  register: 'auth/register/',
  
  // Matérias Primas - Adicione prefixo '/api/'
  materiasPrimas: '/api/materias-primas/',
  materiaPrima: (id) => `/api/materias-primas/${id}/`,
  materiaPrimaEstoque: (id) => `/api/materias-primas/${id}/estoque/`,
  materiaPrimaAbrirEmbalagem: (id) => `/api/materias-primas/${id}/abrir-embalagem/`,
  
  // Lotes - Adicione prefixo '/api/'
  lotes: '/api/lotes/',
  lote: (id) => `/api/lotes/${id}/`,
  loteEstoque: (id) => `/api/lotes/${id}/estoque/`,
  
  // Fornecedores - Adicione prefixo '/api/'
  fornecedores: '/api/fornecedores/',
  fornecedor: (id) => `/api/fornecedores/${id}/`,
};

// Log da configuração inicial
console.log('🔧 API configurada:', {
  baseURL: API_BASE_URL,
  timeout: apiClient.defaults.timeout,
});

export default apiClient;