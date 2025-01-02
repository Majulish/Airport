import {Component, OnInit} from '@angular/core';
import {FlightService} from '../../Flights/Service/flights.service';
import {DestinationsService} from '../../Destinations/Service/destinations.service';
import {Destination} from '../../Destinations/Model/destination.module';
import {Flight} from '../../Flights/Model/filght.module';
import {MatIconModule} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [MatIconModule, MatCard, MatCardActions, MatCardContent, CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
})
export class HomePageComponent implements OnInit {
  flights!: Flight[];
  destinations!: Destination[];

  constructor(
    private flightsService: FlightService,
    private destinationsService: DestinationsService
  ) {
  }

  ngOnInit() {
    this.flights = this.flightsService.getAllFlightsForNextWeek();
    this.destinations = this.destinationsService.getAllDestinations();
  }

  openAirportUrl(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
