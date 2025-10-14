// Configuración en tiempo de ejecución

// Datos de inicialización global, usados para Layout (usuario y permisos).
// Más info: https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'SISTEMA DE MANTENIMIENTO PREDICTIVO' };
}

export const layout = () => {
  return {
    logo: '/icons/img1.svg', // Usa tu SVG local
    menu: {
      locale: false,
    },
  };
};
