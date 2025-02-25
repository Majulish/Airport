import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FlightService } from '../../Service/flights.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import {CommonModule} from '@angular/common';
import {Destination} from '../../../Destinations/Model/destination.module';
import {DestinationsService} from '../../../Destinations/Service/destinations.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddFlightComponent implements OnInit {
  flightForm!: FormGroup;
  existingFlights: string[] = [];
  activeDestinations: Destination[] = [];

  constructor(
    private flightService: FlightService,
    private destinationsService: DestinationsService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.flightForm = this.fb.group({
      flightNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{3,}$/)]],
      originCode: ['', Validators.required],
      arrivalCode: ['', Validators.required],
      boardingDate: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      seatCount: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
      price: ['', Validators.required]
    });

    this.activeDestinations = (await this.destinationsService.getAllDestinations())
      .filter(dest => dest.isActive);

    const allFlights = await this.flightService.getAllFlights();
    this.existingFlights = allFlights.map((f) => f.flightNumber);

    this.flightForm.get('flightNumber')!.valueChanges.subscribe(value => this.validateFlightNumber(value));
  }

  validateFlightNumber(flightNumber: string): void {
    if (this.existingFlights.includes(flightNumber.toUpperCase())) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: `Flight Number ${flightNumber} already exists.` }
      });
    }
  }

  openConfirmDialog(): void {
    if (this.flightForm.invalid) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Please correct the errors before saving.' }
      });
      return;
    }

    const boardingDate = new Date(this.flightForm.value.boardingDate);
    const arrivalDate = new Date(this.flightForm.value.arrivalDate);
    const originCode = this.flightForm.value.originCode;
    const arrivalCode = this.flightForm.value.arrivalCode;

    if (boardingDate >= arrivalDate) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Boarding date must be before arrival date.' }
      });
      return;
    }

    if (boardingDate <= new Date()) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Boarding date already passed' }
      });
      return;
    }

    if (originCode === arrivalCode) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Origin and Arrival destinations must be different.' }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirm Flight', message: 'Are you sure you want to add this flight?', confirmation: true }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.saveFlight();
    });
  }

  async saveFlight(): Promise<void> {
    if (this.flightForm.invalid) return;

    try {
      const flightData = { ...this.flightForm.value, isActive: true };
      await this.flightService.addFlight(flightData);
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Success', message: 'Flight added successfully!' }
      });
      this.router.navigate(['/manage-flights']);
    } catch (error) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Failed to add flight. Please try again.' }
      });
    }
  }

  cancelAdd(): void {
    this.router.navigate(['/manage-flights']);
  }

  get isBoardingAfterArrival(): boolean {
    const boardingDate = this.flightForm.get('boardingDate')?.value;
    const arrivalDate = this.flightForm.get('arrivalDate')?.value;

    if (!boardingDate || !arrivalDate) return false;

    return new Date(boardingDate) >= new Date(arrivalDate);
  }
}
