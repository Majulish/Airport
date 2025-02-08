import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  updateDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { Destination } from '../Model/destination.module';
import firebase from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {
  private collectionName = 'Destinations';
  constructor(private firestore: Firestore) {}

  async getAllDestinations(): Promise<Destination[]> {
    const destinationsCollectionRef = collection(this.firestore, 'Destinations');
    const querySnapshot = await getDocs(destinationsCollectionRef);
    return querySnapshot.docs.map(doc => doc.data() as Destination);
  }

  async get(code: string): Promise<Destination | undefined> {
    console.log(`Fetching Firestore document: ${this.collectionName}/${code}`); // Debugging

    try {
      const documentRef: DocumentReference = doc(this.firestore, this.collectionName, code);
      const docSnap = await getDoc(documentRef); // ✅ Use getDoc() for async fetching

      if (docSnap.exists()) {
        console.log('Fetched destination data:', docSnap.data()); // Debugging
        return docSnap.data() as Destination;
      } else {
        console.warn(`No destination found with code: ${code}`);
        return undefined;
      }
    } catch (error) {
      console.error('Firestore error fetching destination:', error);
      throw error;
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
    return !codeSnapshot.empty || !nameSnapshot.empty;
  }

  async update(destination: Destination): Promise<void> {
    const docRef = doc(this.firestore, `Destinations/${destination.code}`);
    return updateDoc(docRef, {
      name: destination.name,
      airportName: destination.airportName,
      airportUrl: destination.airportUrl,
      imageUrl: destination.imageUrl
    });
  }

}
