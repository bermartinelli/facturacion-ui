import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Producto } from './models/producto';
import { ProductoService } from './services/producto.service';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { ModalService } from '../clientes/detalle/modal.service';
import { ProductoModalComponent } from './producto-modal/producto-modal.component';
import { ProductoPrecioModalComponent } from './producto-modal/producto-precio-modal.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginatorComponent, ProductoModalComponent, ProductoPrecioModalComponent],
  templateUrl: './productos.component.html'
})
export class ProductosComponent{

  productos!: Producto[];
  paginador: any;
  productoSeleccionado!: Producto;
  stockAnterior!: number | null;
  precioAnterior!: number | null;

  constructor(private productoService: ProductoService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              private modalService: ModalService) { };

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let page: number = +params.get('page')!;
        if (!page) {
          page = 0;
        }
        this.productoService.getProductos(page).subscribe(
          response => {
            this.productos = response.content as Producto[];
            this.paginador = response;
          }
        )
      }
    )
    
  }

  public delete(producto: Producto): void {


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary m-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Eliminarias al producto ${producto.nombre}`,
      text: `El proceso sera irreversible.
      Para poder eliminar el producto, el mismo no puede ser parte de ninguna factura.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(producto.id).subscribe(
          () => {
            this.productos = this.productos.filter(p => p !== producto);
            Swal.fire(
              'Producto Eliminado',
              `Producto ${producto.nombre} eliminada con exito`,
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el producto',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  
  
  }
  
  abrirModalStock(producto: Producto){
    this.productoSeleccionado = producto;
    this.stockAnterior = this.productoSeleccionado.stock;
    this.modalService.abrirModalStock();
  }

  abrirModalPrecio(producto: Producto){
    this.productoSeleccionado = producto;
    this.precioAnterior = this.productoSeleccionado.precio;
    this.modalService.abrirModalPrecio();
  }

}
