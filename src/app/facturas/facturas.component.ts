import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import {Observable, flatMap, map, mergeMap, startWith} from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FacturasService } from './services/facturas.service';
import { Producto } from '../productos/models/producto';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule,NgFor, AsyncPipe],
  templateUrl: './facturas.component.html',

})
export class FacturasComponent implements OnInit{

  titulo:String = 'Nueva Factura';
  public factura: Factura = new Factura();
  public errores: string[] = [];

  myControl = new FormControl('');
  productos!: string[]
  filteredOptions!: Observable<Producto[]>;


  constructor(private clienteService: ClienteService,
              private  activatedRoute: ActivatedRoute,
              private facturaService: FacturasService,
              private router: Router) {
   }

   ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params=>{
        let clienteId: number= +params.get('clienteId')!;
        this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      })
      
      this.filteredOptions = this.myControl.valueChanges.pipe(
        map((value:any) => typeof value ==='string'? value: value.nombre),
        mergeMap(value => value ? this._filter(value) :[]))
      ;

      
   }

   private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string{
    return producto ? producto?.nombre : ''; 
  }

  seleccionar(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;

    if(this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    
    this.myControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarTotal(id: number, event:any) :void{
    let cantidad: number = event.target.value as number;
    if(cantidad == 0) {
      this.eliminarItem(id);
      return; //para que salga y no siga ejecutando el código
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) =>{
      if(item.producto.id === id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number): boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) =>{
      if(item.producto.id === id){
        existe = true;
      }
    })
    return existe;
    
  }

  incrementarCantidad(id: number) :void{
    this.factura.items = this.factura.items.map((item: ItemFactura) =>{
      if(item.producto.id === id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItem(id: number) :void {
    this.factura.items = this.factura.items.filter((item : ItemFactura)=> item.producto.id !== id);
  }

  createFactura():void {
    this.facturaService.create(this.factura).subscribe(
        factura => {
          this.router.navigate(['/clientes'])
            Swal.fire({
              title: `Factura Creada`,
                text: `La factura con id ${factura.id} fue creada con éxito`,
                icon: "success"
        });
        }
        );

     

      }
      
}
