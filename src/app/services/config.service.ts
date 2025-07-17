import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'http://localhost:8081/api/config';

  constructor(private http: HttpClient) { }

  getFDate(): Observable<string> {
    return this.http.get<{ checK: string }>(`${this.apiUrl}/check`).pipe(
      map(response => response.checK)
    );
  }
} 