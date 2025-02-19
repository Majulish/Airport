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
import {ConfirmationDialogComponent} from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: true,
  imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, CommonModule, MatButtonModule, MatDialogModule]
})
export class MyBookingsComponent implements OnInit {
  upcomingBookings: BookingWithFlightData[] = [];
  previousBookings: BookingWithFlightData[] = [];

  constructor(private bookingService: BookingService, private router: Router, private dialog: MatDialog) {}

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

    // Show confirmation dialog before toggling status
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: newStatus ? 'Enable Booking' : 'Disable Booking',
        message: `Are you sure you want to ${newStatus ? 'enable' : 'disable'} this booking?`,
        confirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          // Fetch flight status
          const flightStatus = await this.bookingService.getFlightStatus(booking.flightNumber);

          // Prevent enabling if the flight is disabled
          if (newStatus && !flightStatus.isActive) {
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Cannot Enable Booking',
                message: 'The flight associated with this booking is currently disabled. Please enable the flight first.',
              },
            });
            return;
          }

          // Update booking status
          await this.bookingService.updateBookingStatus(booking.bookingId, newStatus);
          booking.isActive = newStatus; // Update UI

        } catch (error) {
          console.error('Error updating booking status:', error);
        }
      }
    });
  }

}
