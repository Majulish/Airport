import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Flight} from '../../../Flights/Model/filght.module';
import {FlightService} from '../../../Flights/Service/flights.service';

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

  constructor(private flightService: FlightService){}
  ngOnInit(): void {
    this.flights = this.flightService.getAllFlights().filter((flight) => new Date(
      `${flight.boardingDate}T${flight.boardingTime}`
    ) > new Date());
  }
}
