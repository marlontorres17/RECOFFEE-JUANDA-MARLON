import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    if (route.url[0]?.path === 'landing') {
      return true;  
    }

    const isLogged = localStorage.getItem('isLogged') === 'true';
    const roleId = localStorage.getItem('roleId');
    const farmId = localStorage.getItem('farmId'); // Obtener farmId del localStorage

    // Redirigir si el recolector no está unido a una finca
    if (roleId === 'recolector' && !farmId) {
        console.log('Recolector no unido a ninguna finca, redirigiendo a /join-farm');
        router.navigate(['/join-farm']);
        return false;
    }
    

    if (!isLogged) {
      console.log('No está logueado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

    // Redirigir si el recolector no está unido a una finca
    if (roleId === 'recolector' && !farmId) {
      console.log('Recolector no unido a ninguna finca, redirigiendo a /join-farm');
      router.navigate(['/join-farm']);
      return false;
    }

    // Admin dashboard
    if (route.url[0]?.path === 'admin-dashboard' && roleId !== 'admin') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

    // Recolector dashboard
    if (route.url[0]?.path === 'recolector-dashboard' && roleId !== 'recolector') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

    // Usuario dashboard
    if (route.url[0]?.path === 'usuario-dashboard' && roleId !== 'usuario') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

  } else {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
