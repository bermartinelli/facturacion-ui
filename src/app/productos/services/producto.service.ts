import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../usuarios/auth.service';
import { Router } from '@angular/router';
import { Producto } from '../models/producto';
import { Observable, catchError, map,tap, throwError } from 'rxjs';


const URL = "http://localhost:8080/api/productos";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor( private http: HttpClient,
                private router: Router,
                private authService: AuthService) { }



public getProductos(page: number): Observable<any> { //map transforma, tap solo utiliza la info y la usa para algo.
  return this.http.get(URL + `/page/${page}`).pipe(
    tap((response: any)=> {

      let clientes = response.content as Producto[];
      clientes.forEach( producto => {
      }); //este tap solo actua adentro y no modifica nada por fuera. el tap es un void. 
    }),
    map((response: any) => {
      (response.content as Producto[]).
       map(producto => {
        //producto.nombre = producto.nombre.toLowerCase();
        return producto;
      });
      return response; //este map si ya convierte el dato de tipo object que viene de la api a tipo Cliente[]. el map tiene un return.
    })
  );

}

public delete(id: Number): Observable<Producto> {
  return this.http.delete<Producto>((URL + `/${id}`)).pipe(
    catchError( e => {

      if(e.error.mensaje){
        console.error(e.error.mensaje);
        if(e.satus != 401 && e.error.mensaje){
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }
      }
      
      return throwError(()=> e);
    }
    )
  );
}

public getProducto(id: Number): Observable<Producto> {
  return this.http.get<Producto>(URL + `/${id}`).pipe(
    catchError( e => {
      console.error(e.error.mensaje);
      return throwError(()=> e);
    }
    )
  );
}

public update(producto: Producto) : Observable<Producto> {
  return this.http.put<any>((URL + `/${producto.id}`), producto).pipe(
    map((response: any) => response.producto as Producto),
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

public create(producto: Producto): Observable<Producto> {
  return this.http.post(URL, producto).pipe(
    map((response: any) => response.producto as Producto),
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

}
