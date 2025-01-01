import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlightService } from '../../Service/flights.service'; // Adjust path
import { Flight } from '../../Model/filght.module';
import {RouterLink} from '@angular/router'; // Adjust path

@Component({
  selector: 'app-manage-flights',
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink], // Add CommonModule
})
export class ManageFlightsComponent implements OnInit {
  flights: Flight[] = [];

  constructor(private flightService: FlightService){}
  ngOnInit(): void {
    this.flights = this.flightService.getAllFlights();
  }
}
