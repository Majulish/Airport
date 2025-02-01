import { Injectable } from '@angular/core';
import { Flight } from '../../Flights/Model/filght.module';
import { FlightService } from '../../Flights/Service/flights.service';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Booking } from '../Model/booking.module';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private flightService: FlightService,
    private destinationsService: DestinationsService,
    private firestore: Firestore
  ) {}

  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    const docRef = doc(this.firestore, 'Booking', bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Booking;
    } else {
      console.warn(`No booking found with ID: ${bookingId}`);
      return undefined;
    }
  }

  async getBookingsByTime(isUpcoming: boolean): Promise<any[]> {
    const now = new Date();

    // Fetch all bookings from Firestore
    const bookingCollectionRef = collection(this.firestore, 'Booking');
    const querySnapshot = await getDocs(bookingCollectionRef);
    const bookings: Booking[] = querySnapshot.docs.map(doc => doc.data() as Booking);

    // Process each booking asynchronously
    const processedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const flightDocRef = doc(this.firestore, 'Flight', booking.flightNo);
        const flightDocSnap = await getDoc(flightDocRef);

        if (!flightDocSnap.exists()) {
          console.warn(`Flight not found for flight number: ${booking.flightNo}`);
          return null; // Skip invalid flights
        }

        const flight = flightDocSnap.data() as Flight;

        const originDestination = await this.destinationsService.get(flight.originCode);
        const destination = await this.destinationsService.get(flight.destination.code);

        return {
          bookingId: booking.bookingId,
          flightNumber: booking.flightNo,
          passengers: booking.passengers,
          numOfPassengers: booking.passengers.length,
          origin: originDestination?.name ?? 'Unknown',
          destination: destination?.name ?? 'Unknown',
          image: destination?.imageUrl ?? '',
          boarding: `${this.formatDate(flight.boardingDate)} ${flight.boardingTime}`,
          landing: `${this.formatDate(flight.arrivalDate)} ${flight.arrivalTime}`,
        };
      })
    );

    // Filter out null entries (invalid flights)
    return processedBookings.filter((booking) => booking !== null);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
}
