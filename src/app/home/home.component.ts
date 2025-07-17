import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../services/category.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PromotionsListComponent } from '../dashboard/client/promotions-list/promotions-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PromotionsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  categorias: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => this.categorias = data);
  }

  goToCategoria(id: number) {
    this.router.navigate(['/categoria', id]);
  }

  goToWhatsApp() {
    window.open('https://wa.me/593979000566', '_blank');
  }
}
