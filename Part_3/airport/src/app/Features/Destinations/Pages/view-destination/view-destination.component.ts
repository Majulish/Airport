import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view-destination',
  templateUrl: './view-destination.component.html',
  styleUrls: ['./view-destination.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewDestinationComponent implements OnInit {
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
}
