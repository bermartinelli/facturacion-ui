import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { CommonModule } from '@angular/common';
import { ClienteService } from './cliente.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PaginatorComponent } from '../paginator/paginator.component';
import { DetalleComponent } from './detalle/detalle.component';
import { ModalService } from './detalle/modal.service';
import { throwError } from 'rxjs';
import e from 'express';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginatorComponent, DetalleComponent],
  templateUrl: './clientes.component.html'
})


export class ClientesComponent {

 clientes!: Cliente[];
 paginador : any;
 clienteSeleccionado!: Cliente;
 
 constructor(private clienteService: ClienteService,
            private activatedRoute : ActivatedRoute,
            private modalService: ModalService, 
            public authService: AuthService ) {};

 ngOnInit(): void {
  this.activatedRoute.paramMap.subscribe(params =>{
    let page: number = +params.get('page')!;
    if(!page){
      page=0;
    }

  this.clienteService.getClientes(page).subscribe(
    response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response; //es todo el JSON que viene del back
    }
    //es lo mismo que hacer lo de abajo. Le asiganmos al parametro clientes, el string que viene desde el observable.
    // es un solo parametro, y al ser una sola linea de codigo no hacen falta ni los () ni los {}.
    //function(clientes) {
    //this.clientes = clientes }
  );
  });

  //aca el modalservice plantea el eventEmitter y el detallecomponent lo emite al cliente con la foto actualizada.
  //entonces el listado de cliente tiene que suscrbirse a ese eventEmitter par apoder actualizar la foto.
  this.modalService.notificarUpload.subscribe(cliente => {
    this.clientes = this.clientes.map(clienteOriginal => { //este map modifica uno por uno los clientesOriginales del listado.
      if(cliente.id == clienteOriginal.id) {
        clienteOriginal.foto = cliente.foto; //si el id del que suscribo es igual al acutal del listado, le guardo la foto nueva.
      } return clienteOriginal;
    })
  });
  
 }

 public delete(cliente: Cliente): void {


  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Estas seguro?",
    text: `Eliminarias al usuario ${cliente.nombre} ${cliente.apellido} El proceso sera irreversible`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {

      this.clientes = this.clientes.filter(cli => cli !== cliente)
      this.clienteService.delete(cliente.id).subscribe(()=>
        swalWithBootstrapButtons.fire({
          title: "Eliminado!",
          text: "EL usuario fue eliminado",
          icon: "success"
        }) 
      )

    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your imaginary file is safe :)",
        icon: "error"
      });
    }
  });


}

abrirModal(cliente: Cliente){
  this.clienteSeleccionado = cliente;
  this.modalService.abrirModalClientes();
}

}
