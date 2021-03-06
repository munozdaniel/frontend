import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ITema } from 'app/models/interface/iTema';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerTemaPorPlanillaTaller(planillaId: string): Observable<any> {
    const query = `tema/por-planilla/${planillaId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  guardarTema(tema: ITema): Observable<any> {
    const query = `tema`;
    const url = this.url + query;

    return this.http.put<any>(url, { ...tema });
  }
  actualizarTema(id: string, tema: ITema): Observable<any> {
    const query = `tema/${id}`;
    const url = this.url + query;

    return this.http.patch<any>(url, { tema });
  }
  eliminar(_id: string): Observable<any> {
    const query = `tema/${_id}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  obtenerTemasCalendario(tipo: string, planillaId: string): Observable<any> {
    const query = `tema/temas-calendario`;
    const url = this.url + query;

    return this.http.post<any>(url, { tipo, planillaId });
  }
  //   Informes
  informeTemasPorPlanillaTaller(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `tema/informe-por-planilla`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaTaller });
  }
}
