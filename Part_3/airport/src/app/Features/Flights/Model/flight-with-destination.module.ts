import {Destination} from '../../Destinations/Model/destination.module';

export class FlightWithDestination {
  constructor(
    public flightNumber: string,
    public origin: Destination | null,
    public arrival: Destination | null,
    public boardingDate: Date,
    public arrivalDate: Date,
    public seatCount: number,
    public takenSeats: number,
    public isActive: boolean,
  ) {}
}
