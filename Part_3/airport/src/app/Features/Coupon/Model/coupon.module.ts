import { Timestamp } from '@angular/fire/firestore';

export class Coupon {
  constructor(
    public code: string,
    public startDate: Date,
    public endDate: Date,
    public discountPercentage: number,
    public description: string,
    public remainingUses: number,
    public isActive: boolean
  ) {}

  toPlainObject() {
    return {
      code: this.code,
      startDate: Timestamp.fromDate(this.startDate),
      endDate: Timestamp.fromDate(this.endDate),
      discountPercentage: this.discountPercentage,
      description: this.description,
      remainingUses: this.remainingUses,
      isActive: this.isActive
    };
  }


  static fromFirestore(data: any): Coupon {
    return new Coupon(
      data.code,
      data.startDate.toDate(),
      data.endDate.toDate(),
      data.discountPercentage,
      data.description,
      data.remainingUses,
      data.isActive ?? true
    );
  }
}
