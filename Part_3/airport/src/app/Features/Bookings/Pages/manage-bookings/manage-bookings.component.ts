import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlightService} from '../../../Flights/Service/flights.service';
import {FormsModule} from '@angular/forms';
import {FlightWithDestination} from "../../../Flights/Model/flight-with-destination.module";


@Component({
  selector: 'book-flight',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
})
export class ManageBookingsComponent {
  @Input() showHeader: boolean = true;
  flights: FlightWithDestination[] = [];
  filteredFlights: FlightWithDestination[] = [];
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;
  searchTerm: string = '';

  constructor(private flightService: FlightService) {
  }

  async ngOnInit() {
    try {
      this.flights = await this.flightService.getUpcomingFlights();
      this.filteredFlights = [...this.flights];
    } catch (error) {
      console.error("Error fetching upcoming flights:", error);
    }
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    if (!term.length) {
      this.filteredFlights = [...this.flights];
      return;
    }

    this.filteredFlights = this.flights.filter(
        flight =>
            flight.arrival?.name.toLowerCase().includes(term) ||
            flight.origin?.name.toLowerCase().includes(term)
    );
  }

  sortTable(column: string) {
    // Cycle sorting direction: `asc` → `desc` → `neutral`
    if (this.currentSortColumn === column) {
      if (this.currentSortDirection === 'asc') {
        this.currentSortDirection = 'desc';
      } else if (this.currentSortDirection === 'desc') {
        this.currentSortDirection = null;
        this.filteredFlights = [...this.flights]; // Reset to original order
        return;
      } else {
        this.currentSortDirection = 'asc';
      }
    } else {
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }

    this.flightService.sortObjectArray(
      column,
      this.currentSortDirection,
      this.filteredFlights
    );
  }

  getSortIcon(column: string) {
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
