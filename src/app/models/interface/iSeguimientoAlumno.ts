import { IAlumno } from './iAlumno';
import { ICicloLectivo } from './iCicloLectivo';
import { IPlanillaTaller } from './iPlanillaTaller';
import { IUsuario } from './iUsuario';

export interface ISeguimientoAlumno {
  _id?: string;
  id_seguimiento: number; // para migrar
  seguimientoAlumnoNro: number;
  alumno: IAlumno;
  planillaTaller: IPlanillaTaller;
  cicloLectivo: ICicloLectivo;
  fecha: Date;
  tipoSeguimiento: string;
  resuelto: boolean;
  observacion: string;
  observacion2: string;
  observacionJefe: string;

  fechaCreacion: Date;
  creadoPor?: IUsuario | string;
  modificadoPor?: IUsuario | string;
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
