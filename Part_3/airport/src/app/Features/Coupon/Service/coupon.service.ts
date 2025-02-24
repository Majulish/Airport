import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import {Coupon} from '../Model/coupon.module';


@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private collectionName = 'Coupons';

  constructor(private firestore: Firestore) {}

  async getAllCoupons(): Promise<Coupon[]> {
    const couponsCollectionRef = collection(this.firestore, this.collectionName);
    const querySnapshot = await getDocs(couponsCollectionRef);
    return querySnapshot.docs.map(doc => Coupon.fromFirestore(doc.data()));
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    const q = query(collection(this.firestore, this.collectionName), where('code', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return Coupon.fromFirestore(querySnapshot.docs[0].data());
  }

  async applyCoupon(code: string, totalPrice: number): Promise<number | null> {
    const coupon = await this.getCouponByCode(code);
    if (!coupon || coupon.remainingUses <= 0 || new Date() > coupon.endDate) return null;
    return totalPrice * (1 - coupon.discountPercentage / 100);
  }

  async updateCouponUsage(id: string): Promise<void> {
    const couponRef = doc(this.firestore, `${this.collectionName}/${id}`);
    const couponSnap = await getDoc(couponRef);
    if (couponSnap.exists()) {
      const remainingUses = couponSnap.data()['remainingUses'];
      if (remainingUses > 0) {
        await updateDoc(couponRef, { remainingUses: remainingUses - 1 });
      }
    }
  }

  async addCoupon(coupon: Coupon): Promise<void> {
    await setDoc(doc(collection(this.firestore, this.collectionName), coupon.code), coupon.toPlainObject());
  }

  async deleteCoupon(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `${this.collectionName}/${id}`));
  }
}
