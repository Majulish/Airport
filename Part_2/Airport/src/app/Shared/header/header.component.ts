import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'ono-air-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
}
