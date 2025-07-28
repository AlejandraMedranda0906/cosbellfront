import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AdminAppointmentsComponent } from './dashboard/admin/admin-appointments/admin-appointments.component';
import { AdminServiciosComponent } from './dashboard/admin/admin-servicios/admin-servicios.component';
import { AdminPromotionsComponent } from './dashboard/admin/admin-promotions/admin-promotions.component'; // Importa el componente de promociones
import { AdminProfessionalRegisterComponent } from './dashboard/admin/admin-professional-register/admin-professional-register.component'; // Importa el componente de registro de profesionales
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { AdminPersonalComponent } from './dashboard/admin/admin-personal.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./dashboard/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'citas', component: AdminAppointmentsComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
      { path: 'servicios', component: AdminServiciosComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
      { path: 'promociones', component: AdminPromotionsComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } }, // Nueva ruta para promociones
      { path: 'registrar-profesional', component: AdminProfessionalRegisterComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
      { path: 'personal', component: AdminPersonalComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
      { path: 'estadisticas', loadComponent: () => import('./dashboard/admin/dashboard-stats/dashboard-stats.component').then(m => m.DashboardStatsComponent) }

       // Nueva ruta para registrar profesionales
    ]
  },
  { path: 'dashboard-employee', loadComponent: () => import('./dashboard/employee/employee.component').then(m => m.EmployeeComponent), canActivate: [authGuard], data: { roles: ['EMPLOYEE'] } },
  { path: 'dashboard-client', loadComponent: () => import('./dashboard/client/client.component').then(m => m.ClientComponent), canActivate: [authGuard], data: { roles: ['CLIENT'] }  },
  { path: 'servicios', loadComponent: () => import('./servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'agendar-cita', loadComponent: () => import('./agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent) },
  { path: 'agendar-cita/new/:servicioId', loadComponent: () => import('./agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent) },
  { path: 'agendar-cita/edit/:citaId', loadComponent: () => import('./agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent) },
  { path: 'agendar', loadComponent: () => import('./agendar-cita-flujo.component').then(m => m.AgendarCitaFlujoComponent) },
  { path: 'mis-citas', loadComponent: () => import('./mis-citas/mis-citas.component').then(m => m.MisCitasComponent) },
  { path: 'valorar-cita/:id', loadComponent: () => import('./valorar-cita/valorar-cita.component').then(m => m.ValorarCitaComponent) },
  { path: 'categoria/:id', loadComponent: () => import('./categoria-detalle/categoria-detalle.component').then(m => m.CategoriaDetalleComponent) },
  { path: 'servicio/:id', loadComponent: () => import('./servicio-detalle/servicio-detalle.component').then(m => m.ServicioDetalleComponent) },
  { path: '**', redirectTo: '' }
];

// Note: The above routes are lazy-loaded, meaning the components will be loaded only when the route is accessed.