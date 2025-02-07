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
  private bookings: Booking[] = [];

  constructor(
    private flightService: FlightService,
    private destinationsService: DestinationsService,
    private firestore: Firestore
  ) {
  }

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

    const bookingCollectionRef = collection(this.firestore, 'Booking');
    const querySnapshot = await getDocs(bookingCollectionRef);
    this.bookings = querySnapshot.docs.map(doc => doc.data() as Booking);

    if (this.bookings.length === 0) {
      console.warn("No bookings found in Firestore.");
      return [];
    }

    const processedBookings = await Promise.all(
      this.bookings.map(async (booking) => {
        const flight: Flight | undefined = await this.flightService.getFlightByNumber(booking.flightNo);

        if (!flight) {
          console.warn(`Flight not found for flight number: ${booking.flightNo}`);
          return null;
        }

        const flightTime = new Date(`${flight.boardingDate} ${flight.boardingTime}`);
        const isFlightUpcoming = flightTime > now;
        const shouldInclude = isUpcoming ? isFlightUpcoming : !isFlightUpcoming;

        return shouldInclude ? {booking, flight} : null;
      })
    );

    const validBookings = processedBookings.filter(item => item !== null) as { booking: Booking, flight: Flight }[];

    return Promise.all(
      validBookings.map(async ({booking, flight}) => {
        // ✅ Fix: Remove firstValueFrom() and directly await get()
        const originDestination = await this.destinationsService.get(flight.originCode);

        return {
          bookingId: booking.bookingId,
          flightNumber: booking.flightNo,
          passengers: booking.passengers,
          numOfPassengers: booking.passengers.length,
          origin: originDestination?.name ?? 'Unknown', // ✅ No more TS2339 error
          destination: flight.destination.name,
          image: flight.destination.imageUrl,
          boarding: `${this.formatDate(flight.boardingDate)} ${flight.boardingTime}`,
          landing: `${this.formatDate(flight.arrivalDate)} ${flight.arrivalTime}`,
        };
      })
    );
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

}
