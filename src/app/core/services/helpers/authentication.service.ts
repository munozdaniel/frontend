import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { IUsuario } from 'app/models/interface/iUsuario';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { SeguimientoAlumnoService } from '../seguimientoAlumno.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  protected url = environment.apiURI;
  private currentUserSubject: BehaviorSubject<IUsuario>;
  public currentUser$: Observable<IUsuario>;

  constructor(
    private _designNavigationService: DesignNavigationService,
    private http: HttpClient,
    private _seguimientoService: SeguimientoAlumnoService
  ) {
    this.currentUserSubject = new BehaviorSubject<IUsuario>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUsuario {
    return this.currentUserSubject.value;
  }
  registrar(usuario: IUsuario) {
    const query = `auth/registrar`;
    const url = this.url + query;

    return this.http.post<any>(url, usuario).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }
  login(email, password) {
    const query = `auth/login`;
    const url = this.url + query;
    return this.http.post<any>(url, { email, password }).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(returnTo?: any) {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._designNavigationService.setCurrentNavigation('navigationEmpty');
    this._seguimientoService.stopPolling.next();
  }
}
