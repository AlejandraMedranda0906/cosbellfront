import { Component, OnInit } from '@angular/core';
import { PromotionService, Promotion } from '../../../services/promotion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.css']
})
export class PromotionsListComponent implements OnInit {
  promotions: Promotion[] = [];

  constructor(private promotionService: PromotionService) { }

  ngOnInit(): void {
    this.loadActivePromotions();
  }

  loadActivePromotions(): void {
    this.promotionService.getActivePromotions().subscribe(
      (data: Promotion[]) => {
        this.promotions = data;
      },
      (error: any) => {
        console.error('Error al cargar promociones activas:', error);
      }
    );
  }
} 