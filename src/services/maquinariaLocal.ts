import { Maquinaria } from '@/constants/maquinaria';

const STORAGE_KEY = 'maquinaria_data';

// Datos iniciales de ejemplo
const DATOS_INICIALES: Maquinaria[] = [
  {
    id: '1',
    codigo: 'EXC-001',
    nombre: 'Excavadora Principal',
    tipo: 'Excavadora',
    numero_serie: 'CAT320D-12345',
    marca: 'Caterpillar',
    modelo: '320D',
    motor: 'C6.6 ACERT',
    fecha_adquisicion: '2020-01-15',
    horasUsoInicial: 500,
    horasUsoActual: 3250,
    estado: 'Operativa',
    ubicacion: 'Zona Norte',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    codigo: 'BUL-001',
    nombre: 'Bulldozer Pesado',
    tipo: 'Bulldozer',
    numero_serie: 'KOMD85-67890',
    marca: 'Komatsu',
    modelo: 'D85EX-15',
    motor: '6D125',
    fecha_adquisicion: '2019-06-20',
    horasUsoInicial: 1200,
    horasUsoActual: 5800,
    estado: 'Operativa',
    ubicacion: 'Zona Sur',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    codigo: 'RET-001',
    nombre: 'Retroexcavadora Ligera',
    tipo: 'Retroexcavadora',
    numero_serie: 'JCB3CX-11223',
    marca: 'JCB',
    modelo: '3CX',
    motor: 'EcoMAX',
    fecha_adquisicion: '2021-03-10',
    horasUsoInicial: 0,
    horasUsoActual: 1500,
    estado: 'Mantenimiento',
    ubicacion: 'Taller Central',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    codigo: 'CAR-001',
    nombre: 'Cargador Frontal',
    tipo: 'Cargador frontal',
    numero_serie: 'CAT950-44556',
    marca: 'Caterpillar',
    modelo: '950 GC',
    motor: 'C7.1',
    fecha_adquisicion: '2020-11-05',
    horasUsoInicial: 300,
    horasUsoActual: 2100,
    estado: 'Operativa',
    ubicacion: 'Zona Este',
    created_at: new Date().toISOString(),
  },
];

export const MaquinariaStore = {
  // Inicializar datos si no existen
  init: (): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DATOS_INICIALES));
    }
  },

  // Listar todas las máquinas
  list: (): Promise<Maquinaria[]> => {
    MaquinariaStore.init();
    const data = localStorage.getItem(STORAGE_KEY);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  // Obtener una máquina por ID
  get: (id: string): Promise<Maquinaria | null> => {
    return MaquinariaStore.list().then((maquinas) => {
      return maquinas.find((m) => m.id === id) || null;
    });
  },

  // Crear nueva máquina
  create: (
    maquina: Omit<Maquinaria, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Maquinaria> => {
    return MaquinariaStore.list().then((maquinas) => {
      const nueva: Maquinaria = {
        ...maquina,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      maquinas.push(nueva);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(maquinas));
      return nueva;
    });
  },

  // Actualizar máquina existente
  update: (id: string, datos: Partial<Maquinaria>): Promise<Maquinaria> => {
    return MaquinariaStore.list().then((maquinas) => {
      const index = maquinas.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error('Máquina no encontrada');
      }
      maquinas[index] = {
        ...maquinas[index],
        ...datos,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(maquinas));
      return maquinas[index];
    });
  },

  // Eliminar máquina
  delete: (id: string): Promise<void> => {
    return MaquinariaStore.list().then((maquinas) => {
      const filtradas = maquinas.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    });
  },

  // Buscar por código
  findByCodigo: (codigo: string): Promise<Maquinaria | null> => {
    return MaquinariaStore.list().then((maquinas) => {
      return maquinas.find((m) => m.codigo === codigo) || null;
    });
  },

  // Filtrar por tipo
  filterByTipo: (tipo: string): Promise<Maquinaria[]> => {
    return MaquinariaStore.list().then((maquinas) => {
      return maquinas.filter((m) => m.tipo === tipo);
    });
  },
};
