import { Component, Input } from '@angular/core';
import { Producto } from '../models/producto';
import { ModalService } from '../../clientes/detalle/modal.service';
import { ActivatedRoute, RouterLink , Router} from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'producto-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './producto-modal.component.html'
})
export class ProductoModalComponent {

  @Input() producto!: Producto;
  tempStock!: number | null;
  @Input()
  stockAnterior!: number | null;

  constructor(public modalService: ModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private productoService: ProductoService) { }


  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalService.cerrarModalStock();
    this.router.navigate(['/productos']);
  }

  public update(): void {
    this.producto.stock = this.stockAnterior ?? 0;
    this.productoService.update(this.producto).subscribe(
      {
        next: () => {
          this.modalService.cerrarModalStock();
          this.router.navigate(['/productos'])
          Swal.fire({
            title: "stock Actualizado",
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
