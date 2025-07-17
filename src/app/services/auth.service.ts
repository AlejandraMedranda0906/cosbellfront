import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_URL = 'http://localhost:8081/api/auth';

interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  email: string;
  message: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient) {
    this._isLoggedIn.next(this.hasToken());
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, data).pipe(
      tap(res => {
        // Eliminamos el inicio de sesión automático después del registro.
        // El usuario deberá iniciar sesión por separado.
        // if (res.token) {
        //   localStorage.setItem('token', res.token);
        //   localStorage.setItem('role', res.role);
        //   localStorage.setItem('userId', res.userId.toString());
        //   localStorage.setItem('name', res.name || '');
        //   this._isLoggedIn.next(true);
        // }
      })
    );
  }

  login(data: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, data).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.userId.toString());
          localStorage.setItem('name', res.name || '');
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    this._isLoggedIn.next(false);
  }
}

/*login(email: string, password: string) {
  return this.http.post<{message: string, token: string, role: string}>('/auth/login', { email, password });
}

register(data: any) {
  return this.http.post<{message: string}>('/auth/register', data);
}*/