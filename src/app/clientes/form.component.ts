import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { subscribe } from 'diagnostics_channel';
import { Region } from './region';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormComponent, FormsModule, CommonModule],
  templateUrl: './form.component.html',
  
})
export class FormComponent {

  public errores: string[] = [];

  constructor(private clienteService: ClienteService, private router:Router, private activatedRoute: ActivatedRoute){}

  public cliente: Cliente = new Cliente()
  regiones!: Region[];
  public titulo:String = "Clientes"
  private fotoSeleccionada!: File;

  

  ngOnInit(): void {
   this.cargarCliente();

   this.clienteService.getRegiones().subscribe(
    regiones => this.regiones = regiones
   );
  }

  compararRegion(o1:Region, o2:Region) {
    if(o1==undefined && o2== undefined){
      return true
    }
    
    if(o1 == null|| o2 ==null) {
      return false
    } else if(o1.id == o2.id) {
      return true
    }
     else return false
  }

  //asignarle a la variable cliente el cliente con id x si es que existe. 
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe (cliente => this.cliente = cliente)
      }
    })
  }

  public create():void {

    this.cliente.nombre = this.cliente.nombre.toUpperCase();
    this.cliente.apellido = this.cliente.apellido.toUpperCase();
    this.cliente.email = this.cliente.email.toUpperCase();
    

    this.clienteService.create(this.cliente).subscribe(
      {
        next: (cliente) => {
          this.router.navigate(['/clientes'])
          Swal.fire({
            title: "Usuario Creado",
              text: `El usuario ${cliente.nombre} ${cliente.apellido} fue creado con éxito correctamente`,
              icon: "success"
          });
        }
        ,error: (err)=> {
          this.errores = err.error.errors as string[];
          console.error(err.error.errors);
        } 
      } )
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      {
        next: (cliente) => {
          this.router.navigate(['/clientes'])
          Swal.fire({
            title: "Usuario Actualizado",
              text: `El usuario ${cliente.nombre} ${cliente.apellido} fue actualizado con éxito correctamente`,
              icon: "success"
          });
        }
        ,error: (err)=> {
          this.errores = err.error.errors as string[];
          console.error(err.error.errors);
        } 
      }
    )
  }



  
}
