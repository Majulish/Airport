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

  ngOnInit(): void {
    this.flights = this.flightService.getAllFlights();
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
    if (this.currentSortColumn === column) {
      if (this.currentSortDirection === 'asc') {
        this.currentSortDirection = 'desc';
      } else if (this.currentSortDirection === 'desc') {
        this.currentSortDirection = null;
        this.filteredFlights = [...this.flights];
        return;
      } else {
        this.currentSortDirection = 'asc';
      }
    } else {
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }

    this.filteredFlights.sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];

      if (valueA < valueB) return this.currentSortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.currentSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.currentSortColumn === column) {
      if (this.currentSortDirection === 'asc') {
        return 'fa-arrow-up';
      } else if (this.currentSortDirection === 'desc') {
        return 'fa-arrow-down';
      }
    }
    return 'fa-arrows-up-down';
  }
}
