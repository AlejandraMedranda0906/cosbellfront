import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface UserData {
  email: string;
  password: string;
  phone?: string;
}

export interface UserDetails {
  id: number;
  name: string;
  email?: string;
  phone?: string;

}

const API_URL = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSource = new BehaviorSubject<UserData>({ email: '', password: '' });
  currentUserData = this.userDataSource.asObservable();

  constructor(private http: HttpClient) {}

  changeData(newUserData: UserData) {
    this.userDataSource.next(newUserData);
  }

  getCurrentUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/employees`);
  }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/clients`);
  }

  getAllPersonal(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/personal`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  getCurrentUser(): Observable<{ email: string; phone: string }> {
  return this.http.get<{ email: string; phone: string }>(`${API_URL}/me`);
}

updateUser(id: number, userData: UserData): Observable<any> {
  return this.http.put(`${API_URL}/${id}`, userData);
}

getById(id: number) {
  return this.http.get<UserDetails>(`${API_URL}/${id}`);
}
}
