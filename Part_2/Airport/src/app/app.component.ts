import {Component, ViewChild} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { HeaderComponent } from './Shared/header/header.component'
import { FooterComponent } from './Shared/footer/footer.component';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from './Shared/menu/menu.component'
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'ono-air-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    MatSidenavModule,
    MenuComponent,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  adminMenuOpen = false;
  userMenuOpen = false;
  isMenuOpen = false;

  @ViewChild('drawer', { static: false }) matDrawer!: MatDrawer;

  toggleDrawer(): void {
    if (this.matDrawer) {
      console.log('toggle drawer from app.component')
      this.matDrawer.toggle();
    } else {
      console.log('toggle drawer from app.component but this.matDrawer is undefined')
    }
  }
}
