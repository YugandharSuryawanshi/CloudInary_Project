import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageApiService } from '../services/image-api.service';

@Component({
  selector: 'app-db-images',
  imports: [CommonModule, RouterModule],
  templateUrl: './db-images.component.html',
  styleUrl: './db-images.component.css'
})
export class DbImagesComponent {

  images: any[] = [];
  showDbImages = true;

  constructor(private imageService: ImageApiService) { }

  ngOnInit(): void {
    this.loadDbImages();
  }

  loadDbImages() {
    this.imageService.getDbImages().subscribe({
      next: (data: any) => {
        this.images = data;
        console.log('The Images OF DB are '+this.images);
        
      },
      error: (err: any) => console.error(err)
    });
  }

  loadCloudImages() {
    this.imageService.getCloudImages().subscribe({
      next: (data: any) => {
        this.images = data;
        console.log('The Images OF Cloud are '+this.images);
        
      },
      error: (err: any) => console.error(err)
    });
  }

}
