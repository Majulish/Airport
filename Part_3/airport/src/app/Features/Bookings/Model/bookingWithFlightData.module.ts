export class BookingWithFlightData {
  constructor(
    public bookingId: string,
    public flightNumber: string,
    public passengers: { 
      name: string; 
      passportId: string; 
      luggage: { 
        type1: number, 
        type2: number, 
        type3: number 
      } 
    }[],
    public totalPrice: number,
    public passengerCount: number,
    public origin: string,
    public arrival: string,
    public image: string,
    public boardingTime: string,
    public landingTime: string,
    public isActive: boolean,
  ) {
  }
}