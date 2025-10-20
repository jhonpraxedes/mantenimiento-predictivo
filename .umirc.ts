import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  locale: {
    default: 'es-ES',
    antd: true,
    baseSeparator: '-',
  },
  layout: {
    title: 'Mantenimiento Predictivo',
    locale: true,
  },
  routes: [
    {
      path: '/',
      redirect: '/maquinaria',
    },
    {
      name: 'Maquinaria',
      path: '/maquinaria',
      component: './Maquinaria',
    },
    {
      name: 'Control Maquinaria',
      path: '/control-maquinaria',
      component: './ControlMaquinaria',
    },
    {
      name: 'Ingreso',
      path: '/ingreso',
      component: './Ingreso',
      access: 'canSeeAdmin', // Solo admin
    },
    {
      name: 'Usuarios',
      path: '/usuarios',
      component: './Usuarios',
    },

    { name: 'Reportes', path: '/reportes', component: './Reportes' },
  ],
  npmClient: 'pnpm',
});
