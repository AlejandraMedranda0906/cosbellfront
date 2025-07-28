import { Component, inject, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  title = 'cosbell-app';

  fb = inject(FormBuilder);
  authService = inject(AuthService);

  formRegister = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^0[0-9]{9}$/),
      Validators.maxLength(10)
    ]],
    role: ['CLIENT'],
    termsAccepted: [false, [Validators.requiredTrue]]
  });

  keyboard: Keyboard | null = null;
  value = '';

  errorMsg = '';
  successMsg = '';
  isSubmitting = false;

  ngAfterViewInit() {
    try {
      const keyboardElement = document.querySelector('.simple-keyboard');
      if (keyboardElement) {
        this.keyboard = new Keyboard({
          onChange: input => this.onChange(input),
          onKeyPress: button => this.onKeyPress(button),
          mergeDisplay: true,
          layoutName: 'default',
          layout: {
            default: [
              'q w e r t y u i o p',
              'a s d f g h j k l',
              '{shift} z x c v b n m {backspace}',
              '{numbers} {space} {ent}'
            ],
            shift: [
              'Q W E R T Y U I O P',
              'A S D F G H J K L',
              '{shift} Z X C V B N M {backspace}',
              '{numbers} {space} {ent}'
            ],
            numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}']
          },
          display: {
            '{numbers}': '123',
            '{ent}': 'return',
            '{backspace}': '⌫',
            '{shift}': '⇧',
            '{abc}': 'ABC'
          }
        });
      }
    } catch (error) {
      console.warn('Error al inicializar el teclado virtual:', error);
    }
  }

  onChange = (input: string) => {
    this.value = input;
    this.formRegister.get('name')?.setValue(input);
  };

  onInputChange = (event: any) => {
    this.value = event.target.value;
    if (this.keyboard) {
      this.keyboard.setInput(this.value);
    }
    this.formRegister.get('name')?.setValue(this.value);
  };

  onKeyPress = (button: string) => {
    if (!this.keyboard) return;

    if (button === '{shift}' || button === '{lock}') this.handleShift();
    if (button === '{numbers}' || button === '{abc}') this.handleNumbers();
  };

  handleShift = () => {
    if (!this.keyboard) return;
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
    this.keyboard.setOptions({ layoutName: shiftToggle });
  };

  handleNumbers = () => {
    if (!this.keyboard) return;
    let currentLayout = this.keyboard.options.layoutName;
    let toggle = currentLayout !== 'numbers' ? 'numbers' : 'default';
    this.keyboard.setOptions({ layoutName: toggle });
  };

  onRegister() {
    this.formRegister.markAllAsTouched();

    if (this.formRegister.invalid) return;

    this.errorMsg = '';
    this.successMsg = '';
    this.isSubmitting = true;

    this.authService.register(this.formRegister.value).pipe(
      catchError((err) => {
        this.errorMsg = err.error?.message || JSON.stringify(err.error) || 'Error desconocido';
        this.isSubmitting = false;
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.successMsg = 'Registro exitoso';
        this.formRegister.reset();
        if (this.keyboard) this.keyboard.clearInput();
        this.value = '';
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy() {}
}
