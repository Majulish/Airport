import { Component } from '@angular/core';
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
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    MenuComponent,
    RouterModule,
    NgIf,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  matDrawer!: MatDrawer

  adminMenuOpen = false;
  userMenuOpen = false;
  isMenuOpen = false;

  toggleMenu(menu: string): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (menu === 'admin') {
      this.adminMenuOpen = !this.adminMenuOpen;
    } else if (menu === 'user') {
      this.userMenuOpen = !this.userMenuOpen;
    }
  }

  async closeMenu(): Promise<void> {
    this.isMenuOpen = false;
  }
}
