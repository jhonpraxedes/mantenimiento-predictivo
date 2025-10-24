// src/services/maquinas.ts
import { apiJson } from './api';

export type Maquina = {
  id: number;
  nombre: string;
  descripcion?: string;
  numero_serie: string;
  motor?: string;
  tipo?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type MaquinaCreate = Omit<Maquina, 'id'>;
export type MaquinaUpdate = Partial<Omit<Maquina, 'id'>>;

export const MaquinasService = {
  create: async (data: MaquinaCreate) =>
    apiJson<Maquina>({ path: 'maquinas', method: 'POST', body: data }),

  list: async (params?: { skip?: number; limit?: number; search?: string }) =>
    apiJson<Maquina[]>({ path: 'maquinas', method: 'GET', query: params }),

  getById: async (id: number) =>
    apiJson<Maquina>({ path: `maquinas/${id}`, method: 'GET' }),

  update: async (id: number, data: MaquinaUpdate) =>
    apiJson<Maquina>({ path: `maquinas/${id}`, method: 'PATCH', body: data }),

  delete: async (id: number) =>
    apiJson<void>({ path: `maquinas/${id}`, method: 'DELETE' }),
};
