import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicioService, Servicio } from '../services/servicio.service';
import { RatingService } from '../services/rating.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent implements OnInit {
  servicio: Servicio | null = null;
  ratings: any[] = [];
  ratingsLoaded = false;
  averageRating = 0;
  totalRatings = 0;
  starCounts = [0, 0, 0, 0, 0]; // 5,4,3,2,1
  recommendPercent = 0;
  public Math = Math;

  constructor(
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private ratingService: RatingService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.servicioService.getServicioById(+id).subscribe(serv => {
        this.servicio = serv;
        this.loadRatings(serv.id!);
      });
    }
  }

  loadRatings(serviceId: number) {
    this.ratingService.getRatingsByService(serviceId).subscribe(ratings => {
      this.ratings = ratings;
      this.totalRatings = ratings.length;
      if (this.totalRatings > 0) {
        const sum = ratings.reduce((acc: number, r: any) => acc + r.rating, 0);
        this.averageRating = +(sum / this.totalRatings).toFixed(1);
        // Contar estrellas
        this.starCounts = [5,4,3,2,1].map(star => ratings.filter((r: any) => r.rating === star).length);
        // % recomendación (4 o 5 estrellas)
        const recommendCount = ratings.filter((r: any) => r.rating >= 4).length;
        this.recommendPercent = Math.round((recommendCount / this.totalRatings) * 100);
      } else {
        this.averageRating = 0;
        this.starCounts = [0,0,0,0,0];
        this.recommendPercent = 0;
      }
      this.ratingsLoaded = true;
    });
  }

  agendarCita() {
    if (this.servicio?.id) {
      this.router.navigate(['/agendar-cita/new', this.servicio.id]);
    }
  }

  goToAgendarCita() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.servicio?.id) {
      localStorage.setItem('preselectedServicioId', this.servicio.id.toString());
      this.router.navigate(['/agendar']);
    }
  }
} 