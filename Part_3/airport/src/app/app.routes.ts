import { Routes} from '@angular/router';
import { MyBookingsComponent } from './Features/Bookings/Pages/my-bookings/my-bookings.component';
import {HomePageComponent} from './Features/Home/home-page/home-page.component';
import {ManageFlightsComponent} from './Features/Flights/Pages/manage-flights/manage-flights.component';
import {
  ManageDestinationsComponent
} from './Features/Destinations/Pages/manage-destinations/manage-destinations.component';
import {HelpComponent} from './Features/Help/help/help.component';
import {BookFlightComponent} from './Features/Bookings/Pages/book-flight/book-flight.component';
import {EditFlightComponent} from './Features/Flights/Pages/edit-flight/edit-flight.component';
import {ViewFlightComponent} from './Features/Flights/Pages/view-flight/view-flight.component';
import {EditDestinationComponent} from './Features/Destinations/Pages/edit-destination/edit-destination.component';
import {ViewBookingComponent} from './Features/Bookings/Pages/view-booking/view-booking.component';
import {AddDestinationComponent} from "./Features/Destinations/Pages/add-destination/add-destination.component";
import {ViewDestinationComponent} from './Features/Destinations/Pages/view-destination/view-destination.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent},
  { path: 'user/book-a-flight', component: BookFlightComponent },
  { path: 'user/my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'admin/manage-flights', component: ManageFlightsComponent },
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'view-flight/:flightNumber', component: ViewFlightComponent },
  { path: 'book-flight/:flightNumber', component: ViewFlightComponent },
  { path: 'admin/manage-destinations', component: ManageDestinationsComponent },
  { path: 'add-destination', component: AddDestinationComponent },
  { path: 'edit-destination/:code', component: EditDestinationComponent },
  { path: 'view-destination/:code', component: ViewDestinationComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/home-page' }
];

