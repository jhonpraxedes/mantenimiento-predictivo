// src/services/maquinaria.ts
import type { Maquina, MaquinaCreate, MaquinaUpdate } from './maquinas';
import { MaquinasService } from './maquinas';

// Adaptador para mantener la API que tu componente Ingreso ya consume
export const MaquinariaStore = {
  list: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<Maquina[]> => {
    return MaquinasService.list(params);
  },

  create: async (data: MaquinaCreate): Promise<Maquina> => {
    return MaquinasService.create(data);
  },

  get: async (id: number | string): Promise<Maquina> => {
    const nid = typeof id === 'string' ? parseInt(id, 10) : id;
    return MaquinasService.getById(nid);
  },

  update: async (
    id: number | string,
    data: MaquinaUpdate,
  ): Promise<Maquina> => {
    const nid = typeof id === 'string' ? parseInt(id, 10) : id;
    return MaquinasService.update(nid, data);
  },

  delete: async (id: number | string): Promise<void> => {
    const nid = typeof id === 'string' ? parseInt(id, 10) : id;
    return MaquinasService.delete(nid);
  },
};
