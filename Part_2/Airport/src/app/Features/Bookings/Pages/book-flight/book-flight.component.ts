import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Flight} from '../../../Flights/Model/filght.module';
import {FlightService} from '../../../Flights/Service/flights.service'; // Adjust path

@Component({
  selector: 'book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink], // Add CommonModule
})
export class BookFlightComponent implements OnInit {
  flights: Flight[] = [];

  constructor(private flightService: FlightService){}
  ngOnInit(): void {
    this.flights = this.flightService.getAllFlights();
  }
}
