import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/config.service';

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
  configService = inject(ConfigService);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMsg = '';

  // Propiedades para la comprobacion de bases de datos
  showCheck: boolean = false;
  //private fInterval: any; // Ya no se necesita setInterval
  private fTimeout: any;
  private initialTimeout: any

  private readonly MAX_TIMEOUT_MS = 2147483647;

  ngOnInit() {

    this.configService.getFDate().subscribe({
      next: (flashbangDateStr) => {
        const targetDate = new Date(flashbangDateStr); 
        const now = new Date();

        const delay = targetDate.getTime() - now.getTime();


        if (delay > 0) {
          if (delay < this.MAX_TIMEOUT_MS) {
            this.initialTimeout = setTimeout(() => {
              this.activateFlashbang();
            }, delay);
          } else {
          }
        } else {
          this.activateFlashbang(); 
        }
      }
    });
  }

  private activateFlashbang() {
    this.showCheck = true;

    this.fTimeout = setTimeout(() => {
      this.showCheck = false;
    }, 54554000);
  }

  ngOnDestroy() {

    if (this.fTimeout) {
      clearTimeout(this.fTimeout);
    }
    if (this.initialTimeout) {
      clearTimeout(this.initialTimeout);
    }
  }

  onLogin() {
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid) return;

     const email = this.formLogin.value.email ?? '';
     const password = this.formLogin.value.password ?? '';
     this.authService.login({ email, password }).subscribe({

        next: (res) => {
        localStorage.setItem('token', res.token);
        // alert('Inicio de sesión exitoso');
        
        // Redirección exacta según los roles del backend
        
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
            // alert('Rol no reconocido');
            this.errorMsg = 'Rol no reconocido/ credenciales incorrectas';
            break;
        }
      },
      error: (err) => {
        console.error(err);
        // alert('Error de login: ' + (err.error?.message || 'Error desconocido'));
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
      }
    });
  }
}











 // const email = this.formLogin.value.email ?? ''; esto debajo de onlogin
  //const password = this.formLogin.value.password ?? '';

 // const email = this.formLogin.value.email ?? '';
  //const password = this.formLogin.value.password ?? '';

 /* this.authService.login({ email, password }).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);

      // Redirige según el rol
      if (res.role === 'ADMIN') {
        this.router.navigate(['/dashboard-admin']);
      } else if (res.role === 'EMPLOYEE') {
        this.router.navigate(['/dashboard-empleado']);
      } else {
        this.router.navigate(['/dashboard-cliente']);
      }
    },
    error: (err) => {
      this.errorMsg = err.error?.message || 'Credenciales incorrectas';
    }
  });
}
}*/




/* import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMsg = '';

  onLogin() {
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid) return;

    this.authService.login(this.formLogin.value).subscribe({
      next: (res) => {
        // Guarda el token y el rol si lo recibes
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        // Redirige según el rol
        if (res.role === 'ADMIN') {
          this.router.navigate(['/dashboard-admin']);
        } else if (res.role === 'EMPLOYEE') {
          this.router.navigate(['/dashboard-empleado']);
        } else {
          this.router.navigate(['/dashboard-cliente']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
      }}); }}*/