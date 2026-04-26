import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tif.uin-suska.ac.id/setoran-dev/v1'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    // Menggunakan template literal untuk memastikan spasi setelah Bearer benar
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;