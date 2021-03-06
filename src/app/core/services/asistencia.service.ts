import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerAsistenciasPorAlumnoId(alumnoId: string): Observable<any> {
    const query = `asistencia/por-alumno/${alumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
