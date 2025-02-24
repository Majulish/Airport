import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import {Coupon} from '../Model/coupon.module';


@Injectable({
  providedIn: 'root',
})
export class CouponUploadService {
  private readonly coupons: Coupon[] = [
    new Coupon('SAVE10', this.createFutureDate(1), this.createFutureDate(2), 10, 'Save 10% on your next flight!', 50,true),
    new Coupon('DISCOUNT15', this.createFutureDate(1), this.createFutureDate(3), 15, '15% off for loyal customers.', 30,true),
    new Coupon('SUMMER20', this.createFutureDate(2), this.createFutureDate(4), 20, 'Summer special discount!', 40, true),
    new Coupon('EARLYBIRD', this.createFutureDate(1), this.createFutureDate(5), 25, 'Get 25% off for early bookings.', 20, true),
    new Coupon('FAMILY50', this.createFutureDate(2), this.createFutureDate(6), 50, 'Family discount for group travelers.', 15,true),
    new Coupon('STUDENT30', this.createFutureDate(3), this.createFutureDate(7), 30, 'Students get 30% off!', 10,true),
    new Coupon('FLYHIGH25', this.createFutureDate(1), this.createFutureDate(3), 25, 'Exclusive 25% off on selected flights.', 35,true),
    new Coupon('NEWYEAR40', this.createFutureDate(4), this.createFutureDate(8), 40, 'New Year special discount!', 25,true),
    new Coupon('WEEKEND20', this.createFutureDate(1), this.createFutureDate(2), 20, 'Weekend flights special 20% off!', 30,true),
    new Coupon('VIP50', this.createFutureDate(6), this.createFutureDate(12), 50, 'Exclusive VIP members discount.', 5,true)
  ];

  constructor(private firestore: Firestore) {}

  async uploadCoupons(): Promise<void> {
    const couponsCollection = collection(this.firestore, 'Coupons');
    for (const coupon of this.coupons) {
      const couponData = coupon.toPlainObject();
      await setDoc(doc(couponsCollection, coupon.code), couponData);
    }
    console.log('Coupons uploaded successfully!');
  }


  private createFutureDate(monthsAhead: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsAhead);
    return date;
  }
}
