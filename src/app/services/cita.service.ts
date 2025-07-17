import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/citas';
const HORARIO_API_URL = 'http://localhost:8081/api/horario';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  constructor(private http: HttpClient) {}

  agendarCita(data: { servicioId: number, userId: number, fecha: string, hora: string, email: string, phone: string, employeeId: number }): Observable<any> {
    return this.http.post(`${API_URL}/user`, data);
  }

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  getCitasPorUsuario(userId: number, month: number | null, year: number | null, serviceId: number | null): Observable<any[]> {
    let params = new HttpParams();
    if (month !== null) {
      params = params.append('month', month.toString());
    }
    if (year !== null) {
      params = params.append('year', year.toString());
    }
    if (serviceId !== null) {
      params = params.append('serviceId', serviceId.toString());
    }
    return this.http.get<any[]>(`${API_URL}/user/${userId}`, { params });
  }

  getCitasPorEmpleado(filters: { fecha?: string, servicioId?: number }): Observable<any[]> {
    let params = new HttpParams();
    if (filters.fecha) {
      params = params.append('fecha', filters.fecha);
    }
    if (filters.servicioId) {
      params = params.append('servicioId', filters.servicioId.toString());
    }
    const url = `${API_URL}/employee/me`;
    console.log('CitaService: Solicitando citas por empleado. URL:', url, 'Parámetros:', params.toString());
    return this.http.get<any[]>(url, { params });
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/${id}`);
  }

  updateCita(id: number, data: { servicioId: number, userId: number, fecha: string, hora: string, email: string, phone: string, employeeId: number }): Observable<any> {
    return this.http.put<any>(`${API_URL}/${id}`, data);
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${API_URL}/${id}/status?status=${status}`, null);
  }

  getAllAppointments(filters: { fecha?: string, employeeId?: number, servicioId?: number, userId?: number }): Observable<any[]> {
    let params = new HttpParams();
    if (filters.fecha) {
      params = params.append('fecha', filters.fecha);
    }
    if (filters.employeeId) {
      params = params.append('employeeId', filters.employeeId.toString());
    }
    if (filters.servicioId) {
      params = params.append('servicioId', filters.servicioId.toString());
    }
    if (filters.userId) {
      params = params.append('userId', filters.userId.toString());
    }
    return this.http.get<any[]>(API_URL, { params });
  }

  getAvailableTimes(date: string, servicioId: number, employeeId?: number): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('date', date);
    params = params.append('servicioId', servicioId.toString());
    if (employeeId) {
      params = params.append('employeeId', employeeId.toString());
    }
    return this.http.get<string[]>(`${HORARIO_API_URL}/available-times`, { params });
  }
}