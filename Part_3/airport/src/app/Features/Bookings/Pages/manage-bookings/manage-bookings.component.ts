import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlightService} from '../../../Flights/Service/flights.service';
import {FormsModule} from '@angular/forms';
import {FlightWithDestination} from "../../../Flights/Model/flight-with-destination.module";
import {DateFilterComponent, DateFilter} from '../../../components/date-filter/date-filter.component';


@Component({
  selector: 'manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule, DateFilterComponent],
})
export class ManageBookingsComponent {
  @Input() showHeader: boolean = true;
  flights: FlightWithDestination[] = [];
  filteredFlights: FlightWithDestination[] = [];
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;
  searchTerm: string = '';
  dateFilter: DateFilter | null = null;
  noFlightsMessage: string = '';

  constructor(private flightService: FlightService) {
  }

  async ngOnInit() {
    try {
      // Start with default (all active flights)
      this.flights = await this.flightService.getUpcomingFlights();
      this.filteredFlights = [...this.flights];
      
      // Only show the no flights message if there are truly no flights
      if (this.filteredFlights.length === 0) {
        this.noFlightsMessage = 'No upcoming flights available.';
      } else {
        this.noFlightsMessage = '';
      }
    } catch (error) {
      console.error("Error fetching upcoming flights:", error);
      this.noFlightsMessage = 'Error loading flights. Please try again later.';
    }
  }

  applyFilter() {
    // Apply text search filter only (date filtering is handled by Firebase)
    if (this.searchTerm.length) {
      const term = this.searchTerm.toLowerCase();
      this.filteredFlights = this.flights.filter(
        flight =>
          flight.arrival?.name.toLowerCase().includes(term) ||
          flight.origin?.name.toLowerCase().includes(term)
      );
      
      // Set message if no flights found
      if (this.filteredFlights.length === 0) {
        this.noFlightsMessage = 'No flights found matching search term.';
      } else {
        this.noFlightsMessage = '';
      }
    } else {
      this.filteredFlights = [...this.flights];
      
      // Only show message if there are no flights after filtering
      if (this.filteredFlights.length === 0) {
        // Check if this is because of a date filter
        if (this.dateFilter && (this.dateFilter.startDate || this.dateFilter.month)) {
          this.noFlightsMessage = 'No flights found in the selected date range.';
        } else {
          this.noFlightsMessage = 'No upcoming flights available.';
        }
      } else {
        this.noFlightsMessage = '';
      }
    }
  }

  async handleDateFilterChange(dateFilter: DateFilter): Promise<void> {
    try {
      this.dateFilter = dateFilter;
      
      // Check if the filter is actually clearing the filter
      const isFilterCleared = !dateFilter.type || 
                             (dateFilter.type === 'specific' && !dateFilter.startDate && !dateFilter.endDate) ||
                             (dateFilter.type === 'flexible' && !dateFilter.month);
      
      // Get flights from Firebase based on date filter
      this.flights = await this.flightService.getFlightsByDateRange(dateFilter);
      
      // Apply text search filter on the returned flights
      this.applyFilter();
      
      // If the user just cleared the filter, ensure we don't display a "no flights" message
      // unless there truly are no flights at all
      if (isFilterCleared && this.flights.length > 0) {
        this.noFlightsMessage = '';
      }
    } catch (err: any) {
      const error = err as Error;
      console.error("Error applying date filter:", error);
      
      // If it's an index error, we'll try to recover
      if (error.toString().includes('requires an index')) {
        console.warn("Firebase index error detected. Using client-side filtering as fallback.");
        try {
          // Fall back to getting all flights and filtering client-side
          this.flights = await this.flightService.getUpcomingFlights();
          this.applyFilter();
        } catch (fallbackError) {
          this.noFlightsMessage = 'Error filtering flights. Please try again later.';
        }
      } else {
        this.noFlightsMessage = 'Error filtering flights. Please try again later.';
      }
    }
  }

  sortTable(column: string) {
    // Cycle sorting direction: `asc` → `desc` → `neutral`
    if (this.currentSortColumn === column) {
      if (this.currentSortDirection === 'asc') {
        this.currentSortDirection = 'desc';
      } else if (this.currentSortDirection === 'desc') {
        this.currentSortDirection = null;
        // Reapply filters to reset sorting
        this.applyFilter();
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