import {Component, NgModule, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CouponService } from '../../Service/coupon.service';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Coupon} from '../../Model/coupon.module';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})

export class AddCouponComponent implements OnInit {
  couponForm!: FormGroup;
  existingCoupons: string[] = [];

  constructor(
    private couponService: CouponService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Z0-9]+$/)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      discountPercentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      description: ['', Validators.required],
      remainingUses: ['', [Validators.required, Validators.min(1)]],
      isActive: [true]
    });

    const allCoupons = await this.couponService.getAllCoupons();
    this.existingCoupons = allCoupons.map((c) => c.code);

    this.couponForm.get('code')!.valueChanges.subscribe(value => this.validateCouponCode(value));
  }

  validateCouponCode(code: string): void {
    if (this.existingCoupons.includes(code.toUpperCase())) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: `Coupon Code ${code} already exists.` }
      });
    }
  }

  openConfirmDialog(): void {
    if (this.couponForm.invalid) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Please correct the errors before saving.' }
      });
      return;
    }

    const startDate = new Date(this.couponForm.value.startDate);
    const endDate = new Date(this.couponForm.value.endDate);

    if (startDate >= endDate) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Start date must be before end date.' }
      });
      return;
    }

    if (startDate <= new Date()) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Start date must be in the future.' }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirm Coupon', message: 'Are you sure you want to add this coupon?', confirmation: true }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.saveCoupon();
    });
  }

  async saveCoupon(): Promise<void> {
    if (this.couponForm.invalid) return;

    try {
      const existingCoupon = await this.couponService.getCouponByCode(this.couponForm.value.code);
      if (existingCoupon) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { title: 'Error', message: `Coupon Code ${this.couponForm.value.code} already exists.` }
        });

        dialogRef.afterOpened().subscribe(() => {
          setTimeout(() => {
            const dialogElement = document.querySelector('.mat-mdc-dialog-container button');
            if (dialogElement) {
              (dialogElement as HTMLElement).focus();
            }
          }, 100);
        });

        return;
      }

      const couponData = new Coupon(
        this.couponForm.value.code,
        new Date(this.couponForm.value.startDate),
        new Date(this.couponForm.value.endDate),
        this.couponForm.value.discountPercentage,
        this.couponForm.value.description,
        this.couponForm.value.remainingUses,
        true
      );

      await this.couponService.addCoupon(couponData);

      const successDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Success', message: 'Coupon added successfully!' }
      });

      successDialogRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          const successDialogElement = document.querySelector('.mat-mdc-dialog-container button');
          if (successDialogElement) {
            (successDialogElement as HTMLElement).focus();
          }
        }, 100);
      });

      await this.router.navigate(['admin/manage-coupons']);
    } catch (error) {
      const errorDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Error', message: 'Failed to add coupon. Please try again.' }
      });

      errorDialogRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          const errorDialogElement = document.querySelector('.mat-mdc-dialog-container button');
          if (errorDialogElement) {
            (errorDialogElement as HTMLElement).focus();
          }
        }, 100);
      });
    }
  }


  cancelAdd(): void {
    this.router.navigate(['/manage-coupons']);
  }
}
