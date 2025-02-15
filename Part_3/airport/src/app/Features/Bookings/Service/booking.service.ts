import { Injectable } from '@angular/core';
import { Flight } from '../../Flights/Model/filght.module';
import { FlightService } from '../../Flights/Service/flights.service';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Booking } from '../Model/booking.module';
import {FlightWithDestination} from "../../Flights/Model/flight-with-destination.module";
import {BookingWithFlightData} from "../Model/bookingWithFlightData.module";

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

  async getAllBookings(): Promise<BookingWithFlightData[]> {
    const now = new Date();

    const bookingCollectionRef = collection(this.firestore, 'Booking');
    const querySnapshot = await getDocs(bookingCollectionRef);
    this.bookings = querySnapshot.docs.map(doc => doc.data() as Booking);

    if (this.bookings.length === 0) {
      console.warn("No bookings found in Firestore.");
      return [];
    }

    // 🔹 Step 2: Fetch all flights in one query
    const flightCollectionRef = collection(this.firestore, 'Flight');
    const flightSnapshot = await getDocs(flightCollectionRef);
    const flightsMap = await this.flightService.getAllFlights()

    const processedBookings =  this.bookings.map((booking) => {
        const flight: FlightWithDestination | undefined = flightsMap.find((flight) => flight.flightNumber === booking.flightNo)

        if (!flight) {
          console.warn(`Flight not found for flight number: ${booking.flightNo}`);
          return null;
        }

        return {booking, flight};
      }).filter(Boolean)

    const validBookings = processedBookings?.filter(item => item !== null) as { booking: Booking, flight: FlightWithDestination }[];

    return validBookings.map(({booking, flight}) => {
        return {
          bookingId: booking.bookingId,
          flightNumber: booking.flightNo,
          passengers: booking.passengers,
          passengerCount: booking.passengers.length,
          origin: flight.origin?.name ?? 'Unknown',
          arrival: flight.arrival?.name ?? 'Unknown',
          image: flight.arrival?.imageUrl ?? 'empty',
          boardingTime: this.formatDate(flight.boardingDate),
          landingTime: this.formatDate(flight.arrivalDate)
        };
      });
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
