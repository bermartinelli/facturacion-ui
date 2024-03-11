import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

 //aca vamos a manejar la respuesta, no lo que enviamos.

  return next(req).pipe(
    catchError((error) => {
      if(error.status == 401){ //401 no autorizado
        //puede que expire el token desde el lado del back, entonces para no romper tambien tengo que cerrar la sesion desde angular.
        if(authService.isAuthenticated()){
          authService.logout();
        }
        router.navigate(['/login']);
        
      }
  
      if(error.status == 403){ //error 403 acceso denegado

        Swal.fire('Acceso denegado', `Hola ${authService.usuario.username} no tienes accesoooooo a este recurso`, 'warning');
        router.navigate(['/clientes']);
       
      }    
      return throwError(() => error);
    })
  );
};
