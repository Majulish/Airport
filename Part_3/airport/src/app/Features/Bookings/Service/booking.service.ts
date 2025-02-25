import { Injectable } from '@angular/core';
import { Flight } from '../../Flights/Model/filght.module';
import { FlightService } from '../../Flights/Service/flights.service';
import { DestinationsService } from '../../Destinations/Service/destinations.service';
import {Firestore, doc, getDoc, collection, getDocs, updateDoc} from '@angular/fire/firestore';
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
          totalPrice: booking.totalPrice,
          origin: flight.origin?.name ?? 'Unknown',
          arrival: flight.arrival?.name ?? 'Unknown',
          image: flight.arrival?.imageUrl ?? 'empty',
          boardingTime: flight.boardingDate?.toISOString(),
          landingTime: flight.arrivalDate?.toISOString(),
          isActive: booking.isActive,
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

  async updateBookingStatus(bookingId: string, isActive: boolean): Promise<void> {
    const docRef = doc(this.firestore, 'Booking', bookingId);
    await updateDoc(docRef, { isActive });
  }

  async getFlightStatus(flightNumber: string): Promise<{ isActive: boolean }> {
    const docRef = doc(this.firestore, 'Flight', flightNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { isActive: docSnap.data()['isActive'] }
    } else {
      console.warn(`No flight found with number: ${flightNumber}`);
      return { isActive: false }; // Default to false if flight not found
    }
  }

  async calculateTotalPrice(flightNo: string, numPassengers: number): Promise<number> {
    if (!flightNo) {
      console.warn("Error: Flight number is missing.");
      return 0; // Default price if flight number is missing
    }

    const flightRef = doc(this.firestore, 'Flight', flightNo);
    const flightSnap = await getDoc(flightRef);

    if (flightSnap.exists()) {
      const flightData = flightSnap.data();
      const pricePerPassenger = flightData['price'] ?? 0;
      return pricePerPassenger * numPassengers;
    } else {
      console.warn(`Flight ${flightNo} not found. Defaulting price to $0`);
      return 0;
    }
  }


}
