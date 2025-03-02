import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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

  constructor(private imageService: ImageApiService) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        console.log('Available cameras:', mediaDevices);
      });
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
      const blob = this.dataURItoBlob(this.capturedImage);
      const file = new File([blob], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
      this.uploadImage(file);
      this.resetCamera();
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

  private uploadImage(file: File): void {
    this.imageService.uploadImage(file).subscribe({
      next: (res) => {
        console.log('Upload successful', res);
        alert('Image uploaded successfully!');
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Upload failed. Please try again.');
      }
    });
  }

  // Error handling
  handleError(error: WebcamInitError): void {
    let errorMessage = '';
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
    } else {
      errorMessage = `Camera error: ${error.message}`;
    }
    console.error(errorMessage);
    alert(errorMessage);
    this.resetCamera();
  }

  // Webcam trigger observable
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
