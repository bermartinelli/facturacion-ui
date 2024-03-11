import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { DetalleComponent } from '../../clientes/detalle/detalle.component';
import { AuthService } from '../../usuarios/auth.service';
import { FacturasComponent } from '../facturas.component';
import { FacturasService } from '../services/facturas.service';
import { Factura } from '../models/factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-facturas',
  standalone: true,
  imports: [NgIf, CommonModule, RouterLink, PaginatorComponent],
  templateUrl: './listado-facturas.component.html',
})
export class ListadoFacturasComponent implements OnInit{

  facturas!: Factura[];
  paginador: any;

  constructor(private activatedRoute: ActivatedRoute,
              private facturaService: FacturasService,
              public authService: AuthService) { }
              
              
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      paramas => {
        let page: number = +paramas.get('page')!;
        if (!page) {
          page = 0;
        }
        this.facturaService.getFacturas(page).subscribe(
          response => {
            this.facturas = response.content as Factura[];
            this.paginador = response;
          }
        )
      }
    )
  }
;


  deleteFactura(factura: Factura): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que deseas eliminar la Factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(
      result => {
        if(result.value) {
          this.facturaService.delete(factura.id).subscribe(
            () => this.facturas = this.facturas.filter(f => f !== factura)
          )
          Swal.fire(
            'Factura Eliminada',
            `Factura ${factura.descripcion} eliminada con exito`,
            'success'
          )
        }
      }
    )
      
    
  }


}
