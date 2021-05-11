import { ICicloLectivo } from './iCicloLectivo';

export interface ICalendario {
  _id?: number;
  id_calendario?: number; // para migrar
  fecha: Date;
  cicloLectivo: ICicloLectivo;
  comisionA: number;
  comisionB: number;
  comisionC: number;
  comisionD: number;
  comisionE: number;
  comisionF: number;
  comisionG: number;
  comisionH: number;

  fechaCreacion?: Date;
  activo: boolean;
  //
  titulo?: string;
}
