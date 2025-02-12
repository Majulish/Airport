import {Component, OnInit} from '@angular/core';
import {FlightService} from '../../Flights/Service/flights.service';
import {DestinationsService} from '../../Destinations/Service/destinations.service';
import {Destination} from '../../Destinations/Model/destination.module';
import {Flight} from '../../Flights/Model/filght.module';
import {MatIconModule} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {ManageBookingsComponent} from '../../Bookings/Pages/manage-bookings/manage-bookings.component';
import {FlightWithDestination} from "../../Flights/Model/flight-with-destination.module";

@Component({
  selector: 'app-home-page',
  imports: [MatIconModule, MatCard, MatCardActions, MatCardContent, CommonModule, RouterLink, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanel, ManageBookingsComponent, MatExpansionPanelContent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
})
export class HomePageComponent implements OnInit {
  flights!: FlightWithDestination[];
  destinations!: Destination[];
  isLastMinuteExpanded = true;
  isSearchFlightExpanded = false;

  constructor(
    private flightsService: FlightService,
    private destinationsService: DestinationsService
  ) {
  }

  async ngOnInit() {
    [this.flights, this.destinations] = await Promise.all([
      this.flightsService.getAllFlightsForNextWeek(),
      this.destinationsService.getAllDestinations()
    ])
  }

  onPanelOpened(panel: string): void {
    if (panel === 'lastMinute') {
      this.isLastMinuteExpanded = true;
      this.isSearchFlightExpanded = false;
    } else if (panel === 'searchFlight') {
      this.isLastMinuteExpanded = false;
      this.isSearchFlightExpanded = true;
    }
  }

  openAirportUrl(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
