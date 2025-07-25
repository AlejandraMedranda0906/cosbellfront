import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/roles'; // Asegúrate de que esta URL sea correcta para tu backend

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }
} 