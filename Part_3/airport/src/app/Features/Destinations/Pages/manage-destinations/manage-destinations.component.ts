import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
  standalone: true,
})
export class ManageDestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  searchTerm: string = '';

  constructor(private destinationsService: DestinationsService) {}

  async ngOnInit(): Promise<void> {
    this.destinations = await this.destinationsService.getAllDestinations();
    this.filteredDestinations = [...this.destinations];
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDestinations = this.destinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(term) ||
        destination.code.toLowerCase().includes(term)
    );
  }
}
