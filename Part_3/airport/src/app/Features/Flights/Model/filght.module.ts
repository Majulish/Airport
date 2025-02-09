export class Flight {
  constructor(
    public flightNumber: string,
    public originCode: string,
    public arrivalCode: string,
    public boardingDate: string,
    public boardingTime: string,
    public arrivalDate: string,
    public arrivalTime: string,
    public seatCount: number,
    public takenSeats: number
  ) {}
}
