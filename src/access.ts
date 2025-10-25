type Rol = 'Administrador' | 'Operador';

export default function access(initialState: any) {
  const role = initialState?.currentUser?.role as Rol | undefined;

  return {
    // Sesión iniciada
    isLoggedIn: !!role,

    // Solo administradores
    canAdmin: role === 'Administrador',

    // Operadores y administradores
    canOperator: role === 'Operador' || role === 'Administrador',
  };
}
