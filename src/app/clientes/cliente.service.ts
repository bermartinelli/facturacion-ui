import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, map,tap, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';


const URL = "http://localhost:8080/api/clientes";

@Injectable({  
  providedIn: 'root'
})


export class ClienteService {



  //private httpsHeaders = new HttpHeaders({'Content-Type': 'Application/json'})  -> este tmb esta al de gusto porque pasa por el interceptor.


  
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  //tengo que incluir este metodo en cada uno de los metodos que necesiten autorizacion para poder acceder.
 /*  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpsHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpsHeaders;
  } */

  /* public isNotAuthorized(error: any): boolean{
    if(error.status == 401){ //401 no autorizado
      //puede que expire el token desde el lado del back, entonces para no romper tambien tengo que cerrar la sesion desde angular.
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if(error.status == 403){ //error 403 acceso denegado
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }    
    return false;
  } */

  public getClientes(page: number): Observable<any> { //map transforma, tap solo utiliza la info y la usa para algo.
    return this.http.get(URL + `/page/${page}`).pipe(
      tap((response: any)=> {

        let clientes = response.content as Cliente[];
        clientes.forEach( cliente => {
        }); //este tap solo actua adentro y no modifica nada por fuera. el tap es un void. 
      }),
      map((response: any) => {
        (response.content as Cliente[]).
         map(cliente => {
          //cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.apellido = cliente.apellido.toUpperCase();
          cliente.email = cliente.email.toLowerCase();
          return cliente;
        });
        return response; //este map si ya convierte el dato de tipo object que viene de la api a tipo Cliente[]. el map tiene un return.
      })
    );
  }

  public getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(URL + `/regiones`);
  }

  //se pasa URL, datos del objeto cliente, y despues el header.
  public create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(URL, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {

  
        if(e.status = 400) { //este no pasa por el iterceptor de auth porque maneja la validacion del formulario.
          return throwError(()=> e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(()=> e);
      }
      )
    )
  }

  public getCliente(id: Number): Observable<Cliente> {
    return this.http.get<Cliente>(URL + `/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(e.satus != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(()=> e);
      })

    );
  }

  public update(cliente: Cliente) : Observable<Cliente> {
    return this.http.put<any>((URL + `/${cliente.id}`), cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {


        if(e.status = 400) {
          return throwError(()=> e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        
        return throwError(()=> e);
      }
      )
    )
  }

  public delete(id: Number): Observable<Cliente> {
      return this.http.delete<Cliente>((URL + `/${id}`)).pipe(
        catchError( e => {

          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
          
          return throwError(()=> e);
        }
        )
      );
  }


  //estamos enviando un formData y no un httpJSON. Por lo que tneemos que crear una nueva instancia.
  public subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

 /*    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    } */

    const req = new HttpRequest('POST',URL + `/upload`, formData, {
      reportProgress: true,
      //headers: httpHeaders
    });
    
    return this.http.request<HttpEvent<{}>>(req);

  }


}
