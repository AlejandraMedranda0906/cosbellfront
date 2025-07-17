import { Component, OnInit } from '@angular/core';
import { ServiciosComponent } from '../../servicios/servicios.component';
import { PromotionsListComponent } from '../client/promotions-list/promotions-list.component'; // Importa el componente de promociones
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, PromotionsListComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {

  userName: string | null = null;
  categorias: Category[] = [];

  constructor(private router: Router, private authService: AuthService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.userName = this.authService.getName();
    this.categoryService.getAllCategories().subscribe(data => this.categorias = data);
  }

  goToMisCitas() {
    this.router.navigate(['mis-citas']); 
  }

  goToCategoria(id: number) {
    this.router.navigate(['/categoria', id]);
  }
}
