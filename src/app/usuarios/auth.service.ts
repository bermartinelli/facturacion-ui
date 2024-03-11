import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario!: Usuario; //va con _ porque x convencion es privada yva a tener un metodo geter para tener el token y el usuario. 
  private _token!: string; //lo mismo con el token.


  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario){
      return this._usuario;
    }else if (this._token && this._token.length > 0){
      return this._usuario;
       //si no esta en la variable, pero si en la sesion del navegador, lo guardo en la variable. En el nav se guarda como string.
    } else if(this._usuario == null && sessionStorage!.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage!.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario(); //si no hay anda retorno un objeto nuevo.
  }



  public get token(): string | null {
    if(this._token != null){
      return this._token;
    } else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token')!;
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const URL = 'http://localhost:8080/oauth/token';
    const credenciales = 'angularapp' + ':' + '12345';
    const base64 = btoa(credenciales);
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post<any>(URL, params.toString(), {headers: httpHeaders});
    }


    //lo que hace es desencriptar el token. lo separa en tres, y se queda con el payload. Despues lo desencripta con atob y lo vuelve a parsear a JSON para retornarlo.    
    getAccessToken(accessToken: string): any {
      if(accessToken != null) {
        return JSON.parse(atob(accessToken.split(".")[1]));
      }
      return null;
    }
  

    //con el access token ya desencriptado en payload, le asigno cada valor al objeto usuario.
    guardarUsuario(access_token: string): void {
      this._usuario = new Usuario();
      let payload = this.getAccessToken(access_token);
      this._usuario.apellido = payload.apellido;
      this._usuario.email = payload.email;
      this._usuario.id = payload.id;
      this._usuario.nombre = payload.nombre;
      this._usuario.username = payload.user_name;
      this._usuario.roles = payload.authorities; //es un arreglo, este cado de dos elementos [0],[1] con ROLE_ADMIN y ROLE_USER.

      sessionStorage.setItem('usuario', JSON.stringify(this._usuario)); //metodo de la api html5 sessionStorage para almacenar datos en el navegador
    }
    
    guardarToken(access_token: string): void {
      this._token = access_token;
      sessionStorage.setItem('token', access_token);
    }

    isAuthenticated(): boolean {
      let payload = this.getAccessToken(this.token!);
      if (payload != null && payload.user_name && payload.user_name.length > 0) {
        return true;
      }
      return false;
    }
    

    hasRole(role: string): boolean {
      if(this.usuario.roles.includes(role)){
        return true;
      }
      return false;
    }

    logout(): void {
      this._token = null!;
      this._usuario = null!;
      sessionStorage.clear();
    }

  

    
  }

