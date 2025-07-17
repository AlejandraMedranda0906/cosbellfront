import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatModalComponent } from './chat-modal.component';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('ChatModalComponent', () => {
  let component: ChatModalComponent;
  let fixture: ComponentFixture<ChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatModalComponent],
      imports: [FormsModule],
      providers: [
        { provide: ChatService, useValue: { getMessages: () => of([]), markAsRead: () => of(null), sendMessage: () => of({}) } },
        { provide: UserService, useValue: {} },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatModalComponent);
    component = fixture.componentInstance;
    component.appointmentId = 1;
    component.currentUserId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 