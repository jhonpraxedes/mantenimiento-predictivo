// .umirc.ts
import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8001', // <- apunta al backend
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
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
      access: 'canSeeAdmin',
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: './Usuarios',
      access: 'canseeAdmin', // Solo admin
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: './Dashboard',
      access: 'isLoggedin',
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
