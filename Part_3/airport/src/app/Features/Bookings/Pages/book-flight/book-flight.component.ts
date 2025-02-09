import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Flight} from '../../../Flights/Model/filght.module';
import {FlightService} from '../../../Flights/Service/flights.service';
import {FormsModule} from '@angular/forms';
import {FlightWithDestination} from "../../../Flights/Model/flight-with-destination.module";


@Component({
  selector: 'book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
})
export class BookFlightComponent {
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
      this.filteredFlights = [...this.flights]; // Ensure the filter updates
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
    this.flightService.sortObjectArray(column, this.currentSortDirection, this.currentSortColumn, this.filteredFlights, this.flights)
  }

  getSortIcon(column: string) {
    return this.flightService.getSortIcon(column, this.currentSortDirection, this.currentSortColumn, this.filteredFlights, this.flights)
  }
}
