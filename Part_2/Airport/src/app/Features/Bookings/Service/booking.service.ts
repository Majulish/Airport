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
          { name: "John Smith", passportId: "P9876543" },
          { name: "Alice Johnson", passportId: "P9876544" }
        ],
        2
      ),
      new Booking(
        "B002",
        "LAX456",
        [
          { name: "Michael Brown", passportId: "P1234567" },
          { name: "Emily Davis", passportId: "P1234568" }
        ],
        2
      ),
      new Booking(
        "B003",
        "LHR789",
        [
          { name: "William Wilson", passportId: "P1122334" },
          { name: "Sophia Taylor", passportId: "P1122335" }
        ],
        2
      ),
      new Booking(
        "B004",
        "DXB101",
        [
          { name: "Olivia Martinez", passportId: "P9988776" },
          { name: "Liam Garcia", passportId: "P9988777" }
        ],
        2
      ),
      new Booking(
        "B005",
        "HND202",
        [
          { name: "Benjamin Lee", passportId: "P4455667" },
          { name: "Emma Anderson", passportId: "P4455668" }
        ],
        2
      ),
      new Booking(
        "B006",
        "SYD303",
        [
          { name: "Charlotte Moore", passportId: "P5566778" },
          { name: "Lucas White", passportId: "P5566779" }
        ],
        2
      ),
      new Booking(
        "B007",
        "CDG404",
        [
          { name: "James Harris", passportId: "P6677889" },
          { name: "Amelia Thompson", passportId: "P6677880" }
        ],
        2
      ),
      new Booking(
        "B008",
        "SFO505",
        [
          { name: "Henry Jackson", passportId: "P7788990" },
          { name: "Evelyn Martin", passportId: "P7788991" }
        ],
        2
      ),
      new Booking(
        "B009",
        "SIN606",
        [
          { name: "Alexander Perez", passportId: "P8899002" },
          { name: "Isabella Roberts", passportId: "P8899003" }
        ],
        2
      ),
      new Booking(
        "B010",
        "FCO707",
        [
          { name: "Daniel Clark", passportId: "P9900114" },
          { name: "Mia Wright", passportId: "P9900115" }
        ],
        2
      )
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

        const flightTime = new Date(flight.boardingDate + ' ' + flight.boardingTime);
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

