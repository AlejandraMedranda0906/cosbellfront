import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  email: string;
  password: string;
}

const API_URL = 'http://localhost:8081/users';

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
}