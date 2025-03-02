import { Component } from '@angular/core';
import { ImageApiService } from '../services/image-api.service';

@Component({
  selector: 'app-all-images',
  imports: [],
  templateUrl: './all-images.component.html',
  styleUrl: './all-images.component.css'
})
export class AllImagesComponent {

  images: any[] = [];
  showDbImages = true;

  constructor(private imageService: ImageApiService) { }

  ngOnInit(): void {
    this.loadDbImages();
  }

  loadDbImages() {
    this.imageService.getDbImages().subscribe({
      next: (data:any) => {
        this.images = data;
        this.showDbImages = true;
      },
      error: (err:any) => console.error(err)
    });
  }

  loadCloudImages() {
    this.imageService.getCloudImages().subscribe({
      next: (data:any) => {
        this.images = data;
        this.showDbImages = false;
      },
      error: (err:any) => console.error(err)
    });
  }

}
