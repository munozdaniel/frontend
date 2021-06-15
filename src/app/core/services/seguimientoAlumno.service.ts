import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { retry, share, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class SeguimientoAlumnoService implements OnDestroy {
  //   private seguimientoNotificacionSubject = new BehaviorSubject<ISeguimientoAlumno[]>(null);
  //   public seguimientoNotificacion$ = this.seguimientoNotificacionSubject.asObservable().pipe(shareReplay(1));
  public seguimientos$: Observable<ISeguimientoAlumno[]>;
  public stopPolling = new Subject();

  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  ngOnDestroy(): void {
    this.stopPolling.next();
  }
  //   setSeguimientoNotificacion(seguimientos: ISeguimientoAlumno[]) {
  //     this.seguimientoNotificacionSubject.next(seguimientos);
  //   }
  poolingSeguimientos(email: string) {
    this.seguimientos$ = timer(1, 60000).pipe(
      switchMap(() => this.obtenerSeguimientosNuevosPorUsuario(email)),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );
  }
  obtenerSeguimientosNuevosPorUsuario(email: string): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/por-usuario/${email}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  //   obtenerSeguimientosSinVerPorUsuario(usuarioId: string) {
  //     const query = `seguimiento-alumnos/por-usuario/${usuarioId}`;
  //     const url = this.url + query;

  //     this.http
  //       .get<any>(url)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(
  //         (datos) => {
  //           this.seguimientoNotificacionSubject.next(datos);
  //         },
  //         (error) => {
  //           console.log('[ERROR]', error);
  //         }
  //       );
  //   }
  obtenerSeguimientoPorId(seguimientoAlumnoId: string): Observable<any> {
    const query = `seguimiento-alumnos/${seguimientoAlumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerSeguimientoPorIdCompleto(seguimientoAlumnoId: string): Observable<any> {
    const query = `seguimiento-alumnos/completo/${seguimientoAlumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerSeguimientoAlumnoes(): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerSeguimientoAlumnoesHabilitadas(): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarSeguimientoAlumno(asignatura: ISeguimientoAlumno): Observable<any> {
    const query = `seguimiento-alumnos`;
    const url = this.url + query;

    return this.http.put<any>(url, asignatura);
  }

  actualizarSeguimientoAlumno(seguimientoId: string, asignatura: ISeguimientoAlumno): Observable<any> {
    const query = `seguimiento-alumnos/${seguimientoId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarSeguimientoAlumno(seguimientoId: string): Observable<any> {
    const query = `seguimiento-alumnos/${seguimientoId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarSeguimientoAlumno(seguimientoId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/deshabilitar/${seguimientoId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarSeguimientoAlumno(seguimientoId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/habilitar/${seguimientoId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  //
  buscarAlumnosPorSeguimiento(resuelto?: boolean): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/resueltos`;
    const url = this.url + query;

    return this.http.post<any>(url, { resuelto });
  }
  obtenerSeguimientoAlumnoPorPlanillaCiclo(planillaId: string, alumnoId: string, ciclo: number) {
    const query = `seguimiento-alumnos/por-planilla/${planillaId}`;
    const url = this.url + query;

    return this.http.post<any>(url, { alumnoId, ciclo });
  }
  obtenerPorPlanillaYAlumno(planillaId: string, alumno_id: string) {
    const query = `seguimiento-alumnos/por-planilla-alumno/${planillaId}/${alumno_id}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerPorAlumno(alumno_id: string) {
    const query = `seguimiento-alumnos/por-alumno/${alumno_id}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
