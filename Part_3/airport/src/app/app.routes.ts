import { Routes} from '@angular/router';
import { MyBookingsComponent } from './Features/Bookings/Pages/my-bookings/my-bookings.component';
import {HomePageComponent} from './Features/Home/home-page/home-page.component';
import {ManageFlightsComponent} from './Features/Flights/Pages/manage-flights/manage-flights.component';
import {
  ManageDestinationsComponent
} from './Features/Destinations/Pages/manage-destinations/manage-destinations.component';
import {HelpComponent} from './Features/Help/help/help.component';
import {ManageBookingsComponent} from './Features/Bookings/Pages/manage-bookings/manage-bookings.component';
import {EditFlightComponent} from './Features/Flights/Pages/edit-flight/edit-flight.component';
import {ViewFlightComponent} from './Features/Flights/Pages/view-flight/view-flight.component';
import {EditDestinationComponent} from './Features/Destinations/Pages/edit-destination/edit-destination.component';
import {ViewBookingComponent} from './Features/Bookings/Pages/view-booking/view-booking.component';
import {AddDestinationComponent} from "./Features/Destinations/Pages/add-destination/add-destination.component";
import {ViewDestinationComponent} from './Features/Destinations/Pages/view-destination/view-destination.component';
import {BookFlightComponent} from "./Features/Bookings/Pages/book-flight/book-flight.component";
import {AddFlightComponent} from './Features/Flights/Pages/add-flight/add-flight.component';
import {ManageCouponsComponent} from './Features/Coupon/Pages/manage-coupons/manage-coupons.component';
import {EditCouponComponent} from './Features/Coupon/Pages/edit-coupon/edit-coupon.component';
import {ViewCouponComponent} from './Features/Coupon/Pages/view-coupon/view-coupon.component';
import {AddCouponComponent} from './Features/Coupon/Pages/add-coupon/add-coupon.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent},
  { path: 'user/book-a-flight', component: ManageBookingsComponent },
  { path: 'user/my-bookings', component: MyBookingsComponent },
  { path: 'view-booking/:id', component: ViewBookingComponent },
  { path: 'user/manage-bookings', component: ManageBookingsComponent },
  { path: 'admin/manage-flights', component: ManageFlightsComponent },
  { path: 'admin/manage-coupons', component: ManageCouponsComponent},
  { path: 'edit-coupon/:code', component: EditCouponComponent},
  { path: 'view-coupon/:code', component: ViewCouponComponent},
  { path: 'add-coupon', component: AddCouponComponent },
  { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
  { path: 'view-flight/:flightNumber', component: ViewFlightComponent },
  { path: 'add-flight', component: AddFlightComponent},
  { path: 'book-flight/:flightNumber', component: BookFlightComponent },
  { path: 'admin/manage-destinations', component: ManageDestinationsComponent },
  { path: 'add-destination', component: AddDestinationComponent },
  { path: 'edit-destination/:code', component: EditDestinationComponent },
  { path: 'view-destination/:code', component: ViewDestinationComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/home-page' }
];

