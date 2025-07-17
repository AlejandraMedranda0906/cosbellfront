import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        const userRole = authService.getRole();
        const requiredRoles = route.data['roles'] as Array<string>;

        if (requiredRoles && requiredRoles.length > 0) {
          if (userRole && requiredRoles.includes(userRole.toUpperCase())) {
            return true;
          } else {
            // Redirigir a una página de acceso denegado o al dashboard principal
            console.warn('Acceso denegado: El usuario no tiene el rol requerido.', userRole, requiredRoles);
            router.navigate(['/dashboard']); // O la ruta de inicio por defecto
            return false;
          }
        }
        return true; // Si no hay roles requeridos, solo se necesita estar logeado
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
}; 