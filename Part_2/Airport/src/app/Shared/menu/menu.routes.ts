import { Routes } from '@angular/router';
import { BookFlightComponent } from '../../Features/Bookings/Pages/book-flight/book-flight.component'
import {HelpComponent} from '../../Features/Help/help/help.component'
import { MyBookingsComponent } from '../../Features/Bookings/Pages/my-bookings/my-bookings.component';
import { ManageDestinationsComponent } from '../../Features/Destinations/Pages/manage-destinations/manage-destinations.component';
import { ViewBookingComponent } from '../../Features/Bookings/Pages/view-booking/view-booking.component';
import { ManageFlightsComponent } from '../../Features/Flights/Pages/manage-flights/manage-flights.component';

export const menuRoutes: Routes = [
  { path: '', redirectTo: '/book-flight', pathMatch: 'full'},
  { path: 'book-flight', component: BookFlightComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'admin/manage/flights', component: ManageFlightsComponent },
  { path: 'admin/manage/destinations', component: ManageDestinationsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/book-flight' },
];
