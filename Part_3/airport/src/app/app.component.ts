import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { HeaderComponent } from './Shared/header/header.component'
import { FooterComponent } from './Shared/footer/footer.component';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from './Shared/menu/menu.component'
import {DestinationsUploadService} from './Features/Destinations/Service/destinatons-upload.service';
import {FlightUploadService} from './Features/Flights/Service/flights-upload.service';
import {BookingUploadService} from './Features/Bookings/Service/booking-upload.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {CouponUploadService} from './Features/Coupon/Service/coupon-upload.service';

@Component({
  selector: 'ono-air-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    MatSidenavModule,
    MenuComponent,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  animations: [
    trigger('transform', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(100px)' })),
      transition('start <=> end', animate('300ms ease-in')),
    ]),
  ],
})
export class AppComponent implements OnInit {
  isMenuOpen = false;
  @ViewChild('drawer', { static: false }) matDrawer!: MatDrawer;

  constructor(
    private UploadDestinationsService: DestinationsUploadService ,
    private UploadFlightService: FlightUploadService,
    private uploadBookingService: BookingUploadService,
    private uploadCouponService: CouponUploadService
  ) {}

  async ngOnInit() {
    // uploading only changing data which is flights data of arrival date and departure date
    await this.UploadDestinationsService.uploadDestinations();
    await this.UploadFlightService.loadDestinationsAndInitializeFlights();
    await this.uploadBookingService.uploadBookings();
    await this.uploadCouponService.uploadCoupons();
  }

  onMenuItemClick(): void {
    if (this.matDrawer) {
      this.matDrawer.close();
    }
  }
}

