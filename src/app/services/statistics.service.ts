import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceCountDto {
  name: string;
  count: number;
}

export interface EmployeeCountDto {
  name: string;
  count: number;
}

export interface StatisticsDto {
  topEmployee: string;
  topService: string;
  totalRevenue: number;
  totalAppointments: number;
  servicesBreakdown: ServiceCountDto[];
  employeesBreakdown: EmployeeCountDto[]; // <--- AGREGA ESTA LÍNEA
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = '/api/admin/stats';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene estadísticas por periodo (day, week, month, all) y fecha opcional (formato YYYY-MM-DD).
   */
  getStatistics(period: string = 'day', date?: string): Observable<StatisticsDto> {
    if (period === 'all') {
      // Para "todos los tiempos" usa el endpoint /api/admin/stats/all sin parámetros
      return this.http.get<StatisticsDto>(`${this.apiUrl}/all`);
    }
    // Para los otros periodos usa el endpoint principal con los query params
    let url = `${this.apiUrl}?period=${period}`;
    if (date) {
      url += `&date=${date}`;
    }
    return this.http.get<StatisticsDto>(url);
  }
}
