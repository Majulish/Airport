import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { Coupon } from '../../Model/coupon.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {Timestamp} from 'firebase/firestore';
import { format } from 'date-fns';
@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule]
})
export class ManageCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  searchTerm: string = '';

  constructor(
    private firestore: Firestore,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCoupons();
  }

  async loadCoupons(): Promise<void> {
    try {
      const couponsCollectionRef = collection(this.firestore, 'Coupons');
      const querySnapshot = await getDocs(couponsCollectionRef);

      this.coupons = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();

        console.log("Raw Firestore Data:", data);

        // ✅ Convert stored ISO strings back to JavaScript Date objects
        const safeStartDate =
          typeof data['startDate'] === "string"
            ? new Date(data['startDate'])
            : new Date("2025-01-01T00:00:00Z"); // Default if missing

        const safeEndDate =
          typeof data['endDate'] === "string"
            ? new Date(data['endDate'])
            : new Date(); // Default if missing

        console.log(`Processed Dates - Code: ${data['code']}, Start: ${safeStartDate}, End: ${safeEndDate}`);

        return new Coupon(
          data['code'],
          safeStartDate, // ✅ Store as Date object
          safeEndDate,   // ✅ Store as Date object
          data['discountPercentage'],
          data['description'],
          data['remainingUses'],
          data['isActive'] ?? true
        );
      });

      this.filteredCoupons = [...this.coupons];
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCoupons = this.coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(term) ||
      coupon.description.toLowerCase().includes(term)
    );
  }

  async toggleCouponStatus(code: string, isActive: boolean): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: isActive ? 'Disable Coupon' : 'Enable Coupon',
        message: `Are you sure you want to ${isActive ? 'disable' : 'enable'} this coupon?`,
        confirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        const couponRef = doc(this.firestore, 'Coupons', code);
        await setDoc(couponRef, { isActive: !isActive }, { merge: true });

        this.coupons = this.coupons.map(coupon =>
          coupon.code === code
            ? new Coupon(
              coupon.code,
              coupon.startDate,
              coupon.endDate,
              coupon.discountPercentage,
              coupon.description,
              coupon.remainingUses,
              !isActive
            )
            : coupon
        );
        this.filteredCoupons = [...this.coupons];
      }
    });
  }


  navigateToView(code: string): void {
    this.router.navigate([`/view-coupon/${code}`]);
  }

  navigateToEdit(code: string): void {
    this.router.navigate([`/edit-coupon/${code}`]);
  }
}
