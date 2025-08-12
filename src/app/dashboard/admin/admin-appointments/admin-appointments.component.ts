import { Component, OnInit } from '@angular/core';
import { CitaService } from '../../../services/cita.service';
import { ServicioService } from '../../../services/servicio.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Servicio } from '../../../services/servicio.service';
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
  services: Servicio[] = [];
  employees: any[] = [];
  clients: any[] = [];

  filters: {
    fechaInicio?: string;
    fechaFin?: string;
    employeeId?: number;
    servicioId?: number;
    userId?: number;
  } = {};

  // UI
  showFilters: boolean = false;
  showChatModal = false;
  selectedAppointmentId: number = 0;
  currentUserId: number = 0;

  // Autocomplete Cliente
  clientQuery: string = '';
  filteredClients: Array<{ id: number; name: string }> = [];
  showClientSuggestions: boolean = false;
  activeClientIndex: number = 0;

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadEmployees();
    this.loadClients();
    this.loadAllAppointments();
    this.currentUserId = this.userService.getCurrentUserId();
  }

  // ====== DATA ======
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
      next: (data: Servicio[]) => (this.services = data),
      error: (err: any) => console.error('Error al cargar servicios:', err)
    });
  }

  loadEmployees(): void {
    this.userService.getEmployees().subscribe({
      next: (data: any[]) => (this.employees = data),
      error: (err: any) => console.error('Error al cargar empleados:', err)
    });
  }

  loadClients(): void {
    this.userService.getClients().subscribe({
      next: (data: any[]) => (this.clients = data),
      error: (err: any) => console.error('Error al cargar clientes:', err)
    });
  }

  // ====== FILTROS ======
  filtrar(): void {
    this.loadAllAppointments();
  }

  applyFilters(): void {
    this.loadAllAppointments();
  }

  clearFilters(): void {
    this.filters = {};
    this.clientQuery = '';
    this.filteredClients = [];
    this.showClientSuggestions = false;
    this.loadAllAppointments();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  mostrarTodo(): void {
    this.clearFilters();
    this.showFilters = false; // si quieres que también se oculte el panel
  }

  // ====== AUTOCOMPLETE CLIENTE ======
  onClientInput(): void {
    const q = (this.clientQuery || '').trim().toLowerCase();
    this.filteredClients =
      q.length === 0
        ? []
        : this.clients
            .filter((c: any) => ((c.name || c.fullName || '').toLowerCase().includes(q)))
            .map((c: any) => ({ id: c.id, name: c.name || c.fullName }))
            .slice(0, 10);
    this.showClientSuggestions = this.filteredClients.length > 0;
    this.activeClientIndex = 0;
  }

  selectClient(c: { id: number; name: string }): void {
    this.clientQuery = c.name;
    this.filters.userId = c.id;
    this.showClientSuggestions = false;
    this.filtrar();
  }

  selectFirstClientSuggestion(): void {
    if (this.filteredClients.length > 0) {
      const c = this.filteredClients[this.activeClientIndex] || this.filteredClients[0];
      this.selectClient(c);
    }
  }

  closeClientSuggestions(): void {
    this.showClientSuggestions = false;
  }

  onClientBlur(): void {
    setTimeout(() => (this.showClientSuggestions = false), 150);
  }

  clearClientFilter(): void {
    this.filters.userId = undefined;
    this.clientQuery = '';
    this.filteredClients = [];
    this.showClientSuggestions = false;
    this.filtrar();
  }

  // ====== ESTADO CITA ======
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

  // ====== CHAT ======
  openChat(appointmentId: number): void {
    this.selectedAppointmentId = appointmentId;
    this.showChatModal = true;
  }

  closeChat(): void {
    this.showChatModal = false;
  }
}
