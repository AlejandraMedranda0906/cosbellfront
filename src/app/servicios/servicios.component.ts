import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../services/servicio.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Servicio } from '../services/servicio.service'; // Importar la interfaz Servicio
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];

  constructor(private servicioService: ServicioService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.servicioService.getAllServicios().subscribe((data: Servicio[]) => {
      console.log('Datos de servicios recibidos:', data);
      this.servicios = data;
    });
  }

  agendarCita(servicioId: number | undefined) {
    if (servicioId !== undefined) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        return;
      }
      localStorage.setItem('preselectedServicioId', servicioId.toString());
      this.router.navigate(['/agendar']);
    } else {
      console.error('No se pudo agendar la cita: ID de servicio no definido.');
    }
  }
}