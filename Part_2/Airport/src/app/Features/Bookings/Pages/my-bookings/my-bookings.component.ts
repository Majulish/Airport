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
import {MatButton, MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, CommonModule, MatButton, MatButtonModule]
})
export class MyBookingsComponent implements OnInit {
  upcomingBookings: any[] = [];
  previousBookings: any[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.upcomingBookings = this.bookingService.getBookingsByTime(true);
    this.previousBookings = this.bookingService.getBookingsByTime(false);
  }

  viewBooking(id: string): void {
    this.router.navigate(['view-booking', id]);
  }
}
