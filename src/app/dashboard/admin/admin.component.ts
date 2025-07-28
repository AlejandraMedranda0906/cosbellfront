import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatModalComponent } from '../../valorar-cita/chat-modal.component';
import { UserService } from '../../services/user.service';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component'; // 👈 Importar el componente

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardStatsComponent // 👈 Importar aquí también
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  showChatModal = false;
  selectedAppointmentId: number = 0;
  currentUserId: number = 0;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
  }

  openChat(appointmentId: number) {
    this.selectedAppointmentId = appointmentId;
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
  }
}
