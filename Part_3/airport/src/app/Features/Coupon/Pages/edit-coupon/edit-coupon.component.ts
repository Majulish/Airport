import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Coupon } from '../../Model/coupon.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditCouponComponent implements OnInit {
  coupon: Coupon | undefined;
  dateError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const couponCode = this.route.snapshot.paramMap.get('code');
    if (couponCode) {
      try {
        console.log(`Fetching coupon with code: ${couponCode}`);

        const couponRef = doc(this.firestore, 'Coupons', couponCode);
        const docSnap = await getDoc(couponRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          this.coupon = new Coupon(
            data['code'],
            typeof data['startDate'] === "string" ? new Date(data['startDate']) : new Date(),
            typeof data['endDate'] === "string" ? new Date(data['endDate']) : new Date(),
            data['discountPercentage'],
            data['description'],
            data['remainingUses'],
            data['isActive'] ?? true
          );
          console.log('Fetched coupon:', this.coupon);
        } else {
          this.showCouponNotFoundDialog(couponCode);
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
        this.showCouponNotFoundDialog(couponCode);
      }
    } else {
      console.error('No coupon code found in route parameters!');
      this.showCouponNotFoundDialog('Invalid Coupon Code');
    }
  }

  validateDates(): void {
    if (this.coupon) {
      const startDate = new Date(this.coupon.startDate);
      const endDate = new Date(this.coupon.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only the date

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        this.dateError = 'Invalid date format';
      } else if (startDate < today || endDate < today) {
        this.dateError = 'Start date and end date must be today or in the future';
        this.openAlertDialog('Date Validation Error', this.dateError);
      } else if (startDate >= endDate) {
        this.dateError = 'Start date must be before end date';
        this.openAlertDialog('Date Validation Error', this.dateError);
      } else {
        this.dateError = null;
      }
      console.log('Date validation:', this.dateError);
    }
  }

  onDateChange(): void {
    this.validateDates();
  }

  openConfirmDialog(): void {
    this.validateDates();
    if (this.dateError) {
      console.log('Validation failed:', this.dateError);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Changes',
        message: 'Are you sure you want to save these changes?',
        confirmation: true
      },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.coupon) {
        await this.saveChanges();
      }
    });
  }

  async saveChanges(): Promise<void> {
    this.validateDates();
    if (this.dateError) {
      console.log('Save prevented due to validation error:', this.dateError);
      return;
    }

    if (this.coupon) {
      try {
        const couponRef = doc(this.firestore, 'Coupons', this.coupon.code);

        const formattedStartDate = new Date(this.coupon.startDate).toISOString();
        const formattedEndDate = new Date(this.coupon.endDate).toISOString();

        await setDoc(couponRef, {
          ...this.coupon,
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }, { merge: true });

        console.log('Coupon saved successfully:', this.coupon);
        this.openAlertDialog('Success', 'Coupon updated successfully!', true);
      } catch (error) {
        console.error('Error updating coupon:', error);
        this.openAlertDialog('Error', 'Failed to update coupon. Please try again.');
      }
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/admin/manage-coupons']);
  }

  private showCouponNotFoundDialog(couponCode: string): void {
    this.openAlertDialog('404 - Coupon Not Found', `The coupon with code "${couponCode}" does not exist.`);
    this.router.navigate(['/admin/manage-coupons']);
  }

  openAlertDialog(title: string, message: string, navigateAfter?: boolean): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateAfter) {
        this.router.navigate(['/admin/manage-coupons']);
      }
    });
  }
}
