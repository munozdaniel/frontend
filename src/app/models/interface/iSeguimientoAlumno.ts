import { IAlumno } from './iAlumno';
import { IPlanillaTaller } from './iPlanillaTaller';

export interface ISeguimientoAlumno {
  _id?: string;
  id_seguimiento: number; // para migrar
  seguimientoAlumnoNro: number;
  alumno: IAlumno;
  planillaTaller: IPlanillaTaller;
  fecha: Date;
  tipoSeguimiento: string;
  cicloLectivo: number;
  resuelto: boolean;
  observacion: string;
  observacion2: string;
  observacionJefe: string;

  fechaCreacion: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
// original
// _id: number;
// id_seguimiento: number;
// id_alumno: number;
// fecha: string;
// tipo_seguimiento: string;
// observacion: string;
// ciclo_lectivo: number;
// IdPlanillaDeTaller: number;
// Resuelto: string;
// Observacion2: string;
// ObservacionJefe: string;
