import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  currentRoute: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.userRole = this.authService.getRole();
      } else {
        this.userRole = null;
      }
    });
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login después de cerrar sesión
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToDashboard(): void {
    const role = this.authService.getRole();
    if (role === 'CLIENT') {
      this.router.navigate(['/dashboard-client']);
    } else if (role === 'EMPLOYEE') {
      this.router.navigate(['/dashboard-employee']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/login']); // O a una página por defecto si no hay rol
    }
  }
} 