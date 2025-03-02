import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllImagesComponent } from './all-images/all-images.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'all-images', component: AllImagesComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
