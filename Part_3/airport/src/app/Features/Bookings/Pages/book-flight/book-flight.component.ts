import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { FlightWithDestination } from '../../../Flights/Model/flight-with-destination.module';
import { BookingService } from '../../Service/booking.service';
import { CouponService } from '../../../Coupon/Service/coupon.service';
import { DestinationsService } from '../../../Destinations/Service/destinations.service';
import { MatStepperModule } from '@angular/material/stepper';
import { LuggageSelectionModalComponent } from '../../../components/luggage-selection-modal/luggage-selection-modal.component';

@Component({
  selector: 'book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    FormsModule,
    MatStepperModule
  ],
})
export class BookFlightComponent implements OnInit {
  flight: FlightWithDestination | null = null;
  flightNumber: string | null = null;
  passengerCount: number = 1;
  passengers: { 
    name: string; 
    passportId: string; 
    luggage?: { 
      type1: number, 
      type2: number, 
      type3: number 
    } 
  }[] = [];
  couponCode: string = '';
  discountedPrice: number | null = null;
  couponError: string | null = null;
  appliedCoupon: boolean = false;
  luggagePrices = {
    type1: 25, // Cabin baggage (8kg)
    type2: 50, // Checked baggage (23kg)
    type3: 100 // Heavy baggage (32kg)
  };
  totalLuggagePrice: number = 0;
  totalBookingPrice: number = 0;
  
  // For stepper linear mode
  isPassengerDetailsValid: boolean = false;
  isLuggageSelectionValid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    private dialog: MatDialog,
    private bookingService: BookingService,
    private destinationService: DestinationsService,
    private couponService: CouponService
  ) {}

  async ngOnInit() {
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (this.flightNumber) {
      const flightFound = await this.getFlightDetails(this.flightNumber);
      if (flightFound) {
        this.updatePassengerCount();
      }
    }
  }

  async applyCoupon() {
    if (this.appliedCoupon) {
      this.couponError = 'Only one coupon can be used per order!';
      return;
    }

    if (!this.flightNumber) {
      this.couponError = 'Error: No flight selected!';
      return;
    }

    try {
      const couponData = await this.couponService.getCouponByCode(this.couponCode);

      if (!couponData || !couponData.isActive) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Invalid Coupon',
            message: 'This coupon is either disabled or does not exist.',
          },
        }).afterClosed().subscribe(() => {
          this.couponCode = ''; // Clear coupon input field
        });
        return;
      }

      const flightPrice = await this.bookingService.calculateTotalPrice(this.flightNumber, this.passengerCount);
      this.totalBookingPrice = flightPrice + this.totalLuggagePrice;
      const discounted = await this.couponService.applyCoupon(this.couponCode, this.totalBookingPrice);

      if (discounted === null) {
        this.couponError = 'Invalid or expired coupon!';
        this.couponCode = ''; // Clear invalid coupon input
      } else {
        this.discountedPrice = discounted;
        this.appliedCoupon = true;
        this.couponError = null;
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Error',
          message: 'Failed to retrieve coupon details. Please try again.',
        },
      });
    }
  }

  async getFlightDetails(flightNumber: string): Promise<boolean> {
    const flightRef = doc(this.firestore, `Flight/${flightNumber}`);
    const flightSnap = await getDoc(flightRef);

    if (!flightSnap.exists()) {
      console.error('❌ Flight not found!');

      // Show 404 dialog and redirect to My Bookings
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: '404 - Flight Not Found',
          message: `The flight with number "${flightNumber}" does not exist.`,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/user/manage-bookings']); // Redirect to bookings page after clicking OK
      });

      return false;
    }

    const flightData = flightSnap.data();
    const [origin, arrival] = await Promise.all([
      this.destinationService.get(flightData['originCode']),
      this.destinationService.get(flightData['arrivalCode'])
    ]);

    this.flight = new FlightWithDestination(
      flightNumber,
      origin,
      arrival,
      flightData['boardingDate'].toDate(),
      flightData['arrivalDate'].toDate(),
      flightData['seatCount'],
      flightData['takenSeats'],
      flightData['price'],
      flightData['isActive']
    );

    return true;
  }

  updatePassengerCount() {
    if (this.passengerCount > this.getAvailableSeats()) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Insufficient Seats',
          message: `Only ${this.getAvailableSeats()} seats are available.`,
        },
      });
      this.passengerCount = this.getAvailableSeats();
    }

    this.passengers = Array.from({ length: this.passengerCount }, () => ({
      name: '',
      passportId: '',
      luggage: {
        type1: 0,
        type2: 0,
        type3: 0
      }
    }));

    this.updateTotalLuggagePrice();
  }

  getAvailableSeats(): number {
    return this.flight ? this.flight.seatCount - this.flight.takenSeats : 0;
  }

  generateBookingId(): string {
    return 'B' + Math.floor(1000 + Math.random() * 9000).toString();
  }

  validatePassengerDetails(): boolean {
    // Check if all passenger names and passport IDs are filled
    const allFieldsFilled = this.passengers.every(
      p => p.name.trim() !== '' && p.passportId.trim() !== ''
    );

    if (!allFieldsFilled) {
      return false;
    }

    // Validate Passenger Name (only letters)
    const nameRegex = /^[A-Za-z\s]+$/;
    for (const passenger of this.passengers) {
      if (!nameRegex.test(passenger.name)) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Invalid Passenger Name',
            message: 'Passenger names must contain only letters and spaces.',
          },
        });
        return false;
      }
    }

    // Validate Passport ID (exactly 9 digits)
    const passportRegex = /^\d{9}$/;
    const passportSet = new Set();
    for (const passenger of this.passengers) {
      if (!passportRegex.test(passenger.passportId)) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Invalid Passport ID',
            message: 'Passport ID must be exactly 9 digits.',
          },
        });
        return false;
      }
      if (passportSet.has(passenger.passportId)) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Duplicate Passport ID',
            message: 'Each passport ID must be unique. Please check your entries.',
          },
        });
        return false;
      }
      passportSet.add(passenger.passportId);
    }

    this.isPassengerDetailsValid = true;
    return true;
  }

  openLuggageSelectionModal(passengerIndex: number) {
    const passenger = this.passengers[passengerIndex];
    
    const dialogRef = this.dialog.open(LuggageSelectionModalComponent, {
      width: '500px',
      data: {
        passengerName: passenger.name,
        luggage: { ...passenger.luggage },
        luggagePrices: this.luggagePrices
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.passengers[passengerIndex].luggage = result;
        this.updateTotalLuggagePrice();
      }
    });
  }

  updateTotalLuggagePrice() {
    this.totalLuggagePrice = this.passengers.reduce((total, passenger) => {
      if (!passenger.luggage) return total;
      
      return total + 
        (passenger.luggage.type1 * this.luggagePrices.type1) +
        (passenger.luggage.type2 * this.luggagePrices.type2) +
        (passenger.luggage.type3 * this.luggagePrices.type3);
    }, 0);

    this.updateTotalBookingPrice();
  }

  async updateTotalBookingPrice() {
    if (!this.flightNumber) return;
    
    const flightPrice = await this.bookingService.calculateTotalPrice(this.flightNumber, this.passengerCount);
    this.totalBookingPrice = flightPrice + this.totalLuggagePrice;
    
    // If coupon is applied, recalculate the discounted price
    if (this.appliedCoupon && this.couponCode) {
      this.discountedPrice = await this.couponService.applyCoupon(this.couponCode, this.totalBookingPrice);
    }
  }

  getLuggageCount(passengerIndex: number): number {
    const luggage = this.passengers[passengerIndex].luggage;
    if (!luggage) return 0;
    
    return luggage.type1 + luggage.type2 + luggage.type3;
  }

  getTotalLuggagePriceForPassenger(passengerIndex: number): number {
    const luggage = this.passengers[passengerIndex].luggage;
    if (!luggage) return 0;
    
    return (luggage.type1 * this.luggagePrices.type1) +
           (luggage.type2 * this.luggagePrices.type2) +
           (luggage.type3 * this.luggagePrices.type3);
  }

  validateLuggageSelection(): boolean {
    // No validation requirements for luggage, it's optional
    this.isLuggageSelectionValid = true;
    return true;
  }

  async confirmBooking() {
    if (!this.flight || this.passengerCount < 1) return;

    try {
      const bookingId = this.generateBookingId();
      const bookingRef = doc(this.firestore, `Booking/${bookingId}`);

      const existingBooking = await getDoc(bookingRef);
      if (existingBooking.exists()) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Error',
            message: `Booking ID ${bookingId} already exists. Please try again.`,
          },
        });
        return;
      }

      if (!this.flightNumber) {
        console.error("Error: Flight number is missing.");
        return;
      }

      // Calculate final price based on flight price, luggage, and any applied coupon
      await this.updateTotalBookingPrice();
      let finalPrice = this.totalBookingPrice;
      
      if (this.appliedCoupon && this.discountedPrice !== null) {
        finalPrice = this.discountedPrice;
        await this.couponService.updateCouponUsage(this.couponCode);
      }

      await setDoc(bookingRef, {
        bookingId: bookingId,
        flightNo: this.flightNumber,
        numOfPassengers: this.passengerCount,
        passengers: this.passengers,
        totalPrice: finalPrice,
        couponUsed: this.appliedCoupon ? this.couponCode : null,
        isActive: true
      });

      const flightRef = doc(this.firestore, `Flight/${this.flightNumber}`);
      await updateDoc(flightRef, {
        takenSeats: this.flight.takenSeats + this.passengerCount,
      });

      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Booking Successful',
          message: `You have successfully booked ${this.passengerCount} seat(s) on flight ${this.flightNumber}.\n\nTotal Price: ${finalPrice}$.`
        },
      });

      this.router.navigate(['/my-bookings']);
    } catch (error) {
      console.error('Error during booking:', error);
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Error',
          message: 'An error occurred while booking your flight. Please try again.',
        },
      });
    }
  }
}