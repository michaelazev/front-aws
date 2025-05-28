import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:10000', // Fallback para desenvolvimento local
  timeout: 15000, // Aumentado para 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros comuns
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Não autorizado - redirecionando para login');
          // Você pode adicionar um redirecionamento para login aqui se necessário
          break;
        case 404:
          console.error('Endpoint não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na requisição:', error.message);
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor', error.request);
    } else {
      console.error('Erro ao configurar a requisição', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;