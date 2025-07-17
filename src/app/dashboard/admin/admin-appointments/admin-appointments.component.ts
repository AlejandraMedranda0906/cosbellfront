import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../../services/cita.service';
import { ServicioService } from '../../../services/servicio.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Servicio } from '../../../services/servicio.service'; // Importar la interfaz Servicio
import { ChatModalComponent } from '../../../valorar-cita/chat-modal.component';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ChatModalComponent],
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.css']
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  services: Servicio[] = []; // Tipar correctamente
  employees: any[] = [];
  clients: any[] = [];
  filters: { fechaInicio?: string, fechaFin?: string, employeeId?: number, servicioId?: number, userId?: number } = {};
  showFilters: boolean = false;
  showChatModal = false;
  selectedAppointmentId: number = 0;
  currentUserId: number = 0;

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.loadEmployees();
    this.loadClients();
    this.loadAllAppointments();
    this.currentUserId = this.userService.getCurrentUserId();
  }

  loadAllAppointments(): void {
    this.citaService.getAllAppointments(this.filters).subscribe({
      next: (data: any[]) => {
        this.appointments = data;
      },
      error: (err: any) => {
        console.error('Error al cargar todas las citas:', err);
      }
    });
  }

  loadServices(): void {
    this.servicioService.getAllServicios().subscribe({
      next: (data: Servicio[]) => {
        this.services = data;
      },
      error: (err: any) => {
        console.error('Error al cargar servicios:', err);
      }
    });
  }

  loadEmployees(): void {
    this.userService.getEmployees().subscribe({
      next: (data: any[]) => {
        this.employees = data;
      },
      error: (err: any) => {
        console.error('Error al cargar empleados:', err);
      }
    });
  }

  loadClients(): void {
    this.userService.getClients().subscribe({
      next: (data: any[]) => {
        this.clients = data;
      },
      error: (err: any) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadAllAppointments();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadAllAppointments();
  }

  onDateRangeChange(type: 'inicio' | 'fin', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (type === 'inicio') {
      this.filters.fechaInicio = value;
    } else {
      this.filters.fechaFin = value;
    }
  }

  onEmployeeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.employeeId = value ? Number(value) : undefined;
  }

  onServiceChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.servicioId = value ? Number(value) : undefined;
  }

  onClientChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.userId = value ? Number(value) : undefined;
  }

  changeAppointmentStatus(appointment: any, newStatus: string): void {
    if (appointment.status === newStatus) return;
    this.citaService.updateAppointmentStatus(appointment.id, newStatus).subscribe({
      next: (updated: any) => {
        appointment.status = updated.status;
      },
      error: (err: any) => {
        console.error('Error al actualizar el estado de la cita:', err);
      }
    });
  }

  openChat(appointmentId: number) {
    this.selectedAppointmentId = appointmentId;
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
  }
} 