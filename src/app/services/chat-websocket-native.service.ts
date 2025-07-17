import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketNativeService {
  private ws: WebSocket | null = null;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messages$ = this.messageSubject.asObservable();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(appointmentId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://localhost:8081/ws-native`);
        
        this.ws.onopen = () => {
          console.log('Conectado al WebSocket nativo');
          this.reconnectAttempts = 0;
          
          // Suscribirse al chat
          this.send({
            type: 'JOIN',
            appointmentId: appointmentId
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'CHAT_MESSAGE') {
              this.messageSubject.next(data.message);
            }
          } catch (error) {
            console.error('Error parseando mensaje:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Error de WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket cerrado');
          this.attemptReconnect(appointmentId);
        };

      } catch (error) {
        console.error('Error creando WebSocket:', error);
        reject(error);
      }
    });
  }

  private attemptReconnect(appointmentId: number) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(appointmentId).catch(error => {
          console.error('Error en reconexión:', error);
        });
      }, 5000);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.send({
          type: 'SEND_MESSAGE',
          message: message
        });
      } catch (error) {
        console.error('Error enviando mensaje:', error);
      }
    } else {
      console.warn('WebSocket no conectado');
    }
  }

  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  joinChat(appointmentId: number): void {
    this.send({
      type: 'JOIN',
      appointmentId: appointmentId
    });
  }
} 