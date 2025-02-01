import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Flight } from '../Model/filght.module';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private firestore: Firestore) {
  }

  async getAllFlights(): Promise<Flight[]> {
    const flightsCollectionRef = collection(this.firestore, 'Flight');
    const querySnapshot = await getDocs(flightsCollectionRef);
    return querySnapshot.docs.map(doc => doc.data() as Flight);
  }

  async getAllFlightsForNextWeek(): Promise<Flight[]> {
    const flights = await this.getAllFlights();
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return flights.filter((flight: Flight) => {
      const flightDate = new Date(flight.boardingDate);
      return flightDate >= today && flightDate <= nextWeek;
    });
  }

  async getFlightByNumber(flightNo: string): Promise<Flight | undefined> {
    const docRef = doc(this.firestore, 'Flight', flightNo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Flight;
    } else {
      console.warn(`No flight found with number: ${flightNo}`);
      return undefined;
    }
  }

  sortObjectArray(column: string, currentSortDirection: "asc" | "desc" | null, currentSortColumn: string | null, filteredArray: any[], sourceArray: any[]) {
    if (currentSortColumn === column) {
      if (currentSortDirection === 'asc') {
        currentSortDirection = 'desc';
      } else if (currentSortDirection === 'desc') {
        currentSortDirection = null;
        filteredArray = [...sourceArray];
        return;
      } else {
        currentSortDirection = 'asc';
      }
    } else {
      currentSortColumn = column;
      currentSortDirection = 'asc';
    }

    filteredArray.sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];

      if (valueA < valueB) return currentSortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return currentSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  getSortIcon(column: string, currentSortDirection: "asc" | "desc" | null, currentSortColumn: string | null, filteredArray: any[], sourceArray: any[]){
    if (currentSortColumn === column) {
      if (currentSortDirection === 'asc') {
        return 'fa-arrow-up';
      } else if (currentSortDirection === 'desc') {
        return 'fa-arrow-down';
      }
    }
    return 'fa-arrows-up-down';
  }
}
