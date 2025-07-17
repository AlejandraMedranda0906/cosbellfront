import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, Category } from '../services/category.service';
import { ServicioService, Servicio } from '../services/servicio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-categoria-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria-detalle.component.html',
  styleUrls: ['./categoria-detalle.component.css']
})
export class CategoriaDetalleComponent implements OnInit {
  categoria: Category | null = null;
  servicios: Servicio[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private servicioService: ServicioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryService.getCategoryById(+id).subscribe(cat => this.categoria = cat);
      this.servicioService.getServiciosByCategory(+id).subscribe(servs => this.servicios = servs);
    }
  }

  goToServicio(id: number) {
    this.router.navigate(['/servicio', id]);
  }

  agendarCitaDesdeCategoria(servicioId: number) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    console.log('[CategoriaDetalle] Guardando preselectedServicioId en localStorage:', servicioId);
    localStorage.setItem('preselectedServicioId', servicioId.toString());
    this.router.navigate(['/agendar']);
  }
}
