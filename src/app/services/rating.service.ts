import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/ratings';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  createRating(appointmentId: number, rating: number, comment: string | null): Observable<any> {
    return this.http.post(API_URL, { appointmentId, rating, comment });
  }

  getRatingsByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/employee/${employeeId}`);
  }

  getRatingsByService(serviceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/service/${serviceId}`);
  }
} 