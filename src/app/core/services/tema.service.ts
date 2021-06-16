import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IProfesor } from 'app/models/interface/iProfesor';
import { ITema } from 'app/models/interface/iTema';
import { ITemaPendiente } from 'app/models/interface/iTemaPendiente';
import { environment } from 'environments/environment';
import { Observable, Subject, timer } from 'rxjs';
import { switchMap, retry, share, takeUntil } from 'rxjs/operators';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class TemaService implements OnDestroy {
  public temas$: Observable<ITemaPendiente[]>;
  public stopPolling = new Subject();
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  ngOnDestroy(): void {
    this.stopPolling.next();
  }
  poolingTemas(email: string) {
    this.temas$ = timer(1, 60000).pipe(
      switchMap(() => this.obtenerTemasPendientesPorUsuario(email)),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );
  }
  obtenerTemasPendientesPorUsuario(email: string): Observable<ITemaPendiente[]> {
    const query = `tema-pendiente/por-usuario/${email}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
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
  obtenerTemasCalendario(planillaId: string): Observable<any> {
    const query = `tema/temas-calendario`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaId });
  }
  //   Informes
  informeTemasPorPlanillaTaller(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `tema/informe-por-planilla`;
    const url = this.url + query;

    return this.http.post<any>(url, { planillaTaller });
  }

  //   TEMAS PENDIENTES
  guardarTemasPendientes(temasPendientes: ITemaPendiente[]): Observable<any> {
    const query = `tema-pendiente`;
    const url = this.url + query;

    return this.http.post<any>(url, { temasPendientes });
  }
  obtenerTemasIncompletosPorPlanilla(planillaId: string): Observable<ITemaPendiente[]> {
    const query = `tema-pendiente/${planillaId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
