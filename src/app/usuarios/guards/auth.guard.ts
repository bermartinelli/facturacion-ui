import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService  = inject(AuthService);
  const router = inject(Router);

  
  if(authService.isAuthenticated()) {
    if(isTokenExpired()){ //esta autenticado pero token esta expirado
      authService.logout();
      router.navigate(['/login']);
      return false;
    }
    return true; //si esta autenticado es true, me deja pasar a la ruta.
  }else{
    router.navigate(['/login']);
    return false;
  }

  function isTokenExpired(): boolean {
    let token = authService.token;
    let payload = authService.getAccessToken(token!);
    let now = new Date().getTime() / 1000; //para llevarlos a segundos

    if(payload.exp < now){
      return true;
    }
    else return false;
  };
};
