export class Booking {
  constructor(
    public bookingId: string,
    public flightNo: string,
    public passengers: { name: string; passportId: string }[],
    public passengerCount: number,
    public isActive: boolean
  ) {
  }

  toPlainObject() {
    return {
      bookingId: this.bookingId,
      flightNo: this.flightNo,
      passengers: this.passengers.map((p) => ({...p})),
      numOfPassengers: this.passengerCount,
      isActive: this.isActive
    };
  }
}
