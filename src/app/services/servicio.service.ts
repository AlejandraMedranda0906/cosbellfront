import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/servicio';

export interface Servicio {
  id?: number;
  name: string;
  duration: number;
  price: number;
  description?: string;
  descripcionExtend?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  constructor(private http: HttpClient) { }

  getAllServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(API_URL);
  }

  getServicioById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${API_URL}/${id}`);
  }

  createServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(API_URL, servicio);
  }

  updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${API_URL}/${id}`, servicio);
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  getServiciosByCategory(categoryId: number) {
    return this.http.get<Servicio[]>(`${API_URL}/categoria/${categoryId}`);
  }
}