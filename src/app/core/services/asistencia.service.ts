import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
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
  buscarInasistencias(fecha: any): Observable<IAlumno[]> {
    console.log('fecha', fecha);
    const query = `asistencia/buscar-inasistencias`;
    const url = this.url + query;

    return this.http.post<any>(url, { fecha });
  }
}
