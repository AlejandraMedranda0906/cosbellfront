import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CitaService } from '../../services/cita.service';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import { ChatModalComponent } from '../../valorar-cita/chat-modal.component';
// ⬇️ AJUSTA esta ruta a donde esté tu modal (p.ej. 'src/app/components/client-info-modal.component.ts')
import { ClientInfoModalComponent } from '../admin/admin-appointments/client-modal.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule, ChatModalComponent, ClientInfoModalComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  // Datos
  appointments: any[] = [];
  services: any[] = [];
  clients: any[] = [];

  // Filtros
  filters: { fecha?: string, servicioId?: number } = {};

  // Sesión/usuario
  currentEmployeeId: number | null = null;
  currentUserId: number = 0;

  // Chat
  showChatModal = false;
  selectedAppointmentId: number = 0;

  // UI
  showFilters: boolean = false;

  // Modal Cliente
  showClientModal = false;
  selectedClientId: number | null = null;
  selectedClientName?: string;
  selectedClientContact: any | null = null;

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentEmployeeId = this.authService.getUserId();
    this.currentUserId = this.userService.getCurrentUserId();

    if (this.currentEmployeeId) {
      this.loadServices();
      this.loadClients();      // ← para reutilizar contacto en el modal
      this.loadAppointments();
    } else {
      console.error('No se pudo obtener el ID del empleado actual.');
    }
  }

  // ====== DATA ======
  loadAppointments(): void {
    if (!this.currentEmployeeId) {
      console.log('EmployeeComponent: No hay ID de empleado actual, no se cargarán citas.');
      return;
    }

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
      next: (data: any) => { this.services = data; },
      error: (err: any) => { console.error('Error al cargar servicios:', err); }
    });
  }

  loadClients(): void {
    this.userService.getClients().subscribe({
      next: (data: any[]) => { this.clients = data ?? []; },
      error: (err: any) => { console.error('Error al cargar clientes:', err); }
    });
  }

  // ====== FILTROS ======
  applyFilters(): void {
    this.loadAppointments();
  }

  clearFilters(): void {
    this.filters = { fecha: '', servicioId: undefined };
    this.applyFilters();
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filters.fecha = inputElement.value;
    this.applyFilters();
  }

  onServiceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filters.servicioId = selectElement.value ? Number(selectElement.value) : undefined;
    this.applyFilters();
  }

  onClientChange(_event: Event): void {
    // futuro filtro por cliente si deseas implementarlo
  }

  // ====== ESTADO CITA ======
  changeAppointmentStatus(appointment: any, newStatus: string): void {
    if (appointment.status === newStatus) return;

    this.citaService.updateAppointmentStatus(appointment.id, newStatus).subscribe({
      next: (updated: any) => { appointment.status = updated.status; },
      error: (err: any) => { console.error('Error al actualizar el estado de la cita:', err); }
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

  // ====== CLIENT INFO MODAL ======
  openClientInfo(appt: any): void {
    // En esta vista tienes userId y userName en la tabla
    const id = appt.userId as number | undefined;
    const byId = id ? this.clients.find((c: any) => c.id === id) : null;
    const byName = this.clients.find((c: any) => (c.name || c.fullName) === appt.userName);

    const contact = byId ?? byName ?? null;

    this.selectedClientId = id ?? contact?.id ?? null;
    this.selectedClientName = contact?.name || contact?.fullName || appt.userName;

    // Normaliza para el modal
    this.selectedClientContact = contact ? {
      id: contact.id,
      name: contact.name || contact.fullName,
      email: contact.email,
      phone: contact.phone || contact.celular,
      document: contact.document || contact.dni,
      createdAt: contact.createdAt
    } : null;

    if (this.selectedClientId) {
      this.showClientModal = true;
    } else {
      console.warn('No se pudo resolver el cliente (id/nombre). Verifica que la cita incluya userId.');
    }
  }

  closeClientInfo(): void {
    this.showClientModal = false;
    this.selectedClientId = null;
    this.selectedClientName = undefined;
    this.selectedClientContact = null;
  }
}
