import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {appRoutes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const AppConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"onoair-app","appId":"1:408491771545:web:4595a40ac1f0dc365d1a08","storageBucket":"onoair-app.firebasestorage.app","apiKey":"AIzaSyAwfRGhbz_elbiURc4ZcKnkv_INzdNst3M","authDomain":"onoair-app.firebaseapp.com","messagingSenderId":"408491771545"})), provideFirestore(() => getFirestore()),
  ],
};
