import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Firestore, collection, getDocs, deleteDoc, doc, query, where, getDoc, setDoc} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { FlightWithDestination } from '../../Model/flight-with-destination.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {Timestamp} from 'firebase/firestore';

@Component({
  selector: 'app-manage-flights',
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule]
})
export class ManageFlightsComponent implements OnInit {
  flights: FlightWithDestination[] = [];
  filteredFlights: FlightWithDestination[] = [];
  searchTerm: string = '';

  constructor(
      private firestore: Firestore,
      private dialog: MatDialog,
      private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadFlights();
  }

  async loadFlights(): Promise<void> {
    try {
      const flightsCollectionRef = collection(this.firestore, 'Flight');
      const querySnapshot = await getDocs(flightsCollectionRef);

      this.flights = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const flightData = docSnapshot.data();
            return {
              flightNumber: flightData['flightNumber'],
              origin: await this.getDestinationByCode(flightData['originCode']),
              arrival: await this.getDestinationByCode(flightData['arrivalCode']),
              boardingDate: (flightData['boardingDate'] as unknown as Timestamp).toDate(),
              arrivalDate: (flightData['arrivalDate']as unknown as Timestamp).toDate(),
              seatCount: flightData['seatCount'],
              takenSeats: flightData['takenSeats'],
              price: flightData['price'],
              isActive: flightData['isActive']
            };
          })
      );

      this.filteredFlights = [...this.flights];
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  }

  private async getDestinationByCode(code: string): Promise<any> {
    try {
      if (!code) return {name: 'Unknown', code};
      const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
      const destinationSnapshot = await getDoc(destinationDocRef);
      return destinationSnapshot.exists()
          ? destinationSnapshot.data()
          : {name: 'Unknown Destination', code};
    } catch (error) {
      console.error('Error fetching destination:', error);
      return {name: 'Error Loading', code};
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredFlights = this.flights.filter(
        (flight) =>
            flight.origin?.name.toLowerCase().includes(term) ||
            flight.arrival?.name.toLowerCase().includes(term)
    );
  }

  async disableFlight(flightNumber: string): Promise<void> {
    try {
      // Check if flight has active bookings
      const bookingQuery = query(collection(this.firestore, 'Booking'), where('flightNo', '==', flightNumber), where('isActive', '==', true));
      const bookingsSnapshot = await getDocs(bookingQuery);

      if (!bookingsSnapshot.empty) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Cannot Disable Flight',
            message: `This flight has ${bookingsSnapshot.size} active bookings and cannot be disabled.`,
          },
        });
        return;
      }

      // Confirm action
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Disable Flight',
          message: 'Are you sure you want to disable this flight?',
          confirmation: true,
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          const flightRef = doc(this.firestore, 'Flight', flightNumber);
          await setDoc(flightRef, { isActive: false }, { merge: true });

          this.flights = this.flights.map(flight =>
            flight.flightNumber === flightNumber ? { ...flight, isActive: false } : flight
          );
          this.filteredFlights = [...this.flights];
        }
      });

    } catch (error) {
      console.error('❌ Error disabling flight:', error);
    }
  }



  async enableFlight(flightNumber: string, originCode?: string, arrivalCode?: string): Promise<void> {
    if (!originCode || !arrivalCode) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Error',
          message: 'Missing origin or destination. Please check flight details.',
        },
      });
      return;
    }

    try {
      const originRef = doc(this.firestore, `Destinations/${originCode}`);
      const arrivalRef = doc(this.firestore, `Destinations/${arrivalCode}`);

      const [originSnapshot, arrivalSnapshot] = await Promise.all([
        getDoc(originRef),
        getDoc(arrivalRef),
      ]);

      if (!originSnapshot.exists() || !arrivalSnapshot.exists()) {
        console.error('❌ One or both destinations do not exist.');
        return;
      }

      const originData = originSnapshot.data();
      const arrivalData = arrivalSnapshot.data();

      if (!originData['isActive'] || !arrivalData['isActive']) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Cannot Enable Flight',
            message: 'Both origin and destination must be active before enabling this flight.',
          },
        });
        return;
      }

      // Confirm action
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Enable Flight',
          message: 'Are you sure you want to enable this flight?',
          confirmation: true,
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          const flightRef = doc(this.firestore, 'Flight', flightNumber);
          await setDoc(flightRef, { isActive: true }, { merge: true });

          this.flights = this.flights.map(flight =>
            flight.flightNumber === flightNumber ? { ...flight, isActive: true } : flight
          );
          this.filteredFlights = [...this.flights];
        }
      });

    } catch (error) {
      console.error('❌ Error enabling flight:', error);
    }
  }


  navigateToView(flightNumber: string): void {
    this.router.navigate([`/view-flight/${flightNumber}`]);
  }

  navigateToEdit(flightNumber: string): void {
    this.router.navigate([`/edit-flight/${flightNumber}`]);
  }
}
