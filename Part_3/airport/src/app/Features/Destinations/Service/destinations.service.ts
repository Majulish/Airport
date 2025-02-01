import { Injectable } from '@angular/core';
import {Firestore, collection, getDocs, doc, getDoc, setDoc, query, where } from '@angular/fire/firestore';
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
  async addDestination(destination: Destination): Promise<void> {
    const destinationsCollection = collection(this.firestore, 'Destinations');
    await setDoc(doc(destinationsCollection, destination.code), { ...destination });
  }


  async checkDestinationExists(code: string, name: string): Promise<boolean> {
    const destinationsCollection = collection(this.firestore, 'Destinations');
    const codeQuery = query(destinationsCollection, where('code', '==', code));
    const nameQuery = query(destinationsCollection, where('name', '==', name));

    const codeSnapshot = await getDocs(codeQuery);
    const nameSnapshot = await getDocs(nameQuery);

    // Check if any matching documents exist
    return !codeSnapshot.empty || !nameSnapshot.empty;
  }
}
