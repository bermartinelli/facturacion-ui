import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../clientes/cliente.service';
import Swal from 'sweetalert2';
import { ProductoService } from '../services/producto.service';
import { FormComponent } from '../../clientes/form.component';
import { Cliente } from '../../clientes/cliente';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [FormsModule, CommonModule, FormComponent],
  templateUrl: './productos-form.component.html'
})


export class ProductosFormComponent {

  public producto: Producto = new Producto()

  constructor(private productoService: ProductoService,
              private router: Router,
              private activatedRoute: ActivatedRoute  ) { }

  ngOnInit(): void {
  }

  public create(): void {

    this.productoService.create(this.producto).subscribe(
      producto => {
        this.router.navigate(['/productos'])
        Swal.fire({
          title: "Producto Creado",
          icon: "success"
        });
      }
    )
  }
  
}
