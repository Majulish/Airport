import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule for routerLink

@Component({
  selector: 'app-manage-destinations',
  templateUrl: './manage-destinations.component.html',
  styleUrls: ['./manage-destinations.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule] // ✅ Add RouterModule here
})
export class ManageDestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  searchTerm: string = '';

  constructor(
    private destinationsService: DestinationsService,
    private dialog: MatDialog,
    private router: Router
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Destination',
        message: 'Are you sure you want to delete this destination? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.destinationsService.deleteDestination(code);
          this.destinations = this.destinations.filter(dest => dest.code !== code);
        } catch (error) {
          let errorMessage = 'An unexpected error occurred.';

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Error: Cannot Delete Destination',
              message: errorMessage
            }
          });
        }
      }
    });
  }

  navigateToView(code: string): void {
    this.router.navigate(['/view-destination', code]);
  }

  navigateToEdit(code: string): void {
    this.router.navigate(['/edit-destination', code]);
  }
}
