import { Injectable } from '@angular/core';
import { Booking } from '../Model/booking.module';
import {Flight} from '../../Flights/Model/filght.module';
import {FlightService} from '../../Flights/Service/flights.service';
import {DestinationsService} from '../../Destinations/Service/destinations.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookings: Booking[] = [];

  constructor(private flightService:FlightService, private destinationsService: DestinationsService
  ) {
    this.initializeBookings();
  }

  private initializeBookings(): void {
    this.bookings = [
      new Booking(
        "B001",
        "NYC123",
        [
          { name: "John Doe", passportId: "A1234567" },
          { name: "Jane Doe", passportId: "A1234568" },
        ],
        2
      ),
      new Booking(
        "B002",
        "LAX456",
        [
          { name: "Alice Smith", passportId: "B9876543" },
          { name: "Bob Smith", passportId: "B9876544" },
          { name: "Charlie Brown", passportId: "B9876545" },
        ],
        3
      ),
      new Booking(
        "B003",
        "LHR789",
        [{ name: "Emily Davis", passportId: "C7654321" }],
        1
      ),
    ];
  }

  getAllBookings(): Booking[] {
    return [...this.bookings];
  }

  getBookingById(bookingId: string): Booking | undefined {
    return this.bookings.find((booking) => booking.bookingId === bookingId);
  }

  getBookingsByFlightNumber(flightNo: string): Booking[] {
    return this.bookings.filter((booking) => booking.flightNo === flightNo);
  }

  getBookingsByTime(isUpcoming: boolean): any[] {
    const now = new Date();

    return this.bookings
      .filter((booking) => {
        const flight: Flight | undefined = this.flightService.getFlightByNumber(booking.flightNo);

        if (!flight) {
          console.warn(`Flight not found for flight number: ${booking.flightNo}`);
          return false;
        }

        const flightTime = new Date(flight.boardingDate + ' ' + flight.boardingTime); // Combine date and time
        return isUpcoming ? flightTime > now : flightTime <= now;
      })
      .map((booking) => {
        const flight: Flight | undefined = this.flightService.getFlightByNumber(booking.flightNo);

        if (!flight) {
          throw new Error(`Flight not found for flight number: ${booking.flightNo}`);
        }

        const originDestination = this.destinationsService.get(flight.originCode)

        return {
          bookingId: booking.bookingId,
          flightNumber: booking.flightNo,
          passengers: booking.passengers,
          numOfPassengers: booking.passengers.length,
          origin: originDestination?.name,
          destination: flight.destination.name,
          image: flight.destination.imageUrl,
          boarding: `${this.formatDate(flight.boardingDate)} ${flight.boardingTime}`,
          landing: `${this.formatDate(flight.arrivalDate)} ${flight.arrivalTime}`,
        };
      });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
}

