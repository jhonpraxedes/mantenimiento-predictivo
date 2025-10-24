import { apiJson } from './api';

export const UsuariosService = {
  // Login de usuario
  authenticateUser: async (credentials: { name: string; code: string }) => {
    return await apiJson<{
      id: number;
      name: string;
      code: string;
      role: string;
    }>({
      path: '/users/login',
      method: 'POST',
      body: credentials,
    });
  },

  // Crear usuario
  createUser: async (user: { code: string; name: string; role: string }) => {
    return await apiJson({
      path: '/users',
      method: 'POST',
      body: user,
    });
  },

  // Listar usuarios con filtros
  listUsers: async (params?: {
    skip?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => {
    return await apiJson({
      path: '/users',
      method: 'GET',
      query: params,
    });
  },

  // Obtener usuario por ID
  getUserById: async (id: number) => {
    return await apiJson({
      path: `/users/${id}`,
      method: 'GET',
    });
  },

  // Actualizar usuario (PATCH)
  updateUser: async (
    id: number,
    updates: Partial<{ name: string; code: string; role: string }>,
  ) => {
    return await apiJson({
      path: `/users/${id}`,
      method: 'PATCH',
      body: updates,
    });
  },

  // Eliminar usuario
  deleteUser: async (id: number) => {
    return await apiJson({
      path: `/users/${id}`,
      method: 'DELETE',
    });
  },
};
