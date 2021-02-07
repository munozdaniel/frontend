import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IComision } from 'app/models/interface/iComision';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComisionService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerComisionPorId(comisionId: string): Observable<IComision> {
    const query = `comisiones/${comisionId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisiones(): Observable<IComision[]> {
    const query = `comisiones`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisionesHabilitadas(): Observable<IComision[]> {
    const query = `comisiones/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarComision(comision: IComision): Observable<IComision> {
    const query = `comisiones`;
    const url = this.url + query;

    return this.http.put<any>(url, comision);
  }

  actualizarComision(comisionId: string, comision: IComision): Observable<any> {
    const query = `comisiones/${comisionId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, comision);
  }
  eliminarComision(comisionId: string): Observable<any> {
    const query = `comisiones/${comisionId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarComision(comisionId: string, activo: boolean): Observable<any> {
    const query = `comisiones/deshabilitar/${comisionId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarComision(comisionId: string, activo: boolean): Observable<any> {
    const query = `comisiones/habilitar/${comisionId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  obtenerComisionPorParametros(comision: IComision): Observable<IComision> {
    const query = `comisiones/parametros`;
    const url = this.url + query;

    return this.http.post<any>(url, { comision });
  }
}
