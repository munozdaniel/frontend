import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAsistencia } from 'app/models/interface/iAsistencia';
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
}
