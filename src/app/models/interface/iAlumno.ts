import { IAdulto } from './iAdulto';
import { IComision } from './iComision';
import { IEstadoCursada } from './iEstadoCursada';

export interface IAlumno {
  _id?: string;
  alumnoNro: number;
  legajo: string;
  alumnoId: number; // para migrar
  adultos: IAdulto[];
  estadoCursadas: IEstadoCursada[];
  // comisiones?:IComision[];
  tipoDni: string;
  dni: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  sexo: 'Masculino' | 'Femenino' | 'Otros';
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
  // Ejecucion
  selected?: boolean;
}
