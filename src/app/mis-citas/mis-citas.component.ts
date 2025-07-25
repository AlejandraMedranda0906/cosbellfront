import { Component, OnInit } from '@angular/core';
import { CitaService } from '../services/cita.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../services/servicio.service';
import { Servicio } from '../services/servicio.service';
import { ChatModalComponent } from '../valorar-cita/chat-modal.component';
import { UserService } from '../services/user.service';

interface Cita {
  id: number;
  servicioId: number;
  userId: number;
  email: string;
  employeeId: number;
  employeeName: string;
  fecha: string;
  hora: string;
  phone: string;
  serviceName: string;
  status: string;
  userName: string;
  hasBeenRated: boolean;
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatModalComponent],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  mensaje = '';
  email = '';

  filterMonth: number | null = null;
  filterYear: number | null = null;
  filterServiceId: number | null = null;
  servicios: Servicio[] = [];
  showChatModal = false;
  selectedAppointmentId: number = 0;
  currentUserId: number = 0;

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private router: Router,
    private servicioService: ServicioService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.cargarServicios();
    this.cargarCitas();
    this.currentUserId = this.userService.getCurrentUserId();
  }

  cargarServicios() {
    this.servicioService.getAllServicios().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
      },
      error: (err: any) => {
        console.error('Error al cargar servicios:', err);
      }
    });
  }

  cargarCitas() {
    const userId = this.authService.getUserId();
    if (userId === null) {
      this.mensaje = 'Error: Debes iniciar sesión para ver tus citas.';
      this.citas = [];
      this.citasFiltradas = [];
      return;
    }

    this.citaService.getCitasPorUsuario(userId, null, null, null).subscribe({
      next: (data: Cita[]) => {
        this.citas = data;
        this.filtrarCitas();
        this.mensaje = '';
      },
      error: (err: any) => {
        console.error('Error al cargar citas:', err);
        this.mensaje = err.error?.message || 'Error al cargar tus citas.';
        this.citas = [];
        this.citasFiltradas = [];
      }
    });
  }

  aplicarFiltros() {
    this.filtrarCitas();
  }

  limpiarFiltros() {
    this.filterMonth = null;
    this.filterYear = null;
    this.filterServiceId = null;
    this.filtrarCitas();
  }

  filtrarCitas() {
    this.citasFiltradas = this.citas.filter(cita => {
      let [day, month, year] = cita.fecha.includes('/')
        ? cita.fecha.split('/').map(Number)
        : cita.fecha.split('-').map(Number).reverse();

      const fechaCita = new Date(year, month - 1, day);

      const cumpleMes = this.filterMonth ? (fechaCita.getMonth() + 1) === this.filterMonth : true;
      const cumpleAño = this.filterYear ? fechaCita.getFullYear() === this.filterYear : true;
      const cumpleServicio = this.filterServiceId ? cita.servicioId === this.filterServiceId : true;

      return cumpleMes && cumpleAño && cumpleServicio;
    });
  }

  isPastAppointment(cita: Cita): boolean {
    const [day, month, year] = cita.fecha.split('/').map(Number);
    const [hours, minutes, seconds] = cita.hora.split(':').map(Number);
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes, seconds);
    return appointmentDateTime < new Date();
  }

  cancelarCita(id: number) {
    if (confirm('¿Seguro que deseas cancelar esta cita?')) {
      this.citaService.cancelarCita(id).subscribe({
        next: () => {
          this.mensaje = 'Cita cancelada correctamente';
          this.cargarCitas();
        },
        error: (err: any) =>
          this.mensaje = err.error?.message || 'Error al cancelar'
      });
    }
  }

  editarCita(citaId: number) {
    this.router.navigate(['/agendar-cita/edit', citaId]);
  }

  goToValorarCita(appointmentId: number) {
    this.router.navigate(['/valorar-cita', appointmentId]);
  }

  openChat(appointmentId: number) {
    this.selectedAppointmentId = appointmentId;
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
  }

  goToDashboardClient() {
    this.router.navigate(['/dashboard-client']);
  }
}
