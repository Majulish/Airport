import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ConfirmationDialogComponent} from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-destination',
  templateUrl: './edit-destination.component.html',
  styleUrls: ['./edit-destination.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditDestinationComponent implements OnInit {
  destination: Destination | undefined;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private destinationsService: DestinationsService,
    private router: Router,
    public dialog: MatDialog
  ) {}


  async ngOnInit(): Promise<void> {
    const destinationCode = this.route.snapshot.paramMap.get('code');
    if (destinationCode) {
      try {
        console.log('Fetching destination with code:', destinationCode); // Debugging

        this.destination = await this.destinationsService.get(destinationCode); // ✅ Awaiting the async function
        console.log('Fetched destination:', this.destination); // Debugging

        if (!this.destination) {
          this.errorMessage = 'Destination not found!';
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        this.errorMessage = 'Failed to load destination details!';
      }
    } else {
      console.error('No destination code found in route parameters!');
      this.errorMessage = 'Invalid destination code!';
    }
  }
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Changes',
        message: 'Are you sure you want to save these changes?'
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.destination) {
        await this.saveChanges();
      }
    });
  }

  async saveChanges(): Promise<void> {
    if (this.destination) {
      try {
        await this.destinationsService.update(this.destination);
        this.successMessage = 'Destination updated successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/manage-destinations']), 2000);
      } catch (error) {
        this.errorMessage = 'Failed to update destination. Please try again.';
        this.successMessage = '';
      }
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/manage-destinations']);
  }
}
