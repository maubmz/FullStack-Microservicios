import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 400:
          console.error('Bad Request: ', error.error());
          break;
        case 401:
          console.error('No autorizado.');
          router.navigate(['/']);
          break;
        case 403:
          console.error('Sin permisos suficientes.');
          break;
        case 404:
          console.error('No encontrado', req.url);
          break;
        case 500:
          console.error('Error interno del servidor.');
          break;
        default:
          console.error(`Error inserperado [${error.status}]: `, error.message);
      }
      return throwError(() => error);
    })
  )

}
