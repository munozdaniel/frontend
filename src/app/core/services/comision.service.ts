import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICurso } from 'app/models/interface/iCurso';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerComisionPorId(comisionId: string): Observable<ICurso> {
    const query = `cursos/${comisionId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisiones(): Observable<ICurso[]> {
    const query = `cursos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisionesHabilitadas(): Observable<ICurso[]> {
    const query = `cursos/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarComision(comision: ICurso): Observable<ICurso> {
    const query = `cursos`;
    const url = this.url + query;

    return this.http.put<any>(url, comision);
  }

  actualizarComision(comisionId: string, comision: ICurso): Observable<any> {
    const query = `cursos/${comisionId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, comision);
  }
  eliminarComision(comisionId: string): Observable<any> {
    const query = `cursos/${comisionId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarComision(comisionId: string, activo: boolean): Observable<any> {
    const query = `cursos/deshabilitar/${comisionId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarComision(comisionId: string, activo: boolean): Observable<any> {
    const query = `cursos/habilitar/${comisionId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  obtenerComisionPorParametros(comision: ICurso): Observable<ICurso> {
    const query = `cursos/parametros`;
    const url = this.url + query;

    return this.http.post<any>(url, { comision });
  }
}
