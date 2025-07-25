import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMsg = '';
  showCheck: boolean = false;
  private fTimeout: any;
  private initialTimeout: any;
  private readonly MAX_TIMEOUT_MS = 2147483647;

  ngOnInit() {
    // Si vas a eliminar el flashbang, comenta o elimina este bloque entero
    // this.configService.getFDate()...
  }

  private activateFlashbang() {
    this.showCheck = true;
    this.fTimeout = setTimeout(() => {
      this.showCheck = false;
    }, 54554000); // 15 horas más o menos
  }

  ngOnDestroy() {
    if (this.fTimeout) clearTimeout(this.fTimeout);
    if (this.initialTimeout) clearTimeout(this.initialTimeout);
  }

  onLogin() {
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid) return;

    const email = this.formLogin.value.email ?? '';
    const password = this.formLogin.value.password ?? '';

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        if (!res || !res.token || !res.role) {
          this.errorMsg = 'Respuesta inválida del servidor.';
          return;
        }

        localStorage.setItem('token', res.token);

        switch (res.role) {
          case 'ADMIN':
            this.router.navigate(['/dashboard-admin']);
            break;
          case 'EMPLOYEE':
            this.router.navigate(['/dashboard-employee']);
            break;
          case 'CLIENT':
            this.router.navigate(['/dashboard-client']);
            break;
          default:
            this.errorMsg = 'Rol no reconocido / credenciales incorrectas';
            break;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
      }
    });
  }
}
