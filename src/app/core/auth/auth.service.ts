import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { IUsuario } from 'app/models/interface/iUsuario';
import { environment } from 'environments/environment';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { SeguimientoAlumnoService } from '../services/seguimientoAlumno.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import Swal from 'sweetalert2';
import { TemaService } from '../services/tema.service';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  //   private currentUserSubject: BehaviorSubject<IUsuario>;
  //   public currentUser$: Observable<IUsuario>;
  private readonly apiUrl = `${environment.apiURI}`;
  private timer: Subscription;
  private _user = new BehaviorSubject<IUsuario>(null);
  currentUser$: Observable<IUsuario> = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.stopTokenTimer();
        this._user.next(null);
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        this.http.get<IUsuario>(`${this.apiUrl}user`).subscribe((x) => {
          console.log('LOGIN EVENT', x);
          this._user.next({
            email: x.email,
            rol: x.rol,
            nombre: x.nombre,
            apellido: x.apellido,
            profesor: x.profesor,
            // originalUserName: x.originalUserName,
          });
        });
      }
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private _designNavigationService: DesignNavigationService,
    private _temaService: TemaService,
    private _seguimientoService: SeguimientoAlumnoService
  ) {
    // this.obtenerUsuarioLogueadoPorToken()
    //   .pipe(untilDestroyed(this))
    //   .subscribe(
    //     (datos) => {
    //       this.currentUserSubject = new BehaviorSubject<IUsuario>(datos);
    //       this.currentUser$ = this.currentUserSubject.asObservable();
    //     },
    //     (error) => {
    //       console.log('[ERROR]', error);
    //     }
    //   );

    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  obtenerUsuarioLogueadoPorToken(): Observable<IUsuario> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }
    return this.http.post<IUsuario>(`${this.apiUrl}auth/usuario-por-token`, {
      refreshToken,
    });
  }
  registrar(usuario: IUsuario) {
    return this.http.post<IUsuario>(`${this.apiUrl}auth/registrar`, usuario).pipe(
      map((x) => {
        this._user.next({
          email: x.email,
          nombre: x.nombre,
          apellido: x.apellido,
          rol: x.rol,
          // role: x.role,
          // originalUserName: x.originalUserName,
        });
        this.setLocalStorage(x);
        this.startTokenTimer();
        return x;
      })
    );
  }
  login(email: string, password: string) {
    // this.logout();
    return this.http.post<IUsuario>(`${this.apiUrl}auth/login`, { email, password }).pipe(
      map((x: any) => {
        console.log('x', x);
        if (x.message) {
          Swal.fire({
            title: 'Error al iniciar sesión',
            text: x.message,
            icon: 'warning',
          });
        } else {
          if (!x.rol) {
            Swal.fire({
              title: 'Usuario Sin Acceso',
              text: 'Actualmente no tiene configurado un rol. Comuniquese con el jefe de taller para que le asigne un rol.',
              icon: 'warning',
            });
            this.router.navigate(['/auth/iniciar-sesion']);
          } else {
            this._user.next({
              email: x.email,
              nombre: x.nombre,
              apellido: x.apellido,
              rol: x.rol,
              profesor: x.profesor, // role: x.role,
              // originalUserName: x.originalUserName,
            });
            this.setLocalStorage(x);
            this.startTokenTimer();
          }
        }
        return x;
      })
    );
  }

  logout() {
    this.http
      .post<unknown>(`${this.apiUrl}auth/logout`, {})
      .pipe(
        finalize(() => {
          this.clearLocalStorage();
          this._user.next(null);
          this.stopTokenTimer();
          this.router.navigate(['/auth/iniciar-sesion']);

          localStorage.removeItem('currentUser');
          this._designNavigationService.setCurrentNavigation('navigationEmpty');
          this._seguimientoService.stopPolling.next();
          this._temaService.stopPolling.next();
        })
      )
      .subscribe();
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }

    return this.http.post<IUsuario>(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      map((x) => {
        this._user.next({
          email: x.email,
          nombre: x.nombre,
          apellido: x.apellido,
          rol: x.rol,
          profesor: x.profesor, // role: x.role,
          // originalUserName: x.originalUserName,
        });
        this.setLocalStorage(x);
        this.startTokenTimer();
        return x;
      })
    );
  }

  setLocalStorage(x: IUsuario) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('logout-event', 'logout' + Math.random());
    this._seguimientoService.stopPolling.next();
    this._temaService.stopPolling.next();
  }

  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);

    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.refreshToken().subscribe())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }
}
