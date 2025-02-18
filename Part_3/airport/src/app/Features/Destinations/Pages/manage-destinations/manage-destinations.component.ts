import {Firestore, collection, getDocs, updateDoc, doc, query, where, getDoc} from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule]
})
export class ManageDestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  searchTerm: string = '';

  constructor(
    private destinationsService: DestinationsService,
    private dialog: MatDialog,
    private router: Router,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    this.destinations = await this.destinationsService.getAllDestinations();
    this.filteredDestinations = [...this.destinations];
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDestinations = this.destinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(term) ||
        destination.code.toLowerCase().includes(term)
    );
  }

  async confirmDeactivate(code: string): Promise<void> {
    try {
      // Check if any flights are associated with this destination
      const flightsQuery = query(collection(this.firestore, 'Flight'), where('originCode', '==', code));
      const flightsQueryArrival = query(collection(this.firestore, 'Flight'), where('arrivalCode', '==', code));

      const [originFlightsSnapshot, arrivalFlightsSnapshot] = await Promise.all([
        getDocs(flightsQuery),
        getDocs(flightsQueryArrival),
      ]);

      const totalFlights = originFlightsSnapshot.size + arrivalFlightsSnapshot.size;

      if (totalFlights > 0) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Cannot Disable Destination',
            message: `This destination is used in ${totalFlights} flights and cannot be disabled.`,
          },
        });
        return;
      }

      // Confirmation dialog before disabling
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Disable Destination',
          message: 'Are you sure you want to disable this destination?',
          confirmation: true,
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          try {
            await updateDoc(doc(this.firestore, `Destinations/${code}`), { isActive: false });

            this.destinations = this.destinations.map(dest =>
              dest.code === code ? { ...dest, isActive: false } : dest
            );
            this.filteredDestinations = [...this.destinations];

            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Destination Disabled',
                message: `Destination ${code} has been successfully disabled.`,
              },
            });
          } catch (error) {
            console.error('❌ Error disabling destination:', error);
          }
        }
      });
    } catch (error) {
      console.error('❌ Error checking flights:', error);
    }
  }

  async enableDestination(code: string): Promise<void> {
    try {
      // Get reference to the destination document
      const destinationRef = doc(this.firestore, `Destinations/${code}`);
      const destinationSnapshot = await getDoc(destinationRef);

      // Check if the document exists
      if (!destinationSnapshot.exists()) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Error',
            message: `Destination ${code} does not exist in Firestore.`,
          },
        });
        return;
      }

      // Check if there are any associated flights
      const flightsQuery = query(collection(this.firestore, 'Flight'), where('originCode', '==', code));
      const flightsQueryArrival = query(collection(this.firestore, 'Flight'), where('arrivalCode', '==', code));

      const [originFlightsSnapshot, arrivalFlightsSnapshot] = await Promise.all([
        getDocs(flightsQuery),
        getDocs(flightsQueryArrival),
      ]);

      const flights = [...originFlightsSnapshot.docs, ...arrivalFlightsSnapshot.docs];

      // Check if any associated flights are disabled
      for (const flightDoc of flights) {
        const flightData = flightDoc.data();
        if (!flightData['isActive']) {
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Cannot Enable Destination',
              message: 'This destination is associated with one or more disabled flights. Enable the flights first.',
            },
          });
          return;
        }
      }

      // Confirmation dialog before enabling
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Enable Destination',
          message: 'Are you sure you want to enable this destination?',
          confirmation: true,
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          try {
            await updateDoc(destinationRef, { isActive: true });

            this.destinations = this.destinations.map(dest =>
              dest.code === code ? { ...dest, isActive: true } : dest
            );
            this.filteredDestinations = [...this.destinations];

            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Destination Enabled',
                message: `Destination ${code} has been successfully enabled.`,
              },
            });
          } catch (error) {
            console.error('❌ Error enabling destination:', error);
          }
        }
      });

    } catch (error) {
      console.error('❌ Error checking flights:', error);
    }
  }



  navigateToView(code: string): void {
    this.router.navigate(['/view-destination', code]);
  }

  navigateToEdit(code: string): void {
    this.router.navigate(['/edit-destination', code]);
  }
}
