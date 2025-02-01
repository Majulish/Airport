import { Component, OnInit } from '@angular/core';
import {BookingService} from '../../Service/booking.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, CommonModule, MatButtonModule]
})
export class MyBookingsComponent implements OnInit {
  upcomingBookings: any[] = [];
  previousBookings: any[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    [this.upcomingBookings, this.previousBookings] = await Promise.all([
        this.bookingService.getBookingsByTime(true),
        this.bookingService.getBookingsByTime(false)
    ])
  }

  viewBooking(id: string): void {
    this.router.navigate(['view-booking', id]);
  }
}
