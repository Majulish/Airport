import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatActionList, MatListItem, MatNavList } from '@angular/material/list';
import {RouterLink, RouterModule} from '@angular/router';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
}
from '@angular/material/expansion';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconButton} from '@angular/material/button';


@Component({
  selector: 'ono-flight-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatListItem,
    RouterLink,
    MatIcon,
    MatExpansionPanel,
    MatActionList,
    MatNavList,
    MatExpansionPanelHeader,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    MatIconButton,
    NgOptimizedImage
  ],
})

export class MenuComponent {
  @Input() matDrawer!: MatDrawer;

  adminMenuOpen = false;
  userMenuOpen = false;

  toggleMenu(menu: string): void {
    if (menu === 'admin') {
      this.adminMenuOpen = !this.adminMenuOpen;
    } else if (menu === 'user') {
      this.userMenuOpen = !this.userMenuOpen;
    }
  }

  async onClick(): Promise<void> {
    await this.matDrawer.close();
  }
}
