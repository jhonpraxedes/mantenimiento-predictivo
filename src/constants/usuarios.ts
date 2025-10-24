export const ROLES_USUARIO = ['Administrador', 'Operador'] as const;

export type RolUsuario = (typeof ROLES_USUARIO)[number];

// src/constants/usuarios.ts
export interface Usuario {
  id: number;
  name: string;
  code: string;
  role: 'OPERADOR' | 'ADMINISTRADOR';
  created_at?: string;
}
// Datos iniciales de ejemplo
export const USUARIOS_INICIALES: Usuario[] = [
  {
    id: 1,
    name: 'JUAN',
    code: 'ADM001',
    role: 'ADMINISTRADOR',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'María González',
    code: 'OPR002',
    role: 'OPERADOR',
    created_at: '2024-02-20T10:00:00Z',
  },
  {
    id: 3,
    name: 'Carlos Ramirez',
    code: 'OPR002',
    role: 'OPERADOR',
    created_at: '2024-03-10T10:00:00Z',
  },
];
