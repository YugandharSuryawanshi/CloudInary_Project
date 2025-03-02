import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageApiService } from '../../services/image-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  selectedFiles: File[] = [];
    imagePreviews: string[] = [];
    uploadedImages: any[] = [];

    constructor(private imageService: ImageApiService) {}

    ngOnInit(): void {
        this.fetchUploadedImages();
    }

    // Handle File Selection
    onFileSelected(event: any): void {
        if (event.target.files.length > 0) {
            this.selectedFiles = [...event.target.files];

            // Show Previews
            this.imagePreviews = [];
            for (let file of this.selectedFiles) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Remove Selected Image Before Uploading
    removeImage(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.imagePreviews.splice(index, 1);
    }

    // Upload Images
    uploadImages(): void {
        if (this.selectedFiles.length === 0) {
            alert('Please select images first!');
            return;
        }

        const formData = new FormData();
        this.selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        this.imageService.uploadImages(formData).subscribe(
            (response: any) => {
                alert('✅ Images Uploaded Successfully');
                this.fetchUploadedImages();
                this.selectedFiles = [];
                this.imagePreviews = [];
            },
            (error) => {
                console.error('❌ Upload Error:', error);
                alert('Error uploading images!');
            }
        );
    }

    // Fetch Uploaded Images from Backend
    fetchUploadedImages(): void {
        this.imageService.getAllImages().subscribe(
            (response: any) => {
                this.uploadedImages = response.data;
            },
            (error) => {
                console.error('❌ Error fetching images:', error);
            }
        );
    }


}
