import { Routes } from '@angular/router';
import { MyBookingsComponent } from './Features/Bookings/Pages/my-bookings/my-bookings.component';
import { ViewBookingComponent } from './Features/Bookings/Pages/view-booking/view-booking.component';
import {HomePageComponent} from './Features/Home/home-page/home-page.component';
import {ManageFlightsComponent} from './Features/Flights/Pages/manage-flights/manage-flights.component';
import {
  ManageDestinationsComponent
} from './Features/Destinations/Pages/manage-destinations/manage-destinations.component';
import {HelpComponent} from './Features/Help/help/help.component';
import {BookFlightComponent} from './Features/Bookings/Pages/book-flight/book-flight.component';
import {EditFlightComponent} from './Features/Flights/Pages/edit-flight/edit-flight.component';
import {EditDestinationComponent} from './Features/Destinations/Pages/edit-destination/edit-destination.component';
import {ViewFlightDetailsComponent} from './Features/Bookings/Pages/view-flight-details/view-flight-details.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent},
  { path: 'user/book-a-flight', component: BookFlightComponent },
  { path: 'user/my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'admin/manage-flights', component: ManageFlightsComponent },
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'book-flight/:flightNumber', component: ViewFlightDetailsComponent },
  { path: 'admin/manage-destinations', component: ManageDestinationsComponent },
  { path: 'edit-destination/:code', component: EditDestinationComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/home-page' }
];

