// src/types/FormData.ts

/** Datos personales de la persona involucrada en la incidencia */
export interface PersonaData {
  nombreCompleto: string;
  dni: string;
  fechaNacimiento?: string;
  genero?: string;
  telefono?: string;
  correo?: string;
  imagenUrl?: string;
  notasAdicionales?: string;
}

/** Datos de la institución educativa asociada a la incidencia */
export interface InstitucionData {
  nombre: string;
  ubicacion?: string;
  codigoModular?: string;
  tipo: "Privada" | "Pública" | string; // puedes restringir más si lo deseas
}

/** Información detallada sobre la incidencia reportada */
export interface IncidenciaData {
  titulo: string;
  descripcion: string;
  tipoIncidencia: "Bullying" | "Acoso" | "Deuda" | "Agresión" | string;
  montoDeuda?: string;
  fechaIncidencia: string;
  estadoIncidencia: "Pendiente" | "En proceso" | "Resuelto";
  confidencialidadNivel: "Privado" | "Público";
  adjuntosUrl?: string;
}

/** Información de un familiar vinculado a la persona afectada */
export interface FamiliarVinculoData {
  dni: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  tipoVinculo: "Padre" | "Madre" | "Hermano" | "Tutor" | string;
}

/** Objeto completo para la creación de una incidencia */
export interface CrearIncidenciaFormData {
  persona: PersonaData;
  institucion: InstitucionData;
  incidencia: IncidenciaData;
  familiares: FamiliarVinculoData[];
}
