import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Flight} from '../../Model/filght.module';
import {FlightService} from '../../Service/flights.service';


@Component({
  selector: 'app-manage-flights',
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
})
export class ManageFlightsComponent implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  searchTerm: string = '';
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;

  constructor(private flightService: FlightService) {}

  async ngOnInit(): Promise<void> {
    this.flights = await this.flightService.getAllFlights();
    this.filteredFlights = [...this.flights];
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredFlights = this.flights.filter(
      (flight) =>
        flight.destination.name.toLowerCase().includes(term) ||
        flight.originCode.toLowerCase().includes(term)
    );
  }

  sortTable(column: string): void {
    this.flightService.sortObjectArray(column, this.currentSortDirection, this.currentSortColumn, this.filteredFlights, this.flights)
  }


  getSortIcon(column: string) {
    return this.flightService.getSortIcon(column, this.currentSortDirection, this.currentSortColumn, this.filteredFlights, this.flights)
  }
}
