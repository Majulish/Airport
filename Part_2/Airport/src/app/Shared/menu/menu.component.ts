import { Component, Input, ViewEncapsulation } from '@angular/core';
import { menuRoutes } from './menu.routes';
import { MatActionList, MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

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
  ],
})
export class MenuComponent {
  @Input() matDrawer!: MatDrawer;

  async onLinkClick() {
    await this.matDrawer.close();
  }
}
