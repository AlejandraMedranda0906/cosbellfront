import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { ChatMessage } from './chat.service';

// Polyfills para sockjs-client
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = {
    env: { DEBUG: undefined },
    version: []
  };
}

// Importar sockjs-client después de los polyfills
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private client: Client | null = null;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messages$ = this.messageSubject.asObservable();

  connect(appointmentId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Conectado al WebSocket');
          
          // Suscribirse al topic del chat específico
          this.client?.subscribe(`/topic/chat/${appointmentId}`, (message) => {
            try {
              const chatMessage: ChatMessage = JSON.parse(message.body);
              this.messageSubject.next(chatMessage);
            } catch (error) {
              console.error('Error parseando mensaje:', error);
            }
          });

          resolve();
        },
        onStompError: (frame) => {
          console.error('Error de STOMP:', frame);
          reject(frame);
        },
        onWebSocketError: (error) => {
          console.error('Error de WebSocket:', error);
          reject(error);
        }
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.client && this.client.connected) {
      try {
        this.client.publish({
          destination: `/app/chat/send`,
          body: JSON.stringify(message)
        });
      } catch (error) {
        console.error('Error enviando mensaje por WebSocket:', error);
      }
    } else {
      console.warn('Cliente WebSocket no conectado');
    }
  }

  joinChat(appointmentId: number): void {
    if (this.client && this.client.connected) {
      try {
        this.client.publish({
          destination: `/app/chat/join/${appointmentId}`,
          body: ''
        });
      } catch (error) {
        console.error('Error uniéndose al chat:', error);
      }
    }
  }
} 