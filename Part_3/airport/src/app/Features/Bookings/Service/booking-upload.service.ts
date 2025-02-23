import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { Booking } from '../Model/booking.module';

@Injectable({
  providedIn: 'root',
})
export class BookingUploadService {
  private bookings: Booking[] = [];

  constructor(private firestore: Firestore) {
    this.initializeBookings();
  }

  private initializeBookings(): void {
    this.bookings = [
      new Booking('B001', 'NYC123', [
        { name: 'John Smith', passportId: '987654312' },
        { name: 'Alice Johnson', passportId: '987654412' },
      ], 2, true),
      new Booking('B002', 'LAX456', [
        { name: 'Michael Brown', passportId: '123456789' },
        { name: 'Emily Davis', passportId: '123456812' },
      ], 2, true),
      new Booking('B003', 'LHR789', [
        { name: 'William Wilson', passportId: '112233412' },
        { name: 'Sophia Taylor', passportId: '112233512' },
      ], 2, true),
      new Booking('B004', 'DXB101', [
        { name: 'Olivia Martinez', passportId: '998877612' },
        { name: 'Liam Garcia', passportId: '998877712' },
      ], 2, true),
      new Booking('B005', 'HND202', [
        { name: 'Benjamin Lee', passportId: '445566712' },
        { name: 'Emma Anderson', passportId: '445566812' },
      ], 2, true),
      new Booking('B006', 'SYD303', [
        { name: 'Charlotte Moore', passportId: '556677812' },
        { name: 'Lucas White', passportId: '556677912' },
      ], 2, true),
      new Booking('B007', 'CDG404', [
        { name: 'James Harris', passportId: '667788912' },
        { name: 'Amelia Thompson', passportId: '667788012' },
      ], 2, true),
      new Booking('B008', 'SFO505', [
        { name: 'Henry Jackson', passportId: '778899012' },
        { name: 'Evelyn Martin', passportId: '778899112' },
      ], 2, true),
      new Booking('B009', 'SIN606', [
        { name: 'Alexander Perez', passportId: '889900212' },
        { name: 'Isabella Roberts', passportId: '889900312' },
      ], 2, true),
      new Booking('B010', 'FCO707', [
        { name: 'Daniel Clark', passportId: '990011412' },
        { name: 'Mia Wright', passportId: '990011512' },
      ], 2, true),
    ];
  }

  async uploadBookings(): Promise<void> {
    const bookingCollection = collection(this.firestore, 'Booking');
    for (const booking of this.bookings) {
      await setDoc(doc(bookingCollection, booking.bookingId), booking.toPlainObject());
    }
    console.log('Bookings uploaded successfully!');
  }
}
