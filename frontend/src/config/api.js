// src/config/api.js - Versão CORRIGIDA e PADRONIZADA

import axios from 'axios';

const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || '';
  }
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method.toUpperCase(), config.url);
    if (config.data) {
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
      error.response ? `${error.response.status} ${error.config.url}` : error.message
    );
    if (error.response && error.response.data) {
      console.error('📥 Error Details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * ✅ Endpoints centralizados e com estrutura padronizada (list, detail, etc.)
 * Essa é a mudança principal para corrigir o erro 'undefined'.
 */
export const apiEndpoints = {
  // Auth
  auth: {
    login: '/accounts/login/',
    register: '/accounts/register/',
  },

  // Fornecedores
  fornecedores: {
    list: '/api/fornecedores/',
    detail: (id) => `/api/fornecedores/${id}/`,
  },

  // Matérias Primas
  materiasPrimas: {
    list: '/api/materias-primas/',
    detail: (id) => `/api/materias-primas/${id}/`,
    estoque: (id) => `/api/materias-primas/${id}/estoque/`,
    abrirEmbalagem: (id) => `/api/materias-primas/${id}/abrir-embalagem/`,
  },

  // Lotes
  lotes: {
    list: '/api/lotes/',
    detail: (id) => `/api/lotes/${id}/`,
    estoque: (id) => `/api/lotes/${id}/estoque/`,
  },

  // Produtos e Fórmulas
  produtos: {
    list: '/api/produtos/',
    detail: (id) => `/api/produtos/${id}/`,
  },
  formulas: {
    list: '/api/formulas/',
    detail: (id) => `/api/formulas/${id}/`,
    ingredientes: (formulaId) => `/api/formulas/${formulaId}/ingredientes/`,
  },
  ingredientes: {
    detail: (id) => `/api/ingredientes/${id}/`,
  },
  meta: {
    apresentacoes: '/api/apresentacoes/',
    formasFarmaceuticas: '/api/formas-farmaceuticas/',
  },

  // Produção
  producao: {
    list: '/api/producao/',
    detail: (id) => `/api/producao/${id}/`,
  },
  
  // Endpoint de Health Check
  health: '/api/',
};


console.log('🔧 API configurada:', {
  baseURL: API_BASE_URL,
  timeout: apiClient.defaults.timeout,
});

export default apiClient;