import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Booking} from '../../Model/booking.module';
import {BookingService} from '../../Service/booking.service';

@Component({
  selector: 'app-view-booking-details',
  imports: [CommonModule],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css',
  standalone: true
})
export class ViewBookingComponent {

  booking: Booking | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  async ngOnInit(): Promise<void> {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.booking = await this.bookingService.getBookingById(bookingId);
    }
  }
}
