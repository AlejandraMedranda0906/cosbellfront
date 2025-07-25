import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../../services/servicio.service';
import { CategoryService, Category } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Servicio {
  id?: number;
  name: string;
  duration: number;
  price: number;
  description?: string;
  descripcionExtend?: string;
  imageUrl?: string;
  categoryId?: number;
}

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-servicios.component.html',
  styleUrl: './admin-servicios.component.css'
})
export class AdminServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];

  selectedServicio: Servicio | null = null;
  newServicioForm: Servicio = { name: '', duration: 0, price: 0, description: '', imageUrl: '', categoryId: undefined };
  showForm: boolean = false;

  categorias: Category[] = [];
  filtroNombre: string = '';
  filtroCategoriaId?: number;

  constructor(private servicioService: ServicioService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadServicios();
    this.loadCategorias();
  }

  loadServicios(): void {
    this.servicioService.getAllServicios().subscribe(
      (data: Servicio[]) => {
        this.servicios = data;
        this.filtrar(); // Inicializar lista filtrada
      },
      (error: any) => {
        console.error('Error al cargar servicios:', error);
      }
    );
  }

  loadCategorias(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categorias = data;
      },
      (error: any) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  filtrar(): void {
    this.serviciosFiltrados = this.servicios.filter(servicio => {
      const coincideNombre = this.filtroNombre.trim().length === 0 ||
        servicio.name.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideCategoria = !this.filtroCategoriaId || servicio.categoryId === this.filtroCategoriaId;
      return coincideNombre && coincideCategoria;
    });
  }

  clearFiltros(): void {
    this.filtroNombre = '';
    this.filtroCategoriaId = undefined;
    this.filtrar();
  }

  editServicio(servicio: Servicio): void {
    this.selectedServicio = { ...servicio };
    this.newServicioForm = { ...servicio };
    this.showForm = true;
  }

  newServicio(): void {
    this.selectedServicio = null;
    this.newServicioForm = { name: '', duration: 0, price: 0, description: '', imageUrl: '', categoryId: undefined };
    this.showForm = true;
  }

  saveServicio(): void {
    if (this.selectedServicio?.id) {
      this.servicioService.updateServicio(this.selectedServicio.id, this.newServicioForm).subscribe(
        () => {
          this.loadServicios();
          this.showForm = false;
          this.newServicio(); // Reset form
        },
        error => console.error('Error al actualizar servicio:', error)
      );
    } else {
      this.servicioService.createServicio(this.newServicioForm).subscribe(
        () => {
          this.loadServicios();
          this.showForm = false;
          this.newServicio(); // Reset form
        },
        error => console.error('Error al crear servicio:', error)
      );
    }
  }

  deleteServicio(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.servicioService.deleteServicio(id).subscribe(
        () => this.loadServicios(),
        error => console.error('Error al eliminar servicio:', error)
      );
    }
  }
}
