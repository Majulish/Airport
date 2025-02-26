import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DateFilter {
  type: 'specific' | 'flexible' | null;
  startDate: Date | null;
  endDate: Date | null;
  month: Date | null;
}

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class DateFilterComponent implements OnInit {
  @Output() dateFilterChanged = new EventEmitter<DateFilter>();
  
  dateFilterForm: FormGroup;
  dateFilterType: 'specific' | 'flexible' = 'specific';
  months: { name: string; date: Date }[] = [];
  currentYear: number = new Date().getFullYear();

  constructor() {
    this.dateFilterForm = new FormGroup({
      dateFilterType: new FormControl('specific'),
      dateRange: new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null)
      }),
      month: new FormControl<Date | null>(null)
    });
  }

  ngOnInit(): void {
    this.initializeMonths();
    
    // Listen to form changes
    this.dateFilterForm.get('dateFilterType')?.valueChanges.subscribe(value => {
      this.dateFilterType = value;
      this.resetCurrentFilter();
    });

    // Listen to date range changes
    this.dateFilterForm.get('dateRange')?.valueChanges.subscribe(() => {
      if (this.dateFilterType === 'specific') {
        this.emitCurrentFilter();
      }
    });

    // Listen to month changes
    this.dateFilterForm.get('month')?.valueChanges.subscribe(() => {
      if (this.dateFilterType === 'flexible') {
        this.emitCurrentFilter();
      }
    });
  }

  initializeMonths(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    this.months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      return {
        name: date.toLocaleString('default', { month: 'long' }),
        date: date
      };
    });
  }

  selectMonth(date: Date): void {
    this.dateFilterForm.get('month')?.setValue(date);
  }

  isMonthSelected(month: Date): boolean {
    const selectedMonth = this.dateFilterForm.get('month')?.value as Date;
    return selectedMonth && 
           selectedMonth.getMonth() === month.getMonth() && 
           selectedMonth.getFullYear() === month.getFullYear();
  }

  resetCurrentFilter(): void {
    if (this.dateFilterType === 'specific') {
      this.dateFilterForm.get('month')?.reset();
    } else {
      this.dateFilterForm.get('dateRange')?.reset();
    }
    this.emitCurrentFilter();
  }

  emitCurrentFilter(): void {
    const dateRangeValue = this.dateFilterForm.get('dateRange')?.value;
    const monthValue = this.dateFilterForm.get('month')?.value;
    
    const filter: DateFilter = {
      type: this.dateFilterType,
      startDate: dateRangeValue?.start || null,
      endDate: dateRangeValue?.end || null,
      month: monthValue
    };
    
    this.dateFilterChanged.emit(filter);
  }

  clearDateFilter(): void {
    this.dateFilterForm.reset({ dateFilterType: this.dateFilterType });
    this.emitCurrentFilter();
  }

  applyDateFilter(): void {
    this.emitCurrentFilter();
  }
}