export interface PermisoModulo {
  permiso: string;
  modulo: string;
  path: string;
  icono: string;
}

export interface PlanActivo {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  codigo_usuario: string;
  permisos: PermisoModulo[];
  plan_activo: PlanActivo | null;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  reloadUser: () => void;
}