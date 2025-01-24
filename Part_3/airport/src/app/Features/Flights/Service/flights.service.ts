import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { Flight } from '../Model/filght.module';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import { Destination } from '../../Destinations/Model/destination.module';
import {date} from '../../../Utilities/get-date';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flights: Flight[] = [];

  constructor(
    private destinationsService: DestinationsService,
    private firestore: Firestore
  ) {
    this.initializeFlights();
  }

  private initializeFlights(): void {
    const destinations = this.destinationsService.getAllDestinations();

    this.flights = [
      new Flight(
        'NYC123',
        'NYC',
        this.findDestination('NYC', destinations).name,
        this.findDestination('DXB', destinations),
        date.getUpcomingDate(1),
        '08:00',
        date.getUpcomingDate(1),
        '18:00',
        250,
        120
      ),
      new Flight(
        'LAX456',
        'LAX',
        this.findDestination('LAX', destinations).name,
        this.findDestination('LHR', destinations),
        date.getUpcomingDate(1),
        '10:00',
        date.getUpcomingDate(1),
        '20:00',
        300,
        200
      ),
      new Flight(
        'LHR789',
        'LHR',
        this.findDestination('LHR', destinations).name,
        this.findDestination('LAX', destinations),
        date.getUpcomingDate(-3),
        '15:00',
        date.getUpcomingDate(-2),
        '05:00',
        220,
        180
      ),
      new Flight(
        'DXB101',
        'DXB',
        this.findDestination('DXB', destinations).name,
        this.findDestination('HND', destinations),
        date.getUpcomingDate(-5),
        '18:30',
        date.getUpcomingDate(-5),
        '23:00',
        180,
        50
      ),
      new Flight(
        'HND202',
        'HND',
        this.findDestination('HND', destinations).name,
        this.findDestination('SYD', destinations),
        date.getUpcomingDate(1),
        '22:00',
        date.getUpcomingDate(2),
        '06:00',
        300,
        270
      ),
      new Flight(
        'SYD303',
        'SYD',
        this.findDestination('SYD', destinations).name,
        this.findDestination('SFO', destinations),
        date.getUpcomingDate(10),
        '09:00',
        date.getUpcomingDate(11),
        '19:00',
        250,
        100
      ),
      new Flight(
        'CDG404',
        'CDG',
        this.findDestination('CDG', destinations).name,
        this.findDestination('SIN', destinations),
        date.getUpcomingDate(8),
        '16:00',
        date.getUpcomingDate(9),
        '23:30',
        200,
        150
      ),
      new Flight(
        'SFO505',
        'SFO',
        this.findDestination('SFO', destinations).name,
        this.findDestination('FCO', destinations),
        date.getUpcomingDate(12),
        '11:00',
        date.getUpcomingDate(12),
        '22:30',
        180,
        60
      ),
      new Flight(
        'SIN606',
        'SIN',
        this.findDestination('SIN', destinations).name,
        this.findDestination('CDG', destinations),
        date.getUpcomingDate(13),
        '13:00',
        date.getUpcomingDate(13),
        '21:30',
        200,
        120
      ),
      new Flight(
        'FCO707',
        'FCO',
        this.findDestination('FCO', destinations).name,
        this.findDestination('NYC', destinations),
        date.getUpcomingDate(14),
        '07:00',
        date.getUpcomingDate(14),
        '14:00',
        250,
        140
      ),
    ];
  }

  private findDestination(code: string, destinations: Destination[]): Destination {
    const destination = destinations.find((dest) => dest.code === code);
    if (!destination) {
      throw new Error(`Destination with code ${code} not found.`);
    }
    return destination;
  }

  async uploadFlights(): Promise<void> {
    const flightCollection = collection(this.firestore, 'Flight');
    for (const flight of this.flights) {
      await setDoc(doc(flightCollection, flight.flightNumber), {
        ...flight,
        destination: flight.destination.toPlainObject(),
        destinationRef: doc(this.firestore, 'Destinations', flight.destination.code),
      });
    }
    console.log('Flights uploaded successfully!');
  }

  getAllFlights(): Flight[] {
    return [...this.flights];
  }

  getAllFlightsForNextWeek(): Flight[] {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return this.flights.filter((flight: Flight) => {
      const flightDate = new Date(flight.boardingDate);
      return flightDate >= today && flightDate <= nextWeek;
    });
  }

  getFlightByNumber(flightNo: string): Flight | undefined {
    return this.flights.find((flight) => flight.flightNumber === flightNo);
  }
}
