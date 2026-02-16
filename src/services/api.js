// src/services/api.js
import axios from "axios";

// Используем переменную окружения, если она есть, иначе локальный адрес
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE); // Добавьте эту строку для отладки

export const api = (token) => {
  const instance = axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Auth endpoints
export const registerUser = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_BASE}/auth/login`, data);

// Progress endpoints
export const getUserProgress = (token) => api(token).get('/progress');
export const completeLesson = (token, lessonId) => api(token).post('/progress/complete', { lessonId });
export const initUserProgress = (token) => api(token).post('/progress/init');
