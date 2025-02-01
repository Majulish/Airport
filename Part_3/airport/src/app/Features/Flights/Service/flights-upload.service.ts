import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { Flight } from '../Model/filght.module';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import { Destination } from '../../Destinations/Model/destination.module';
import { date } from '../../../Utilities/get-date';

@Injectable({
  providedIn: 'root',
})
export class FlightUploadService {
  private flights: Flight[] = [];
  private destinations: Destination[] = [];

  constructor(
    private destinationsService: DestinationsService,
    private firestore: Firestore
  ) {
    this.loadDestinationsAndInitializeFlights();
  }

  private async loadDestinationsAndInitializeFlights(): Promise<void> {
    try {
      this.destinations = await this.destinationsService.getAllDestinations();
      this.initializeFlights();
      this.uploadFlights();
    } catch (error) {
      console.error('Failed to load destinations:', error);
    }
  }

  private initializeFlights(): void {
    const destinations = this.destinationsService.getAllDestinations();

    this.flights = [
      new Flight(
          'NYC123',
          'NYC',
          this.findDestination('NYC').name,
          this.findDestination('DXB'),
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
          this.findDestination('LAX').name,
          this.findDestination('LHR'),
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
          this.findDestination('LHR').name,
          this.findDestination('LAX'),
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
          this.findDestination('DXB').name,
          this.findDestination('HND'),
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
          this.findDestination('HND').name,
          this.findDestination('SYD'),
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
          this.findDestination('SYD').name,
          this.findDestination('SFO'),
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
          this.findDestination('CDG').name,
          this.findDestination('SIN'),
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
          this.findDestination('SFO').name,
          this.findDestination('FCO'),
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
          this.findDestination('SIN').name,
          this.findDestination('CDG'),
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
          this.findDestination('FCO').name,
          this.findDestination('NYC'),
          date.getUpcomingDate(14),
          '07:00',
          date.getUpcomingDate(14),
          '14:00',
          250,
          140
      ),
    ];
  }

  private findDestination(code: string): Destination {
    const destination = this.destinations.find((dest) => dest.code === code);
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
        destination: flight.destination,
        destinationRef: doc(this.firestore, 'Destinations', flight.destination.code),
      },
          { merge: true });
    }
    console.log('Flights uploaded successfully!');
  }
}
