import { Component, OnInit } from '@angular/core';
import { PromotionService, Promotion } from '../../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-promotions.component.html',
  styleUrls: ['./admin-promotions.component.css']
})
export class AdminPromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  selectedPromotion: Promotion | null = null;
  newPromotionForm: Promotion = {
    name: '',
    description: '',
    startDate: this.formatDate(new Date()), // Default to today
    endDate: this.formatDate(new Date()),   // Default to today
    conditions: '',
    image_url: ''
  };
  showForm: boolean = false;

  constructor(private promotionService: PromotionService) { }

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promotionService.getAllPromotions().subscribe(
      (data: Promotion[]) => {
        this.promotions = data;
      },
      (error: any) => {
        console.error('Error al cargar promociones:', error);
      }
    );
  }

  editPromotion(promotion: Promotion): void {
    this.selectedPromotion = { ...promotion };
    this.newPromotionForm = { ...promotion };
    this.showForm = true;
  }

  newPromotion(): void {
    this.selectedPromotion = null;
    this.newPromotionForm = {
      name: '',
      description: '',
      startDate: this.formatDate(new Date()),
      endDate: this.formatDate(new Date()),
      conditions: '',
      image_url: ''
    };
    this.showForm = true;
  }

  savePromotion(): void {
    if (this.selectedPromotion && this.selectedPromotion.id) {
      // Actualizar promoción existente
      this.promotionService.updatePromotion(this.selectedPromotion.id, this.newPromotionForm).subscribe(
        (data: Promotion) => {
          console.log('Promoción actualizada:', data);
          this.loadPromotions();
          this.showForm = false;
          this.newPromotion(); // Reset form
        },
        (error: any) => {
          console.error('Error al actualizar promoción:', error);
        }
      );
    } else {
      // Crear nueva promoción
      this.promotionService.createPromotion(this.newPromotionForm).subscribe(
        (data: Promotion) => {
          console.log('Promoción creada:', data);
          this.loadPromotions();
          this.showForm = false;
          this.newPromotion(); // Reset form
        },
        (error: any) => {
          console.error('Error al crear promoción:', error);
        }
      );
    }
  }

  deletePromotion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      this.promotionService.deletePromotion(id).subscribe(
        () => {
          console.log('Promoción eliminada exitosamente.');
          this.loadPromotions();
        },
        (error: any) => {
          console.error('Error al eliminar promoción:', error);
        }
      );
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
} 