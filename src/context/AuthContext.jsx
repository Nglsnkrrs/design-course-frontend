// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';
import { initUserProgress } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Вход
  const login = async (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    // Инициализируем прогресс для нового пользователя
    try {
      await initUserProgress(token);
    } catch (error) {
      console.error('Error initializing progress:', error);
    }
  };

  // Выход
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};