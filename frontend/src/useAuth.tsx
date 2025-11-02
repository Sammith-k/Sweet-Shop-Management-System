import React from 'react';
import { api, LoginResult } from './api';

type Auth = LoginResult | null;

function getStoredAuth(): Auth {
  const raw = localStorage.getItem('auth');
  return raw ? JSON.parse(raw) : null;
}

function setStoredAuth(value: Auth) {
  if (value) localStorage.setItem('auth', JSON.stringify(value));
  else localStorage.removeItem('auth');
}

type Ctx = {
  auth: Auth;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<Ctx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = React.useState<Auth>(getStoredAuth());

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setAuth(res);
    setStoredAuth(res);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    setAuth(res);
    setStoredAuth(res);
  };

  const logout = () => {
    setAuth(null);
    setStoredAuth(null);
  };

  return <AuthContext.Provider value={{ auth, login, register, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}