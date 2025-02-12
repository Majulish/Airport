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
    this.upcomingBookings = allBookings.filter((booking) => new Date(booking.boardingTime) > new Date());
    this.previousBookings = allBookings.filter((booking) => new Date(booking.boardingTime) < new Date());
  }

  viewBooking(id: string): void {
    this.router.navigate(['view-booking', id]);
  }

  formatDate(date: Date): string {
    return format(date, 'dd-MM-yyyy HH:mm');
  }
}
