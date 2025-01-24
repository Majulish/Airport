import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FlightService } from '../../Service/flights.service';
import { Flight } from '../../Model/filght.module';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class EditFlightComponent implements OnInit {
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
