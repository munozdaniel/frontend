import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private asistenciasHoySubject = new BehaviorSubject<any>(null);
  public asistenciasHoy$ = this.asistenciasHoySubject.asObservable().pipe(shareReplay(1));

  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerAsistenciasPorAlumnoId(alumnoId: string, planillaId: string): Observable<any> {
    const query = `asistencia/por-alumno/${alumnoId}`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaId });
  }
  obtenerAsistenciasPorAlumnosCurso(curso: number, division: number, ciclo: number): Observable<any> {
    const query = `asistencia/por-alumno-curso`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, division, ciclo });
  }
  obtenerAsistenciasPorPlanilla(planillaId: string): Observable<IAsistencia[]> {
    const query = `asistencia/por-planilla/${planillaId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  guardarAsistencia(asistencia: IAsistencia): Observable<IAsistencia> {
    const query = `asistencia`;
    const url = this.url + query;

    return this.http.put<any>(url, { asistencia });
  }
  actualizarAsistencia(id: string, asistencia: IAsistencia): Observable<IAsistencia> {
    const query = `asistencia/${id}`;
    const url = this.url + query;

    return this.http.patch<any>(url, { asistencia });
  }
  eliminar(_id: string): Observable<any> {
    const query = `asistencia/${_id}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  //   Informes
  informeAsistenciasPlantillasEntreFechas(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `asistencia/informe-plantillas-entre-fechas`;
    const url = this.url + query;
    return this.http.post<any>(url, { planillaTaller });
  }
  informeAsistenciasPorPlanilla(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `asistencia/informe-por-planilla`;
    const url = this.url + query;
    return this.http.post<any>(url, { planillaTaller });
  }
  buscarAsistenciasPorFechas(division: number, curso: number, turno: string, desde: any, hasta?: any): Observable<IAlumno[]> {
    const query = `asistencia/buscar-asistencias-por-fechas`;
    const url = this.url + query;

    return this.http.post<any>(url, { division, curso, turno, desde, hasta });
  }
  buscarAsistenciasPorFechaYPlanilla(fecha: Date, planilla: IPlanillaTaller, alumnos: IAlumno[]): Observable<IAsistencia[]> {
    const query = `asistencia/obtener-asistencias-fecha`; // va una planilla
    const url = this.url + query;

    return this.http.post<any>(url, { fecha, planilla, alumnos });
  }
  buscarInasistencias(division: number, curso: number, turno: string, desde: any, hasta?: any): Observable<IAlumno[]> {
    const query = `asistencia/buscar-inasistencias`;
    const url = this.url + query;

    return this.http.post<any>(url, { division, curso, turno, desde, hasta });
  }
  tomarAsistencia(alumno: IAlumno, fecha: string): Observable<any> {
    const query = `asistencia/tomar-asistencias`;
    const url = this.url + query;

    return this.http.post<any>(url, { alumno, fecha });
  }
  tomarAsistenciaPorPlanilla(planilla: IPlanillaTaller, alumnos: IAlumno[], fecha: string): Observable<any> {
    const query = `asistencia/tomar-asistencias`;
    const url = this.url + query;

    return this.http.post<any>(url, { planilla, alumnos, fecha });
  }
  obtenerAsistenciasHoyPorPlanilla(planilla: IPlanillaTaller, alumnos: IAlumno[]): Observable<IAsistencia[]> {
    const query = `asistencia/obtener-asistencias-hoy`;
    const url = this.url + query;

    return this.http.post<any>(url, { planilla, alumnos });
  }
  buscarAsistenciasHoy(planillaTallerId) {
    const query = `asistencia/asistencias-hoy/${planillaTallerId}`;
    const url = this.url + query;

    this.http
      .get<any>(url)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.asistenciasHoySubject.next(datos);
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
}
