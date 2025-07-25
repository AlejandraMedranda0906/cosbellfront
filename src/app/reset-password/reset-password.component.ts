import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent {
  form!: FormGroup;
  mensaje: string = '';
  loading = false;
  token: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  passwordsMatchValidator(form: any) {
    return form.get('newPassword').value === form.get('confirmPassword').value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.http.post(
      '/api/auth/reset-password?token=' + this.token + '&newPassword=' + this.form.value.newPassword,
      null,
      { responseType: 'text' }
    )
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta backend:', res);
          this.mensaje = res || 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.log('Error backend:', err);
          if (typeof err.error === 'string') {
            this.mensaje = err.error;
          } else if (err.error && err.error.message) {
            this.mensaje = err.error.message;
          } else {
            this.mensaje = 'El enlace no es válido o ha expirado.';
          }
          this.loading = false;
        }
      });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
} 