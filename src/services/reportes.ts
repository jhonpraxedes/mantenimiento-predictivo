// src/services/reportes.ts
import { apiJson } from './api';

export type Reporte = {
  id: number;
  maquina_id: number;
  temperatura?: number;
  vibracion?: number;
  presion?: number;
  rpm_motor?: number;
  timestamp_lectura?: string; // ISO string
  timestamp_arranque?: string;
};

export type ReporteCreate = Omit<Reporte, 'id'>;
export type ReporteQuery = {
  maquina_id?: number;
  from?: string; // ISO date
  to?: string; // ISO date
  skip?: number;
  limit?: number;
};

export const ReportesService = {
  // Crear reporte (lectura)
  create: async (data: ReporteCreate) => {
    return await apiJson<Reporte>({
      path: '/lecturas',
      method: 'POST',
      body: data,
    });
  },

  // Listar reportes (con filtros)
  list: async (params?: ReporteQuery) => {
    return await apiJson<Reporte[]>({
      path: '/lecturas',
      method: 'GET',
      query: params,
    });
  },

  // Obtener reporte por ID
  getById: async (id: number) => {
    return await apiJson<Reporte>({
      path: `/lecturas/${id}`,
      method: 'GET',
    });
  },

  // Actualizar reporte
  update: async (id: number, data: Partial<ReporteCreate>) => {
    return await apiJson<Reporte>({
      path: `/lecturas/${id}`,
      method: 'PATCH',
      body: data,
    });
  },

  // Eliminar reporte
  delete: async (id: number) => {
    return await apiJson<void>({
      path: `/lecturas/${id}`,
      method: 'DELETE',
    });
  },
};
