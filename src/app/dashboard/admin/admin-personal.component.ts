import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, UserData } from '../../services/user.service';

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

  // Para edición
  showEditModal = false;
  usuarioEditando: any = null;
  editForm: UserData = { email: '', password: '', phone: '' };

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPersonal();
  }

  loadPersonal(): void {
    this.loading = true;
    this.userService.getAllPersonal().subscribe({
      next: data => {
        this.personal = data;
        this.personalFiltrado = [...data];
        this.rolesDisponibles = Array.from(
          new Set(data.map(p => p.roleName || p.role || (p.roles?.[0]?.name || '')))
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el personal';
        this.loading = false;
      }
    });
  }

  filtrarPersonal(): void {
    const term = this.filtroNombre.toLowerCase();
    this.personalFiltrado = this.personal.filter(p => {
      const nombre = (p.name || '').toLowerCase();
      const rol = p.roleName || p.role || (p.roles?.[0]?.name || '');
      return nombre.includes(term) && (!this.filtroRol || rol === this.filtroRol);
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroRol = null;
    this.personalFiltrado = [...this.personal];
  }

  // ABRE MODAL DE EDICIÓN
  editarPersonal(persona: any): void {
    this.usuarioEditando = persona;
    this.editForm = {
      email: persona.email || '',
      password: '', // Por seguridad nunca rellenas el password real
      phone: persona.phone || ''
    };
    this.showEditModal = true;
  }

  // GUARDA LOS CAMBIOS (PUT)
  guardarEdicion(): void {
    if (!this.usuarioEditando) return;
    this.userService.updateUser(this.usuarioEditando.id, this.editForm).subscribe(
      () => {
        this.showEditModal = false;
        this.usuarioEditando = null;
        this.loadPersonal();
      },
      () => alert('Error al actualizar usuario')
    );
  }

  // CANCELA EDICIÓN
  cancelarEdicion(): void {
    this.showEditModal = false;
    this.usuarioEditando = null;
  }

  eliminarPersonal(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe(
      () => this.loadPersonal(),
      () => alert('Error al eliminar usuario')
    );
  }
}
