import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getDbImages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/images/db`);
  }

  deleteImage(imageId: number) {
    return this.http.delete(`${this.apiUrl}/images/delete?image_id=${imageId}`);
  }
  

}
