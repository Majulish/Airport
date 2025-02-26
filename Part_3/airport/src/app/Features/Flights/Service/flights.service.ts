import { Injectable } from '@angular/core';
import {Firestore, collection, getDocs, doc, getDoc, setDoc, query, where, Query} from '@angular/fire/firestore';
import { Flight } from '../Model/filght.module';
import { FlightWithDestination } from '../Model/flight-with-destination.module';
import { Destination } from '../../Destinations/Model/destination.module';
import { Timestamp } from 'firebase/firestore';
import { DateFilter } from '../../components/date-filter/date-filter.component';

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

    return new FlightWithDestination(flightData.flightNumber, origin, arrival, flightData.boardingDate, flightData.arrivalDate, flightData.seatCount, flightData.takenSeats,flightData.price, flightData.isActive);
  }

  private async getDestinationByCode(code: string): Promise<Destination | undefined> {
    if (!code) return undefined;
    const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
    const destinationSnapshot = await getDoc(destinationDocRef);

    return destinationSnapshot.exists() ? (destinationSnapshot.data() as Destination) : undefined;
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
          destinationsMap.get(flight.originCode),
          destinationsMap.get(flight.arrivalCode),
          flight.boardingDate,
          flight.arrivalDate,
          flight.seatCount,
          flight.takenSeats,
          flight.price,
          flight.isActive
      );
    });

    console.log(`Returning ${flightsWithDestinations.length} flights with destinations`);
    return flightsWithDestinations;
  }

  async getUpcomingFlights(): Promise<FlightWithDestination[]> {
    // For default view, we'll load all active flights without date restrictions
    // to maintain the original behavior
    const flightsRef = collection(this.firestore, 'Flight');
    const flightQuery = query(flightsRef, where('isActive', '==', true));
    
    // Get all destinations for lookup
    const [flightsSnapshot, destinationsSnapshot] = await Promise.all([
      getDocs(flightQuery),
      getDocs(collection(this.firestore, 'Destinations'))
    ]);
    
    // Process Destinations into a Map for fast lookups
    const destinationsMap = new Map<string, Destination>();
    destinationsSnapshot.docs.forEach(doc => {
      const destination = doc.data() as Destination;
      destinationsMap.set(destination.code, destination);
    });

    // Process the flight results
    const flightsData: Flight[] = flightsSnapshot.docs.map(doc => {
      const data = doc.data() as Flight;
      data.boardingDate = (data.boardingDate as unknown as Timestamp).toDate();
      data.arrivalDate = (data.arrivalDate as unknown as Timestamp).toDate();
      return data;
    });

    // Map flights to destinations
    const flightsWithDestinations: FlightWithDestination[] = flightsData.map(flight => {
      return new FlightWithDestination(
        flight.flightNumber,
        destinationsMap.get(flight.originCode),
        destinationsMap.get(flight.arrivalCode),
        flight.boardingDate,
        flight.arrivalDate,
        flight.seatCount,
        flight.takenSeats,
        flight.price,
        flight.isActive
      );
    });

    console.log(`Returning ${flightsWithDestinations.length} active flights`);
    return flightsWithDestinations;
  }

  async getFlightsByDateRange(dateFilter: DateFilter): Promise<FlightWithDestination[]> {
    console.log('Fetching flights by date range:', dateFilter);

    // Get all destinations for lookup
    const destinationsSnapshot = await getDocs(collection(this.firestore, 'Destinations'));
    const destinationsMap = new Map<string, Destination>();
    destinationsSnapshot.docs.forEach(doc => {
      const destination = doc.data() as Destination;
      destinationsMap.set(destination.code, destination);
    });

    // Build flight query based on date filter
    let flightQuery: Query;
    const flightsRef = collection(this.firestore, 'Flight');
    const today = new Date();

    if (!dateFilter || dateFilter.type === null) {
      // If no specific date filter, just return all active flights
      flightQuery = query(flightsRef, where('isActive', '==', true));
    } else if (dateFilter.type === 'specific' && dateFilter.startDate) {
      // Specific date range filter
      let startDate = new Date(dateFilter.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      try {
        if (dateFilter.endDate) {
          // Both start and end dates specified
          let endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          
          // We'll try a simpler query first - just getting all active flights
          flightQuery = query(flightsRef, where('isActive', '==', true));
          
          // We'll filter the date range on the client side to avoid index issues
          // This isn't as efficient but will work without requiring index creation
        } else {
          // Only start date specified - same approach
          flightQuery = query(flightsRef, where('isActive', '==', true));
        }
      } catch (error) {
        console.warn("Query requires index, falling back to client-side filtering", error);
        flightQuery = query(flightsRef, where('isActive', '==', true));
      }
    } else if (dateFilter.type === 'flexible' && dateFilter.month) {
      // Month filter - also using the simplified approach
      flightQuery = query(flightsRef, where('isActive', '==', true));
    } else {
      // Fallback to all active flights
      flightQuery = query(flightsRef, where('isActive', '==', true));
    }

    // Execute the query
    const flightsSnapshot = await getDocs(flightQuery);
    
    // Process the results
    const flightsData: Flight[] = flightsSnapshot.docs.map(doc => {
      const data = doc.data() as Flight;
      data.boardingDate = (data.boardingDate as unknown as Timestamp).toDate();
      data.arrivalDate = (data.arrivalDate as unknown as Timestamp).toDate();
      return data;
    });

    // Map flights to destinations
    let flightsWithDestinations: FlightWithDestination[] = flightsData.map(flight => {
      return new FlightWithDestination(
        flight.flightNumber,
        destinationsMap.get(flight.originCode),
        destinationsMap.get(flight.arrivalCode),
        flight.boardingDate,
        flight.arrivalDate,
        flight.seatCount,
        flight.takenSeats,
        flight.price,
        flight.isActive
      );
    });
    
    // Apply date filtering on the client side if needed
    if (dateFilter.type === 'specific' && dateFilter.startDate) {
      let startDate = new Date(dateFilter.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      let endDate: Date;
      if (dateFilter.endDate) {
        endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      }
      
      flightsWithDestinations = flightsWithDestinations.filter(flight => {
        const boardingDate = new Date(flight.boardingDate);
        return boardingDate >= startDate && boardingDate <= endDate;
      });
    } else if (dateFilter.type === 'flexible' && dateFilter.month) {
      const selectedMonth = dateFilter.month.getMonth();
      const selectedYear = dateFilter.month.getFullYear();
      
      flightsWithDestinations = flightsWithDestinations.filter(flight => {
        const boardingDate = new Date(flight.boardingDate);
        return boardingDate.getMonth() === selectedMonth && 
               boardingDate.getFullYear() === selectedYear;
      });
    }

    console.log(`Returning ${flightsWithDestinations.length} flights matching date filter`);
    return flightsWithDestinations;
  }

  async getAllFlightsForNextWeek(): Promise<FlightWithDestination[]> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Use the new date range function
    return this.getFlightsByDateRange({
      type: 'specific',
      startDate: today,
      endDate: nextWeek,
      month: null
    });
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

  async addFlight(flightData: any): Promise<void> {
    const flightRef = doc(this.firestore, `Flight/${flightData.flightNumber}`);
    const existingFlight = await getDoc(flightRef);

    if (existingFlight.exists()) {
      throw new Error(`Flight ${flightData.flightNumber} already exists.`);
    }

    // Convert date strings to Firebase Timestamp format
    const formattedFlightData = {
      ...flightData,
      boardingDate: new Date(flightData.boardingDate),
      arrivalDate: new Date(flightData.arrivalDate),
    };

    await setDoc(flightRef, formattedFlightData);
  }
}