import {Destination} from '../../Destinations/Model/destination.module';

export class Flight {
  constructor(
    public flightNumber: string,
    public originCode: string,
    public originName: string,
    public destination: Destination,
    public boardingDate: string,
    public boardingTime: string,
    public arrivalDate: string,
    public arrivalTime: string,
    public seatCount: number,
    public takenSeats: number
  ) {}
}
