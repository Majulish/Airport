import {Destination} from '../../Destinations/Model/destination.module';

export class FlightWithDestination {
  constructor(
    public flightNumber: string,
    public origin: Destination | undefined,
    public arrival: Destination | undefined,
    public boardingDate: Date,
    public arrivalDate: Date,
    public seatCount: number,
    public takenSeats: number,
    public isActive: boolean,
  ) {}
}
