// src/services/maquinas.ts
import { apiJson } from './api';

export type Maquina = {
  id: number;
  nombre: string;
  descripcion?: string;
  numero_serie: string;
  motor?: string;
};

export type MaquinaCreate = Omit<Maquina, 'id'>;
export type MaquinaUpdate = Partial<Omit<Maquina, 'id'>>;

export const MaquinasService = {
  // Crear máquina
  create: async (data: MaquinaCreate) => {
    return await apiJson<Maquina>({
      path: '/maquinas',
      method: 'POST',
      body: data,
    });
  },

  // Listar máquinas (con filtros)
  list: async (params?: { skip?: number; limit?: number; search?: string }) => {
    return await apiJson<Maquina[]>({
      path: '/maquinas',
      method: 'GET',
      query: params,
    });
  },

  // Obtener máquina por ID
  getById: async (id: number) => {
    return await apiJson<Maquina>({
      path: `/maquinas/${id}`,
      method: 'GET',
    });
  },

  // Actualizar máquina
  update: async (id: number, data: MaquinaUpdate) => {
    return await apiJson<Maquina>({
      path: `/maquinas/${id}`,
      method: 'PATCH',
      body: data,
    });
  },

  // Eliminar máquina
  delete: async (id: number) => {
    return await apiJson<void>({
      path: `/maquinas/${id}`,
      method: 'DELETE',
    });
  },
};
