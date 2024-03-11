import { Component, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule, NgIf } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { Router } from 'express';
import { FacturasService } from '../../facturas/services/facturas.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent {

  @Input() cliente! :Cliente;
  public fotoSeleccionada!: File | null;
  public progreso: number = 0;
  

  titulo: String = "Detalle del Cliente";

  //necesitamos el activated route rpara poder suscribirnos para cuando cambia el parametro del id.
  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService,
              private facturaService: FacturasService) {

    
  }


  //params solo suscribre una vez, paramMap suscribie cada vez que cambia el id. 
  ngOnInit(): void {
    //esto no va, antes del modal si. Ahora como inyectamos la instancia con el Imput(), que viene del clientes component no hace falta.
    /* this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id')!;
      if(id) {
        this.clienteService.getCliente(id).subscribe( cliente => {
          this.cliente = cliente;
        })
      }

    }) */
    
  }

  seleccionarFoto(event: any){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada !== null && this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error de archivo', `Seleccionar una imagen`, 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error de subida', `Debe seleccionar una foto`, 'error');

   } else{
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
      event => {

        if(event.type === HttpEventType.UploadProgress) {
          this.progreso = event.total ? Math.round(100* event.loaded/event.total) : 0;
          console.log("progreso: " + this.progreso)
        } else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          console.log("progreso: " + this.progreso)

          this.modalService.notificarUpload.emit(this.cliente);

          //this.modalService.notificarUpload.emit(this.cliente);

          Swal.fire('La foto se subio correctamente', response.mensaje, 'success');
        }
       // this.cliente = cliente; //subo la foto, y actualizo cliente al cliente que me devuelve el subirFoto con la foto actualizada.
       
      }
    );
   }

   
  }


  cerrarModal(){
    this.modalService.cerrarModalClientes();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

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
            () => this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
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
