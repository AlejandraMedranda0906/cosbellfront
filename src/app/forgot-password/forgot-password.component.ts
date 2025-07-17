import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  mensaje: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.http.post('http://localhost:8081/api/auth/forgot-password?email=' + this.form.value.email, null)
      .subscribe({
        next: () => {
          this.mensaje = 'Si el correo existe, se ha enviado un enlace de recuperación.';
          this.loading = false;
        },
        error: () => {
          this.mensaje = 'Si el correo existe, se ha enviado un enlace de recuperación.';
          this.loading = false;
        }
      });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
} 