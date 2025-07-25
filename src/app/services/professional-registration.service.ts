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
  roleName: string; // e.g., "EMPLOYEE" or "ADMIN"
  serviceIds: number[];
  schedules: HorarioRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalRegistrationService {

  constructor(private http: HttpClient) { }

  registerProfessional(request: ProfessionalRegisterRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/register`, request);
  }
} 