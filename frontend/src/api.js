import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ownerToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerInfo');
    }
    return Promise.reject(err);
  }
);

export default api;