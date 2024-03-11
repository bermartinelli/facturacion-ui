import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../../productos/models/producto';


const URL = "http://localhost:8080/api/facturas";

@Injectable({
  providedIn: 'root'
})

export class FacturasService {



  constructor(private http: HttpClient,
               ) { }


  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${URL}/${id}`);
  }

public getFacturas(page: number): Observable<any> {
  return this.http.get(URL + `/page/${page}`).pipe(
    map((response: any) => {
      (response.content as Factura[]).map(factura => {
        return factura;
      });
      return response;
    }),
    catchError(e => {
      console.error(e.error.mensaje);
      return throwError(()=> e);
    })
  )
}

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }

  filtrarProductos(term: string): Observable<Producto[]>{
    
    return this.http.get<Producto[]>(`${URL}/filtrarProductos/${term}`);
  }

  public create(factura: Factura): Observable<Factura>{
        return this.http.post(URL, factura).pipe(
          map((response: any) => response.factura as Factura),
          catchError(e => {
            
            if(e.status == 400) {
              return throwError(()=> e);
            }
            if(e.error.mensaje){
              console.error(e.error.mensaje);
            }
            return throwError(()=> e); 
          })
        )
  }

}

