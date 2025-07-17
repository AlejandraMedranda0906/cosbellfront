import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarViewComponent } from './calendar-view.component';
import { CitaService } from './services/cita.service';
import { UserService } from './services/user.service';
import { ServicioService } from './services/servicio.service';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-agendar-cita-flujo',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarViewComponent, AgendarCitaComponent],
  templateUrl: './agendar-cita-flujo.component.html',
  styleUrls: ['./agendar-cita-flujo.component.css']
})
export class AgendarCitaFlujoComponent {
  events: EventInput[] = [];
  showModal = false;
  selectedDate: string = '';
  selectedTime: string = '';
  selectedEmployeeId: number | null = null;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;
  employeeServices: any[] = [];
  servicios: any[] = [];
  selectedServicioId: number | null = null;
  preselectedServicioId: number | null = null;
  servicioPreseleccionado: boolean = false;
  availableSlots: string[] = [];
  private visibleRange: {start: string, end: string} | null = null;

  constructor(private citaService: CitaService, private userService: UserService, private servicioService: ServicioService) {
    this.loadServicios();
  }

  loadServicios() {
    this.servicioService.getAllServicios().subscribe(servs => {
      this.servicios = servs;
      // Si hay un servicio preseleccionado en localStorage, siempre usarlo y sobrescribir el seleccionado
      const storedServicioId = localStorage.getItem('preselectedServicioId');
      if (storedServicioId) {
        this.selectedServicioId = +storedServicioId;
        this.servicioPreseleccionado = true;
        localStorage.removeItem('preselectedServicioId');
      }
      this.loadEmployees();
    });
  }

  loadEmployees() {
    this.userService.getEmployees().subscribe(emps => {
      this.employees = emps;
      this.filterEmployeesByServicio();
    });
  }

  filterEmployeesByServicio() {
    if (!this.selectedServicioId) {
      this.filteredEmployees = [];
      return;
    }
    this.filteredEmployees = this.employees.filter(emp =>
      emp.services && emp.services.some((s: any) => s.id === this.selectedServicioId)
    );
    this.selectedEmployeeId = null;
    this.selectedEmployee = null;
    this.employeeServices = [];
    this.events = [];
  }

  onServicioChange() {
    this.filterEmployeesByServicio();
  }

  onVisibleRangeChange(range: {start: string, end: string}) {
    this.visibleRange = range;
    this.loadAvailableSlots(range);
  }

  onEmployeeChange() {
    if (!this.selectedEmployeeId) return;
    this.selectedEmployee = this.filteredEmployees.find(e => e.id === this.selectedEmployeeId);
    this.employeeServices = this.selectedEmployee?.services.filter((s: any) => s.id === this.selectedServicioId) || [];
    this.loadEvents();
    if (this.visibleRange) {
      this.loadAvailableSlots(this.visibleRange);
    } else {
      this.loadAvailableSlots();
    }
  }

  loadAvailableSlots(range?: {start: string, end: string}) {
    if (!this.selectedEmployeeId || !this.selectedServicioId) {
      this.availableSlots = [];
      return;
    }
    const slots: string[] = [];
    let startDate: Date;
    let endDate: Date;
    if (range) {
      startDate = new Date(range.start);
      endDate = new Date(range.end);
    } else {
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(startDate.getDate() + 6);
    }
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      this.citaService.getAvailableTimes(dateStr, this.selectedServicioId!, this.selectedEmployeeId!).subscribe(times => {
        times.forEach(time => {
          slots.push(`${dateStr}T${time}`);
        });
        this.availableSlots = [...slots];
      });
    }
  }

  loadEvents() {
    if (!this.selectedEmployeeId || !this.selectedServicioId) {
      this.events = [];
      return;
    }
    this.citaService.getAllAppointments({ employeeId: this.selectedEmployeeId, servicioId: this.selectedServicioId }).subscribe(citas => {
      this.events = citas.map(cita => {
        let hora = cita.hora;
        if (hora.length === 5) hora += ':00';
        const startStr = `${cita.fecha}T${hora}`;
        let end = startStr;
        if (cita.serviceDuration) {
          const startDate = new Date(startStr);
          const endDate = new Date(startDate.getTime() + cita.serviceDuration * 60000);
          const pad = (n: number) => n.toString().padStart(2, '0');
          const endStr = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;
          end = endStr;
        }
        // Mostrar cliente, servicio y profesional
        const cliente = cita.userName || 'Cliente';
        const servicio = cita.serviceName || 'Servicio';
        const profesional = cita.employeeName || 'Profesional';
        return {
          title: `Cliente: ${cliente}\nServicio: ${servicio}\nProfesional: ${profesional}`,
          start: startStr,
          end: end,
          color: '#bdbdbd',
          extendedProps: { employeeId: cita.employeeId }
        };
      });
    });
  }

  onSlotSelected(event: any) {
    console.log('[onSlotSelected] Evento recibido:', event);
    this.selectedDate = event.dateStr.split('T')[0];
    const rawTime = event.dateStr.split('T')[1] || '';
    this.selectedTime = rawTime.length >= 5 ? rawTime.slice(0,5) : rawTime;
    console.log('[onSlotSelected] selectedDate:', this.selectedDate, 'rawTime:', rawTime, 'selectedTime:', this.selectedTime);
    this.employeeServices = this.filteredEmployees.find(e => e.id === this.selectedEmployeeId)?.services.filter((s: any) => s.id === this.selectedServicioId) || [];
    this.preselectedServicioId = this.selectedServicioId;
    console.log('[onSlotSelected] Datos enviados al modal:', {
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      selectedEmployeeId: this.selectedEmployeeId,
      preselectedServicioId: this.preselectedServicioId,
      employeeServices: this.employeeServices
    });
    this.showModal = false;
    setTimeout(() => this.showModal = true, 0);
  }

  closeModal() {
    this.showModal = false;
    this.selectedDate = '';
    this.selectedTime = '';
    // No limpiar selectedEmployeeId ni selectedServicioId para mantener la selección
    // Solo limpiar los datos del modal
    // this.selectedEmployeeId = null;
    // this.selectedEmployee = null;
    // this.employeeServices = [];
    // this.events = [];
  }
} 