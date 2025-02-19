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
  isMenuOpen = false;

  @ViewChild('drawer', { static: false }) matDrawer!: MatDrawer;

  onMenuItemClick(): void {
    if (this.matDrawer) {
      this.matDrawer.close();
    }
  }
}
