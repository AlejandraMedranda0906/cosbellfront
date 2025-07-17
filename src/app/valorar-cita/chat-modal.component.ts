import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3>Chat de la cita</h3>
        <div class="header-controls">
          <span class="connection-status" [class.connected]="connected" [class.disconnected]="!connected">
            {{ connected ? '🟢 En línea' : '🔴 Desconectado' }}
          </span>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </div>
      </div>
      <div class="modal-body">
        <div *ngIf="messages.length === 0" class="empty">No hay mensajes aún.</div>
        <div class="messages">
          <div *ngFor="let msg of messages" [ngClass]="{'own': msg.senderId === currentUserId}">
            <span class="sender">{{msg.senderName || (msg.senderId === currentUserId ? 'Tú' : 'Otro')}}</span>
            <span class="content">{{msg.content}}</span>
            <span class="timestamp">{{msg.timestamp | date:'short'}}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <form (ngSubmit)="send()" class="send-form">
          <input [(ngModel)]="newMessage" name="message" required placeholder="Escribe un mensaje..." autocomplete="off" />
          <button type="submit" [disabled]="!newMessage.trim() || loading">
            {{ loading ? 'Enviando...' : 'Enviar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { 
      position: fixed; 
      top:0; 
      left:0; 
      width:100vw; 
      height:100vh; 
      background:rgba(0,0,0,0.5); 
      z-index:1000; 
    }
    .modal-content { 
      position: fixed; 
      top:50%; 
      left:50%; 
      transform:translate(-50%,-50%); 
      background:#fff; 
      border-radius:15px; 
      width:400px; 
      max-width:95vw; 
      z-index:1001; 
      box-shadow:0 8px 32px rgba(0,0,0,0.3); 
      display:flex; 
      flex-direction:column;
      border: 2px solid var(--cosbell-pink);
    }
    .modal-header { 
      display:flex; 
      justify-content:space-between; 
      align-items:center; 
      padding:16px 20px; 
      border-bottom:2px solid var(--cosbell-light-pink);
      background: linear-gradient(135deg, var(--cosbell-dark-purple), var(--cosbell-pink));
      color: white;
      border-radius: 13px 13px 0 0;
    }
    .modal-header h3 {
      color: white;
      margin: 0;
      font-size: 1.3em;
      font-weight: 600;
    }
    .header-controls { 
      display:flex; 
      align-items:center; 
      gap:10px; 
    }
    .connection-status { 
      font-size:0.8em; 
      padding:4px 8px; 
      border-radius:6px; 
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .connection-status.connected { color:white; }
    .connection-status.disconnected { color:white; }
    .close-btn { 
      background:var(--cosbell-pink); 
      border:none; 
      font-size:1.5em; 
      cursor:pointer;
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }
    .close-btn:hover {
      background: #c44d7a;
    }
    .modal-body { 
      padding:16px 20px; 
      max-height:350px; 
      overflow-y:auto; 
      background: #f8f9fa;
    }
    .messages { 
      display:flex; 
      flex-direction:column; 
      gap:12px; 
    }
    .messages .own { 
      align-self:flex-end; 
      background:var(--cosbell-btn-yellow); 
      color: white;
      border-radius:12px 12px 0 12px; 
      padding:10px 14px; 
      max-width:80%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .messages div { 
      background:var(--cosbell-light-pink); 
      border: 1px solid var(--cosbell-pink);
      border-radius:12px 12px 12px 0; 
      padding:10px 14px; 
      max-width:80%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .sender { 
      font-weight:bold; 
      margin-right:6px; 
      font-size: 0.9em;
    }
    .timestamp { 
      font-size:0.8em; 
      color:#666; 
      margin-left:8px; 
      opacity: 0.8;
    }
    .modal-footer { 
      padding:16px 20px; 
      border-top:2px solid var(--cosbell-light-pink);
      background: white;
      border-radius: 0 0 13px 13px;
    }
    .send-form { 
      display:flex; 
      gap:10px; 
    }
    .send-form input { 
      flex:1; 
      padding:10px 12px; 
      border-radius:8px; 
      border:2px solid var(--cosbell-light-pink);
      font-size: 1em;
      transition: border-color 0.3s ease;
    }
    .send-form input:focus {
      outline: none;
      border-color: var(--cosbell-pink);
      box-shadow: 0 0 0 3px rgba(221, 94, 138, 0.1);
    }
    .send-form button { 
      padding:10px 20px; 
      border-radius:8px; 
      border:none; 
      background:var(--cosbell-pink); 
      color:#fff; 
      cursor:pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
    .send-form button:hover {
      background: #c44d7a;
    }
    .send-form button:disabled { 
      background:#ccc; 
      cursor:not-allowed; 
    }
    .empty { 
      color:#888; 
      text-align:center; 
      margin:20px 0;
      font-style: italic;
    }
  `]
})
export class ChatModalComponent implements OnInit, OnDestroy {
  @Input() appointmentId!: number;
  @Input() currentUserId!: number;
  @Input() receiverId?: number;
  @Output() close = new EventEmitter<void>();

  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;
  connected = true;
  private subscription: Subscription = new Subscription();
  private lastMessageCount = 0;

  constructor(
    private chatService: ChatService, 
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startPolling() {
    this.subscription.add(
      interval(3000).subscribe(() => {
        this.checkForNewMessages();
      })
    );
  }

  checkForNewMessages() {
    this.chatService.getMessages(this.appointmentId).subscribe(msgs => {
      if (msgs.length > this.lastMessageCount) {
        this.messages = msgs;
        this.lastMessageCount = msgs.length;
        this.markAsRead();
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  loadMessages() {
    this.chatService.getMessages(this.appointmentId).subscribe(msgs => {
      this.messages = msgs;
      this.lastMessageCount = msgs.length;
      this.markAsRead();
    });
  }

  send() {
    if (!this.newMessage.trim() || this.loading) return;
    
    const msg: ChatMessage = {
      appointmentId: this.appointmentId,
      senderId: this.currentUserId,
      receiverId: this.getReceiverId(),
      content: this.newMessage.trim(),
    };
    
    this.loading = true;
    
    this.chatService.sendMessage(msg).subscribe({
      next: (sent) => {
        this.messages.push(sent);
        this.newMessage = '';
        this.loading = false;
        this.lastMessageCount = this.messages.length;
        this.markAsRead();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error enviando mensaje:', error);
        this.loading = false;
      }
    });
  }

  getReceiverId(): number {
    if (this.receiverId) {
      return this.receiverId;
    }
    
    if (this.messages.length > 0) {
      const last = this.messages[this.messages.length - 1];
      return last.senderId === this.currentUserId ? last.receiverId : last.senderId;
    }
    
    return 0;
  }

  markAsRead() {
    this.chatService.markAsRead(this.appointmentId, this.currentUserId).subscribe();
  }

  onClose() {
    this.close.emit();
  }

  scrollToBottom() {
  }
} 