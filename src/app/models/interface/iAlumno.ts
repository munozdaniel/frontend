import { IAdulto } from './iAdulto';

export interface IAlumno {
  _id: string;
  identificador?: number;// Numero secuencial empezando en 100
  adultos: IAdulto[];
  tipoDni: string;
  dni: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  sexo: string;
  nacionalidad: string;
  observacionTelefono?: string;
  telefono?: string;
  celular?: string;
  email: string;
  fechaIngreso: string;
  procedenciaColegioPrimario: string;
  procedenciaColegioSecundario: string;
  fechaDeBaja: string;
  motivoDeBaja: string;
  domicilio: string;

  cantidadIntegranteGrupoFamiliar: number;
  seguimientoEtap: string;

  nombreCompletoTae: string;
  emailTae: string;
  archivoDiagnostico: string;

  observacion?: string;

  fechaCreacion: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
