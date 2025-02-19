import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { Destination } from '../Model/destination.module';

@Injectable({
  providedIn: 'root',
})
export class DestinationsUploadService {
  private readonly destinations: Destination[] = [
    new Destination(
      'NYC',
      'New York',
      'JFK Airport',
      'https://www.jfkairport.com',
      'https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg',
      true
    ),
    new Destination(
      'LAX',
      'Los Angeles',
      'LAX Airport',
      'https://www.flylax.com',
      'https://www.civitatis.com/f/estados-unidos/los-angeles/los-angeles.jpg',
      true
    ),
    new Destination(
      'LHR',
      'London',
      'Heathrow Airport',
      'https://www.heathrow.com',
      'https://www.studying-in-uk.org/wp-content/uploads/2019/05/study-in-london.jpg',
      true
    ),
    new Destination(
      'DXB',
      'Dubai',
      'Dubai International Airport',
      'https://www.dubaiairports.ae',
      'https://www.arabianbusiness.com/cloud/2023/07/26/dubai-real-estate.jpg',
      true
    ),
    new Destination(
      'HND',
      'Tokyo',
      'Haneda Airport',
      'https://tokyo-haneda.com',
      'https://www.gotokyo.org/en/plan/tokyo-outline/images/main.jpg',
      true
    ),
    new Destination(
      'SYD',
      'Sydney',
      'Sydney Kingsford Smith Airport',
      'https://www.sydneyairport.com.au',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/268px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg',
      true
),
    new Destination(
      'CDG',
      'Paris',
      'Charles de Gaulle Airport',
      'https://www.parisaeroport.fr',
      'https://a.eu.mktgcdn.com/f/100004519/N2BB4ohwclor2uLoZ7XMHgJmxOZaMOokMdQqqXQAq3s.jpg',
      true
    ),
    new Destination(
      'SFO',
      'San Francisco',
      'San Francisco International Airport',
      'https://www.flysfo.com',
      'https://assets.cityexperiences.com/wp-content/uploads/2022/08/golden-gate-bridge-sf-e1666363524869.jpg',
      true
    ),
    new Destination(
      'SIN',
      'Singapore',
      'Changi Airport',
      'https://www.changiairport.com',
      'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/542000/542607-singapore.jpg',
      true
    ),
    new Destination(
      'FCO',
      'Rome',
      'Leonardo da Vinci–Fiumicino Airport',
      'https://www.romeairport.com',
      'https://i.natgeofe.com/k/a6c9f195-de20-445d-9d36-745ef56042c5/OG_Colosseum_Ancient-Rome_KIDS_1122.jpg',
      true
    ),
  ];

  constructor(private firestore: Firestore) {}

  async uploadDestinations(): Promise<void> {
    const destinationsCollection = collection(this.firestore, 'Destinations');
    for (const destination of this.destinations) {
      const destinationData = { ...destination };
      await setDoc(doc(destinationsCollection, destination.code), destinationData);
    }
    console.log('Destinations uploaded successfully!');
  }
}
