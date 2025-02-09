import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import { Destination } from '../../Destinations/Model/destination.module';
import { date } from '../../../Utilities/get-date';
import {Flight} from "../Model/filght.module";

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
  }

  public async loadDestinationsAndInitializeFlights(): Promise<void> {
    try {
      this.destinations = await this.destinationsService.getAllDestinations();
      this.initializeFlights();
      await this.uploadFlights();
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
          'DXB',
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
          'LHR',
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
          'LAX',
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
          'HND',
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
          'SYD',
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
          'SFO',
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
          'SIN',
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
          'FCO',
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
          'CDG',
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
          'NYC',
          date.getUpcomingDate(14),
          '07:00',
          date.getUpcomingDate(14),
          '14:00',
          250,
          140
      ),
    ];
  }

  private findDestination(code: string): Destination | null {
    return this.destinations.find((dest) => dest.code === code) || null;
  }

  async uploadFlights(): Promise<void> {
    console.log("Uploading Flights...", this.flights);

    if (!this.flights || this.flights.length === 0) {
      console.error("No flights found to upload.");
      return;
    }

    const flightCollection = collection(this.firestore, 'Flight');

    for (const flight of this.flights) {
      const flightDocRef = doc(flightCollection, flight.flightNumber);
      await setDoc(
          flightDocRef,
          {
            flightNumber: flight.flightNumber,
            originCode: flight.originCode,
            arrivalCode: flight.arrivalCode,
            boardingDate: flight.boardingDate,
            boardingTime: flight.boardingTime,
            arrivalDate: flight.arrivalDate,
            arrivalTime: flight.arrivalTime,
            seatCount: flight.seatCount,
            takenSeats: flight.takenSeats,
            originRef: doc(this.firestore, 'Destinations', flight.originCode),
            arrivalRef: doc(this.firestore, 'Destinations', flight.arrivalCode),
          },
          { merge: true }
      );
    }

    console.log("Flights uploaded successfully!");
  }

}

