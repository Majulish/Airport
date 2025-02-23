import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { FlightWithDestination } from '../../Model/flight-with-destination.module';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditFlightComponent implements OnInit {
  flight: FlightWithDestination | undefined;

  constructor(
      private route: ActivatedRoute,
      private firestore: Firestore,
      private router: Router,
      public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      try {
        console.log(`Fetching flight with number: ${flightNumber}`);
        this.flight = await this.getFlightFromFirestore(flightNumber);

        if (!this.flight) {
          this.openAlertDialog('Flight Not Found', `The flight with number "${flightNumber}" does not exist.`, true);
        }
      } catch (error) {
        console.error('Error fetching flight:', error);
        this.openAlertDialog('Flight Not Found', `The flight with number "${flightNumber}" does not exist.`, true);
      }
    } else {
      console.error('No flight number found in route parameters!');
      this.openAlertDialog('Flight Not Found', 'Invalid flight number!', true);
    }
  }



  private async getFlightFromFirestore(flightNumber: string): Promise<FlightWithDestination | undefined> {
    try {
      const flightDocRef = doc(this.firestore, `Flight/${flightNumber}`);
      const flightSnapshot = await getDoc(flightDocRef);

      if (!flightSnapshot.exists()) {
        console.warn(`Flight with number ${flightNumber} not found.`);
        return undefined;
      }

      const flightData = flightSnapshot.data();
      return {
        flightNumber: flightData["flightNumber"],
        origin: await this.getDestinationByCode(flightData["originCode"]),
        arrival: await this.getDestinationByCode(flightData["arrivalCode"]),
        boardingDate: flightData["boardingDate"],
        arrivalDate: flightData["arrivalDate"],
        seatCount: flightData["seatCount"],
        takenSeats: flightData["takenSeats"],
        isActive: flightData["isActive"]
      };
    } catch (error) {
      console.error("Error fetching flight:", error);
      return undefined;
    }
  }

  private async getDestinationByCode(code: string): Promise<any> {
    if (!code) return { name: "Unknown", code };

    const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
    const destinationSnapshot = await getDoc(destinationDocRef);

    return destinationSnapshot.exists()
        ? destinationSnapshot.data()
        : { name: "Unknown Destination", code };
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
      if (result && this.flight) {
        await this.saveChanges();
      }
    });
  }

  async saveChanges(): Promise<void> {
    if (!this.flight) return;
    try {
      const flightDocRef = doc(this.firestore, `Flight/${this.flight.flightNumber}`);
      await updateDoc(flightDocRef, {
        boardingDate: this.flight.boardingDate,
        arrivalDate: this.flight.arrivalDate,
        seatCount: this.flight.seatCount,
        takenSeats: this.flight.takenSeats,
        isActive: this.flight.isActive,
      });

      this.openAlertDialog('Success', 'Flight updated successfully!', true);
    } catch (error) {
      this.openAlertDialog('Error', 'Failed to update flight. Please try again.');
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/manage-flights']);
  }

  openAlertDialog(title: string, message: string, navigateAfter?: boolean): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `404 - ${title}`,
        message: message,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateAfter) {
        this.router.navigate(['/admin/manage-flights']);
      }
    });
  }
}
