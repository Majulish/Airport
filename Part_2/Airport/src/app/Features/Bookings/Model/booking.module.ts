export class Booking {
  constructor(
    public bookingId: string,
    public flightNo: string,
    public passengers: { name: string; passportId: string }[],
    public passengerCount: number
  ) {}
}
