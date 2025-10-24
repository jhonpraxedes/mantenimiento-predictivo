// src/hooks/useAuth.ts
import { UsuariosService } from '@/services/usuarios';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  code: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: { name: string; code: string }) => {
    try {
      const userData = await UsuariosService.authenticateUser(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error: any) {
      message.error(error.message || 'Credenciales incorrectas');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  return { user, login, logout, loading };
};
