import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Flight } from '../../../Flights/Model/filght.module';
import { FlightService } from '../../../Flights/Service/flights.service';

@Component({
  selector: 'book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
})
export class BookFlightComponent implements OnInit {
  @Input() showHeader = true;

  flights: Flight[] = [];
  originalFlights: Flight[] = [];
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.flights = this.flightService.getAllFlights().filter(
      (flight) =>
        new Date(`${flight.boardingDate}T${flight.boardingTime}`) > new Date()
    );
    this.originalFlights = [...this.flights];
  }

  sortTable(column: string): void {
    if (this.currentSortColumn === column) {
      if (this.currentSortDirection === 'asc') {
        this.currentSortDirection = 'desc';
      } else if (this.currentSortDirection === 'desc') {
        this.currentSortDirection = null;
        this.flights = [...this.originalFlights];
        return;
      } else {
        this.currentSortDirection = 'asc';
      }
    } else {
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }

    this.flights.sort((a, b) => {
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
