import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../services/cita.service';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatModalComponent } from '../../valorar-cita/chat-modal.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule, ChatModalComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  appointments: any[] = [];
  services: any[] = [];
  filters: { fecha?: string, servicioId?: number } = {};
  currentEmployeeId: number | null = null;
  showChatModal = false;
  selectedAppointmentId: number = 0;
  currentUserId: number = 0;
  showFilters: boolean = false;

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentEmployeeId = this.authService.getUserId();
    this.currentUserId = this.userService.getCurrentUserId();
    if (this.currentEmployeeId) {
      this.loadServices();
      this.loadAppointments();
    } else {
      console.error('No se pudo obtener el ID del empleado actual.');
    }
  }

  loadAppointments(): void {
    if (!this.currentEmployeeId) {
      console.log('EmployeeComponent: No hay ID de empleado actual, no se cargarán citas.');
      return;
    }
    console.log('EmployeeComponent: Cargando citas para el empleado con ID:', this.currentEmployeeId);
    console.log('EmployeeComponent: Filtros actuales:', this.filters);
    console.log('EmployeeComponent: Token en localStorage antes de la solicitud:', localStorage.getItem('token'));
    this.citaService.getCitasPorEmpleado(this.filters).subscribe({
      next: (data: any) => {
        this.appointments = data;
      },
      error: (err: any) => {
        console.error('Error al cargar citas:', err);
      }
    });
  }

  loadServices(): void {
    this.servicioService.getAllServicios().subscribe({ 
      next: (data: any) => {
        this.services = data;
      },
      error: (err: any) => {
        console.error('Error al cargar servicios:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadAppointments();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadAppointments();
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filters.fecha = inputElement.value;
  }

  onServiceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filters.servicioId = selectElement.value ? Number(selectElement.value) : undefined;
  }

  onClientChange(event: Event): void {
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