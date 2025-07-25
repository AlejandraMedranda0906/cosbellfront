import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/chat';

export interface ChatMessage {
  id?: number;
  appointmentId: number;
  senderId: number;
  senderName?: string;
  receiverId: number;
  receiverName?: string;
  content: string;
  timestamp?: string;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getMessages(appointmentId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${API_URL}/appointment/${appointmentId}`);
  }

  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(API_URL, message);
  }

  markAsRead(appointmentId: number, userId: number): Observable<any> {
    return this.http.post(`${API_URL}/appointment/${appointmentId}/read/${userId}`, null);
  }
} 