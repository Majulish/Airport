export class Flight {
  constructor(
    public flightNumber: string,
    public originCode: string,
    public arrivalCode: string,
    public boardingDate: Date,
    public arrivalDate: Date,
    public seatCount: number,
    public takenSeats: number,
    public isActive: boolean
  ) {}
}
