import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Booking } from '../../Model/booking.module';
import { BookingService } from '../../Service/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view-booking-details',
  imports: [CommonModule],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css',
  standalone: true
})
export class ViewBookingComponent implements OnInit {

  booking: Booking | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      try {
        console.log(`Fetching booking with ID: ${bookingId}`);
        this.booking = await this.bookingService.getBookingById(bookingId);

        if (!this.booking) {
          this.showBookingNotFoundDialog(bookingId);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        this.showBookingNotFoundDialog(bookingId);
      }
    } else {
      console.error('No booking ID found in route parameters!');
      this.showBookingNotFoundDialog('Invalid Booking ID');
    }
  }

  private showBookingNotFoundDialog(bookingId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '404 - Booking Not Found',
        message: `The booking with ID "${bookingId}" does not exist.`,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/user/my-bookings']);
    });
  }
}
