import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../Utilities/confirmation-dialog/confirmation-dialog.component';
import { Coupon } from '../../Model/coupon.module';
import { Timestamp } from '@angular/fire/firestore';
import { format } from 'date-fns';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.component.html',
  styleUrls: ['./view-coupon.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ViewCouponComponent implements OnInit {
  coupon: Coupon | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const couponCode = this.route.snapshot.paramMap.get('code');
    if (couponCode) {
      await this.loadCouponData(couponCode);
    }
  }

  private async loadCouponData(couponCode: string): Promise<void> {
    try {
      this.loading = true;
      const couponDocRef = doc(this.firestore, `Coupons/${couponCode}`);
      const couponSnapshot = await getDoc(couponDocRef);

      if (!couponSnapshot.exists()) {
        this.showCouponNotFoundDialog(`The coupon with code "${couponCode}" does not exist.`);
        return;
      }

      const couponData = couponSnapshot.data() as {
        code: string;
        startDate: Timestamp | string;
        endDate: Timestamp | string;
        discountPercentage: number;
        description: string;
        remainingUses: number;
        isActive: boolean;
      };

      this.coupon = new Coupon(
        couponData.code,
        couponData.startDate instanceof Timestamp
          ? couponData.startDate.toDate()
          : new Date(couponData.startDate),
        couponData.endDate instanceof Timestamp
          ? couponData.endDate.toDate()
          : new Date(couponData.endDate),
        couponData.discountPercentage,
        couponData.description,
        couponData.remainingUses,
        couponData.isActive
      );

      this.loading = false;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      this.showCouponNotFoundDialog('Failed to load coupon data.');
    }
  }

  private showCouponNotFoundDialog(message: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '404 - Coupon Not Found',
        message: message,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/admin/manage-coupons']);
    });
  }
}
