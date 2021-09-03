import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalificacionService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerCalificacionesPorAlumnoId(alumnoId: string, planillaId: string): Observable<any> {
    const query = `calificacion/por-alumno/${alumnoId}`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaId });
  }
  guardarCalificacion(calificacion: ICalificacion): Observable<ICalificacion> {
    const query = `calificacion`;
    const url = this.url + query;

    return this.http.put<any>(url, { ...calificacion });
  }
  actualizarCalificacion(id: string, calificacion: ICalificacion): Observable<ICalificacion> {
    const query = `calificacion/${id}`;
    const url = this.url + query;

    return this.http.patch<any>(url, { calificacion });
  }
  eliminar(_id: string): Observable<any> {
    const query = `calificacion/${_id}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  //   Informe
  informeCalificacionesPorPlanilla(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `calificacion/informe-por-planilla`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaTaller });
  }
  informeAlumnosPorTaller(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `calificacion/informe-alumnos-por-taller`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaTaller });
  }
  informePromediosPorTaller(alumnoId: string): Observable<any> {
    const query = `calificacion/informe-promedio-taller/${alumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  // Examen
  agregarExamen(mes, nota, alumnoId, planillaId, ausente, fecha): Observable<any> {
    const query = `examen`;
    const url = this.url + query;

    return this.http.put<any>(url, { mes, nota, alumnoId, planillaId, ausente, fecha });
  }
  obtenerExamenes(alumnoId, planillaId): Observable<any> {
    const query = `examen/por-planilla-alumno`;
    const url = this.url + query;

    return this.http.post<any>(url, { alumnoId, planillaId });
  }
  eliminarExamen(_id): Observable<any> {
    const query = `examen/eliminar/${_id}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
}
