import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-destination',
  templateUrl: './edit-destination.component.html',
  styleUrls: ['./edit-destination.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditDestinationComponent implements OnInit {
  destination: Destination | undefined;

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
        console.log(`Fetching destination with code: ${destinationCode}`);

        this.destination = await this.destinationsService.get(destinationCode);
        console.log('Fetched destination:', this.destination);

        if (!this.destination) {
          this.showDestinationNotFoundDialog(destinationCode);
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        this.showDestinationNotFoundDialog(destinationCode);
      }
    } else {
      console.error('No destination code found in route parameters!');
      this.showDestinationNotFoundDialog('Invalid Destination Code');
    }
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Changes',
        message: 'Are you sure you want to save these changes?',
        confirmation: true
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
        this.openAlertDialog('Success', 'Destination updated successfully!', true);
      } catch (error) {
        this.openAlertDialog('Error', 'Failed to update destination. Please try again.');
      }
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/admin/manage-destinations']);
  }

  private showDestinationNotFoundDialog(destinationCode: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '404 - Destination Not Found',
        message: `The destination with code "${destinationCode}" does not exist.`,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/admin/manage-destinations']);
    });
  }


openAlertDialog(title: string, message: string, navigateAfter?: boolean): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateAfter) {
        this.router.navigate(['/manage-destinations']);
      }
    });
  }
}
