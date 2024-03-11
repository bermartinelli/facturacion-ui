import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  let role = route.data['role'] as string;

  if(!authService.isAuthenticated()){
    router.navigate(['/login']);
    return false;
  }

  if(authService.hasRole(role)){
    return true;
  } else {
    Swal.fire('Acceso denegado', `Hola ${authService.usuario.username} no tienes acceso a este recurso`, 'warning');
    router.navigate(['/clientes']);
    return false;
  }

  
 
};
