import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'ono-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  standalone: true,
})
export class HelpComponent {}
