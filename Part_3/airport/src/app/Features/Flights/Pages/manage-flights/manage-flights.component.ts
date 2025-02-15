import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Firestore, collection, getDocs, deleteDoc, doc, query, where, getDoc} from '@angular/fire/firestore';
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

  async confirmDelete(flightNumber: string): Promise<void> {
    try {
      console.log(`Checking reservations for flight: ${flightNumber}`);

      const bookingQuery = query(collection(this.firestore, 'Booking'), where('flightNo', '==', flightNumber));
      const bookingsSnapshot = await getDocs(bookingQuery);

      console.log(`Found ${bookingsSnapshot.size} reservations for flight ${flightNumber}`);

      if (!bookingsSnapshot.empty) {
        console.warn(`🚫 Flight ${flightNumber} has reservations and cannot be deleted.`);

        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Cannot Delete Flight',
            message: `❌ This flight has ${bookingsSnapshot.size} active reservations and cannot be deleted.`,
          },
        });

        return;
      }

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Delete Flight',
          message: 'Are you sure you want to delete this flight? This action cannot be undone.',
          confirmation: true,
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          try {
            console.log(`🗑️ Deleting flight: ${flightNumber}`);
            await deleteDoc(doc(this.firestore, `Flight/${flightNumber}`));

            this.flights = this.flights.filter(flight => flight.flightNumber !== flightNumber);
            this.filteredFlights = [...this.flights];

            console.log(`✅ Flight ${flightNumber} deleted successfully.`);

            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Flight Deleted',
                message: `Flight ${flightNumber} was successfully deleted.`,
              },
            });
          } catch (error) {
            console.error('❌ Error deleting flight:', error);

            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Error',
                message: 'An error occurred while deleting the flight. Please try again.',
              },
            });
          }
        } else {
          console.log('🚫 Deletion canceled by user.');
        }
      });
    } catch (error) {
      console.error('❌ Error checking reservations:', error);

      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Error',
          message: 'Failed to check flight reservations. Please try again.',
        },
      });
    }
  }

  navigateToView(flightNumber: string): void {
    this.router.navigate([`/view-flight/${flightNumber}`]);
  }

  navigateToEdit(flightNumber: string): void {
    this.router.navigate([`/edit-flight/${flightNumber}`]);
  }
}
