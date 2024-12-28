import { Injectable } from '@angular/core';
import { Flight } from '../Model/filght.module';
import {date} from '../../../Utilities/get-date';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly flights: Flight[] = [
    new Flight(
      'NYC123',
      'Dubai',
      { destName: 'New York', destCode: 'NYC' },
      date.getUpcomingDate(1),
      '08:00',
      date.getUpcomingDate(1),
      '18:00',
      250,
      120
    ),
    new Flight(
      'LAX456',
      'London',
      { destName: 'Los Angeles', destCode: 'LAX' },
      date.getUpcomingDate(1),
      '10:00',
      date.getUpcomingDate(1),
      '20:00',
      300,
      200
    ),
    new Flight(
      'LHR789',
      'Los Angeles',
      { destName: 'London', destCode: 'LHR' },
      date.getUpcomingDate(2),
      '15:00',
      date.getUpcomingDate(3),
      '05:00',
      220,
      180
    ),
    new Flight(
      'DXB101',
      'Tokyo',
      { destName: 'Dubai', destCode: 'DXB' },
      date.getUpcomingDate(1),
      '18:30',
      date.getUpcomingDate(1),
      '23:00',
      180,
      50
    ),
    new Flight(
      'HND202',
      'Sydney',
      { destName: 'Tokyo', destCode: 'HND' },
      date.getUpcomingDate(1),
      '22:00',
      date.getUpcomingDate(2),
      '06:00',
      300,
      270
    ),
    new Flight(
      'SYD303',
      'San Francisco',
      { destName: 'Sydney', destCode: 'SYD' },
      date.getUpcomingDate(10),
      '09:00',
      date.getUpcomingDate(11),
      '19:00',
      250,
      100
    ),
    new Flight(
      'CDG404',
      'Singapore',
      { destName: 'Paris', destCode: 'CDG' },
      date.getUpcomingDate(8),
      '16:00',
      date.getUpcomingDate(9),
      '23:30',
      200,
      150
    ),
    new Flight(
      'SFO505',
      'Rome',
      { destName: 'San Francisco', destCode: 'SFO' },
      date.getUpcomingDate(12),
      '11:00',
      date.getUpcomingDate(12),
      '22:30',
      180,
      60
    ),
    new Flight(
      'SIN606',
      'Paris',
      { destName: 'Singapore', destCode: 'SIN' },
      date.getUpcomingDate(13),
      '13:00',
      date.getUpcomingDate(13),
      '21:30',
      200,
      120
    ),
    new Flight(
      'FCO707',
      'New York',
      { destName: 'Rome', destCode: 'FCO' },
      date.getUpcomingDate(14),
      '07:00',
      date.getUpcomingDate(14),
      '14:00',
      250,
      140
    ),
  ];

  constructor() {}

  getAllFlights(): Flight[] {
    return [...this.flights];
  }

  getFlightByNumber(flightNo: string): Flight | undefined {
    return this.flights.find((flight) => flight.flightNumber === flightNo);
  }

  getFlightsByOrigin(origin: string): Flight[] {
    return this.flights.filter((flight) => flight.originCode === origin);
  }

  getFlightsByDestination(destCode: string): Flight[] {
    return this.flights.filter((flight) => flight.destination.destCode === destCode);
  }
}
