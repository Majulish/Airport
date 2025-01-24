import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { HeaderComponent } from './Shared/header/header.component'
import { FooterComponent } from './Shared/footer/footer.component';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from './Shared/menu/menu.component'
import {NgClass, NgIf} from '@angular/common';
import {DestinationsService} from './Features/Destinations/Service/destinations.service';
import {FlightService} from './Features/Flights/Service/flights.service';
import {BookingService} from './Features/Bookings/Service/booking.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
    private destinationsService: DestinationsService,
    private flightService: FlightService,
    private bookingService: BookingService
  ) {}

  async ngOnInit() {
    await this.destinationsService.uploadDestinations();
    await this.flightService.uploadFlights();
    await this.bookingService.uploadBookings();
  }

  onMenuItemClick(): void {
    if (this.matDrawer) {
      this.matDrawer.close();
    }
  }
}

