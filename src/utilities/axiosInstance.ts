import axios from 'axios';

// CORRECCIÓN CLAVE: Ahora apunta a tu propio servidor (Proxy)
// Al ser una ruta relativa, el navegador usa el mismo dominio y puerto (3000)
const axiosInstance = axios.create({
  baseURL: '/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR PARA EL TOKEN
axiosInstance.interceptors.request.use(
  (config) => {
    // Solo buscamos en localStorage si estamos en el cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MANEJO DE ERRORES GLOBALES
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o no autorizada. Redirigiendo...");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Opcional: auto-logout
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;