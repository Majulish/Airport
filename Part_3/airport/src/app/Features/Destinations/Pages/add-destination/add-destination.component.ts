import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddDestinationComponent implements OnInit {
  destinationForm!: FormGroup;
  existingDestinations: Destination[] = [];
  destinationCodeExists = false;
  destinationNameExists = false;
  invalidCodeFormat = false;
  invalidNameFormat = false;

  constructor(
    private destinationsService: DestinationsService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.destinationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      airportName: ['', Validators.required],
      airportUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    // Fetch existing destinations after initializing the form
    this.existingDestinations = await this.destinationsService.getAllDestinations();

    this.destinationForm.get('code')!.valueChanges.subscribe(value => this.validateCode(value));
    this.destinationForm.get('name')!.valueChanges.subscribe(value => this.validateName(value));
  }


  validateCode(code: string): void {
    this.destinationCodeExists = this.existingDestinations.some(dest => dest.code.toUpperCase() === code.toUpperCase());
    this.invalidCodeFormat = !/^[A-Z]{3}$/.test(code);
  }

  validateName(name: string): void {
    this.destinationNameExists = this.existingDestinations.some(dest => dest.name.toLowerCase() === name.toLowerCase());
    this.invalidNameFormat = !/^[A-Za-z\s]+$/.test(name);
  }

  openConfirmDialog(): void {
    if (this.destinationForm.invalid || this.destinationCodeExists || this.destinationNameExists) {
      this.openAlertDialog('Error', 'Please correct the errors before saving.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Destination',
        message: 'Are you sure you want to add this destination?',
        confirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.saveDestination();
      }
    });
  }

  async saveDestination(): Promise<void> {
    if (this.destinationForm.invalid || this.destinationCodeExists || this.destinationNameExists) {
      this.openAlertDialog('Error', 'Please correct the errors before saving.');
      return;
    }

    try {
      await this.destinationsService.addDestination(this.destinationForm.value);
      this.openAlertDialog('Success', 'Destination added successfully!', true);
    } catch (error) {
      this.openAlertDialog('Error', 'Failed to add destination. Please try again.');
    }
  }

  cancelAdd(): void {
    this.router.navigate(['/manage-destinations']);
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
