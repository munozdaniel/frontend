import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
