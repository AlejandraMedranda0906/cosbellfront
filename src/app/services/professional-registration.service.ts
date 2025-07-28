import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/professionals';

export interface HorarioRequest {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface ProfessionalRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string; 
  roleName: string; // e.g., "EMPLOYEE" or "ADMIN"
  serviceIds: number[];
  schedules: HorarioRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalRegistrationService {

  constructor(private http: HttpClient) { }

  /** Crear un profesional */
  registerProfessional(request: ProfessionalRegisterRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/register`, request);
  }

  /** Obtener todos los profesionales */
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  /** Actualizar un profesional */
  updateProfessional(id: number, request: ProfessionalRegisterRequest): Observable<any> {
    return this.http.put<any>(`${API_URL}/${id}`, request);
  }

  /** Borrar un profesional */
  deleteProfessional(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
