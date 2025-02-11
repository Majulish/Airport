import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
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
  errorMessage: string | null = null;

  constructor(
      private route: ActivatedRoute,
      private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      await this.loadFlightData(flightNumber);
    } else {
      this.errorMessage = "Invalid flight number.";
      this.loading = false;
    }
  }

  private async loadFlightData(flightNumber: string): Promise<void> {
    try {
      this.loading = true;
      const flightDocRef = doc(this.firestore, `Flight/${flightNumber}`);
      const flightSnapshot = await getDoc(flightDocRef);

      if (!flightSnapshot.exists()) {
        this.errorMessage = "Flight not found.";
        this.loading = false;
        return;
      }

      const flightData = flightSnapshot.data() as {
        flightNumber: string;
        originCode: string;
        arrivalCode: string;
        boardingDate: string;
        boardingTime: string;
        arrivalDate: string;
        arrivalTime: string;
        seatCount: number;
        takenSeats: number;
      };

      console.log("Flight data from Firestore:", flightData); // ✅ Debugging line

      const [origin, arrival] = await Promise.all([
        this.getDestinationByCode(flightData.originCode),  // ✅ Fetch origin
        this.getDestinationByCode(flightData.arrivalCode)  // ✅ Fetch arrival
      ]);

      console.log("Origin retrieved:", origin); // ✅ Debugging line
      console.log("Arrival retrieved:", arrival); // ✅ Debugging line

      this.flight = {
        flightNumber: flightData.flightNumber,
        origin: origin,  // ✅ Assign full object, not just code
        arrival: arrival,
        boardingDate: flightData.boardingDate,
        boardingTime: flightData.boardingTime,
        arrivalDate: flightData.arrivalDate,
        arrivalTime: flightData.arrivalTime,
        seatCount: flightData.seatCount,
        takenSeats: flightData.takenSeats
      };

      this.loading = false;
    } catch (error) {
      console.error("Error fetching flight:", error);
      this.errorMessage = "Failed to load flight data.";
      this.loading = false;
    }
  }

  private async getDestinationByCode(code: string): Promise<any> {
    try {
      if (!code) {
        console.error("Invalid destination code.");
        return { name: "Unknown", code };
      }

      const destinationDocRef = doc(this.firestore, `Destinations/${code}`);
      const destinationSnapshot = await getDoc(destinationDocRef);

      if (!destinationSnapshot.exists()) {
        console.warn(`Destination not found in Firestore: ${code}`);
        return { name: "Unknown Destination", code };
      }

      const destinationData = destinationSnapshot.data();

      console.log(`Fetched destination:`, destinationData); // ✅ Debugging line

      return {
        name: destinationData?.['name'] ?? "Unknown",  // ✅ Ensure `name` is returned
        code: destinationData?.['code'] ?? code
      };
    } catch (error) {
      console.error("Error fetching destination:", error);
      return { name: "Error Loading", code };
    }
  }



}
