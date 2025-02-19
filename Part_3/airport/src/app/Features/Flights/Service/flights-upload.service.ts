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
          date.getUpcomingDate(1,8,0),
          date.getUpcomingDate(1,18,0),
          250,
          120,
          true
      ),
      new Flight(
          'LAX456',
          'LAX',
          'LHR',
          date.getUpcomingDate(1,10),
          date.getUpcomingDate(1, 20),
          300,
          200,
          true
      ),
      new Flight(
          'LHR789',
          'LHR',
          'LAX',
          date.getUpcomingDate(-3, 15, ),
          date.getUpcomingDate(-2, 5),
          220,
          180,
          true
      ),
      new Flight(
          'DXB101',
          'DXB',
          'HND',
          date.getUpcomingDate(-5, 18, 30),
          date.getUpcomingDate(-5, 23),
          180,
          50,
          true
      ),
      new Flight(
          'HND202',
          'HND',
          'SYD',
          date.getUpcomingDate(1,22),
          date.getUpcomingDate(2,6),
          300,
          270,
          true
      ),
      new Flight(
          'SYD303',
          'SYD',
          'SFO',
          date.getUpcomingDate(10,9),
          date.getUpcomingDate(11,19),
          250,
          100,
          true
      ),
      new Flight(
          'CDG404',
          'CDG',
          'SIN',
          date.getUpcomingDate(8,16),
          date.getUpcomingDate(9,23,30),
          200,
          150,
          true
      ),
      new Flight(
          'SFO505',
          'SFO',
          'FCO',
          date.getUpcomingDate(12,11),
          date.getUpcomingDate(12,22,30),
          180,
          60,
          true
      ),
      new Flight(
          'SIN606',
          'SIN',
          'CDG',
          date.getUpcomingDate(13,13),
          date.getUpcomingDate(13,21,30),
          200,
          120,
          true
      ),
      new Flight(
          'FCO707',
          'FCO',
          'NYC',
          date.getUpcomingDate(14,7),
          date.getUpcomingDate(14,14),
          250,
          140,
          true
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
            arrivalDate: flight.arrivalDate,
            seatCount: flight.seatCount,
            takenSeats: flight.takenSeats,
            originRef: doc(this.firestore, 'Destinations', flight.originCode),
            arrivalRef: doc(this.firestore, 'Destinations', flight.arrivalCode),
            isActive: flight.isActive,
          },
          { merge: true }
      );
    }

    console.log("Flights uploaded successfully!");
  }

}

