import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-personal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit {
  personal: any[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadPersonal();
  }

  loadPersonal() {
    this.loading = true;
    this.userService.getAllPersonal().subscribe({
      next: (data) => {
        this.personal = data;
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
} 