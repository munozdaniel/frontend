import { IAlumno } from './iAlumno';

export interface IAlumnoPaginado {
  docs?: IAlumno[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}
