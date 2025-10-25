// .umirc.ts
import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  locale: {
    default: 'es-ES',
    antd: true,
    // baseSeparator: '-', // opcional, puedes probar sin esta línea
  },
  layout: {
    title: 'Mantenimiento Predictivo',
  },
  routes: [
    { path: '/login', name: 'Login', component: '@/pages/Login' },
    { path: '/inicio', name: 'Inicio', component: './Inicio' },
    {
      path: '/ingreso',
      name: 'Ingreso',
      component: './Ingreso',
      access: 'isLoggedIn',
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: './Usuarios',
      access: 'isLoggedIn',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: './Dashboard',
      access: 'isLoggedIn',
    },
    {
      path: '/reportes',
      name: 'Reportes',
      component: './Reportes',
      access: 'isLoggedIn',
    },
    { path: '/', redirect: '/inicio' },
  ],
});
