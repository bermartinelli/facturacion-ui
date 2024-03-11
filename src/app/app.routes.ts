import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'path';
import { MainComponent } from './main/main.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { authGuard } from './usuarios/guards/auth.guard';
import { roleGuard } from './usuarios/guards/role.guard';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { ListadoFacturasComponent } from './facturas/listado-facturas/listado-facturas.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },

  {
    path: 'clientes',
    component: ClientesComponent,
  },
  {
    path: 'clientes/page/:page',
    component: ClientesComponent,
  },
  {
    path: 'clientes/form',
    component: FormComponent,
    canActivate: [authGuard, roleGuard], data: {role: 'ROLE_ADMIN'} //arreglo de guards. Tengo toda la logica en el role, esta al dope el authGuard.
  },
  {
    path: 'clientes/form/:id',
    component: FormComponent,
    canActivate: [authGuard, roleGuard], data: {role: 'ROLE_ADMIN'} //arreglo de guards.
  },
  {
    path: 'clientes/form/detalles/:id',
    component: DetalleComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'facturas/:id',
    component: DetalleFacturaComponent,
    canActivate: [authGuard, roleGuard], data: {role: 'ROLE_USER'} //arreglo de guards.

  },
  {
  path: 'facturas/form/:clienteId',
   component: FacturasComponent,
   canActivate: [authGuard, roleGuard], data: {role: 'ROLE_ADMIN'} //arreglo de guards.

  },
  {
    path: 'facturas',
     component: ListadoFacturasComponent,
     canActivate: [authGuard, roleGuard], data: {role: 'ROLE_USER'} //arreglo de guards.
  
    },
  {
    path: 'productos',
      component: ProductosComponent,
      canActivate: [authGuard, roleGuard], data: {role: 'ROLE_USER'} //arreglo de guards.
  
    },
  {
    path: 'productos/form',
    component: ProductosFormComponent,
    canActivate: [authGuard, roleGuard], data: {role: 'ROLE_ADMIN'} //arreglo de guards. Tengo toda la logica en el role, esta al dope el authGuard.
  },
];