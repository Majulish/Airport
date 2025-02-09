import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FlightService} from '../../../Flights/Service/flights.service';
import {FlightWithDestination} from "../../../Flights/Model/flight-with-destination.module";

@Component({
  selector: 'app-view-flight-details',
  imports: [CommonModule],
  templateUrl: './view-flight-details.component.html',
  styleUrl: './view-flight-details.component.css',
  standalone: true
})
export class ViewFlightDetailsComponent {

  flight: FlightWithDestination | undefined;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  async ngOnInit(): Promise<void> {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      this.flight = await this.flightService.getFlightByNumber(flightNumber);
    }
  }
}
