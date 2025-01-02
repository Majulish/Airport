import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'ono-air-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  @Input() matDrawer!: MatDrawer;
  @Output() menuClick = new EventEmitter<void>();

  toggleDrawer(): void {
    if (this.matDrawer) {
      console.log('toggle drawer from app.component')
      this.matDrawer.toggle();
    } else {
      console.log('toggle drawer from app.component but this.matDrawer is undefined')
    }
  }
}
