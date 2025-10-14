import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Mantenimiento Predictivo',
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
      name: 'Usuarios',
      path: '/usuarios',
      component: './Usuarios',
    },

    { name: 'Reportes', path: '/reportes', component: './Reportes' },
  ],
  npmClient: 'pnpm',
});
