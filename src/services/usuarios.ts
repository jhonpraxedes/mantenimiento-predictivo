// src/services/usuarios.ts
import { apiJson } from '@/services/api';

export const UsuariosService = {
  authenticateUser: async (credentials: { name: string; code: string }) => {
    return apiJson<{
      id: number;
      name: string;
      code: string;
      role: string;
    }>({
      path: 'users/login', // sin slash inicial: usará '/api/users/login' con BASE_URL = '/api'
      method: 'POST',
      body: credentials,
    });
  },

  listUsers: async () =>
    apiJson({
      path: 'users',
    }),

  // Otros métodos ejemplo:
  getUserById: async (id: number) =>
    apiJson({ path: `users/${id}`, method: 'GET' }),

  createUser: async (payload: any) =>
    apiJson({ path: 'users', method: 'POST', body: payload }),

  updateUser: async (id: number, payload: any) =>
    apiJson({ path: `users/${id}`, method: 'PATCH', body: payload }),

  deleteUser: async (id: number) =>
    apiJson({ path: `users/${id}`, method: 'DELETE' }),
};
