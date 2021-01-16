export interface IAdulto {
  nombreCompleto: string;
  telefono?: string;
  celular?: string;
  email: string;
  tipoAdulto: 'TUTOR' | 'PADRE' | 'MADRE';
  fechaCreacion: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
