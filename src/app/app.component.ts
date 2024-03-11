import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',

})
export class AppComponent {


}
