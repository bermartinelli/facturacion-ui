import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',

})
export class LoginComponent implements OnInit {

  titulo: String = "Iniciar Sesión";

  usuario: Usuario = new Usuario();

  constructor(private authService: AuthService,
              private router: Router) { }

    ngOnInit(): void {
        if(this.authService.isAuthenticated()){
          Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estas autenticado`, 'info');
          this.router.navigate(['/clientes']);
        }
    }
  login(): void{
    if(this.usuario.username ==null || this.usuario.password == null){
      Swal.fire('Error Login', 'Username o password vacías', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe( //el metodo login del authservice retorna un observable por esto me suscribo.
      {
        next: (response) =>{
          //el response viene con toda la data del accesToken encriptado, apellido, emial, info adicional, nombre, y mas que traigo del back.
          //el accestoken(si lo pego en jwt.io lo veo)esta dividio entres partes por un . (header, payload, verify signature)
          //aca interesa el paload que tiene toda la info del usuario. 
          this.authService.guardarUsuario(response.access_token);
          this.authService.guardarToken(response.access_token);

          let usuario = this.authService.usuario; //este no es el privado, sino el que retorna el getter.

          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          if(error.status == 400){
            this.router.navigate(['/login']);
            Swal.fire('Error Login', 'Username o password incorrectos', 'error');
          } 
        }
      }  
    );

  }

}
