import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageApiService } from '../../services/image-api.service';

@Component({
  selector: 'app-all-images',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-images.component.html',
  styleUrl: './all-images.component.css'
})
export class AllImagesComponent {

  images: any[] = [];

  constructor(private imageApi: ImageApiService) { }

  getDatabaseImages() {
    this.imageApi.getAllImages().subscribe((data:any) => {
      this.images = data;
    });
  }

  getCloudImages() {
    this.imageApi.getAllImages().subscribe((data:any) => {
      this.images = data;
    });
  }

}
