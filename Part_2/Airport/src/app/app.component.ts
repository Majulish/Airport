import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Shared/header/header.component'
import { FooterComponent } from './Shared/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from './Shared/menu/menu.component'

@Component({
  selector: 'ono-air-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {}
