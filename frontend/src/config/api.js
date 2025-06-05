// src/config/api.js - Versão atualizada para Replit
import axios from 'axios';

/**
 * ✅ Função melhorada para detectar o ambiente e retornar a URL base correta
 */
export const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  console.log('🔍 Detectando ambiente:', { hostname, protocol });

  // Ambiente Replit - melhor detecção
  if (hostname.includes('replit.dev') || hostname.includes('repl.co')) {
    const replitUrl = `${protocol}//${hostname}`;
    console.log('✅ Ambiente Replit detectado:', replitUrl);
    return replitUrl;
  }

  // Desenvolvimento local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const localUrl = 'http://localhost:8000';
    console.log('✅ Ambiente local detectado:', localUrl);
    return localUrl;
  }

  // Produção Azure ou outros
  if (process.env.REACT_APP_API_URL) {
    console.log('✅ URL da API definida por variável de ambiente:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // Fallback - usar porta 8000 para Replit
  const fallbackUrl = `${protocol}//${hostname}`;
  console.log('⚠️ Usando fallback:', fallbackUrl);
  return fallbackUrl;
};

/**
 * ✅ Instância configurada do Axios com melhor tratamento de erros
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 segundos para Replit
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ✅ Interceptor melhorado para logs de debug
 */
apiClient.interceptors.request.use(
  (config) => {
    const url = `${config.baseURL}${config.url}`;
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${url}`);
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

    // Tratamento específico para problemas comuns do Replit
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - servidor pode estar inicializando');
    } else if (!error.response) {
      console.error('🌐 Network error - verifique se o backend está rodando');
      console.error('💡 Dica: Tente executar o backend com: cd backend && python manage.py runserver 0.0.0.0:8000');
    } else if (status === 404) {
      console.error('🔍 Endpoint não encontrado - verifique a URL da API');
    } else if (status >= 500) {
      console.error('🚨 Erro interno do servidor');
    }

    return Promise.reject(error);
  }
);

/**
 * ✅ Função de teste de conexão melhorada
 */
export const testConnection = async () => {
  try {
    const baseUrl = getApiBaseUrl();
    console.log(`🧪 Testando conexão com: ${baseUrl}`);

    // Tentar endpoint de status primeiro
    const response = await fetch(`${baseUrl}/`, { 
      method: 'GET',
      mode: 'cors'
    });

    if (response.ok) {
      console.log('✅ Servidor Django está respondendo');
      return true;
    } else {
      console.warn(`⚠️ Servidor respondeu com status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Falha na conexão:', error.message);
    console.error('💡 Possíveis soluções:');
    console.error('   1. Verificar se o backend está rodando');
    console.error('   2. Verificar configurações de CORS');
    console.error('   3. Aguardar o servidor inicializar completamente');
    return false;
  }
};

// Resto do código permanece igual...
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
  baseURL: getApiBaseUrl(),
  timeout: apiClient.defaults.timeout,
  headers: apiClient.defaults.headers
});

export const API_BASE_URL = getApiBaseUrl();
export default apiClient;