import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ImageApiService } from '../services/image-api.service';

@Component({
  selector: 'app-home',
  imports: [WebcamModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Modal control
  showModal = false;

  // Webcam controls
  showWebcam = false;
  capturedImage: string | null = null;
  trigger: Subject<void> = new Subject<void>();
  videoOptions: MediaTrackConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'environment'
  };

  // File upload
  selectedFiles: File[] = [];
  @ViewChild('fileInput') fileInput: any;

  images: any[] = [];
  selectedImage: any = null;
  currentIndex: number = 0;
  isBrowser: boolean = false;
  webcamEnabled: boolean = false; // Flag to enable webcam only when browser is detected

  constructor(@Inject(PLATFORM_ID)
  private platformId: Object, private imageService: ImageApiService, private toastr: ToastrService) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Check if browser
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.webcamEnabled = true;
      this.loadDbImages();
      WebcamUtil.getAvailableVideoInputs().then(() => { });
    }
  }

  // Modal operations
  openUploadModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetCamera();
    this.clearFiles();
  }

  // Camera operations
  openCamera(): void {
    this.showWebcam = true;
    this.capturedImage = null;
  }

  captureImage(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
  }

  uploadCapturedImage(): void {
    if (this.capturedImage) {
      const file = new File([
        this.dataURItoBlob(this.capturedImage)
      ], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
      this.uploadImage(file);
      this.resetCamera();
      this.showModal = false;
    }
  }

  retakePhoto(): void {
    this.capturedImage = null;
    this.showWebcam = true;
  }

  cancelCamera(): void {
    this.resetCamera();
  }

  private resetCamera(): void {
    this.showWebcam = false;
    this.capturedImage = null;
  }

  // File operations
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  uploadSelectedFiles(): void {
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => this.uploadImage(file));
      this.clearFiles();
    }
  }

  clearFiles(): void {
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Utility functions
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  uploadImage(file: File): void {
    console.log(file);
    this.imageService.uploadImage(file).subscribe({
      next: (res) => {
        console.log('Upload successful', res);
        this.toastr.success('Image Uploaded Successfully..', 'Success', { closeButton: true, disableTimeOut: false, progressBar: true });
        this.loadDbImages();
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.toastr.error('Image Upload failed. Please try again.', 'Error', { closeButton: true, disableTimeOut: false, progressBar: true }); // Error toast
      }
    });
  }


  // Error handling
  handleError(error: WebcamInitError): void {
    const errorMessage = error.mediaStreamError?.name === 'NotAllowedError'
      ? 'Camera access was denied. Please allow camera access in your browser settings.'
      : `Camera error: ${error.message}`;
    alert(errorMessage);
    this.resetCamera();
  }

  // Webcam trigger observable
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  // Database image handling
  loadDbImages(): void {
    this.imageService.getDbImages().subscribe({
      next: (data: any) => {
        this.images = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteImage(image: any): void {
    this.imageService.deleteImage(image.id).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success('Image deleted successfully!', 'Success', {
            closeButton: true, disableTimeOut: false, progressBar: true
          });
          this.loadDbImages(); // Refresh the image list
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


  openModal(image: any, index: number): void {
    this.selectedImage = image;
    this.currentIndex = index;
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
    }
  }

  closeModal1(): void {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage = this.images[this.currentIndex];
    }
  }

}
