import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Flight} from '../../../Flights/Model/filght.module';
import {FlightService} from '../../../Flights/Service/flights.service';

@Component({
  selector: 'app-view-flight-details',
  imports: [CommonModule], // Include CommonModule for DatePipe
  templateUrl: './view-flight-details.component.html',
  styleUrl: './view-flight-details.component.css',
  standalone: true
})
export class ViewFlightDetailsComponent {

  flight: Flight | undefined;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      this.flight = this.flightService.getFlightByNumber(flightNumber);
    }
  }
}
