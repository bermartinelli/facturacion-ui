import { Component, OnInit } from '@angular/core';
import { FacturasService } from './services/facturas.service';
import { Factura } from './models/factura';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { map } from 'rxjs';
import { ItemFactura } from './models/item-factura';

@Component({
  selector: 'app-detalle-factura',
  standalone: true,
  imports: [RouterLink,NgFor, NgIf],
  templateUrl: './detalle-factura.component.html',
  
})
export class DetalleFacturaComponent implements OnInit {

  factura!: Factura;
  titulo: String = 'Factura';


  constructor(private facturaService: FacturasService,
              private activatedRoute: ActivatedRoute) {
                
    
  }
  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        //con el + lo convertimos a number, agarro el id del url.
        let id: number = +params.get('id')!;
        this.facturaService.getFactura(id)
        .subscribe(factura => this.factura = factura
                              );
        
      });
     
  }
}
