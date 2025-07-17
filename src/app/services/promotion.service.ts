import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/promotions';

export interface Promotion {
  id?: number;
  name: string;
  description: string;
  startDate: string; // Using string for date to match input type='date'
  endDate: string;   // Using string for date to match input type='date'
  conditions?: string;
  image_url?: string; // Nueva propiedad para la imagen de fondo
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient) { }

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(API_URL);
  }

  getActivePromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${API_URL}/active`);
  }

  getPromotionById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${API_URL}/${id}`);
  }

  createPromotion(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(API_URL, promotion);
  }

  updatePromotion(id: number, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${API_URL}/${id}`, promotion);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
} 