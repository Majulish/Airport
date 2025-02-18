import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../Service/booking.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {CommonModule, formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {BookingWithFlightData} from "../../Model/bookingWithFlightData.module";
import { format } from 'date-fns';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, CommonModule, MatButtonModule]
})
export class MyBookingsComponent implements OnInit {
  upcomingBookings: BookingWithFlightData[] = [];
  previousBookings: BookingWithFlightData[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const allBookings = await this.bookingService.getAllBookings();
    const now = new Date();

    this.upcomingBookings = allBookings
      .filter(booking => new Date(booking.boardingTime) > now)
      .map(this.formatBookingDates.bind(this));

    this.previousBookings = allBookings
      .filter(booking => new Date(booking.boardingTime) < now)
      .map(this.formatBookingDates.bind(this));
  }

  viewBooking(id: string): void {
    this.router.navigate(['view-booking', id]);
  }

  private formatBookingDates(booking: BookingWithFlightData): BookingWithFlightData {
    return {
      ...booking,
      boardingTime: this.formatDate(booking.boardingTime),
      landingTime: this.formatDate(booking.landingTime),
    };
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd-MM-yyyy HH:mm');
  }

  async toggleBookingStatus(booking: BookingWithFlightData): Promise<void> {
    const newStatus = !booking.isActive;

    try {
      await this.bookingService.updateBookingStatus(booking.bookingId, newStatus);
      booking.isActive = newStatus; // Update the UI immediately
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }
}
