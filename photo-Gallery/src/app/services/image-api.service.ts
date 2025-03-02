import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {

  private baseUrl = 'http://localhost:5000/api/images';

  constructor(private http: HttpClient) {}

  // Upload Images
  uploadImages(formData: FormData): Observable<any> {
      return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // Get All Images
  getAllImages(): Observable<any> {
      return this.http.get(`${this.baseUrl}/all`);
  }

}
