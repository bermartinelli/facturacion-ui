import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'paginator-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {

@Input() paginador : any;
paginas! : number[];

desde!:number;
hasta!:number;

ngOnInit(): void {
  this.initPaginator();

}

ngOnChanges(changes: SimpleChanges): void {
    let paginatorActualizado = changes['paginador'];

    if(paginatorActualizado.previousValue) {
      this.initPaginator();
    }
}


private initPaginator(): void { //va en onchanges porque si fuese on init, se ejecutaria una sola vez y no cada vez qye se cambia de paginacion.
 
  this.desde = Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages -5);
  this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+4), 6);

  if(this.paginador.totalPages>5){
    this.paginas = new Array(this.hasta - this.desde +1 ).fill(0).map((_valor, indice) => indice +this.desde);
  }else {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice +1);
  }
}
}
