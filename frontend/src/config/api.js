// src/config/api.js - Versão corrigida e robusta
import axios from 'axios';

/**
 * Lógica de URL simplificada.
 * Em desenvolvimento, com o proxy, a URL base é o próprio host do frontend ('').
 * Em produção, usaremos uma variável de ambiente.
 */
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || '';
  }
  // Em desenvolvimento, o proxy do webpack cuida do redirecionamento.
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Instância configurada do Axios
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Interceptadores para logs de debug (ótima prática que você já usa)
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method.toUpperCase(), config.url);
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
    if (error.response && error.response.data) {
      console.error('📥 Error Details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * ✅ Endpoints centralizados e CORRIGIDOS
 * Corrigi 'auth/' para 'accounts/' e adicionei o prefixo '/api/' onde necessário,
 * para bater com o seu `sistema_capsulas/urls.py`.
 */
export const apiEndpoints = {
  // Auth
  login: '/accounts/login/',
  register: '/accounts/register/',
  
  // Fornecedores
  fornecedores: '/api/fornecedores/',
  fornecedor: (id) => `/api/fornecedores/${id}/`,

  // Matérias Primas
  materiasPrimas: '/api/materias-primas/',
  materiaPrima: (id) => `/api/materias-primas/${id}/`,
  materiaPrimaEstoque: (id) => `/api/materias-primas/${id}/estoque/`,
  materiaPrimaAbrirEmbalagem: (id) => `/api/materias-primas/${id}/abrir-embalagem/`,
  
  // Lotes
  lotes: '/api/lotes/',
  lote: (id) => `/api/lotes/${id}/`,
  loteEstoque: (id) => `/api/lotes/${id}/estoque/`,

  // Produtos
  produtos: '/api/produtos/',
  produto: (id) => `/api/produtos/${id}/`,
  formulas: '/api/formulas/',
  apresentacoes: '/api/apresentacoes/',
  formasFarmaceuticas: '/api/formas-farmaceuticas/',

  // Produção
  producao: '/api/producao/',
  producaoDetalhe: (id) => `/api/producao/${id}/`,
};

// Log da configuração inicial
console.log('🔧 API configurada:', {
  baseURL: API_BASE_URL,
  timeout: apiClient.defaults.timeout,
});

export default apiClient;