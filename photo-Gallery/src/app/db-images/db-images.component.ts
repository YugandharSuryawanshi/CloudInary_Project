import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selectedImage: any = null;
  currentIndex: number = 0;

  constructor(private imageService: ImageApiService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages() {
    this.imageService.getDbImages().subscribe({
      next: (data: any) => {
        this.images = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  toggleImages(dbImages: boolean) {
    this.showDbImages = dbImages;
    this.loadImages();
  }

  openModal(image: any, index: number) {
    this.selectedImage = image;
    this.currentIndex = index;
    const modalElement = document.getElementById('imageModal');
    
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('imageModal');

    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  deleteImage(image: any): void {
    this.imageService.deleteImage(image.id).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success('Image deleted successfully!', 'Success', {
            closeButton: true, disableTimeOut: false, progressBar: true
          });
          this.loadImages(); // Refresh the image list after Delete Images
        } else {
          this.toastr.error('Failed to delete image. Please try again.', 'Error', {
            closeButton: true, disableTimeOut: false, progressBar: true
          });
        }
      },
      (error) => {
        console.error('Error deleting image:', error);
        this.toastr.error('An error occurred while deleting the image.', 'Error', {
          closeButton: true, disableTimeOut: false, progressBar: true
        });
      }
    );
  }
}
