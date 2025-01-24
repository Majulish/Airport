import { Component, EventEmitter, Output } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [
    MatSidenav,
    RouterLink,
    NgClass,
    NgIf
  ],
  standalone: true
})
export class MenuComponent {
  @Output() menuToggle = new EventEmitter<string>();
  @Output() toggleDrawer = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<void>();
  adminMenuOpen = false;
  userMenuOpen = false;

  toggleMenu(menu: string): void {
    if (menu === 'admin') {
      this.adminMenuOpen = !this.adminMenuOpen;
    } else if (menu === 'user') {
      this.userMenuOpen = !this.userMenuOpen;
    }
    this.menuToggle.emit(menu);
  }

  onMenuItemClick(): void {
    this.menuItemClicked.emit();
  }
}
