import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente{
    id!: Number;
   nombre!: string;
   apellido!: string;
   email!: string;
   createAt!: string;
   foto!: String;
   region!: Region;
   facturas!: Factura[];
}