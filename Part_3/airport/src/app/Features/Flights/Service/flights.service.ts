import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Flight } from '../Model/filght.module';
import { FlightWithDestination } from '../Model/flight-with-destination.module';
import { Destination } from '../../Destinations/Model/destination.module';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private firestore: Firestore) {}

  async getFlightByNumber(flightNo: string): Promise<FlightWithDestination | undefined> {
    const docRef = doc(this.firestore, 'Flight', flightNo);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`No flight found with number: ${flightNo}`);
      return undefined;
    }

    const flightData = docSnap.data() as Flight;
    flightData.boardingDate = (flightData.boardingDate as unknown as Timestamp).toDate();
    flightData.arrivalDate = (flightData.arrivalDate as unknown as Timestamp).toDate();

    const [origin, arrival] = await Promise.all([
        this.getDestinationByCode(flightData.originCode),
        this.getDestinationByCode(flightData.arrivalCode)
        ])

    return new FlightWithDestination(flightData.flightNumber, origin, arrival, flightData.boardingDate, flightData.arrivalDate, flightData.seatCount, flightData.takenSeats, flightData.isActive);
  }

  private async getDestinationByCode(code: string): Promise<Destination | null> {
    if (!code) return null;
    const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
    const destinationSnapshot = await getDoc(destinationDocRef);

    return destinationSnapshot.exists() ? (destinationSnapshot.data() as Destination) : null;
  }

  async getAllFlights(): Promise<FlightWithDestination[]> {
    console.log('Fetching all flights and destinations in parallel...');

    // Fetch all flights and destinations simultaneously
    const [flightsSnapshot, destinationsSnapshot] = await Promise.all([
      getDocs(collection(this.firestore, 'Flight')),
      getDocs(collection(this.firestore, 'Destinations'))
    ]);

    // Process Flights
    const flightsData: Flight[] = flightsSnapshot.docs.map(doc => {
      const data = doc.data() as Flight;
      data.boardingDate = (data.boardingDate as unknown as Timestamp).toDate();
      data.arrivalDate = (data.arrivalDate as unknown as Timestamp).toDate();
      return data;
    });

    // Process Destinations into a Map for fast lookups
    const destinationsMap = new Map<string, Destination>();
    destinationsSnapshot.docs.forEach(doc => {
      const destination = doc.data() as Destination;
      destinationsMap.set(destination.code, destination);
    });

    console.log(`Loaded ${flightsData.length} flights`);
    console.log(`Loaded ${destinationsMap.size} destinations`);

    // Map flights to their destinations efficiently
    const flightsWithDestinations: FlightWithDestination[] = flightsData.map(flight => {
      return new FlightWithDestination(
          flight.flightNumber,
          destinationsMap.get(flight.originCode) || null,
          destinationsMap.get(flight.arrivalCode) || null,
          flight.boardingDate,
          flight.arrivalDate,
          flight.seatCount,
          flight.takenSeats,
          flight.isActive
      );
    });

    console.log(`Returning ${flightsWithDestinations.length} flights with destinations`);
    return flightsWithDestinations;
  }


  async getUpcomingFlights(): Promise<FlightWithDestination[]> {
    const [flightsSnapshot, destinationsSnapshot] = await Promise.all([
      getDocs(collection(this.firestore, 'Flight')),
      getDocs(collection(this.firestore, 'Destinations'))
    ]);

    const flightsData: Flight[] = flightsSnapshot.docs.map(doc => {
      const data = doc.data() as Flight;
      data.boardingDate = (data.boardingDate as unknown as Timestamp).toDate();
      data.arrivalDate = (data.arrivalDate as unknown as Timestamp).toDate();
      return data;
    });

    const destinationsMap = new Map<string, Destination>();
    destinationsSnapshot.docs.forEach(doc => {
      const destination = doc.data() as Destination;
      destinationsMap.set(destination.code, destination);
    });

    const today = new Date();
    return flightsData
        .filter(flight => new Date(flight.boardingDate) >= today)
        .map(flight => new FlightWithDestination(
            flight.flightNumber,
            destinationsMap.get(flight.originCode) || null,
            destinationsMap.get(flight.arrivalCode) || null,
            flight.boardingDate,
            flight.arrivalDate,
            flight.seatCount,
            flight.takenSeats,
            flight.isActive,
        ));
  }


  async getAllFlightsForNextWeek(): Promise<FlightWithDestination[]> {
    const [flightsSnapshot, destinationsSnapshot] = await Promise.all([
      getDocs(collection(this.firestore, 'Flight')),
      getDocs(collection(this.firestore, 'Destinations'))
    ]);

    const flightsData: Flight[] = flightsSnapshot.docs.map(doc => {
      const data = doc.data() as Flight;
      data.boardingDate = (data.boardingDate as unknown as Timestamp).toDate();
      data.arrivalDate = (data.arrivalDate as unknown as Timestamp).toDate();
      return data;
    });

    const destinationsMap = new Map<string, Destination>();
    destinationsSnapshot.docs.forEach(doc => {
      const destination = doc.data() as Destination;
      destinationsMap.set(destination.code, destination);
    });

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const flightsForNextWeek: FlightWithDestination[] = flightsData
        .filter(flight => {
          const flightDate = new Date(flight.boardingDate);
          return flightDate >= today && flightDate <= nextWeek;
        })
        .map(flight => new FlightWithDestination(
            flight.flightNumber,
            destinationsMap.get(flight.originCode) || null,
            destinationsMap.get(flight.arrivalCode) || null,
            flight.boardingDate,
            flight.arrivalDate,
            flight.seatCount,
            flight.takenSeats,
            flight.isActive,
        ));

    console.log(`Returning ${flightsForNextWeek.length} flights for next week`);
    return flightsForNextWeek;
  }


  sortObjectArray(
    column: string,
    currentSortDirection: "asc" | "desc" | null,
    filteredArray: any[]
  ) {
    if (!currentSortDirection) {
      return;
    }

    filteredArray.sort((a, b) => {
      let valueA = this.resolveNestedProperty(a, column);
      let valueB = this.resolveNestedProperty(b, column);

      // Handle dates properly
      if (valueA instanceof Date && valueB instanceof Date) {
        return currentSortDirection === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      // Fallback to string comparison
      if (typeof valueA === "string" && typeof valueB === "string") {
        return currentSortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Default number comparison
      return currentSortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  /**
   * Handles nested properties, e.g., "destination.name"
   */
  private resolveNestedProperty(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
  }

  getSortIcon(column: string, currentSortColumn: string | null, currentSortDirection: string | null) {
    if (currentSortColumn === column) {
      if (currentSortDirection === 'asc') {
        return 'fa-arrow-up';
      } else if (currentSortDirection === 'desc') {
        return 'fa-arrow-down';
      }
    }
    return 'fa-arrow';
  }
}
