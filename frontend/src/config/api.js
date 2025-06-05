// src/config/api.js
import axios from 'axios';

/**
 * ✅ Função para detectar o ambiente e retornar a URL base correta
 */
export const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Ambiente Replit
  if (hostname.includes('replit.dev') || hostname.includes('repl.co')) {
    return `${protocol}//${hostname}`;
  }

  // Desenvolvimento local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000'; 
  }

  // Produção Azure ou outros
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Fallback
  return 'http://localhost:8080';
};

/**
 * ✅ Instância configurada do Axios
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ✅ Interceptor para logs de debug
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error(`❌ API Response Error: ${status} ${url}`, error.message);

    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    } else if (!error.response) {
      console.error('🌐 Network error - servidor pode estar offline');
    }

    return Promise.reject(error);
  }
);

/**
 * ✅ Funções utilitárias para endpoints específicos
 */
export const apiEndpoints = {
  // Autenticação
  login: '/accounts/login/',
  register: '/accounts/register/',

  // Fornecedores
  fornecedores: '/api/fornecedores/',
  fornecedor: (id) => `/api/fornecedores/${id}/`,

  // Matérias Primas
  materiasPrimas: '/api/materias-primas/',
  materiaPrima: (id) => `/api/materias-primas/${id}/`,

  // Lotes
  lotes: '/api/lotes/',
  lote: (id) => `/api/lotes/${id}/`,

  // Produtos
  produtos: '/api/produtos/',
  produto: (id) => `/api/produtos/${id}/`,

  // Produção
  producao: '/api/producao/',
  producaoDetalhe: (id) => `/api/producao/${id}/`,

  // Configurações
  apresentacoes: '/api/apresentacoes/',
  formasFarmaceuticas: '/api/formas-farmaceuticas/',
  formulas: '/api/formulas/',
};

/**
 * ✅ Função para fazer requisições com tratamento de erro padronizado
 */
export const makeApiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    // Log detalhado do erro
    console.error('API Request Failed:', {
      method,
      url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    throw error;
  }
};

/**
 * ✅ Hook personalizado para debug de conexão
 */
export const testConnection = async () => {
  try {
    const baseUrl = getApiBaseUrl();
    console.log(`🧪 Testando conexão com: ${baseUrl}`);

    const response = await fetch(`${baseUrl}/admin/`, { 
      method: 'HEAD',
      mode: 'no-cors' // Para evitar problemas de CORS em teste
    });

    console.log('✅ Servidor está respondendo');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão:', error);
    return false;
  }
};

// Export da URL base para componentes que precisam
export const API_BASE_URL = getApiBaseUrl();

export default apiClient;