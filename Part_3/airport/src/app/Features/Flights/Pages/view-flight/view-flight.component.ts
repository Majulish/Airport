import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { FlightWithDestination } from "../../Model/flight-with-destination.module";

@Component({
  selector: 'app-view-flight',
  templateUrl: './view-flight.component.html',
  styleUrls: ['./view-flight.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class ViewFlightComponent implements OnInit {
  flight: FlightWithDestination | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      await this.loadFlightData(flightNumber);
    } else {
      this.showFlightNotFoundDialog('Invalid flight number.');
    }
  }

  private async loadFlightData(flightNumber: string): Promise<void> {
    try {
      this.loading = true;
      const flightDocRef = doc(this.firestore, `Flight/${flightNumber}`);
      const flightSnapshot = await getDoc(flightDocRef);

      if (!flightSnapshot.exists()) {
        this.showFlightNotFoundDialog(`The flight with number "${flightNumber}" does not exist.`);
        return;
      }

      const flightData = flightSnapshot.data() as {
        flightNumber: string;
        originCode: string;
        arrivalCode: string;
        boardingDate: Date;
        arrivalDate: Date;
        seatCount: number;
        takenSeats: number;
        isActive: boolean;
      };

      const [origin, arrival] = await Promise.all([
        this.getDestinationByCode(flightData.originCode),
        this.getDestinationByCode(flightData.arrivalCode)
      ]);

      this.flight = {
        flightNumber: flightData.flightNumber,
        origin: origin,
        arrival: arrival,
        boardingDate: flightData.boardingDate,
        arrivalDate: flightData.arrivalDate,
        seatCount: flightData.seatCount,
        takenSeats: flightData.takenSeats,
        isActive: flightData.isActive
      };

      this.loading = false;
    } catch (error) {
      console.error("Error fetching flight:", error);
      this.showFlightNotFoundDialog("Failed to load flight data.");
    }
  }

  private async getDestinationByCode(code: string): Promise<any> {
    try {
      if (!code) return { name: "Unknown", code };

      const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
      const destinationSnapshot = await getDoc(destinationDocRef);

      if (!destinationSnapshot.exists()) {
        console.warn(`Destination not found in Firestore: ${code}`);
        return { name: "Unknown Destination", code };
      }

      const destinationData = destinationSnapshot.data();
      return {
        name: destinationData?.['name'] ?? "Unknown",
        code: destinationData?.['code'] ?? code
      };
    } catch (error) {
      console.error("Error fetching destination:", error);
      return { name: "Error Loading", code };
    }
  }

  private showFlightNotFoundDialog(message: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '404 - Flight Not Found',
        message: message,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/admin/manage-flights']); // Redirect to manage flights
    });
  }
}
