import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DbImagesComponent } from './db-images/db-images.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'db_images', component: DbImagesComponent},
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
