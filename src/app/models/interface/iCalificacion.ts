import { IAlumno } from './iAlumno';
import { IPlanillaTaller } from './iPlanillaTaller';
import { IProfesor } from './iProfesor';

export interface ICalificacion {
  _id?: string;
  id_calificaciones: number; // para migrar
  planillaTaller: IPlanillaTaller;
  profesor: IProfesor;
  alumno: IAlumno;
  formaExamen?: string; // ORAL | ESCRITO
  tipoExamen?: string; // TP | EVALUACION | CONCEPTO | PARTICIPACION | TRABAJO EN GRUPO
  promedia: boolean;
  promedioGeneral: number;
  observaciones: string;
  ausente?: boolean;
  ausentePermitido?: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
