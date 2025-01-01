import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
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
    RouterModule
  ],
  template: `
    <ono-flight-menu></ono-flight-menu>
  `,
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {}
