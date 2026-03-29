import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(() => {
    const stored = localStorage.getItem('ownerInfo');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ownerToken', data.token);
      localStorage.setItem('ownerInfo', JSON.stringify(data.owner));
      setOwner(data.owner);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('ownerToken', data.token);
      localStorage.setItem('ownerInfo', JSON.stringify(data.owner));
      setOwner(data.owner);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerInfo');
    setOwner(null);
  };

  return (
    <AuthContext.Provider value={{ owner, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);