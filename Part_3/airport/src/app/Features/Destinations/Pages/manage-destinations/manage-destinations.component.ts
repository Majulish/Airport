import { Firestore, collection, getDocs, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
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
    private firestore: Firestore,
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

  async confirmDelete(code: string): Promise<void> {
    try {
      console.log(`Checking flights for destination: ${code}`);

      // 🔹 Check if any flight has this destination as origin or arrival
      const flightsQuery = query(
          collection(this.firestore, 'Flight'),
          where('originCode', '==', code)
      );
      const flightsQueryArrival = query(
          collection(this.firestore, 'Flight'),
          where('arrivalCode', '==', code)
      );

      const [originFlightsSnapshot, arrivalFlightsSnapshot] = await Promise.all([
        getDocs(flightsQuery),
        getDocs(flightsQueryArrival),
      ]);

      const totalFlights = originFlightsSnapshot.size + arrivalFlightsSnapshot.size;

      console.log(`Found ${totalFlights} flights for destination ${code}`);

      if (totalFlights > 0) {
        console.warn(`🚫 Destination ${code} is used in flights and cannot be deleted.`);
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Cannot Delete Destination',
            message: `❌ This destination is used in ${totalFlights} flights and cannot be deleted.`,
          },
        });

        return; // 🚀 Stop execution if the destination is used
      }

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Delete Destination',
          message: 'Are you sure you want to delete this destination? This action cannot be undone.',
          confirmation: true, // Enables "Yes/No" options
        },
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          try {
            console.log(`🗑️ Deleting destination: ${code}`);
            await deleteDoc(doc(this.firestore, `Destination/${code}`));
            this.destinations = this.destinations.filter(dest => dest.code !== code);
            this.filteredDestinations = [...this.destinations];

            console.log(`✅ Destination ${code} deleted successfully.`);
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Destination Deleted',
                message: `Destination ${code} was successfully deleted.`,
              },
            });
          } catch (error) {
            console.error('❌ Error deleting destination:', error);
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Error',
                message: 'An error occurred while deleting the destination. Please try again.',
              },
            });
          }
        } else {
          console.log('🚫 Deletion canceled by user.');
        }
      });
    } catch (error) {
      console.error('❌ Error checking flights:', error);
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Error',
          message: 'Failed to check flights associated with this destination. Please try again.',
        },
      });
    }
  }


  navigateToView(code: string): void {
    this.router.navigate(['/view-destination', code]);
  }

  navigateToEdit(code: string): void {
    this.router.navigate(['/edit-destination', code]);
  }
}
