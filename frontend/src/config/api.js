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
apiClient.interceptors.request.use(
  (config) => {
    // Agora a URL logada será a relativa, ex: /accounts/login/
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
    return Promise.reject(error);
  }
);

/**
 * ✅ Endpoints centralizados (mantidos por serem uma ótima prática)
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

// Log da configuração inicial
console.log('🔧 API configurada:', {
  baseURL: API_BASE_URL,
  timeout: apiClient.defaults.timeout,
});

export default apiClient;