import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
  standalone: true
})
export class ManageDestinationsComponent implements OnInit {
  destinations: Destination[] = [];

  constructor(private destinationsService: DestinationsService, private router: Router) {}

  ngOnInit(): void {
    this.destinations = this.destinationsService.getAllDestinations();
  }
}
