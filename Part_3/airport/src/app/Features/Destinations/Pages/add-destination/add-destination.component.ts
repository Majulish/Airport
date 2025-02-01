import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import {FormsModule} from "@angular/forms";
import {ConfirmationDialogComponent} from "../../../../Utilities/confirmation-dialog/confirmation-dialog.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.css'],
  standalone: true,
  imports:[CommonModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
})
export class AddDestinationComponent {
  newDestination: Destination = new Destination('', '', '', '', '');
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
      public router: Router,
      private destinationsService: DestinationsService,
      private dialog: MatDialog
  ) {}

  confirmAndSave() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { title: 'Confirm Save', message: 'Are you sure you want to save this destination?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addDestination();
      } else {
        this.goBack();
      }
    });
  }

  async addDestination(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (
        !this.newDestination.code ||
        !this.newDestination.name ||
        !this.newDestination.airportName ||
        !this.newDestination.airportUrl ||
        !this.newDestination.imageUrl
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    try {
      const existingDestination = await this.destinationsService.checkDestinationExists(
          this.newDestination.code,
          this.newDestination.name
      );

      if (existingDestination) {
        this.errorMessage = 'A destination with the same code or name already exists.';
        return;
      }

      await this.destinationsService.addDestination(this.newDestination);
      this.successMessage = 'Destination saved successfully!';
      setTimeout(() => this.router.navigate(['/admin/manage-destinations']), 2000);
    } catch (error) {
      console.error('Error adding destination:', error);
      this.errorMessage = 'Failed to save destination. Please try again.';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/manage-destinations']);
  }
}
