import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: 'https://tea-id-back-281848678899.us-east1.run.app',
});

// Interceptor para adicionar o token de autenticação do Firebase em cada requisição
// Este é o método correto e necessário para autenticar com o seu serviço no Google Cloud Run
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    
    // Adiciona o token ao cabeçalho 'x-endpoint-api-userinfo'
    // Este cabeçalho é o que o Google Cloud Run usa para verificar a identidade do chamador
    config.headers['x-endpoint-api-userinfo'] = token;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
