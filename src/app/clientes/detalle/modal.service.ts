import { Injectable, EventEmitter } from '@angular/core';
import { Cliente } from '../cliente';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modalStock: boolean = false;
  modalPrecio: boolean = false;
  modalClientes: boolean =false;
  notificarUpload = new EventEmitter<any>();

  constructor() { }

 get _notificarUpload(): EventEmitter<any>{
  return this._notificarUpload;
 }

  abrirModalStock() {
    this.modalStock = true;
  }

  abrirModalPrecio() {
    this.modalPrecio = true;
  }

  abrirModalClientes() {
    this.modalClientes = true;
  }

  cerrarModalClientes() {
    this.modalClientes = false;
  }

  cerrarModalStock() {
    this.modalStock = false;
  }

  cerrarModalPrecio() {
    this.modalPrecio = false;
  }
}
