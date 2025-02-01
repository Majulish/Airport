import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Destination } from '../Model/destination.module';

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {
  constructor(private firestore: Firestore) {}

  async getAllDestinations(): Promise<Destination[]> {
    const destinationsCollectionRef = collection(this.firestore, 'Destinations');
    const querySnapshot = await getDocs(destinationsCollectionRef);
    return querySnapshot.docs.map(doc => doc.data() as Destination);
  }

  async get(code: string): Promise<Destination | undefined> {
    const docRef = doc(this.firestore, 'Destinations', code);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Destination;
    } else {
      console.warn(`No destination found with code: ${code}`);
      return undefined;
    }
  }
}
