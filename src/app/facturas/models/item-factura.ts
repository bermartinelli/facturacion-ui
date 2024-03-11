import { Producto } from "../../productos/models/producto";

export class ItemFactura {

   
    cantidad: number = 1;
    producto!: Producto;
    importe!: number;

    calcularImporte(): number{
        return this.cantidad * this.producto.precio;
    }
    
}
