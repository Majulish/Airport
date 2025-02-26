import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlightService} from '../../../Flights/Service/flights.service';
import {FormsModule} from '@angular/forms';
import {FlightWithDestination} from "../../../Flights/Model/flight-with-destination.module";
import {DateFilterComponent, DateFilter} from '../date-filter/date-filter.component';


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
      this.flights = await this.flightService.getUpcomingFlights();
      this.filteredFlights = [...this.flights];
    } catch (error) {
      console.error("Error fetching upcoming flights:", error);
    }
  }

  applyFilter() {
    // Reset filtered flights to all flights first
    let filtered = [...this.flights];
    
    // Apply text search filter if present
    if (this.searchTerm.length) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        flight =>
          flight.arrival?.name.toLowerCase().includes(term) ||
          flight.origin?.name.toLowerCase().includes(term)
      );
    }
    
    // Apply date filter if present
    if (this.dateFilter) {
      if (this.dateFilter.type === 'specific' && this.dateFilter.startDate) {
        const startDate = new Date(this.dateFilter.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        let endDate: Date;
        if (this.dateFilter.endDate) {
          endDate = new Date(this.dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
        }
        
        filtered = filtered.filter(flight => {
          const boardingDate = new Date(flight.boardingDate);
          return boardingDate >= startDate && boardingDate <= endDate;
        });
      } else if (this.dateFilter.type === 'flexible' && this.dateFilter.month) {
        const selectedMonth = this.dateFilter.month.getMonth();
        const selectedYear = this.dateFilter.month.getFullYear();
        
        filtered = filtered.filter(flight => {
          const boardingDate = new Date(flight.boardingDate);
          return boardingDate.getMonth() === selectedMonth && 
                 boardingDate.getFullYear() === selectedYear;
        });
      }
    }
    
    this.filteredFlights = filtered;
    
    // Set message if no flights found
    if (this.filteredFlights.length === 0) {
      if (this.searchTerm && this.dateFilter) {
        this.noFlightsMessage = 'No flights found matching both search term and date filter.';
      } else if (this.searchTerm) {
        this.noFlightsMessage = 'No flights found matching search term.';
      } else if (this.dateFilter) {
        this.noFlightsMessage = 'No flights found in the selected date range.';
      } else {
        this.noFlightsMessage = 'No upcoming flights available.';
      }
    } else {
      this.noFlightsMessage = '';
    }
  }

  handleDateFilterChange(dateFilter: DateFilter): void {
    this.dateFilter = dateFilter;
    this.applyFilter();
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