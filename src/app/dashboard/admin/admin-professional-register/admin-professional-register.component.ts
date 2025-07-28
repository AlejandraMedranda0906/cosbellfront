import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfessionalRegistrationService, HorarioRequest } from '../../../services/professional-registration.service';
import { ServicioService, Servicio } from '../../../services/servicio.service';
import { RoleService } from '../../../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-professional-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-professional-register.component.html',
  styleUrls: ['./admin-professional-register.component.css']
})
export class AdminProfessionalRegisterComponent implements OnInit {
  professionalForm: FormGroup;
  servicios: Servicio[] = [];
  roles: any[] = [];
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private professionalRegistrationService: ProfessionalRegistrationService,
    private servicioService: ServicioService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.professionalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^0[0-9]{9}$'),
        Validators.maxLength(10)
      ]], // Solo acepta 10 dígitos y empieza con 0
      roleName: ['EMPLOYEE', Validators.required],
      serviceIds: this.fb.array([]),
      schedules: this.fb.array([])
    });

    // Precargar datos si vienen del estado de navegación
    const nav = this.router.getCurrentNavigation();
    const user = nav?.extras?.state?.['user'];
    if (user) {
      this.professionalForm.patchValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        roleName: user.roleName || user.role || (user.roles?.[0]?.name || 'EMPLOYEE'),
      });
      if (user.services && Array.isArray(user.services)) {
        const ids = user.services.map((s: any) => s.id);
        this.professionalForm.setControl('serviceIds', this.fb.array(ids));
      }
      if (user.schedules && Array.isArray(user.schedules)) {
        const schedulesArray = new FormArray<FormGroup>([]);
        user.schedules.forEach((h: any) => {
          schedulesArray.push(this.fb.group({
            dia: [h.dia || h.day || ''],
            horaInicio: [h.horaInicio || h.startTime || ''],
            horaFin: [h.horaFin || h.endTime || '']
          }));
        });
        this.professionalForm.setControl('schedules', schedulesArray);
      } else if (user.horarios && Array.isArray(user.horarios)) {
        const schedulesArray = new FormArray<FormGroup>([]);
        user.horarios.forEach((h: any) => {
          schedulesArray.push(this.fb.group({
            dia: [h.dia || h.day || ''],
            horaInicio: [h.horaInicio || h.startTime || ''],
            horaFin: [h.horaFin || h.endTime || '']
          }));
        });
        this.professionalForm.setControl('schedules', schedulesArray);
      }
    }

    this.professionalForm.get('roleName')?.valueChanges.subscribe(role => {
      this.updateValidationForRole(role);
    });
  }

  ngOnInit(): void {
    this.loadServicios();
    this.loadRoles();
    this.addSchedule();
  }

  updateValidationForRole(role: string): void {
    const schedulesArray = this.schedulesFormArray;
    if (role === 'ADMIN') {
      schedulesArray.controls.forEach(control => {
        control.get('dia')?.clearValidators();
        control.get('horaInicio')?.clearValidators();
        control.get('horaFin')?.clearValidators();
        control.get('dia')?.updateValueAndValidity();
        control.get('horaInicio')?.updateValueAndValidity();
        control.get('horaFin')?.updateValueAndValidity();
      });
    } else {
      schedulesArray.controls.forEach(control => {
        control.get('dia')?.setValidators(Validators.required);
        control.get('horaInicio')?.setValidators(Validators.required);
        control.get('horaFin')?.setValidators(Validators.required);
        control.get('dia')?.updateValueAndValidity();
        control.get('horaInicio')?.updateValueAndValidity();
        control.get('horaFin')?.updateValueAndValidity();
      });
    }
  }

  loadServicios(): void {
    this.servicioService.getAllServicios().subscribe(
      (data: Servicio[]) => {
        this.servicios = data;
      },
      (error: any) => {
        console.error('Error al cargar servicios:', error);
      }
    );
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (data: any[]) => {
        this.roles = data.filter(role => role.name === 'EMPLOYEE' || role.name === 'ADMIN');
      },
      (error: any) => {
        console.error('Error al cargar roles:', error);
      }
    );
  }

  get serviceIdsFormArray() {
    return this.professionalForm.get('serviceIds') as FormArray;
  }

  onServiceCheckboxChange(event: any) {
    const serviceId = Number(event.target.value);
    if (event.target.checked) {
      this.serviceIdsFormArray.push(this.fb.control(serviceId));
    } else {
      const index = this.serviceIdsFormArray.controls.findIndex(x => x.value === serviceId);
      this.serviceIdsFormArray.removeAt(index);
    }
  }

  get schedulesFormArray() {
    return this.professionalForm.get('schedules') as FormArray;
  }

  addSchedule(): void {
    const role = this.professionalForm.get('roleName')?.value;
    const isRequired = role === 'EMPLOYEE';
    this.schedulesFormArray.push(this.fb.group({
      dia: ['', isRequired ? Validators.required : []],
      horaInicio: ['', isRequired ? Validators.required : []],
      horaFin: ['', isRequired ? Validators.required : []]
    }));
  }

  removeSchedule(index: number): void {
    this.schedulesFormArray.removeAt(index);
  }

  isFormValid(): boolean {
    const role = this.professionalForm.get('roleName')?.value;
    const basicFieldsValid = !!(
      this.professionalForm.get('name')?.valid &&
      this.professionalForm.get('email')?.valid &&
      this.professionalForm.get('password')?.valid &&
      this.professionalForm.get('phone')?.valid &&
      this.professionalForm.get('roleName')?.valid
    );
    if (role === 'ADMIN') {
      return basicFieldsValid;
    } else {
      const schedulesValid = this.schedulesFormArray.controls.every(control =>
        !!(control.get('dia')?.valid &&
          control.get('horaInicio')?.valid &&
          control.get('horaFin')?.valid)
      );
      return basicFieldsValid && schedulesValid;
    }
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.mensaje = 'Por favor, complete todos los campos requeridos y corrija los errores.';
      return;
    }

    const requestData = this.professionalForm.value;
    this.professionalRegistrationService.registerProfessional(requestData).subscribe(
      (response: any) => {
        this.mensaje = response.message || 'Profesional registrado exitosamente!';
        this.professionalForm.reset({ roleName: 'EMPLOYEE' });
        this.serviceIdsFormArray.clear();
        this.schedulesFormArray.clear();
        this.addSchedule();
      },
      (error: any) => {
        this.mensaje = error.error?.message || 'Error al registrar profesional. Intente de nuevo.';
      }
    );
  }

  isServiceChecked(serviceId: number): boolean {
    return this.serviceIdsFormArray.value.includes(serviceId);
  }

  aplicarHorarioEstandar() {
    // Borra todos los horarios anteriores
    while (this.schedulesFormArray.length > 0) {
      this.schedulesFormArray.removeAt(0);
    }
    const dias = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    dias.forEach(dia => {
      this.schedulesFormArray.push(this.fb.group({
        dia: [dia, Validators.required],
        horaInicio: ['09:00', Validators.required],
        horaFin: ['18:00', Validators.required]
      }));
    });
  }

}
