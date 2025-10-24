// src/services/reportes.ts
export const ReportesService = {
  // construye URL para abrir/descargar el PDF (usa proxy /api)
  maquinasPdfUrl: (params?: {
    tipo?: string;
    status?: string;
    search?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.tipo) qs.append('tipo', params.tipo);
    if (params?.status) qs.append('status', params.status);
    if (params?.search) qs.append('search', params.search);
    return `/api/reportes/maquinas/pdf${
      qs.toString() ? `?${qs.toString()}` : ''
    }`;
  },
};
