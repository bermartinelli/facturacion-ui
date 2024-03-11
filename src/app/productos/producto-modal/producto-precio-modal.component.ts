import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink , Router} from '@angular/router';
import { Producto } from '../models/producto';
import { ModalService } from '../../clientes/detalle/modal.service';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'producto-precio-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './producto-precio-modal.component.html',

})
export class ProductoPrecioModalComponent {

  @Input() producto!: Producto;
  tempPrecio!: number | null;
  @Input()
  precioAnterior!: number | null;

  constructor(public modalService: ModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private productoService: ProductoService) { }


  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalService.cerrarModalPrecio();
    this.router.navigate(['/productos']);
  }

  public update(): void {
    this.producto.precio = this.precioAnterior ?? 0;
    this.productoService.update(this.producto).subscribe(
      {
        next: () => {
          this.modalService.cerrarModalPrecio();
          this.router.navigate(['/productos'])
          Swal.fire({
            title: "precio Actualizado",
              icon: "success"
          });
        }
      }
    )
  }

  onSubmit(){
    this.update();
  }
 
}
