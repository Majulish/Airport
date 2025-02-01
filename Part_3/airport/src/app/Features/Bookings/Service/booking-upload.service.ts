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
        { name: 'John Smith', passportId: 'P9876543' },
        { name: 'Alice Johnson', passportId: 'P9876544' },
      ], 2),
      new Booking('B002', 'LAX456', [
        { name: 'Michael Brown', passportId: 'P1234567' },
        { name: 'Emily Davis', passportId: 'P1234568' },
      ], 2),
      new Booking('B003', 'LHR789', [
        { name: 'William Wilson', passportId: 'P1122334' },
        { name: 'Sophia Taylor', passportId: 'P1122335' },
      ], 2),
      new Booking('B004', 'DXB101', [
        { name: 'Olivia Martinez', passportId: 'P9988776' },
        { name: 'Liam Garcia', passportId: 'P9988777' },
      ], 2),
      new Booking('B005', 'HND202', [
        { name: 'Benjamin Lee', passportId: 'P4455667' },
        { name: 'Emma Anderson', passportId: 'P4455668' },
      ], 2),
      new Booking('B006', 'SYD303', [
        { name: 'Charlotte Moore', passportId: 'P5566778' },
        { name: 'Lucas White', passportId: 'P5566779' },
      ], 2),
      new Booking('B007', 'CDG404', [
        { name: 'James Harris', passportId: 'P6677889' },
        { name: 'Amelia Thompson', passportId: 'P6677880' },
      ], 2),
      new Booking('B008', 'SFO505', [
        { name: 'Henry Jackson', passportId: 'P7788990' },
        { name: 'Evelyn Martin', passportId: 'P7788991' },
      ], 2),
      new Booking('B009', 'SIN606', [
        { name: 'Alexander Perez', passportId: 'P8899002' },
        { name: 'Isabella Roberts', passportId: 'P8899003' },
      ], 2),
      new Booking('B010', 'FCO707', [
        { name: 'Daniel Clark', passportId: 'P9900114' },
        { name: 'Mia Wright', passportId: 'P9900115' },
      ], 2),
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
