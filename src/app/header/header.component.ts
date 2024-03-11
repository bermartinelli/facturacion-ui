import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  username!: String;

  constructor(private _authService:AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.usuario.username!;
  }

  get authService(){
    return this._authService;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }



}
