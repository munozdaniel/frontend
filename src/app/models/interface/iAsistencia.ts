import { IAlumno } from './iAlumno';
import { IPlanillaTaller } from './iPlanillaTaller';

export interface IAsistencia {
  _id: string;
  asistenciaNro: number;
  id_planilla_de_asistencia: number; // para migrar
  planillaTaller: IPlanillaTaller;
  alumno: IAlumno;
  fecha: Date;
  presente: boolean;
  ausentePermitido?: boolean;
  llegoTarde: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;

  //
  tomarAsistencia?: number; // 0: Nada 1:Presente 2:Ausente 3:AusentePermitido
}
