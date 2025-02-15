export class BookingWithFlightData {
  constructor(
    public bookingId: string,
    public flightNumber: string,
    public passengers: { name: string; passportId: string }[],
    public passengerCount: number,
    public origin: string,
    public arrival: string,
    public image: string,
    public boardingTime: string,
    public landingTime: string,
  ) {
  }
}
