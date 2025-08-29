// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000', // The URL of your running Flask backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// This is a crucial part: an "interceptor" that automatically adds the
// authentication token to every API request's header.
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;