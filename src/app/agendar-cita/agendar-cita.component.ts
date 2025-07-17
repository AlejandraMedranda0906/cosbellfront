import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { ServicioService } from '../services/servicio.service';
import { CitaService } from '../services/cita.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AgendarCitaComponent implements OnInit, OnChanges {
  @Input() preselectedFecha: string = '';
  @Input() preselectedHora: string = '';
  @Input() preselectedEmployeeId: number | null = null;
  @Input() preselectedServicioId: number | null = null;
  @Input() servicios: any[] = [];
  @Output() close = new EventEmitter<void>();

  formCita: any;
  employees: any[] = [];
  mensaje: string = '';
  availableTimes: string[] = [];
  private unsubscribe$ = new Subject<void>();

  isEditMode: boolean = false;
  currentCitaId: number | null = null;

  // Validador personalizado para evitar fechas pasadas
  dateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo la fecha

      if (selectedDate < today) {
        return { 'dateInPast': { value: control.value } };
      }
      return null;
    };
  }

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private citaService: CitaService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.formCita = this.fb.group({
      servicioId: ['', Validators.required],
      fecha: ['', [Validators.required, this.dateNotPastValidator()]],
      hora: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const servicioIdFromRoute = params.get('servicioId');
      const citaIdFromRoute = params.get('citaId');

      if (citaIdFromRoute) {
        this.isEditMode = true;
        this.currentCitaId = Number(citaIdFromRoute);
        this.cargarDatosCitaParaEdicion(this.currentCitaId);
      } else if (servicioIdFromRoute) {
        this.formCita.get('servicioId')?.setValue(servicioIdFromRoute);
      }
    });

    this.servicioService.getAllServicios().subscribe((data: any[]) => this.servicios = data);
    this.userService.getEmployees().subscribe((data: any[]) => this.employees = data);

    this.formCita.get('servicioId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateAvailableTimes());
    this.formCita.get('fecha').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateAvailableTimes());
    this.formCita.get('employeeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateAvailableTimes());

    // Elimina la lógica que ponía los valores de los @Input aquí
    // Solo forzar la consulta de horarios disponibles al abrir el modal
    this.updateAvailableTimes();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formCita.get('fecha')?.setValue(this.preselectedFecha ?? '');
    this.formCita.get('employeeId')?.setValue(this.preselectedEmployeeId ?? '');
    this.formCita.get('servicioId')?.setValue(this.preselectedServicioId ?? '');
    this.updateAvailableTimes();
    // Elimina el setTimeout aquí
    console.log('[AgendarCitaComponent] preselectedHora:', this.preselectedHora, 'form hora:', this.formCita.get('hora')?.value);
  }

  cargarDatosCitaParaEdicion(citaId: number) {
    this.citaService.getAppointmentById(citaId).subscribe({
      next: (cita: any) => {
        this.formCita.patchValue({
          servicioId: cita.servicio.id,
          fecha: cita.fecha,
          hora: cita.hora,
          email: cita.email,
          phone: cita.phone,
          employeeId: cita.employee.id
        });
        this.updateAvailableTimes();
      },
      error: (err: any) => {
        console.error('Error al cargar la cita para edición:', err);
        this.mensaje = err.error?.message || 'Error al cargar la cita para edición.';
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateAvailableTimes() {
    const servicioId = this.formCita.get('servicioId').value;
    const fecha = this.formCita.get('fecha').value;
    const employeeId = this.formCita.get('employeeId').value;

    if (servicioId && fecha) {
      this.citaService.getAvailableTimes(fecha, servicioId, employeeId).subscribe({
        next: (times: string[]) => {
          this.availableTimes = times.map(hora => hora.slice(0,5));
          const selectedTime = (this.formCita.get('hora').value || '').slice(0,5);
          if (selectedTime && !this.availableTimes.includes(selectedTime)) {
            this.formCita.get('hora').setValue('');
          }
          console.log('[AgendarCitaComponent] availableTimes:', this.availableTimes, 'fecha:', fecha, 'servicioId:', servicioId, 'employeeId:', employeeId);
          // Setear la hora seleccionada solo cuando availableTimes ya está actualizado
          const horaCorta = (this.preselectedHora || '').slice(0,5);
          if (horaCorta && this.availableTimes.includes(horaCorta)) {
            this.formCita.get('hora')?.setValue(horaCorta);
            console.log('[AgendarCitaComponent] (fix) Seteando hora después de cargar availableTimes:', horaCorta);
          }
          if (this.availableTimes.length === 0 && servicioId && fecha) {
            this.mensaje = 'No hay horarios disponibles para esta fecha y servicio.';
          } else {
            this.mensaje = '';
          }
        },
        error: (err: any) => {
          console.error('Error al obtener horarios disponibles', err);
          this.availableTimes = [];
          this.formCita.get('hora').setValue('');
          this.mensaje = err.error?.message || 'Error al cargar horarios. Intenta de nuevo.';
        }
      });
    } else {
      this.availableTimes = [];
      this.formCita.get('hora').setValue('');
      this.mensaje = '';
    }
  }

  agendarCita() {
    if (this.formCita.invalid) return;

    const formValue = this.formCita.value;
    const data = {
      servicioId: Number(formValue.servicioId),
      userId: this.authService.getUserId(),
      fecha: formValue.fecha as string,
      hora: formValue.hora as string,
      email: formValue.email as string,
      phone: formValue.phone as string,
      employeeId: Number(formValue.employeeId)
    };

    if (data.userId === null) {
      this.mensaje = 'Error: Debes iniciar sesión para agendar o modificar una cita.';
      return;
    }

    console.log('Datos a enviar para agendar/modificar cita:', data);

    if (this.isEditMode && this.currentCitaId !== null) {
      this.citaService.updateCita(this.currentCitaId, {
        servicioId: data.servicioId,
        userId: data.userId!,
        fecha: data.fecha,
        hora: data.hora,
        email: data.email,
        phone: data.phone,
        employeeId: data.employeeId
      }).subscribe({
        next: (res: any) => {
          this.mensaje = 'Cita modificada correctamente';
        },
        error: (err: any) => this.mensaje = err.error?.message || 'Error al modificar cita'
      });
    } else {
      this.citaService.agendarCita({
        servicioId: data.servicioId,
        userId: data.userId!,
        fecha: data.fecha,
        hora: data.hora,
        email: data.email,
        phone: data.phone,
        employeeId: data.employeeId
      }).subscribe({
        next: (res: any) => {
        this.mensaje = 'Cita agendada correctamente';
        this.formCita.reset();
        this.close.emit();
      },
        error: (err: any) => this.mensaje = err.error?.message || 'Error al agendar'
    });
    }
  }

  goToDashboardClient() {
    this.router.navigate(['/dashboard-client']);
  }
}