import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface LuggageDialogData {
  passengerName: string;
  luggage: {
    type1: number; // Cabin baggage (8kg)
    type2: number; // Checked baggage (23kg)
    type3: number; // Heavy baggage (32kg)
  };
  luggagePrices: {
    type1: number;
    type2: number;
    type3: number;
  };
}

@Component({
  selector: 'app-luggage-selection-modal',
  templateUrl: './luggage-selection-modal.component.html',
  styleUrls: ['./luggage-selection-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class LuggageSelectionModalComponent {
  luggage: {
    type1: number;
    type2: number;
    type3: number;
  };
  passengerName: string;
  luggagePrices: {
    type1: number;
    type2: number;
    type3: number;
  };

  constructor(
    public dialogRef: MatDialogRef<LuggageSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LuggageDialogData
  ) {
    this.passengerName = data.passengerName;
    this.luggage = { ...data.luggage };
    this.luggagePrices = data.luggagePrices;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  increaseLuggage(type: 'type1' | 'type2' | 'type3'): void {
    this.luggage[type]++;
  }

  decreaseLuggage(type: 'type1' | 'type2' | 'type3'): void {
    if (this.luggage[type] > 0) {
      this.luggage[type]--;
    }
  }

  getTotalPrice(): number {
    return (this.luggage.type1 * this.luggagePrices.type1) +
           (this.luggage.type2 * this.luggagePrices.type2) +
           (this.luggage.type3 * this.luggagePrices.type3);
  }

  clearLuggage(): void {
    this.luggage = {
      type1: 0,
      type2: 0,
      type3: 0
    };
  }

  submit(): void {
    this.dialogRef.close(this.luggage);
  }
}