// src/types/Incidencia.ts

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_incidencia: string;
  estado_incidencia: string;
  monto_deuda?: string;
  fecha_creacion: string;
}
