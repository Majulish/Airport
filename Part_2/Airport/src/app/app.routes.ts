import { Routes } from '@angular/router';
import { BookFlightComponent } from './Features/Bookings/Pages/book-flight/book-flight.component';
import { MyBookingsComponent } from './Features/Bookings/Pages/my-bookings/my-bookings.component';
import { ViewBookingComponent } from './Features/Bookings/Pages/view-booking/view-booking.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/book-flight', pathMatch: 'full' },
  { path: 'book-flight', component: BookFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: '**', redirectTo: '/book-flight' }
];

