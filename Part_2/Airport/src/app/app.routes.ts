import { Routes } from '@angular/router';
import { BookFlightComponent } from './Features/Bookings/Pages/book-flight/book-flight.component';
import { MyBookingsComponent } from './Features/Bookings/Pages/my-bookings/my-bookings.component';
import { ViewBookingComponent } from './Features/Bookings/Pages/view-booking/view-booking.component';
import {HomePageComponent} from './Features/Home/home-page/home-page.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent},
  { path: 'book-flight', component: BookFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: '**', redirectTo: '/home-page' }
];

