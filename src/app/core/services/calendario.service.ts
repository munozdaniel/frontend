import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICalendario } from 'app/models/interface/iCalendario';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerCalendarioPorCiclo(ciclo: number): Observable<ICalendario[]> {
    const query = `calendario/por-ciclo/${ciclo}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerCalendario(ciclo: number): Observable<ICalendario[]> {
    const query = `calendario`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  crearCalendario(fechaInicio: string, fechaFinal: string): Observable<ICalendario[]> {
    const query = `calendario`;
    const url = this.url + query;

    return this.http.post<any>(url, { fechaInicio, fechaFinal });
  }
}
