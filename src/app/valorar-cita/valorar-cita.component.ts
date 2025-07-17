import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatingService } from '../services/rating.service';
import { CitaService } from '../services/cita.service';
import { ChatModalComponent } from './chat-modal.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-valorar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChatModalComponent],
  templateUrl: './valorar-cita.component.html',
  styleUrls: ['./valorar-cita.component.css']
})
export class ValorarCitaComponent implements OnInit {
  valoracionForm: FormGroup;
  appointmentId!: number;
  cita: any;
  mensaje: string = '';
  showChatModal = false;
  currentUserId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ratingService: RatingService,
    private citaService: CitaService,
    private userService: UserService
  ) {
    this.valoracionForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.appointmentId = +idParam;
        this.loadCitaDetails(this.appointmentId);
      } else {
        this.mensaje = 'ID de cita no proporcionado.';
      }
    });
    this.currentUserId = this.userService.getCurrentUserId();
  }

  loadCitaDetails(id: number): void {
    this.citaService.getAppointmentById(id).subscribe({
      next: data => {
        this.cita = data;
      },
      error: err => {
        console.error('Error al cargar detalles de la cita:', err);
        this.mensaje = err.error?.message || 'Error al cargar detalles de la cita.';
      }
    });
  }

  setRating(stars: number): void {
    this.valoracionForm.get('rating')?.setValue(stars);
  }

  submitRating(): void {
    if (this.valoracionForm.valid) {
      const { rating, comment } = this.valoracionForm.value;
      this.ratingService.createRating(this.appointmentId, rating, comment).subscribe({
        next: () => {
          this.mensaje = 'Valoración enviada con éxito.';
          // Redirigir al usuario o actualizar la vista de citas
          this.router.navigate(['/mis-citas']);
        },
        error: err => {
          this.mensaje = err.error?.message || 'Error al enviar la valoración.';
          console.error('Error al enviar la valoración:', err);
        }
      });
    } else {
      this.mensaje = 'Por favor, completa la calificación y el comentario (si aplica) correctamente.';
    }
  }

  goBack(): void {
    this.router.navigate(['/mis-citas']);
  }

  openChat() {
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
  }
} 