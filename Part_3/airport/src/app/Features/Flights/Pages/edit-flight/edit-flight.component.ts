import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FlightService } from '../../Service/flights.service';
import { Flight } from '../../Model/filght.module';
import {FlightWithDestination} from "../../Model/flight-with-destination.module";

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class EditFlightComponent implements OnInit {
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
