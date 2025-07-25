import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit {
  personal: any[] = [];
  personalFiltrado: any[] = [];
  loading = true;
  error = '';

  filtroNombre: string = '';
  filtroRol: string | null = null;
  rolesDisponibles: string[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadPersonal();
  }

  loadPersonal() {
    this.loading = true;
    this.userService.getAllPersonal().subscribe({
      next: (data) => {
        this.personal = data;
        this.personalFiltrado = [...data];
        this.rolesDisponibles = [...new Set(data.map(p => p.roleName || p.role || (p.roles?.[0]?.name || '')))];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el personal';
        this.loading = false;
      }
    });
  }

  editarPersonal(persona: any) {
    this.router.navigate(['/dashboard-admin/registrar-profesional'], { state: { user: persona } });
  }

  eliminarPersonal(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadPersonal(),
        error: () => alert('Error al eliminar usuario')
      });
    }
  }

  filtrarPersonal() {
    this.personalFiltrado = this.personal.filter(p => {
      const nombreMatch = p.name?.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const rol = p.roleName || p.role || (p.roles?.[0]?.name || '');
      const rolMatch = !this.filtroRol || rol === this.filtroRol;
      return nombreMatch && rolMatch;
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroRol = null;
    this.personalFiltrado = [...this.personal];
  }
}
