export const TIPOS_MAQUINARIA = [
  'Retroexcavadora',
  'Bulldozer',
  'Excavadora',
  'Perfiladora',
  'Cargador frontal',
  'Camión',
] as const;

export type TipoMaquinaria = (typeof TIPOS_MAQUINARIA)[number];

export const ESTADOS_MAQUINARIA = [
  'Operativa',
  'Mantenimiento',
  'Parada',
] as const;

export type EstadoMaquinaria = (typeof ESTADOS_MAQUINARIA)[number];

export interface Maquinaria {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoMaquinaria;
  descripcion?: string;
  numero_serie: string;
  marca: string;
  modelo: string;
  motor?: string;
  fecha_adquisicion: string;
  horasUsoInicial: number;
  horasUsoActual: number;
  estado: EstadoMaquinaria;
  ubicacion?: string;
  created_at?: string;
  updated_at?: string;
}
