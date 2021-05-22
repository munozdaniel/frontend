import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from './authentication.service';
@UntilDestroy()
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JwtInterceptor');
    // add authorization header with jwt token if available
    // firebase
    //   .auth()
    //   .currentUser.getIdToken(/* forceRefresh */ true)
    //   .then(function (idToken) {
    //     // Send token to your backend via HTTPS
    //     // ...
    //   })
    //   .catch(function (error) {
    //     // Handle error
    //   });
    // this.authService.afAuth.idToken.pipe(untilDestroyed(this)).subscribe(
    //   (token) => {
    //     console.log('token', token);
    //     request = request.clone({
    //       setHeaders: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //   },
    //   (error) => {
    //     console.log('[ERROR]', error);
    //   }
    // );
    if (this.authService.currentUserValue) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.currentUserValue.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
export const AuthInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
